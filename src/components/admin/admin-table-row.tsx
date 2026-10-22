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
} from "lucide-react";

export const AdminTableRow: React.FC<{
  group: any;
  onReview: (group: any, defaultAction?: "APPROVED" | "REJECTED") => void;
  onPresentation: (group: any) => void;
  onDelete?: (group: any) => void;
}> = ({ group, onReview, onPresentation, onDelete }) => {
  const leader =
    group.members?.find((m: any) => m.role === "LEADER") || group.members?.[0];
  const otherMembers = group.members?.filter((m: any) => m !== leader) || [];
  const isCompleted = group.presentation?.status === "COMPLETED";
  const isApproved = group.reviewStatus === "APPROVED";
  const isRejected = group.reviewStatus === "REJECTED";

  return (
    <tr className="border-b border-gray-100/80 hover:bg-white/80 transition-colors text-xs text-gray-700">
      {/* 1. Group Name */}
      <td className="p-3 font-black text-gray-900 whitespace-nowrap">
        {group.groupName}
        <span className="block text-[10px] text-gray-400 font-normal">
          ID: {group.id.slice(-6)}
        </span>
      </td>

      {/* 2 & 3. Team Leader Name & Reg Number */}
      <td className="p-3 whitespace-nowrap">
        <span className="font-bold text-gray-900 block">
          {leader?.fullName || "Unassigned"}
        </span>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
          {leader?.regNumber || "N/A"}
        </span>
      </td>

      {/* 4 & 5. Member Names & Registration Numbers */}
      <td className="p-3 max-w-xs">
        {otherMembers.length === 0 ? (
          <span className="text-gray-400 italic">None</span>
        ) : (
          <div className="space-y-1">
            {otherMembers.map((m: any, idx: number) => (
              <div key={m.id || idx} className="text-[11px] flex items-center gap-1.5 truncate">
                <span className="font-medium text-gray-800 truncate">{m.fullName}</span>
                <span className="text-[10px] font-mono text-gray-500 shrink-0">
                  ({m.regNumber})
                </span>
              </div>
            ))}
          </div>
        )}
      </td>

      {/* 6 & 7. Project Idea Name & Description Preview */}
      <td className="p-3 max-w-xs">
        <span className="font-bold text-gray-900 block truncate" title={group.project?.ideaName}>
          {group.project?.ideaName || "Untitled Project"}
        </span>
        <span
          className="text-[11px] text-gray-500 line-clamp-2 mt-0.5"
          title={group.project?.description}
        >
          {group.project?.description || "No description."}
        </span>
      </td>

      {/* 8 & 9. Drive PDF Link, GitHub / Website Links */}
      <td className="p-3 whitespace-nowrap">
        <div className="flex flex-col gap-1 text-[11px]">
          {group.project?.projectPdfUrl ? (
            <a
              href={group.project.projectPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-uaf-green hover:underline font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Drive PDF</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <span className="text-gray-400">No PDF</span>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            {group.project?.githubUrl && (
              <a
                href={group.project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repo"
                className="text-gray-600 hover:text-black"
              >
                <GitFork className="w-3.5 h-3.5" />
              </a>
            )}
            {group.project?.websiteUrl && (
              <a
                href={group.project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Website"
                className="text-gray-600 hover:text-uaf-green"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </td>

      {/* 10. Review Status */}
      <td className="p-3 whitespace-nowrap">
        <Badge type="review" status={group.reviewStatus} />
      </td>

      {/* 11. Presentation Status */}
      <td className="p-3 whitespace-nowrap">
        <Badge
          type="presentation"
          status={group.presentation?.status || "PENDING"}
        />
      </td>

      {/* 12. Submission Date & Update indicator */}
      <td className="p-3 whitespace-nowrap text-[11px] text-gray-500">
        <div>
          {new Date(group.createdAt).toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        {group.updatedAt &&
          new Date(group.updatedAt).getTime() - new Date(group.createdAt).getTime() > 5000 && (
            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
              Edited:{" "}
              {new Date(group.updatedAt).toLocaleDateString("en-PK", {
                timeZone: "Asia/Karachi",
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
      </td>

      {/* 13. Actions */}
      <td className="p-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          {/* View Profile */}
          <Link
            href={`/groups/${group.id}`}
            title="View Group Profile"
            className="p-1.5 rounded-lg text-gray-600 hover:text-uaf-green hover:bg-emerald-50 transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Quick Approve Button */}
          {!isApproved && (
            <button
              onClick={() => onReview(group, "APPROVED")}
              title="Approve Group"
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {/* Quick Reject Button */}
          {!isRejected && (
            <button
              onClick={() => onReview(group, "REJECTED")}
              title="Reject Group (Require Feedback)"
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          {/* Mark Presentation Completed / Revert */}
          <button
            onClick={() => onPresentation(group)}
            title={isCompleted ? "Revert to Presentation Pending" : "Mark Presentation Completed"}
            className={`p-1.5 rounded-lg transition-all ${
              isCompleted
                ? "text-amber-600 hover:bg-amber-50"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {isCompleted ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Export PDF */}
          <a
            href={`/api/export/group/${group.id}`}
            title="Export Group PDF"
            className="p-1.5 rounded-lg text-uaf-green hover:bg-emerald-50 transition-all"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Delete Group Profile */}
          {onDelete && (
            <button
              onClick={() => onDelete(group)}
              title="Permanently Delete Group Profile"
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
