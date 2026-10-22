import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  ExternalLink,
  FileText,
  GitFork,
  Globe,
  Trash2,
  User,
  Users,
  Calendar,
} from "lucide-react";

interface AdminMobileCardProps {
  group: any;
  onReview: (group: any, defaultAction?: "APPROVED" | "REJECTED") => void;
  onPresentation: (group: any) => void;
  onDelete?: (group: any) => void;
}

export const AdminMobileCard: React.FC<AdminMobileCardProps> = ({
  group,
  onReview,
  onPresentation,
  onDelete,
}) => {
  const leader =
    group.members?.find((m: any) => m.role === "LEADER") || group.members?.[0];
  const otherMembers = group.members?.filter((m: any) => m !== leader) || [];
  const isCompleted = group.presentation?.status === "COMPLETED";
  const isApproved = group.reviewStatus === "APPROVED";
  const isRejected = group.reviewStatus === "REJECTED";

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs space-y-3">
      {/* Top Header: Group Name + Badges */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-uaf-forest border border-emerald-200">
              Sec {group.section?.code || "M1"}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              #{group.id.slice(-6)}
            </span>
          </div>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            {group.groupName}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge type="review" status={group.reviewStatus} />
          <Badge
            type="presentation"
            status={group.presentation?.status || "PENDING"}
          />
        </div>
      </div>

      {/* Leader & Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Leader */}
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-800 mb-0.5">
            <User className="w-3 h-3 text-emerald-600" />
            <span>Leader</span>
          </div>
          <p className="font-bold text-gray-900 truncate">
            {leader?.fullName || "Unassigned"}
          </p>
          <p className="text-[11px] font-mono text-emerald-800 font-semibold">
            {leader?.regNumber || "N/A"}
          </p>
        </div>

        {/* Other Members */}
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 mb-0.5">
            <Users className="w-3 h-3 text-gray-400" />
            <span>Other Members ({otherMembers.length})</span>
          </div>
          {otherMembers.length === 0 ? (
            <p className="text-gray-400 italic text-[11px]">No other members</p>
          ) : (
            <div className="space-y-0.5 max-h-16 overflow-y-auto pr-1">
              {otherMembers.map((m: any, idx: number) => (
                <div key={m.id || idx} className="text-[11px] truncate flex items-center justify-between">
                  <span className="font-medium text-gray-800 truncate mr-1">
                    {m.fullName}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500 shrink-0">
                    {m.regNumber}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Idea & Description */}
      <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100 text-xs space-y-1">
        <span className="text-[10px] uppercase font-bold text-gray-400 block">
          Project Proposal
        </span>
        <p className="font-bold text-gray-900 text-xs">
          {group.project?.ideaName || "Untitled Project"}
        </p>
        <p className="text-gray-500 text-[11px] line-clamp-2">
          {group.project?.description || "No description provided."}
        </p>
      </div>

      {/* Links & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {group.project?.projectPdfUrl && (
            <a
              href={group.project.projectPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-[11px] border border-red-200"
            >
              <FileText className="w-3 h-3" />
              <span>Drive PDF</span>
            </a>
          )}
          {group.project?.githubUrl && (
            <a
              href={group.project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 font-bold text-[11px] border border-gray-200"
            >
              <GitFork className="w-3 h-3" />
              <span>GitHub</span>
            </a>
          )}
          {group.project?.websiteUrl && (
            <a
              href={group.project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200"
            >
              <Globe className="w-3 h-3" />
              <span>Demo</span>
            </a>
          )}
        </div>

        <span className="text-[10px] text-gray-400 font-medium">
          Submitted: {new Date(group.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })}
        </span>
      </div>

      {/* Actions Grid */}
      <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2">
        <Link
          href={`/groups/${group.id}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-xs hover:text-uaf-green"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </Link>

        <a
          href={`/api/export/group/${group.id}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-uaf-forest text-xs font-bold shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PDF Dossier</span>
        </a>

        {!isApproved && (
          <button
            type="button"
            onClick={() => onReview(group, "APPROVED")}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
        )}

        {!isRejected && (
          <button
            type="button"
            onClick={() => onReview(group, "REJECTED")}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs hover:bg-rose-100 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onPresentation(group)}
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold shadow-xs cursor-pointer ${
            isCompleted
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "bg-uaf-forest text-white"
          }`}
        >
          {isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-uaf-gold" />}
          <span>{isCompleted ? "Reopen Pres" : "Complete Pres"}</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(group)}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold shadow-xs hover:bg-red-100 cursor-pointer col-span-2 sm:col-span-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
