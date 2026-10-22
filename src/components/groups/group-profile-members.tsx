import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, ExternalLink } from "lucide-react";

export const GroupProfileMembers: React.FC<{ members: any[] }> = ({
  members,
}) => {
  return (
    <Card className="p-5 space-y-3">
      <h3 className="text-xs font-bold text-uaf-navy uppercase tracking-wider flex items-center gap-2">
        <Users className="w-4 h-4 text-uaf-academic" />
        <span>Team Roster ({members.length} Members)</span>
      </h3>
      <div className="space-y-2">
        {members.map((m, idx) => (
          <div
            key={m.id || idx}
            className="flex items-center justify-between p-3 rounded-xl bg-uaf-surface shadow-neu-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-uaf-navy text-white flex items-center justify-center text-xs font-bold shrink-0">
                {m.displayOrder}
              </div>
              <div>
                <p className="text-sm font-bold text-uaf-navy">{m.fullName}</p>
                <p className="text-[11px] text-gray-500 font-mono">{m.regNumber}</p>
              </div>
            </div>
            {m.role === "LEADER" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-uaf-gold/20 text-uaf-gold text-[10px] font-bold">
                <Shield className="w-3 h-3" />
                LEADER
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
