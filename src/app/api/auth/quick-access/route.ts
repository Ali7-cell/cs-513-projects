import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, regNumber, sectionCode, password, mode } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanSection = String(sectionCode || "M1").trim().toUpperCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      // If user exists, verify password
      const valid = await verifyPassword(password, existing.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { success: false, error: "Incorrect password for this email. Please check your credentials." },
          { status: 401 }
        );
      }

      // If it's a student, optionally update their name/regNumber/sectionCode if provided
      if (existing.role === "STUDENT") {
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            fullName: fullName ? String(fullName).trim() : existing.fullName,
            regNumber: regNumber ? String(regNumber).trim().toUpperCase() : existing.regNumber,
            sectionCode: cleanSection || existing.sectionCode,
          },
        });
      }

      return NextResponse.json({
        success: true,
        isNew: false,
        role: existing.role,
        sectionCode: existing.role === "ADMIN" ? null : (cleanSection || existing.sectionCode),
      });
    }

    // If user does not exist, student registration requires name, regNumber, section
    if (!fullName || !regNumber) {
      return NextResponse.json(
        { success: false, error: "Full Name and Registration Number are required for first-time registration." },
        { status: 400 }
      );
    }

    // Check if section exists in database
    const section = await prisma.section.findUnique({
      where: { code: cleanSection },
    });
    if (!section) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${cleanSection}. Must be M1 or M2.` },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        fullName: String(fullName).trim(),
        email: cleanEmail,
        passwordHash,
        role: "STUDENT",
        sectionCode: cleanSection,
        regNumber: String(regNumber).trim().toUpperCase(),
      },
    });

    return NextResponse.json({
      success: true,
      isNew: true,
      role: newUser.role,
      sectionCode: newUser.sectionCode,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process login/registration." },
      { status: 500 }
    );
  }
}
