import React from "react";
import { redirect } from "next/navigation";
import { getSectionGroups } from "@/lib/services/group-query.service";
import { SectionTabs } from "@/components/sections/section-tabs";
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

      {/* Student View: Show ONLY their own group profile, or prompt to create one */}
      {!isAdmin && (
        userGroup ? (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-glass">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-uaf-green block mb-1">
                  Your Registered Group Profile
                </span>
                <h2 className="text-xl font-black text-gray-900">
                  {userGroup.groupName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Section M2 • {userGroup.members?.length || 0} Team Members
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {userGroup.reviewStatus.replace("_", " ")}
                </span>
                <Link
                  href={`/groups/${userGroup.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Project Idea Info */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Project Title & Concept
              </span>
              <h3 className="text-base font-bold text-gray-900">
                {userGroup.project?.ideaName || "Untitled Project"}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                {userGroup.project?.description || "No description provided."}
              </p>
            </div>

            {/* Team Members */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Team Members ({userGroup.members?.length || 0})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userGroup.members?.map((m: any, mIdx: number) => (
                  <div
                    key={m.id || mIdx}
                    className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-800 block">
                        {m.fullName}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {m.regNumber}
                      </span>
                    </div>
                    {m.role === "LEADER" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        Leader
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Links / Deliverables */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
              {userGroup.project?.projectPdfUrl ? (
                <a
                  href={userGroup.project.projectPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 hover:bg-red-100 transition-all"
                >
                  <span>Google Drive PDF</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic">No Drive link</span>
              )}

              {userGroup.project?.githubUrl && (
                <a
                  href={userGroup.project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-800 font-bold border border-gray-200 hover:bg-gray-200 transition-all"
                >
                  <span>GitHub Repository</span>
                </a>
              )}

              {userGroup.project?.websiteUrl && (
                <a
                  href={userGroup.project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition-all"
                >
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center glass-panel rounded-3xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                You have not registered a group yet
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Each student group must register with 2 to 7 members, a project idea, and team details.
              </p>
            </div>
            <Link
              href="/sections/m2/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Group Profile Now</span>
            </Link>
          </div>
        )
      )}

      {/* Admin View ONLY: View all groups in the section */}
      {isAdmin && (
        groups.length > 0 ? (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                All Section M2 Groups ({groups.length})
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                Admin Evaluation Directory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.map((g) => (
                <GroupCard
                  key={g.id}
                  id={g.id}
                  groupName={g.groupName}
                  ideaName={g.project?.ideaName || "Project Idea"}
                  leaderName={g.members?.[0]?.fullName || "Lead"}
                  memberCount={g.members?.length || 0}
                  presentationStatus={g.presentation?.status || "PENDING"}
                  reviewStatus={g.reviewStatus}
                  isMyGroup={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center glass-panel rounded-3xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No Groups Registered Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No student teams have registered in Section M2 yet.
            </p>
          </div>
        )
      )}
    </div>
  );
}
