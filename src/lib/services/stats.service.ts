import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/types/audit";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalM1,
    totalM2,
    totalGroups,
    pendingReviews,
    approvedGroups,
    rejectedGroups,
    presentationsPending,
    presentationsCompleted,
  ] = await Promise.all([
    prisma.group.count({ where: { section: { code: "M1" } } }),
    prisma.group.count({ where: { section: { code: "M2" } } }),
    prisma.group.count(),
    prisma.group.count({ where: { reviewStatus: "PENDING_REVIEW" } }),
    prisma.group.count({ where: { reviewStatus: "APPROVED" } }),
    prisma.group.count({ where: { reviewStatus: "REJECTED" } }),
    prisma.presentation.count({ where: { status: "PENDING" } }),
    prisma.presentation.count({ where: { status: "COMPLETED" } }),
  ]);

  return {
    totalM1,
    totalM2,
    totalGroups,
    pendingReviews,
    approvedGroups,
    rejectedGroups,
    presentationsPending,
    presentationsCompleted,
  };
}
