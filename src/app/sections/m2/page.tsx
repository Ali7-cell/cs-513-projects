import React from "react";
import { redirect } from "next/navigation";
import { getSectionGroups } from "@/lib/services/group-query.service";
import { formatSectionGroupsForTable } from "@/lib/services/section-table-data";
import { SectionTabs } from "@/components/sections/section-tabs";
import { SectionGroupedTable } from "@/components/sections/section-grouped-table";
import { GroupCard } from "@/components/groups/group-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getActiveDeadline } from "@/lib/services/deadline.service";
import { CountdownTimer } from "@/components/dashboard/countdown-timer";
import Link from "next/link";
import {
  PlusCircle,
  Edit,
  Users,
  GraduationCap,
} from "lucide-react";

export default async function SectionM2Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/sections/m2");
  }

  // Strict Section Isolation: If student belongs to M1, redirect to M1
  if (user.role !== "ADMIN" && user.sectionCode?.toUpperCase() === "M1") {
    redirect("/sections/m1");
  }

  const [groups, deadline] = await Promise.all([
    getSectionGroups("M2"),
    getActiveDeadline(),
  ]);
  const isAdmin = user.role === "ADMIN";

  // Transform database groups and reference groups for the table
  const tableData = formatSectionGroupsForTable("M2", groups);

  // Find user's group if any
  const userGroup = groups.find(
    (g) =>
      g.createdById === user.id ||
      g.members?.some(
        (m) =>
          user.regNumber &&
          m.regNumber?.toUpperCase() === user.regNumber.toUpperCase()
      )
  );

  return (
    <div className="space-y-6">
      {/* Show section tabs ONLY to Admin */}
      {isAdmin && <SectionTabs currentSection="m2" />}

      {/* Action Bar & Quick Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0E366C] flex items-center justify-center font-black">
            M2
          </div>
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              CS-513: Web Programming • Instructor: VF. Lecturer Ramish Saleem
            </div>
            <div className="text-sm sm:text-base font-extrabold text-gray-900">
              BS IT 5th Semester • Section M2
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {userGroup ? (
            <Link
              href={`/groups/${userGroup.id}/edit`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-900/15 transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Your Group Profile</span>
            </Link>
          ) : (
            <Link
              href="/sections/m2/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Group Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* User's Own Group Quick Banner if registered */}
      {userGroup && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Your Registered Group:
              </span>
              <span className="text-sm font-black text-uaf-green">
                {userGroup.groupName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-emerald-800 border border-emerald-200">
                {userGroup.reviewStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              Project: {userGroup.project?.ideaName || "Untitled Project"} • {userGroup.members?.length || 0} Members
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/groups/${userGroup.id}`}
              className="flex-1 sm:flex-initial text-center px-3 py-2 rounded-xl bg-white text-gray-700 hover:text-uaf-green text-xs font-bold border border-emerald-200 shadow-sm transition-all"
            >
              View Details
            </Link>
            <Link
              href={`/groups/${userGroup.id}/edit`}
              className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl bg-uaf-green text-white hover:bg-uaf-forest text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      )}

      {/* MAIN REQUIREMENT: Starting BSIT Fifth M2 List Table */}
      <SectionGroupedTable sectionCode="M2" data={tableData} />

      {/* Live Deadline Countdown if active */}
      {deadline && (
        <div className="pt-2 max-w-md mx-auto">
          <CountdownTimer deadline={deadline.deadline} title={deadline.title} />
        </div>
      )}

      {/* Detailed Group Cards Section */}
      {groups.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Database Registered Groups ({groups.length})
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              Invariant: 2–7 Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g) => {
              const isMyGroup =
                g.createdById === user.id ||
                g.members?.some(
                  (m) =>
                    user.regNumber &&
                    m.regNumber?.toUpperCase() === user.regNumber.toUpperCase()
                );

              return (
                <GroupCard
                  key={g.id}
                  id={g.id}
                  groupName={g.groupName}
                  ideaName={g.project?.ideaName || "Project Idea"}
                  leaderName={g.members?.[0]?.fullName || "Lead"}
                  memberCount={g.members?.length || 0}
                  presentationStatus={g.presentation?.status || "PENDING"}
                  reviewStatus={g.reviewStatus}
                  isMyGroup={isMyGroup}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
