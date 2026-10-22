export type Role = "STUDENT" | "ADMIN";

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  sectionCode?: string | null;
  regNumber?: string | null;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  sectionCode: string | null;
  regNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
