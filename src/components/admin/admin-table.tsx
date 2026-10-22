"use client";

import React, { useState } from "react";
import { AdminTableRow } from "./admin-table-row";
import { AdminMobileCard } from "./admin-mobile-card";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

export const AdminTable: React.FC<{
  groups: any[];
  onReview: (group: any, defaultAction?: "APPROVED" | "REJECTED") => void;
  onPresentation: (group: any) => void;
  onDelete?: (group: any) => void;
}> = ({ groups, onReview, onPresentation, onDelete }) => {
  const [mobileView, setMobileView] = useState<"cards" | "table">("cards");

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 rounded-3xl glass-panel text-gray-500 text-xs">
        No groups found matching the current search criteria or status filter.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile View Switcher (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-2 rounded-xl bg-white/70 border border-gray-200/80 text-xs">
        <span className="font-bold text-gray-600 pl-1">
          {groups.length} Groups
        </span>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setMobileView("cards")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all ${
              mobileView === "cards"
                ? "bg-white text-uaf-green shadow-xs"
                : "text-gray-500"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView("table")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all ${
              mobileView === "table"
                ? "bg-white text-uaf-green shadow-xs"
                : "text-gray-500"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Swipe hint if mobile user selected table mode */}
      {mobileView === "table" && (
        <div className="md:hidden text-center text-xs text-blue-700 bg-blue-50 py-1.5 px-3 rounded-xl border border-blue-100">
          👉 Swipe horizontally to view all table columns
        </div>
      )}

      {/* 1. Mobile Cards View (Rendered on mobile when cards mode active) */}
      <div className={`space-y-3 ${mobileView === "table" ? "hidden" : "block md:hidden"}`}>
        {groups.map((group) => (
          <AdminMobileCard
            key={`mobile-${group.id}`}
            group={group}
            onReview={onReview}
            onPresentation={onPresentation}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 2. Desktop & Full Table View */}
      <div
        className={`overflow-x-auto rounded-3xl glass-panel shadow-glass touch-scroll ${
          mobileView === "cards" ? "hidden md:block" : "block"
        }`}
      >
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200/80 bg-emerald-950/5 text-[11px] font-bold text-uaf-forest uppercase tracking-wider">
              <th className="p-3">Group Name</th>
              <th className="p-3">Team Leader</th>
              <th className="p-3">Members & Reg #</th>
              <th className="p-3">Project Title & Description</th>
              <th className="p-3">Links</th>
              <th className="p-3">Review</th>
              <th className="p-3">Presentation</th>
              <th className="p-3">Submitted</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <AdminTableRow
                key={group.id}
                group={group}
                onReview={onReview}
                onPresentation={onPresentation}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
