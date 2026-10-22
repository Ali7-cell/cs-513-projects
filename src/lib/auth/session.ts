import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { UserSession } from "@/types/user";

export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const u = session.user as any;
  return {
    id: u.id,
    fullName: u.name || "User",
    email: u.email || "",
    role: u.role,
    sectionCode: u.sectionCode,
    regNumber: u.regNumber,
  };
}

export async function requireAuth(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(): Promise<UserSession> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN_ADMIN_ONLY");
  return user;
}
