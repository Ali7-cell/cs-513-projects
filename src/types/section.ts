export interface SectionData {
  id: string;
  code: "M1" | "M2";
  name: string;
  semester: string;
  program: string;
  totalGroups?: number;
  pendingPresentations?: number;
}
