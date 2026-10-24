"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteGroupModalProps {
  group: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !group) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to delete group profile.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl glass-panel bg-white/95 p-6 shadow-2xl border border-red-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">
              Delete Group Profile
            </h3>
            <p className="text-xs text-red-600 font-semibold">
              Permanent Database Deletion
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-3 text-xs text-gray-600 mb-6 bg-red-50/50 p-4 rounded-2xl border border-red-100">
          <p>
            Are you sure you want to permanently delete{" "}
            <strong className="text-gray-900 font-bold">{group.groupName}</strong>{" "}
            from the database?
          </p>
          <p className="text-[11px] text-gray-500">
            This will permanently remove the group roster, project idea, external links, and the team leader&apos;s login account (email &amp; AG number) from the database so they can register fresh.
          </p>
        </div>

        <div className="flex gap-2.5 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/20"
          >
            {loading ? "Deleting..." : "Permanently Delete Group"}
          </Button>
        </div>
      </div>
    </div>
  );
};
