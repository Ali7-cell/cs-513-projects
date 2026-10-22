"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export const UserNav: React.FC = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const u = session.user as any;
  const subtitle =
    u.role === "ADMIN"
      ? "Department Administrator"
      : `BS IT • ${u.sectionCode || "5th Sem"}`;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-xs font-bold text-gray-900 leading-tight">
          {u.name || "Student"}
        </p>
        <p className="text-[10px] text-uaf-emerald font-semibold">{subtitle}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-sm flex items-center justify-center text-uaf-forest font-bold overflow-hidden">
        {u.name ? u.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Logout"
        className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
