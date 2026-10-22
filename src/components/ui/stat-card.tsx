import React from "react";
import { Card } from "./card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "gold" | "green" | "amber";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}) => {
  const iconColors = {
    default: "bg-uaf-surface text-uaf-navy",
    gold: "bg-amber-100 text-uaf-gold",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  }[variant];

  return (
    <Card className="flex items-center gap-4 hover:translate-y-[-2px] transition-transform">
      <div className={`p-3 rounded-xl shadow-neu-sm ${iconColors}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-uaf-navy">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
    </Card>
  );
};
