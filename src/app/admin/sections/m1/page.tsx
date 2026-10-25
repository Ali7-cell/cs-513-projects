"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminTable } from "@/components/admin/admin-table";
import { PresentationModal } from "@/components/admin/presentation-modal";
import { ReviewModal } from "@/components/admin/review-modal";
import { DeleteGroupModal } from "@/components/admin/delete-group-modal";
import { Button } from "@/components/ui/button";
import { SectionTabs } from "@/components/sections/section-tabs";
import { Download, Search, Filter, RefreshCw, Users } from "lucide-react";

export default function AdminSectionM1Page() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [presGroup, setPresGroup] = useState<any>(null);
  const [reviewGroup, setReviewGroup] = useState<any>(null);
  const [deleteGroup, setDeleteGroup] = useState<any>(null);
  const [defaultAction, setDefaultAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const fetchGroups = async () => {
    setLoading(true);
    const params = new URLSearchParams({ section: "m1" });
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/groups?${params}`);
      const data = await res.json();
      setGroups(data.data || []);
    } catch (err) {
      console.error("Failed to load M1 groups:", err);
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
    fetchGroups();
  }, [authStatus, isAdmin, statusFilter]);

  const handlePres = async () => {
    if (!presGroup) return;
    setActionLoading(true);
    const newStatus =
      presGroup.presentation?.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    await fetch("/api/admin/presentation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: presGroup.id, status: newStatus }),
    });
    setActionLoading(false);
    setPresGroup(null);
    fetchGroups();
  };

  const handleOpenReview = (group: any, action: "APPROVED" | "REJECTED" = "APPROVED") => {
    setDefaultAction(action);
    setReviewGroup(group);
  };

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
    fetchGroups();
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
      <SectionTabs currentSection="m1" basePath="/admin/sections" />

      {/* Top action and filter bar */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Section M1 Administration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              M1 Groups Evaluation Hub
            </h1>
            <p className="text-xs text-gray-500">
              Manage student group approvals, reviews, presentation status, and PDF exports.
            </p>
          </div>

          <a href="/api/export/section/m1" className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto bg-uaf-green hover:bg-uaf-forest text-white font-bold flex items-center justify-center gap-2 shadow-md">
              <Download className="w-4 h-4" />
              <span>Export Section M1 PDF</span>
            </Button>
          </a>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-3 pt-2 border-t border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchGroups()}
              placeholder="Search by group name, leader, reg #, or project..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-start">
            <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-gray-200 overflow-x-auto no-scrollbar flex-1 sm:flex-initial">
              <Filter className="w-3.5 h-3.5 text-gray-400 ml-1.5 shrink-0" />
              {["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    statusFilter === st
                      ? "bg-uaf-green text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {st === "ALL"
                    ? "All"
                    : st === "PENDING_REVIEW"
                    ? "Pending"
                    : st === "APPROVED"
                    ? "Approved"
                    : "Rejected"}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={fetchGroups}
              className="flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 glass-panel rounded-3xl">
          Loading Section M1 groups from PostgreSQL...
        </div>
      ) : (
        <AdminTable
          groups={groups}
          onReview={handleOpenReview}
          onPresentation={setPresGroup}
          onDelete={setDeleteGroup}
        />
      )}

      {/* Modals */}
      <PresentationModal
        group={presGroup}
        isOpen={!!presGroup}
        loading={actionLoading}
        onClose={() => setPresGroup(null)}
        onConfirm={handlePres}
      />
      <ReviewModal
        group={reviewGroup}
        isOpen={!!reviewGroup}
        loading={actionLoading}
        onClose={() => setReviewGroup(null)}
        onSubmit={handleReview}
      />
      <DeleteGroupModal
        group={deleteGroup}
        isOpen={!!deleteGroup}
        onClose={() => setDeleteGroup(null)}
        onSuccess={fetchGroups}
      />
    </div>
  );
}
