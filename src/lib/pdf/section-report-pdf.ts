import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

interface ReportColumn {
  title: string;
  width: number;
  align: "left" | "center" | "right";
}

export function generateSectionReportPdf(sectionCode: string, groups: any[]): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const sec = sectionCode.toUpperCase();
  const pageWidth = 297;
  const marginX = 12;
  const tableWidth = 273; // 297 - 24

  // Column definitions matching reference specification (Sum = 273mm)
  const columns: ReportColumn[] = [
    { title: "SR", width: 10, align: "center" },
    { title: "Group Name", width: 38, align: "left" },
    { title: "Team Leader", width: 32, align: "left" },
    { title: "Team Leader AG Number", width: 30, align: "left" },
    { title: "Team Members (Name + AG Number)", width: 65, align: "left" },
    { title: "GitHub", width: 32, align: "center" },
    { title: "Live Demo", width: 32, align: "center" },
    { title: "Google Drive", width: 34, align: "center" },
  ];

  const drawHeader = (pageNumber: number) => {
    try {
      const logoPath = path.join(process.cwd(), "public", "uaf-logo.png");
      if (fs.existsSync(logoPath)) {
        const imgData = fs.readFileSync(logoPath).toString("base64");
        doc.addImage(`data:image/png;base64,${imgData}`, "PNG", marginX, 7, 15, 15);
      }
    } catch {
      // Gracefully continue without logo if file reading fails
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(19, 88, 53); // Official Emerald
    doc.text("UNIVERSITY OF AGRICULTURE, FAISALABAD — CS-513: WEB PROGRAMMING", marginX + 18, 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(14, 110, 60);
    doc.text("Course Instructor: VF. Lecturer Ramish Saleem • BS IT 5th Semester • Group Evaluation & Project Directory", marginX + 18, 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    const titleText = sec === "ALL"
      ? `ALL SECTIONS (M1 & M2) COMPREHENSIVE GROUPS REGISTER (${groups.length} Groups)`
      : `SECTION ${sec} OFFICIAL GROUPS REGISTER (${groups.length} Groups)`;
    doc.text(titleText, marginX + 18, 21);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    const dateStr = new Date().toLocaleDateString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "long" });
    doc.text(`Generated on: ${dateStr} • Page ${pageNumber}`, marginX, 26);

    // Gold divider rule
    doc.setDrawColor(212, 160, 23);
    doc.setLineWidth(0.5);
    doc.line(marginX, 28, marginX + tableWidth, 28);
  };

  const drawTableHeader = (startY: number): number => {
    const headerHeight = 7.5;
    doc.setFillColor(19, 88, 53); // Emerald header
    doc.rect(marginX, startY, tableWidth, headerHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    let curX = marginX;
    columns.forEach((col) => {
      const textX = col.align === "center" ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, startY + 5, { align: col.align });
      curX += col.width;
    });

    // Borders
    doc.setDrawColor(14, 70, 42);
    doc.setLineWidth(0.3);
    doc.rect(marginX, startY, tableWidth, headerHeight);

    let vX = marginX;
    columns.forEach((col) => {
      vX += col.width;
      doc.line(vX, startY, vX, startY + headerHeight);
    });

    return startY + headerHeight;
  };

  let currentPage = 1;
  drawHeader(currentPage);
  let curY = drawTableHeader(31);

  if (groups.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(marginX, curY, tableWidth, 16, "F");
    doc.setDrawColor(203, 213, 225);
    doc.rect(marginX, curY, tableWidth, 16);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text("No student groups registered yet.", marginX + tableWidth / 2, curY + 10, { align: "center" });
    curY += 16;
  } else {
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const leader = g.members?.find((m: any) => m.role === "LEADER") || g.members?.[0];
      const nonLeaders = g.members?.filter((m: any) => m.id !== leader?.id && m !== leader) || [];

      // Group Name
      const groupDisplayName = sec === "ALL" && g.section?.code
        ? `${g.groupName} [${g.section.code}]`
        : g.groupName;
      const groupLines = doc.splitTextToSize(groupDisplayName, columns[1].width - 4);

      // Leader Info
      const leaderLines = doc.splitTextToSize(leader?.fullName || "Lead", columns[2].width - 4);
      const leaderAgLines = doc.splitTextToSize(leader?.regNumber || "Pending", columns[3].width - 4);

      // Members Info (Name + AG Number)
      const memberLines: string[] = [];
      if (nonLeaders.length === 0) {
        memberLines.push("—");
      } else {
        nonLeaders.forEach((m: any, mIdx: number) => {
          const mText = `${mIdx + 1}. ${m.fullName} (${m.regNumber})`;
          const wrapped = doc.splitTextToSize(mText, columns[4].width - 4);
          memberLines.push(...wrapped);
        });
      }

      const maxTextLines = Math.max(
        groupLines.length,
        leaderLines.length,
        leaderAgLines.length,
        memberLines.length,
        1
      );
      const rowHeight = Math.max(9.5, maxTextLines * 3.8 + 4.5);

      // Page break check (Landscape A4 bottom margin around 196mm)
      if (curY + rowHeight > 195) {
        doc.addPage("a4", "landscape");
        currentPage++;
        drawHeader(currentPage);
        curY = drawTableHeader(31);
      }

      // Zebra background
      if (i % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(marginX, curY, tableWidth, rowHeight, "F");
      }

      const textStartY = curY + 4.5;

      // 1. SR
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(31, 41, 55);
      doc.text(String(i + 1), marginX + columns[0].width / 2, textStartY, { align: "center" });

      // 2. Group Name
      let colX = marginX + columns[0].width;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(groupLines, colX + 2, textStartY);

      // 3. Team Leader
      colX += columns[1].width;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(19, 88, 53);
      doc.text(leaderLines, colX + 2, textStartY);

      // 4. Team Leader AG Number
      colX += columns[2].width;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(leaderAgLines, colX + 2, textStartY);

      // 5. Team Members (Name + AG Number)
      colX += columns[3].width;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.3);
      doc.setTextColor(51, 65, 85);
      doc.text(memberLines, colX + 2, textStartY);

      // 6. GitHub
      colX += columns[4].width;
      const wGithub = columns[5].width;
      if (g.project?.githubUrl) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(25, 103, 210); // Accent blue
        doc.text("GitHub", colX + wGithub / 2, textStartY, { align: "center" });
        doc.setDrawColor(25, 103, 210);
        doc.setLineWidth(0.2);
        doc.line(colX + wGithub / 2 - 6, textStartY + 0.8, colX + wGithub / 2 + 6, textStartY + 0.8);
        doc.link(colX + 2, curY + 1.5, wGithub - 4, 6, { url: g.project.githubUrl });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text("Not Provided", colX + wGithub / 2, textStartY, { align: "center" });
      }

      // 7. Live Demo
      colX += columns[5].width;
      const wLiveDemo = columns[6].width;
      if (g.project?.websiteUrl) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(25, 103, 210);
        doc.text("Live Demo", colX + wLiveDemo / 2, textStartY, { align: "center" });
        doc.setDrawColor(25, 103, 210);
        doc.setLineWidth(0.2);
        doc.line(colX + wLiveDemo / 2 - 7, textStartY + 0.8, colX + wLiveDemo / 2 + 7, textStartY + 0.8);
        doc.link(colX + 2, curY + 1.5, wLiveDemo - 4, 6, { url: g.project.websiteUrl });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text("Not Provided", colX + wLiveDemo / 2, textStartY, { align: "center" });
      }

      // 8. Google Drive
      colX += columns[6].width;
      const wDrive = columns[7].width;
      if (g.project?.projectPdfUrl) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(14, 110, 60); // Green
        doc.text("Google Drive", colX + wDrive / 2, textStartY, { align: "center" });
        doc.setDrawColor(14, 110, 60);
        doc.setLineWidth(0.2);
        doc.line(colX + wDrive / 2 - 9, textStartY + 0.8, colX + wDrive / 2 + 9, textStartY + 0.8);
        doc.link(colX + 2, curY + 1.5, wDrive - 4, 6, { url: g.project.projectPdfUrl });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text("Not Provided", colX + wDrive / 2, textStartY, { align: "center" });
      }

      // Draw Row Borders
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.rect(marginX, curY, tableWidth, rowHeight);

      let vLineX = marginX;
      columns.forEach((col) => {
        vLineX += col.width;
        doc.line(vLineX, curY, vLineX, curY + rowHeight);
      });

      curY += rowHeight;
    }
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `University of Agriculture, Faisalabad • CS-513: Web Programming • Instructor: VF. Lecturer Ramish Saleem • Page ${p} of ${totalPages}`,
      pageWidth / 2,
      204,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
