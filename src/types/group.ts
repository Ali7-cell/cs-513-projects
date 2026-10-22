export type ReviewStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type PresentationStatus = "PENDING" | "COMPLETED";
export type MemberRole = "LEADER" | "MEMBER";

export interface GroupMemberData {
  id?: string;
  fullName: string;
  regNumber: string;
  role: MemberRole;
  displayOrder: number;
}

export interface ProjectData {
  id?: string;
  ideaName: string;
  description: string;
  projectPdfUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

export interface GroupDetails {
  id: string;
  groupName: string;
  sectionId: string;
  sectionCode: string;
  createdById: string;
  reviewStatus: ReviewStatus;
  rejectionReason?: string | null;
  members: GroupMemberData[];
  project?: ProjectData | null;
  presentationStatus: PresentationStatus;
  createdAt: Date;
  updatedAt: Date;
}
