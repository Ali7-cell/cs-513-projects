"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/admin-table";
import { ReviewModal } from "@/components/admin/review-modal";
import { Clock, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingReviewsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewGroup, setReviewGroup] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const fetchPending = async () => {
    setLoading(true);
    try {
      const [resM1, resM2] = await Promise.all([
        fetch("/api/groups?section=m1&status=PENDING_REVIEW").then((r) => r.json()),
        fetch("/api/groups?section=m2&status=PENDING_REVIEW").then((r) => r.json()),
      ]);
      setGroups([...(resM1.data || []), ...(resM2.data || [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "loading") return;
    if (!isAdmin) {
      router.push("/login?admin=true");
      return;
    }
    fetchPending();
  }, [authStatus, isAdmin]);

  const handleReview = async (status: "APPROVED" | "REJECTED", reason?: string) => {
    if (!reviewGroup) return;
    setActionLoading(true);
    await fetch("/api/admin/review", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: reviewGroup.id,
        reviewStatus: status,
        rejectionReason: reason,
      }),
    });
    setActionLoading(false);
    setReviewGroup(null);
    fetchPending();
  };

  if (authStatus === "loading" || !isAdmin) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 glass-panel rounded-3xl">
        Verifying administrator privileges...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Review Queue</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Pending Group Reviews ({groups.length})
            </h1>
            <p className="text-xs text-gray-500">
              Submissions awaiting faculty review and project proposal authorization.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={fetchPending}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 glass-panel rounded-3xl">
          Loading pending reviews...
        </div>
      ) : groups.length === 0 ? (
        <div className="p-12 text-center text-xs text-emerald-800 glass-panel rounded-3xl flex flex-col items-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          <p className="font-bold text-sm">All caught up!</p>
          <p className="text-gray-500">There are no pending group submissions awaiting review.</p>
        </div>
      ) : (
        <AdminTable
          groups={groups}
          onReview={(g) => setReviewGroup(g)}
          onPresentation={() => {}}
        />
      )}

      <ReviewModal
        group={reviewGroup}
        isOpen={!!reviewGroup}
        loading={actionLoading}
        onClose={() => setReviewGroup(null)}
        onSubmit={handleReview}
      />
    </div>
  );
}
