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
  if (sec !== "M1" && sec !== "M2" && sec !== "ALL") {
    return NextResponse.json(
      { success: false, error: { message: "Invalid section. Use M1, M2, or ALL." } },
      { status: 400 }
    );
  }

  let groups: any[] = [];
  if (sec === "ALL") {
    const [m1, m2] = await Promise.all([
      getSectionGroups("M1"),
      getSectionGroups("M2"),
    ]);
    groups = [...m1, ...m2];
  } else {
    groups = await getSectionGroups(sec);
  }

  const pdfBuffer = generateSectionReportPdf(sec, groups);
  const filename = sec === "ALL" ? `BSIT-5th-All-Class-Groups.pdf` : `BSIT-5th-${sec}-Groups.pdf`;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
