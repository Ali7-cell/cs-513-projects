import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { Settings, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login?admin=true");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>CS-513 Course Administration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">
          Administrator Settings
        </h1>
        <p className="text-xs text-gray-500">
          Course Instructor: Mam Ramish Saleem • CS-513: Web Programming
        </p>
      </div>

      {/* Admin Profile */}
      <div className="glass-panel p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-uaf-green" />
          <span>Authorized Course Instructor & Admin</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/70 p-4 rounded-2xl border border-gray-100">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Instructor / Admin</span>
            <span className="font-bold text-gray-900">{user?.fullName || "Mam Ramish Saleem"}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Address</span>
            <span className="font-bold text-gray-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Role & Authorization</span>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Course Instructor & Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
