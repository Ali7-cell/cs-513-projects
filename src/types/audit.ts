export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: string | null;
  newValue?: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalM1: number;
  totalM2: number;
  totalGroups: number;
  pendingReviews: number;
  approvedGroups: number;
  rejectedGroups: number;
  presentationsPending: number;
  presentationsCompleted: number;
}
