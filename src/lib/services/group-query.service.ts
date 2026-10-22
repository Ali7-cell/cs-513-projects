import { prisma } from "@/lib/prisma";

export async function getSectionGroups(
  sectionCode: string,
  search?: string,
  status?: string
) {
  const code = sectionCode.toUpperCase();
  return prisma.group.findMany({
    where: {
      section: { code },
      ...(status ? { reviewStatus: status as any } : {}),
      ...(search
        ? {
            OR: [
              { groupName: { contains: search, mode: "insensitive" } },
              { project: { ideaName: { contains: search, mode: "insensitive" } } },
              {
                members: {
                  some: { fullName: { contains: search, mode: "insensitive" } },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      section: true,
      members: { orderBy: { displayOrder: "asc" } },
      project: true,
      presentation: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getGroupById(groupId: string) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: {
      section: true,
      createdBy: { select: { id: true, fullName: true, email: true } },
      members: { orderBy: { displayOrder: "asc" } },
      project: true,
      presentation: true,
    },
  });
}
