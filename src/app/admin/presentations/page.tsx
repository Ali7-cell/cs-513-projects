"use client";

import React, { useEffect, useState } from "react";
import { AdminTable } from "@/components/admin/admin-table";
import { PresentationModal } from "@/components/admin/presentation-modal";
import { CheckSquare, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PresentationTrackingPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [sectionFilter, setSectionFilter] = useState<"ALL" | "M1" | "M2">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
  const [loading, setLoading] = useState(true);
  const [presGroup, setPresGroup] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const [resM1, resM2] = await Promise.all([
        fetch("/api/groups?section=m1").then((r) => r.json()),
        fetch("/api/groups?section=m2").then((r) => r.json()),
      ]);
      let all = [...(resM1.data || []), ...(resM2.data || [])];

      if (sectionFilter !== "ALL") {
        all = all.filter((g) => g.section?.code === sectionFilter);
      }
      if (statusFilter !== "ALL") {
        all = all.filter((g) => (g.presentation?.status || "PENDING") === statusFilter);
      }
      setGroups(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [sectionFilter, statusFilter]);

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

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Evaluation Status</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Presentation Tracking ({groups.length})
            </h1>
            <p className="text-xs text-gray-500">
              Track and toggle presentation evaluation marks independently from project review status.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={fetchGroups}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Statuses</span>
          </Button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            <span className="font-bold text-gray-500 mr-1 shrink-0">Section:</span>
            {(["ALL", "M1", "M2"] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setSectionFilter(sec)}
                className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  sectionFilter === sec
                    ? "bg-uaf-green text-white shadow-sm"
                    : "bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200"
                }`}
              >
                {sec === "ALL" ? "All Sections" : `Section ${sec}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            <span className="font-bold text-gray-500 mr-1 shrink-0">Status:</span>
            {(["ALL", "PENDING", "COMPLETED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? "bg-uaf-green text-white shadow-sm"
                    : "bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200"
                }`}
              >
                {st === "ALL" ? "All" : st === "PENDING" ? "Pending" : "Completed"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 glass-panel rounded-3xl">
          Loading presentation records...
        </div>
      ) : (
        <AdminTable
          groups={groups}
          onReview={() => {}}
          onPresentation={(g) => setPresGroup(g)}
        />
      )}

      <PresentationModal
        group={presGroup}
        isOpen={!!presGroup}
        loading={actionLoading}
        onClose={() => setPresGroup(null)}
        onConfirm={handlePres}
      />
    </div>
  );
}
