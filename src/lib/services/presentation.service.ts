import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "./audit.service";
import { PresentationStatus } from "@/types/group";

export async function updatePresentationStatus(
  groupId: string,
  newStatus: PresentationStatus,
  adminUserId: string
) {
  const current = await prisma.presentation.findUnique({
    where: { groupId },
  });
  if (!current) throw new Error("PRESENTATION_RECORD_NOT_FOUND");

  const prevStatus = current.status;

  const updated = await prisma.presentation.update({
    where: { groupId },
    data: {
      status: newStatus,
      markedBy: adminUserId,
      markedAt: new Date(),
    },
  });

  await logAuditEvent({
    actorUserId: adminUserId,
    action: "UPDATE_PRESENTATION_STATUS",
    entityType: "PRESENTATION",
    entityId: updated.id,
    previousValue: JSON.stringify({ status: prevStatus }),
    newValue: JSON.stringify({ status: newStatus }),
  });

  return updated;
}
