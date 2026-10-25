import React from "react";
import { Input } from "@/components/ui/input";
import { UserCheck } from "lucide-react";

interface Member2InputsProps {
  name: string;
  regNumber: string;
  nameError?: string;
  regError?: string;
  onNameChange: (val: string) => void;
  onRegChange: (val: string) => void;
}

export const Member2Inputs: React.FC<Member2InputsProps> = ({
  name,
  regNumber,
  nameError,
  regError,
  onNameChange,
  onRegChange,
}) => {
  return (
    <div className="p-4 rounded-xl bg-uaf-surface shadow-neu-sm border border-uaf-academic/20">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-uaf-navy uppercase tracking-wider">
        <UserCheck className="w-4 h-4 text-uaf-academic" />
        <span>Team Member 2 (Optional — Leave blank if solo)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Member 2 Full Name (Optional)"
          placeholder="e.g. Usman Tariq (leave blank if solo)"
          value={name}
          error={nameError}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Input
          label="Member 2 University Reg # (Optional)"
          placeholder="e.g. 2022-AG-8813 (leave blank if solo)"
          value={regNumber}
          error={regError}
          onChange={(e) => onRegChange(e.target.value.toUpperCase())}
        />
      </div>
    </div>
  );
};
