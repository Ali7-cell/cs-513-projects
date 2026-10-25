export async function submitGroupForm(payload: any, isEdit?: boolean, groupId?: string) {
  const url = isEdit ? `/api/groups/${groupId}` : "/api/groups";
  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to save group profile");
  }

  return data;
}

export function buildGroupPayload(state: any, sectionCode: string) {
  const leaderName = state.leaderName?.trim() || "";
  const leaderReg = state.leaderReg?.trim() || "";
  const m2Name = state.m2Name?.trim() || "";
  const m2Reg = state.m2Reg?.trim() || "";

  if (!leaderName || !leaderReg) {
    throw new Error("Team Leader full name and registration number are mandatory.");
  }

  if ((m2Name && !m2Reg) || (!m2Name && m2Reg)) {
    throw new Error(
      "If adding Team Member 2, both Full Name and Registration Number are required."
    );
  }

  const members: Array<{
    fullName: string;
    regNumber: string;
    role: "LEADER" | "MEMBER";
    displayOrder: number;
  }> = [
    { fullName: leaderName, regNumber: leaderReg, role: "LEADER", displayOrder: 1 },
  ];

  if (m2Name && m2Reg) {
    members.push({
      fullName: m2Name,
      regNumber: m2Reg,
      role: "MEMBER",
      displayOrder: 2,
    });
  }

  state.optionals.forEach((opt: any) => {
    const optName = opt.fullName?.trim() || "";
    const optReg = opt.regNumber?.trim() || "";
    if ((optName && !optReg) || (!optName && optReg)) {
      throw new Error(
        "For additional team members, both Full Name and Registration Number are required."
      );
    }
    if (optName && optReg) {
      members.push({
        fullName: optName,
        regNumber: optReg,
        role: "MEMBER",
        displayOrder: members.length + 1,
      });
    }
  });

  return {
    groupName: state.groupName,
    sectionCode: sectionCode.toUpperCase(),
    ideaName: state.ideaName,
    description: state.description,
    projectPdfUrl: state.pdfUrl?.trim() ? state.pdfUrl.trim() : null,
    githubUrl: state.githubUrl?.trim() ? state.githubUrl.trim() : null,
    websiteUrl: state.websiteUrl?.trim() ? state.websiteUrl.trim() : null,
    members,
  };
}
