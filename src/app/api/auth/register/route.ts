import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { findConflictingRegNumbers } from "@/lib/services/group-check.service";

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  sectionCode: z.enum(["M1", "M2"], {
    errorMap: () => ({ message: "Section must be either M1 or M2" }),
  }),
  regNumber: z
    .string()
    .min(3, "Registration number must be at least 3 characters")
    .regex(/^(?:[0-9]{4}-[A-Za-z]+-[0-9]+|[A-Za-z0-9_-]{3,20})$/i, {
      message: "Registration format must be e.g. 2024-AG-6959 or AG001",
    }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { fullName, email, password, sectionCode, regNumber } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedReg = regNumber.toUpperCase().trim();

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists.",
        },
        { status: 409 }
      );
    }

    // Check if registration number already registered in user accounts
    const existingRegUser = await prisma.user.findFirst({
      where: { regNumber: normalizedReg },
    });
    if (existingRegUser) {
      return NextResponse.json(
        {
          success: false,
          error: "This registration number is already registered to another student account.",
        },
        { status: 409 }
      );
    }

    // Check if registration number already assigned to an active group
    const conflicts = await findConflictingRegNumbers([normalizedReg]);
    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This registration number is already assigned to an active group.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT",
        sectionCode,
        regNumber: normalizedReg,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        sectionCode: true,
        regNumber: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please log in to continue.",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during registration.",
      },
      { status: 500 }
    );
  }
}
