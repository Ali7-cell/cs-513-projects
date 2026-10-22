import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface PresentationModalProps {
  group: any;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  group,
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !group) return null;
  const isCompleted = group.presentation?.status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto touch-scroll border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shadow-neu-sm ${isCompleted ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
            {isCompleted ? <RotateCcw className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-uaf-navy">
              {isCompleted ? "Reopen Presentation to Pending?" : "Mark Presentation Completed?"}
            </h3>
            <p className="text-xs text-gray-500 font-medium">Group: {group.groupName}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          {isCompleted
            ? "This will revert the presentation status back to 'Pending' and log an audit entry."
            : "Confirming this action will record the presentation as completed with your administrator timestamp and signature."}
        </p>

        <div className="flex gap-2.5 justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Updating..." : isCompleted ? "Reopen to Pending" : "Confirm Completed"}
          </Button>
        </div>
      </div>
    </div>
  );
};
