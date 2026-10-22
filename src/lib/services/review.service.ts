import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "./audit.service";
import { ReviewStatus } from "@/types/group";

export async function updateGroupReviewStatus(
  groupId: string,
  newStatus: ReviewStatus,
  adminUserId: string,
  rejectionReason?: string
) {
  const current = await prisma.group.findUnique({
    where: { id: groupId },
    select: { reviewStatus: true, rejectionReason: true },
  });
  if (!current) throw new Error("GROUP_NOT_FOUND");

  const updated = await prisma.group.update({
    where: { id: groupId },
    data: {
      reviewStatus: newStatus,
      rejectionReason: newStatus === "REJECTED" ? rejectionReason : null,
    },
  });

  // Record review history
  await prisma.groupReviewHistory.create({
    data: {
      groupId,
      status: newStatus,
      reason:
        rejectionReason ||
        (newStatus === "APPROVED"
          ? "Approved by faculty evaluator"
          : "Status updated"),
      actorId: adminUserId,
    },
  });

  await logAuditEvent({
    actorUserId: adminUserId,
    action: "UPDATE_GROUP_REVIEW_STATUS",
    entityType: "GROUP",
    entityId: groupId,
    previousValue: JSON.stringify(current),
    newValue: JSON.stringify({ reviewStatus: newStatus, rejectionReason }),
  });

  return updated;
}
