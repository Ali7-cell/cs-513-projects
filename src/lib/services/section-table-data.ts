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

// Initial verified sample groups based on official reference specification
export const M2_REFERENCE_GROUPS: TeamGroupRowData[] = [
  {
    sr: 1,
    groupName: "Smart IT",
    teamLeader: "Ali",
    teamLeaderAG: "AG001",
    members: [
      { name: "Anfal", agNumber: "AG002" },
      { name: "Aisha", agNumber: "AG003" },
      { name: "Laiba", agNumber: "AG004" },
      { name: "Ali", agNumber: "AG005" },
    ],
    githubUrl: "https://github.com/uaf-bsit/smart-it",
    liveDemoUrl: "https://smart-it-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/smart-it-uaf",
  },
  {
    sr: 2,
    groupName: "Code Masters",
    teamLeader: "Usama",
    teamLeaderAG: "AG006",
    members: [
      { name: "Hira", agNumber: "AG007" },
      { name: "Daniyal", agNumber: "AG008" },
      { name: "Zainab", agNumber: "AG009" },
      { name: "Talha", agNumber: "AG010" },
    ],
    githubUrl: "https://github.com/uaf-bsit/code-masters",
    liveDemoUrl: "https://code-masters-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/code-masters-uaf",
  },
  {
    sr: 3,
    groupName: "Pixel Squad",
    teamLeader: "Sara",
    teamLeaderAG: "AG011",
    members: [
      { name: "Hamza", agNumber: "AG012" },
      { name: "Sana", agNumber: "AG013" },
      { name: "Muneeb", agNumber: "AG014" },
      { name: "Areeba", agNumber: "AG015" },
    ],
    githubUrl: "https://github.com/uaf-bsit/pixel-squad",
    liveDemoUrl: "https://pixel-squad-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/pixel-squad-uaf",
  },
  {
    sr: 4,
    groupName: "Tech Explorers",
    teamLeader: "Bilal",
    teamLeaderAG: "AG016",
    members: [
      { name: "Rida", agNumber: "AG017" },
      { name: "Fahad", agNumber: "AG018" },
      { name: "Zara", agNumber: "AG019" },
      { name: "Waqas", agNumber: "AG020" },
    ],
    githubUrl: "https://github.com/uaf-bsit/tech-explorers",
    liveDemoUrl: "https://tech-explorers-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/tech-explorers-uaf",
  },
  {
    sr: 5,
    groupName: "Future Coders",
    teamLeader: "Hassan",
    teamLeaderAG: "AG021",
    members: [
      { name: "Fatima", agNumber: "AG022" },
      { name: "Saad", agNumber: "AG023" },
      { name: "Ayesha", agNumber: "AG024" },
      { name: "Kashif", agNumber: "AG025" },
    ],
    githubUrl: "https://github.com/uaf-bsit/future-coders",
    liveDemoUrl: "https://future-coders-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/future-coders-uaf",
  },
];

