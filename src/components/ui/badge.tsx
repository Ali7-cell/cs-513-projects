import React from "react";
import { clsx } from "clsx";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface BadgeProps {
  type: "review" | "presentation";
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PENDING" | "COMPLETED";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, status, className }) => {
  const isPending = status === "PENDING" || status === "PENDING_REVIEW";
  const isApprovedOrDone = status === "APPROVED" || status === "COMPLETED";

  const colorClasses = isPending
    ? "bg-amber-100 text-amber-800 border-amber-300"
    : isApprovedOrDone
    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
    : "bg-rose-100 text-rose-800 border-rose-300";

  const label =
    type === "presentation"
      ? status === "COMPLETED"
        ? "Presentation Completed"
        : "Presentation Pending"
      : status === "APPROVED"
      ? "Approved"
      : status === "REJECTED"
      ? "Rejected"
      : "Pending Review";

  const Icon = isPending ? Clock : isApprovedOrDone ? CheckCircle : XCircle;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-neu-sm",
        colorClasses,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </span>
  );
};
