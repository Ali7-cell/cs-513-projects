import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/services/stats.service";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { message: "Forbidden: Admin only" } },
      { status: 403 }
    );
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to load dashboard statistics." } },
      { status: 500 }
    );
  }
}
