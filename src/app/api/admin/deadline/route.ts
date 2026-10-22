import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import {
  getActiveDeadline,
  upsertDeadline,
  toggleDeadlineStatus,
} from "@/lib/services/deadline.service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deadline = await getActiveDeadline();
    const allDeadlines = await prisma.submissionDeadline.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json({
      success: true,
      data: { active: deadline, history: allDeadlines },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    if (!body.deadline) {
      return NextResponse.json(
        { success: false, error: "Deadline timestamp is required" },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(body.deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid deadline date format" },
        { status: 400 }
      );
    }

    const updated = await upsertDeadline(deadlineDate, body.title, admin.id);

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: "DEADLINE_CONFIGURED",
        entityType: "SubmissionDeadline",
        entityId: updated.id,
        newValue: JSON.stringify({
          deadline: updated.deadline,
          title: updated.title,
        }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      {
        success: false,
        error: isForbidden
          ? "Forbidden: Administrator privileges required."
          : "Failed to update deadline configuration.",
      },
      { status: isForbidden ? 403 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    if (!body.id || typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "id and isActive boolean are required" },
        { status: 400 }
      );
    }

    const updated = await toggleDeadlineStatus(body.id, body.isActive);

    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: "DEADLINE_STATUS_TOGGLED",
        entityType: "SubmissionDeadline",
        entityId: updated.id,
        newValue: JSON.stringify({ isActive: updated.isActive }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      {
        success: false,
        error: isForbidden
          ? "Forbidden: Administrator privileges required."
          : "Failed to toggle deadline status.",
      },
      { status: isForbidden ? 403 : 500 }
    );
  }
}
