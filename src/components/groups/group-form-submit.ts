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
  const members = [
    { fullName: state.leaderName, regNumber: state.leaderReg, role: "LEADER", displayOrder: 1 },
    { fullName: state.m2Name, regNumber: state.m2Reg, role: "MEMBER", displayOrder: 2 },
  ];

  state.optionals.forEach((opt: any, idx: number) => {
    if (opt.fullName && opt.regNumber) {
      members.push({
        fullName: opt.fullName,
        regNumber: opt.regNumber,
        role: "MEMBER",
        displayOrder: idx + 3,
      });
    }
  });

  return {
    groupName: state.groupName,
    sectionCode: sectionCode.toUpperCase(),
    ideaName: state.ideaName,
    description: state.description,
    projectPdfUrl: state.pdfUrl || undefined,
    githubUrl: state.githubUrl || undefined,
    websiteUrl: state.websiteUrl || undefined,
    members,
  };
}
