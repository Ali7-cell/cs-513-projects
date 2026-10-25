import React from "react";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

interface LeaderInputsProps {
  name: string;
  regNumber: string;
  nameError?: string;
  regError?: string;
  onNameChange: (val: string) => void;
  onRegChange: (val: string) => void;
}

export const LeaderInputs: React.FC<LeaderInputsProps> = ({
  name,
  regNumber,
  nameError,
  regError,
  onNameChange,
  onRegChange,
}) => {
  return (
    <div className="p-4 rounded-xl bg-uaf-surface shadow-neu-sm border border-uaf-gold/20">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-uaf-navy uppercase tracking-wider">
        <Shield className="w-4 h-4 text-uaf-gold" />
        <span>Team Leader (Mandatory / Solo Member)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Leader Full Name *"
          placeholder="e.g. Muhammad Ali Liaqat"
          value={name}
          error={nameError}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Input
          label="Leader University Reg # *"
          placeholder="e.g. 2022-AG-8812"
          value={regNumber}
          error={regError}
          onChange={(e) => onRegChange(e.target.value.toUpperCase())}
        />
      </div>
    </div>
  );
};
