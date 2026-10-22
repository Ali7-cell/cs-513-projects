import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getSectionGroups } from "@/lib/services/group-query.service";
import { generateSectionReportPdf } from "@/lib/pdf/section-report-pdf";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { message: "Forbidden: Admin only" } },
      { status: 403 }
    );
  }

  const sec = params.code.toUpperCase();
  if (sec !== "M1" && sec !== "M2") {
    return NextResponse.json(
      { success: false, error: { message: "Invalid section" } },
      { status: 400 }
    );
  }

  const groups = await getSectionGroups(sec);
  const pdfBuffer = generateSectionReportPdf(sec, groups);
  const filename = `BSIT-5th-${sec}-Groups.pdf`;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
