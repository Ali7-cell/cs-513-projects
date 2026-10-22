import React from "react";
import { OptionalMemberRow } from "./optional-member-row";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface MemberEntry {
  fullName: string;
  regNumber: string;
}

interface OptionalMembersProps {
  members: MemberEntry[];
  errors: Record<number, string>;
  onAdd: () => void;
  onUpdate: (idx: number, field: "fullName" | "regNumber", val: string) => void;
  onRemove: (idx: number) => void;
}

export const OptionalMembers: React.FC<OptionalMembersProps> = ({
  members,
  errors,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const canAddMore = members.length < 5; // Leader + M2 + max 5 optional = 7 total

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Optional Team Members (Members 3 to 7)
        </span>
        {canAddMore && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAdd}
            className="flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-uaf-academic" />
            <span>Add Member {members.length + 3}</span>
          </Button>
        )}
      </div>

      {members.map((m, idx) => (
        <OptionalMemberRow
          key={idx}
          order={idx + 3}
          name={m.fullName}
          regNumber={m.regNumber}
          error={errors[idx]}
          onChangeName={(val) => onUpdate(idx, "fullName", val)}
          onChangeReg={(val) => onUpdate(idx, "regNumber", val)}
          onRemove={() => onRemove(idx)}
        />
      ))}
    </div>
  );
};
