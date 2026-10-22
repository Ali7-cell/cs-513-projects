import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  checkAdminRateLimit,
  recordFailedAdminAttempt,
  resetAdminRateLimit,
} from "@/lib/auth/rate-limiter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "admin_ip";
    const limiterKey = `admin_${clientIp}`;

    // 1. Check rate limit
    const rateCheck = checkAdminRateLimit(limiterKey);
    if (rateCheck.isLocked) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          error: rateCheck.message,
          remainingMinutes: rateCheck.remainingMinutes,
        },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Check if user is not found or not an ADMIN
    if (!user || user.role !== "ADMIN") {
      const result = recordFailedAdminAttempt(limiterKey);
      return NextResponse.json(
        {
          success: false,
          isLocked: result.isLocked,
          error: result.message || "Invalid administrator credentials.",
          attemptsLeft: result.attemptsLeft,
        },
        { status: result.isLocked ? 429 : 401 }
      );
    }

    // 3. Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      const result = recordFailedAdminAttempt(limiterKey);
      return NextResponse.json(
        {
          success: false,
          isLocked: result.isLocked,
          error: result.message || "Invalid administrator credentials.",
          attemptsLeft: result.attemptsLeft,
        },
        { status: result.isLocked ? 429 : 401 }
      );
    }

    // 4. Success: reset rate limit attempts
    resetAdminRateLimit(limiterKey);

    return NextResponse.json({
      success: true,
      message: "Admin authentication authorized.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An authentication error occurred." },
      { status: 500 }
    );
  }
}
