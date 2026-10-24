export interface TeamMemberItem {
  name: string;
  agNumber: string;
}

export interface TeamGroupRowData {
  sr: number;
  id?: string;
  groupName: string;
  teamLeader: string;
  teamLeaderAG: string;
  members: TeamMemberItem[];
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  googleDriveUrl?: string | null;
  isDbGroup?: boolean;
}

/**
 * Transforms real database groups into the table structure.
 * Only formats real groups; does not inject any mock data.
 */
export function formatSectionGroupsForTable(
  _sectionCode: string,
  dbGroups: any[]
): TeamGroupRowData[] {
  if (!dbGroups || dbGroups.length === 0) {
    return [];
  }

  return dbGroups.map((g, idx) => {
    const leader = g.members?.find((m: any) => m.role === "LEADER") || g.members?.[0];
    const nonLeaders = g.members?.filter((m: any) => m.id !== leader?.id && m !== leader) || [];

    const memberItems: TeamMemberItem[] = nonLeaders.length > 0
      ? nonLeaders.map((m: any) => ({ name: m.fullName, agNumber: m.regNumber }))
      : [];

    return {
      sr: idx + 1,
      id: g.id,
      groupName: g.groupName,
      teamLeader: leader?.fullName || "Lead",
      teamLeaderAG: leader?.regNumber || "Pending",
      members: memberItems,
      githubUrl: g.project?.githubUrl || null,
      liveDemoUrl: g.project?.websiteUrl || null,
      googleDriveUrl: g.project?.projectPdfUrl || null,
      isDbGroup: true,
    };
  });
}
