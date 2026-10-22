import { jsPDF } from "jspdf";
import { drawUafPdfHeader } from "./pdf-header";

export function generateSingleGroupPdf(group: any): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const secName = group.section?.name || `Section ${group.section?.code}`;
  drawUafPdfHeader(
    doc,
    `GROUP PROFILE: ${group.groupName} (${secName})`,
    `Generated on: ${new Date().toLocaleDateString()} | Presentation: ${group.presentation?.status || "PENDING"}`
  );

  let y = 44;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 52, 91);
  doc.text("1. Team Roster", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55);
  for (const m of group.members || []) {
    const roleTag = m.role === "LEADER" ? "[TEAM LEADER]" : `[MEMBER ${m.displayOrder}]`;
    doc.text(`• ${roleTag} ${m.fullName} — Reg #: ${m.regNumber}`, 18, y);
    y += 5;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 52, 91);
  doc.text("2. Project Idea & Description", 14, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);
  doc.text(`Title: ${group.project?.ideaName || "N/A"}`, 18, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(group.project?.description || "No description provided.", 175);
  doc.text(descLines, 18, y);
  y += descLines.length * 4.5 + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 52, 91);
  doc.text("3. External Links & Status", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`• Project PDF Link: ${group.project?.projectPdfUrl || "None provided"}`, 18, y);
  y += 5;
  doc.text(`• GitHub Repository: ${group.project?.githubUrl || "None provided"}`, 18, y);
  y += 5;
  doc.text(`• Live Website Link: ${group.project?.websiteUrl || "None provided"}`, 18, y);
  y += 5;
  doc.text(`• Review Status: ${group.reviewStatus} | Presentation: ${group.presentation?.status || "PENDING"}`, 18, y);

  return Buffer.from(doc.output("arraybuffer"));
}
