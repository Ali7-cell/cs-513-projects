import { prisma } from "@/lib/prisma";

export async function getActiveDeadline() {
  try {
    const deadline = await prisma.submissionDeadline.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return deadline;
  } catch (error) {
    console.error("Failed to fetch active deadline:", error);
    return null;
  }
}

export async function checkSubmissionDeadlineAllowed(): Promise<{
  allowed: boolean;
  message?: string;
  deadline?: Date;
}> {
  const active = await getActiveDeadline();
  if (!active) {
    // If no deadline is set, submissions are open by default
    return { allowed: true };
  }

  const now = new Date();
  const deadlineDate = new Date(active.deadline);

  if (now > deadlineDate) {
    return {
      allowed: false,
      message: `Group profile submissions closed on ${deadlineDate.toLocaleString("en-PK", {
        timeZone: "Asia/Karachi",
        dateStyle: "medium",
        timeStyle: "short",
      })} (PKT). Contact the department coordinator for extensions.`,
      deadline: deadlineDate,
    };
  }

  return { allowed: true, deadline: deadlineDate };
}

export async function upsertDeadline(deadlineDate: Date, title?: string, actorId?: string) {
  // Deactivate all previous deadlines
  await prisma.submissionDeadline.updateMany({
    data: { isActive: false },
  });

  return prisma.submissionDeadline.create({
    data: {
      title: title || "BS IT 5th Semester Final Project Group Registration",
      deadline: deadlineDate,
      isActive: true,
      createdBy: actorId,
    },
  });
}

export async function toggleDeadlineStatus(id: string, isActive: boolean) {
  return prisma.submissionDeadline.update({
    where: { id },
    data: { isActive },
  });
}
