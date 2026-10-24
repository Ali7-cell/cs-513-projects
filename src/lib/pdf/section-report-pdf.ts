import { jsPDF } from "jspdf";
import { drawUafPdfHeader } from "./pdf-header";

export function generateSectionReportPdf(sectionCode: string, groups: any[]): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const sec = sectionCode.toUpperCase();
  drawUafPdfHeader(
    doc,
    `SECTION ${sec} COMPREHENSIVE GROUPS REGISTER (${groups.length} Groups)`,
    `Generated on: ${new Date().toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })} | CS-513: Web Programming • Instructor: Mam Ramish Saleem`
  );

  let y = 42;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (y > 245) {
      doc.addPage();
      drawUafPdfHeader(
        doc,
        `SECTION ${sec} GROUPS REGISTER (Cont.)`,
        `Page ${doc.getNumberOfPages()} • Department of Information Technology`
      );
      y = 42;
    }

    const leader = g.members?.find((m: any) => m.role === "LEADER") || g.members?.[0];
    const otherMembers = g.members?.filter((m: any) => m !== leader) || [];
    const memberStr = otherMembers
      .map((m: any) => `${m.fullName} (${m.regNumber})`)
      .join(", ");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(19, 88, 53); // #135835 UAF green
    doc.text(
      `${i + 1}. ${g.groupName} — [Review: ${g.reviewStatus} | Pres: ${g.presentation?.status || "PENDING"}]`,
      14,
      y
    );
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text(
      `Team Leader: ${leader ? `${leader.fullName} (Reg: ${leader.regNumber})` : "N/A"}`,
      18,
      y
    );
    y += 4.5;

    if (memberStr) {
      const wrappedMembers = doc.splitTextToSize(`Team Members: ${memberStr}`, 175);
      doc.text(wrappedMembers, 18, y);
      y += wrappedMembers.length * 4;
    }

    doc.text(`Project Idea: ${g.project?.ideaName || "N/A"}`, 18, y);
    y += 4.5;

    if (g.project?.description) {
      const descLines = doc.splitTextToSize(`Description: ${g.project.description}`, 175);
      const sliceLines = descLines.slice(0, 3);
      doc.text(sliceLines, 18, y);
      y += sliceLines.length * 4;
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Google Drive PDF: ${g.project?.projectPdfUrl || "None"} | GitHub: ${g.project?.githubUrl || "None"} | Website: ${g.project?.websiteUrl || "None"}`,
      18,
      y
    );
    y += 6;

    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(14, y - 2, 196, y - 2);
  }

  return Buffer.from(doc.output("arraybuffer"));
}
