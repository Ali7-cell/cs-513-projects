import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ReviewModal: React.FC<{
  group: any;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (status: "APPROVED" | "REJECTED", reason?: string) => void;
}> = ({ group, isOpen, loading, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto touch-scroll border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Review Group: {group.groupName}</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={action === "APPROVED" ? "primary" : "secondary"}
            onClick={() => setAction("APPROVED")}
          >
            Approve Group
          </Button>
          <Button
            type="button"
            size="sm"
            variant={action === "REJECTED" ? "danger" : "secondary"}
            onClick={() => setAction("REJECTED")}
          >
            Reject Group
          </Button>
        </div>
        {action === "REJECTED" && (
          <Textarea
            label="Rejection Reason *"
            placeholder="Explain why the group is rejected and what must be updated..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            size="sm"
            variant={action === "REJECTED" ? "danger" : "primary"}
            disabled={loading || (action === "REJECTED" && reason.trim().length < 5)}
            onClick={() => onSubmit(action, reason)}
          >
            {loading ? "Saving..." : `Confirm ${action}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
