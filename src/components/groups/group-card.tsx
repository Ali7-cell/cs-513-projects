import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Code2, Users, ArrowRight } from "lucide-react";

interface GroupCardProps {
  id: string;
  groupName: string;
  ideaName: string;
  leaderName: string;
  memberCount: number;
  presentationStatus: "PENDING" | "COMPLETED";
  reviewStatus?: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  isMyGroup?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  id,
  groupName,
  ideaName,
  leaderName,
  memberCount,
  presentationStatus,
  reviewStatus = "PENDING_REVIEW",
  isMyGroup = false,
}) => {
  return (
    <div className={`glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between group relative overflow-hidden ${
      isMyGroup ? "ring-2 ring-emerald-500 bg-emerald-50/20" : ""
    }`}>
      {isMyGroup && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-xl tracking-wider">
          YOUR GROUP
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-uaf-green group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-uaf-green transition-colors">
                {groupName}
              </h3>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]" title={ideaName}>
                {ideaName}
              </p>
            </div>
          </div>
          <Badge type="review" status={reviewStatus} />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-white/60 p-2 rounded-xl">
          <Users className="w-3.5 h-3.5 text-uaf-forest" />
          <span className="font-semibold">{memberCount} members</span>
          <span>•</span>
          <span className="truncate">Lead: {leaderName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Badge type="presentation" status={presentationStatus} />
        <div className="flex items-center gap-2">
          {isMyGroup && (
            <Link
              href={`/groups/${id}/edit`}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-all"
            >
              <span>Edit</span>
            </Link>
          )}
          <Link
            href={`/groups/${id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-uaf-green hover:text-uaf-forest group-hover:translate-x-0.5 transition-all"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
