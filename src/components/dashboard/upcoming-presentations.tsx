import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const UpcomingPresentations: React.FC<{ groups: any[] }> = ({ groups }) => {
  const pending = groups.filter((g) => g.presentation?.status === "PENDING").slice(0, 4);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-uaf-navy uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Upcoming Presentations</span>
        </h3>
      </div>

      {pending.length === 0 ? (
        <p className="text-xs text-gray-400 py-4 text-center">No pending presentations scheduled.</p>
      ) : (
        <div className="space-y-2">
          {pending.map((g) => (
            <Link
              key={g.id}
              href={`/groups/${g.id}`}
              className="p-2.5 rounded-xl bg-uaf-surface hover:bg-white shadow-neu-sm transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-uaf-navy text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  {g.groupName.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="font-bold text-uaf-navy group-hover:text-uaf-academic truncate">{g.groupName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{g.project?.ideaName || "No title"}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-uaf-navy shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};
