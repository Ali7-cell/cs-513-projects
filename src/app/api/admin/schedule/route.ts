import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const schedules = await prisma.presentationSchedule.findMany({
      where: section ? { group: { section: { code: section.toUpperCase() } } } : {},
      include: {
        group: {
          include: {
            section: true,
            project: true,
            presentation: true,
            members: { where: { role: "LEADER" } },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      {
        success: false,
        error: isForbidden
          ? "Forbidden: Administrator privileges required."
          : "Failed to load schedules.",
      },
      { status: isForbidden ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const { groupId, scheduledAt, venue, notes } = body;
    if (!groupId || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: "groupId and scheduledAt are required" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);

    // Upsert schedule
    const schedule = await prisma.presentationSchedule.upsert({
      where: { groupId },
      create: {
        groupId,
        scheduledAt: scheduledDate,
        venue: venue || "CS Lab 1 / IT Department",
        notes: notes || null,
        scheduledBy: admin.id,
      },
      update: {
        scheduledAt: scheduledDate,
        venue: venue || "CS Lab 1 / IT Department",
        notes: notes || null,
        scheduledBy: admin.id,
      },
      include: { group: true },
    });

    // Update presentation record scheduledDate and venue as well for direct synchronization
    await prisma.presentation.updateMany({
      where: { groupId },
      data: {
        scheduledDate,
        venue: venue || "CS Lab 1 / IT Department",
        notes: notes || null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: "PRESENTATION_SCHEDULED",
        entityType: "PresentationSchedule",
        entityId: schedule.id,
        newValue: JSON.stringify({
          groupId,
          scheduledAt: schedule.scheduledAt,
          venue: schedule.venue,
        }),
      },
    });

    return NextResponse.json({ success: true, data: schedule });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      {
        success: false,
        error: isForbidden
          ? "Forbidden: Administrator privileges required."
          : "Failed to schedule presentation.",
      },
      { status: isForbidden ? 403 : 500 }
    );
  }
}
