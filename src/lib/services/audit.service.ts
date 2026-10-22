import { prisma } from "@/lib/prisma";

export async function logAuditEvent(params: {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: string | null;
  newValue?: string | null;
}) {
  return prisma.auditLog.create({
    data: {
      actorUserId: params.actorUserId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousValue: params.previousValue ?? null,
      newValue: params.newValue ?? null,
    },
  });
}
