"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteGroupModal } from "./delete-group-modal";

export const AdminDeleteButton: React.FC<{ group: any }> = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all"
        title="Delete Group Profile"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Group</span>
      </button>

      <DeleteGroupModal
        group={group}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          router.push(`/admin/sections/${group.section?.code?.toLowerCase() || "m1"}`);
          router.refresh();
        }}
      />
    </>
  );
};
