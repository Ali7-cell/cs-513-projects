import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createGroupSchema } from "@/lib/validation/group.schema";
import { createGroupTransactional } from "@/lib/services/group-create.service";
import { getSectionGroups } from "@/lib/services/group-query.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") || "m1";
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  try {
    const groups = await getSectionGroups(section, search, status);
    return NextResponse.json({ success: true, data: groups });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to retrieve groups." } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized: Please log in to create a group profile." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createGroupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: parsed.error.errors[0]?.message || "Validation failed" } },
        { status: 400 }
      );
    }

    if (
      user.role === "STUDENT" &&
      user.sectionCode &&
      user.sectionCode.toUpperCase() !== parsed.data.sectionCode.toUpperCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Cross-section violation: Your account belongs to Section ${user.sectionCode}. You cannot create a group under Section ${parsed.data.sectionCode}.`,
          },
        },
        { status: 403 }
      );
    }

    const group = await createGroupTransactional(parsed.data, user.id, user.role === "ADMIN");
    return NextResponse.json({ success: true, data: group }, { status: 201 });
  } catch (error: any) {
    const msg = error.message || "Failed to create group";
    const isConflict = msg.includes("already assigned") || msg.includes("Duplicate") || msg.includes("CONFLICT");
    const isDeadline = msg.includes("DEADLINE");
    return NextResponse.json(
      { success: false, error: { message: msg } },
      { status: isConflict ? 409 : isDeadline ? 403 : 400 }
    );
  }
}
