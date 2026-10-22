import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getGroupById } from "@/lib/services/group-query.service";
import { updateGroupTransactional } from "@/lib/services/group-create.service";
import { createGroupSchema } from "@/lib/validation/group.schema";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await getGroupById(params.id);
    if (!group) {
      return NextResponse.json(
        { success: false, error: { message: "Group not found" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: group });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to load group details." } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const group = await getGroupById(params.id);
    if (!group) {
      return NextResponse.json(
        { success: false, error: { message: "Group not found" } },
        { status: 404 }
      );
    }

    const isCreator = group.createdById === user.id;
    const isMember = group.members?.some(
      (m: any) =>
        user.regNumber &&
        m.regNumber?.toUpperCase() === user.regNumber?.toUpperCase()
    );

    if (user.role !== "ADMIN" && !isCreator && !isMember) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Forbidden: Only group members, leader, or administrator can edit this profile." },
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createGroupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: parsed.error.errors[0]?.message || "Validation failed" },
        },
        { status: 400 }
      );
    }

    const updated = await updateGroupTransactional(
      params.id,
      parsed.data,
      user.id,
      user.role === "ADMIN"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Unauthorized: Administrator privileges required to delete group profiles.",
          },
        },
        { status: 403 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: { message: "Group not found." } },
        { status: 404 }
      );
    }

    // Permanently delete group and cascaded relations
    await prisma.$transaction(async (tx) => {
      await tx.auditLog.deleteMany({
        where: { entityId: params.id },
      });

      await tx.group.delete({
        where: { id: params.id },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: "GROUP_DELETED",
          entityType: "Group",
          entityId: params.id,
          previousValue: JSON.stringify({ groupName: group.groupName }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Group '${group.groupName}' has been permanently deleted from the database.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Failed to delete group." },
      },
      { status: 500 }
    );
  }
}
