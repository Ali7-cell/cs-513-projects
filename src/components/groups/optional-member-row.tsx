import React from "react";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface OptionalMemberRowProps {
  order: number;
  name: string;
  regNumber: string;
  error?: string;
  onChangeName: (val: string) => void;
  onChangeReg: (val: string) => void;
  onRemove: () => void;
}

export const OptionalMemberRow: React.FC<OptionalMemberRowProps> = ({
  order,
  name,
  regNumber,
  error,
  onChangeName,
  onChangeReg,
  onRemove,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 p-3 rounded-xl bg-uaf-light shadow-neu-sm">
      <div className="flex-1 w-full">
        <Input
          label={`Member ${order} Name (Optional)`}
          placeholder="Full Name"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
        />
      </div>
      <div className="flex-1 w-full">
        <Input
          label={`Member ${order} Reg #`}
          placeholder="e.g. 2022-AG-8814"
          value={regNumber}
          error={error}
          onChange={(e) => onChangeReg(e.target.value.toUpperCase())}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        title="Remove Member"
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 p-2 sm:p-2.5 rounded-xl text-red-600 bg-red-50/80 sm:bg-transparent sm:text-gray-400 hover:text-red-600 hover:bg-red-50 shadow-neu-sm transition-all text-xs font-semibold cursor-pointer shrink-0"
      >
        <Trash2 className="w-4 h-4 shrink-0" />
        <span className="sm:hidden">Remove Member {order}</span>
      </button>
    </div>
  );
};
