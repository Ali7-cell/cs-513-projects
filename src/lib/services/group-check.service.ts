import { prisma } from "@/lib/prisma";

export async function findConflictingRegNumbers(
  regNumbers: string[],
  currentGroupId?: string
): Promise<string[]> {
  const normalized = regNumbers.map((r) => r.trim().toUpperCase());
  const existing = await prisma.groupMember.findMany({
    where: {
      regNumber: { in: normalized },
      isActive: true,
      ...(currentGroupId ? { groupId: { not: currentGroupId } } : {}),
      group: {
        reviewStatus: { not: "REJECTED" },
      },
    },
    select: { regNumber: true },
  });

  return existing.map((m) => m.regNumber);
}
