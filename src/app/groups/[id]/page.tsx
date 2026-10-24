import React from "react";
import { notFound } from "next/navigation";
import { getGroupById } from "@/lib/services/group-query.service";
import { getCurrentUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { GroupProfileMembers } from "@/components/groups/group-profile-members";
import { GroupProfileProject } from "@/components/groups/group-profile-project";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import {
  CalendarDays,
  FileDown,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowLeft,
  Users,
} from "lucide-react";

export default async function GroupProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const group = await getGroupById(params.id);
  if (!group) return notFound();

  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const isCreator = user?.id === group.createdById;
  const isMember = group.members?.some(
    (m: any) =>
      user?.regNumber &&
      m.regNumber?.toUpperCase() === user?.regNumber?.toUpperCase()
  );

  const schedule = (group as any).schedule || (group as any).presentation;
  const scheduledDate =
    (group as any).schedule?.scheduledAt ||
    (group as any).presentation?.scheduledDate;
  const venue =
    (group as any).schedule?.venue || (group as any).presentation?.venue;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <Link
          href={`/sections/${group.section?.code.toLowerCase() || "m1"}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-gray-700 hover:text-uaf-green transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Section {group.section?.code}</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {(isAdmin || isCreator || isMember) && (
            <Link
              href={`/groups/${group.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-panel text-xs font-bold text-gray-700 hover:text-uaf-green transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit / Resubmit</span>
            </Link>
          )}

          {(isAdmin || isCreator || isMember) && (
            <a
              href={`/api/export/group/${group.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </a>
          )}

          {isAdmin && <AdminDeleteButton group={group} />}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>
                Section {group.section?.code} • {group.section?.semester}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {group.groupName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              CS-513: Web Programming • Instructor: Mam Ramish Saleem
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge type="review" status={group.reviewStatus} />
              <Badge
                type="presentation"
                status={group.presentation?.status || "PENDING"}
              />
            </div>
            {group.reviewStatus === "APPROVED" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFFICIALLY APPROVED</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Alert if Rejected */}
      {group.reviewStatus === "REJECTED" && group.rejectionReason && (
        <div className="p-5 rounded-2xl bg-red-50/90 border border-red-200 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Faculty Rejection Feedback</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed">
            {group.rejectionReason}
          </p>
          {(isCreator || isAdmin) && (
            <div className="pt-2">
              <Link
                href={`/groups/${group.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Correct & Resubmit Group Profile</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Presentation Schedule Card if scheduled */}
      {scheduledDate && (
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-uaf-green space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-uaf-forest uppercase">
            <Clock className="w-4 h-4 text-uaf-green" />
            <span>Scheduled Presentation Session</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
            <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl">
              <CalendarDays className="w-4 h-4 text-uaf-green" />
              <span>
                <strong>Date & Time:</strong>{" "}
                {new Date(scheduledDate).toLocaleString("en-PK", {
                  timeZone: "Asia/Karachi",
                  dateStyle: "medium",
                  timeStyle: "short",
                })} (PKT)
              </span>
            </div>
            {venue && (
              <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-uaf-green" />
                <span>
                  <strong>Venue:</strong> {venue}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members Roster Card */}
      <GroupProfileMembers members={group.members || []} />

      {/* Project Details Card */}
      <GroupProfileProject project={group.project} />

      {/* Timestamps Card */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-uaf-green" />
          <span>
            Submitted: {new Date(group.createdAt).toLocaleDateString()} at{" "}
            {new Date(group.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div>
          Last updated: {new Date(group.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
