import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getGroupById } from "@/lib/services/group-query.service";
import { generateSingleGroupPdf } from "@/lib/pdf/single-group-pdf";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
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

  // Permitted if Admin, group creator, or verified group member
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
        error: {
          message:
            "Forbidden: Only authorized evaluators or group members can export this profile.",
        },
      },
      { status: 403 }
    );
  }

  const pdfBuffer = generateSingleGroupPdf(group);
  const sanitized = group.groupName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `BSIT-${group.section?.code}-Group-${sanitized}.pdf`;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
