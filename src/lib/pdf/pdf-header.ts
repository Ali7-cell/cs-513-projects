import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

export function drawUafPdfHeader(doc: jsPDF, title: string, subtitle: string) {
  try {
    const logoPath = path.join(process.cwd(), "public", "uaf-logo.png");
    if (fs.existsSync(logoPath)) {
      const imgData = fs.readFileSync(logoPath).toString("base64");
      doc.addImage(`data:image/png;base64,${imgData}`, "PNG", 14, 10, 18, 18);
    }
  } catch {
    // If logo read fails, proceed gracefully
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(19, 88, 53); // Official Emerald #135835
  doc.text("CS-513: WEB PROGRAMMING", 36, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(14, 110, 60); // #0E6E3C
  doc.text("Course Instructor: VF. Lecturer Ramish Saleem — BS IT 5th Semester", 36, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(31, 41, 55);
  doc.text(title, 36, 28);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(subtitle, 14, 34);

  doc.setDrawColor(212, 160, 23); // UAF Gold line
  doc.setLineWidth(0.6);
  doc.line(14, 36, 196, 36);
}