export const M1_REFERENCE_GROUPS: TeamGroupRowData[] = [
  {
    sr: 1,
    groupName: "Data Titans",
    teamLeader: "Zubair",
    teamLeaderAG: "AG101",
    members: [
      { name: "Farhan", agNumber: "AG102" },
      { name: "Maryam", agNumber: "AG103" },
      { name: "Omer", agNumber: "AG104" },
      { name: "Siddique", agNumber: "AG105" },
    ],
    githubUrl: "https://github.com/uaf-bsit/data-titans",
    liveDemoUrl: "https://data-titans-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/data-titans-uaf",
  },
  {
    sr: 2,
    groupName: "Cyber Nexus",
    teamLeader: "Hamid",
    teamLeaderAG: "AG106",
    members: [
      { name: "Mahnoor", agNumber: "AG107" },
      { name: "Rehan", agNumber: "AG108" },
      { name: "Iqra", agNumber: "AG109" },
      { name: "Usman", agNumber: "AG110" },
    ],
    githubUrl: "https://github.com/uaf-bsit/cyber-nexus",
    liveDemoUrl: "https://cyber-nexus-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/cyber-nexus-uaf",
  },
  {
    sr: 3,
    groupName: "Algo Crafts",
    teamLeader: "Noman",
    teamLeaderAG: "AG111",
    members: [
      { name: "Nimra", agNumber: "AG112" },
      { name: "Bilal", agNumber: "AG113" },
      { name: "Junaid", agNumber: "AG114" },
      { name: "Aliza", agNumber: "AG115" },
    ],
    githubUrl: "https://github.com/uaf-bsit/algo-crafts",
    liveDemoUrl: "https://algo-crafts-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/algo-crafts-uaf",
  },
  {
    sr: 4,
    groupName: "Cloud Ninjas",
    teamLeader: "Ahsan",
    teamLeaderAG: "AG116",
    members: [
      { name: "Sidra", agNumber: "AG117" },
      { name: "Qasim", agNumber: "AG118" },
      { name: "Sahar", agNumber: "AG119" },
      { name: "Kamran", agNumber: "AG120" },
    ],
    githubUrl: "https://github.com/uaf-bsit/cloud-ninjas",
    liveDemoUrl: "https://cloud-ninjas-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/cloud-ninjas-uaf",
  },
  {
    sr: 5,
    groupName: "Visionary Devs",
    teamLeader: "Daniyal",
    teamLeaderAG: "AG121",
    members: [
      { name: "Laiba", agNumber: "AG122" },
      { name: "Mustafa", agNumber: "AG123" },
      { name: "Mehak", agNumber: "AG124" },
      { name: "Haseeb", agNumber: "AG125" },
    ],
    githubUrl: "https://github.com/uaf-bsit/visionary-devs",
    liveDemoUrl: "https://visionary-devs-demo.uaf.edu.pk",
    googleDriveUrl: "https://drive.google.com/drive/folders/visionary-devs-uaf",
  },
];

/**
 * Transforms database groups into the reference table structure,
 * prepending any live database-registered groups ahead of sample rows,
 * or using live groups when available.
 */
export function formatSectionGroupsForTable(
  sectionCode: string,
  dbGroups: any[]
): TeamGroupRowData[] {
  const isM2 = sectionCode.toUpperCase() === "M2";
  const defaultList = isM2 ? M2_REFERENCE_GROUPS : M1_REFERENCE_GROUPS;

  if (!dbGroups || dbGroups.length === 0) {
    return defaultList;
  }

  // Format database groups
  const formattedDbGroups: TeamGroupRowData[] = dbGroups.map((g, idx) => {
    const leader = g.members?.find((m: any) => m.role === "LEADER") || g.members?.[0];
    const nonLeaders = g.members?.filter((m: any) => m.id !== leader?.id) || [];
    
    // Ensure all members are rendered in members list
    const memberItems: TeamMemberItem[] = nonLeaders.length > 0 
      ? nonLeaders.map((m: any) => ({ name: m.fullName, agNumber: m.regNumber }))
      : (g.members || []).map((m: any) => ({ name: m.fullName, agNumber: m.regNumber }));

    return {
      sr: idx + 1,
      id: g.id,
      groupName: g.groupName,
      teamLeader: leader?.fullName || "Lead",
      teamLeaderAG: leader?.regNumber || "Pending",
      members: memberItems.length > 0 ? memberItems : [{ name: leader?.fullName || "Leader", agNumber: leader?.regNumber || "N/A" }],
      githubUrl: g.project?.githubUrl || null,
      liveDemoUrl: g.project?.websiteUrl || null,
      googleDriveUrl: g.project?.projectPdfUrl || null,
      isDbGroup: true,
    };
  });

  // If there are DB groups, combine with default sample groups if needed or return DB groups
  // If user registered fewer than 5 groups, supplement with default groups to keep directory rich
  const existingNames = new Set(formattedDbGroups.map((g) => g.groupName.toLowerCase()));
  const remainingDefaults = defaultList
    .filter((g) => !existingNames.has(g.groupName.toLowerCase()))
    .map((g, idx) => ({
      ...g,
      sr: formattedDbGroups.length + idx + 1,
    }));

  return [...formattedDbGroups, ...remainingDefaults];
}
