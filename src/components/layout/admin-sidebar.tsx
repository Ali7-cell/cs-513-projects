"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckSquare,
  Calendar,
  Timer,
  FileDown,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "M1 Groups", href: "/admin/sections/m1", icon: Users },
    { label: "M2 Groups", href: "/admin/sections/m2", icon: Users },
    { label: "Pending Reviews", href: "/admin/reviews", icon: Clock },
    {
      label: "Presentation Tracking",
      href: "/admin/presentations",
      icon: CheckSquare,
    },
    {
      label: "Upcoming Presentations",
      href: "/admin/schedule",
      icon: Calendar,
    },
    { label: "Submission Deadline", href: "/admin/deadline", icon: Timer },
    { label: "PDF Exports", href: "/admin/exports", icon: FileDown },
    { label: "Audit Logs", href: "/admin/audits", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full space-y-4">
      {/* Admin badge */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-emerald-950 text-white shadow-md">
        <ShieldCheck className="w-5 h-5 text-uaf-gold shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight truncate">
            Admin Workspace
          </p>
          <p className="text-[10px] text-emerald-300">BS IT 5th Semester</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-uaf-green text-white shadow-md shadow-emerald-900/20 font-bold"
                  : "text-gray-600 hover:text-uaf-green hover:bg-emerald-50/70"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="pt-2 border-t border-gray-200/70">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Find active label for mobile button
  const currentNavItem = navItems.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  return (
    <>
      {/* Mobile Sticky Action Bar with Menu Toggle */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl glass-panel shadow-xs border border-white/80">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-uaf-forest text-white text-xs font-bold shadow-sm hover:bg-uaf-darkgreen transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Admin Navigation</span>
          </button>

          <div className="text-right pr-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Current View</span>
            <span className="text-xs font-bold text-uaf-green truncate block max-w-[150px]">
              {currentNavItem?.label || "Admin Area"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white/98 backdrop-blur-2xl p-4 z-10 shadow-2xl border-r border-emerald-100 flex flex-col touch-scroll">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Admin Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-60 shrink-0 hidden lg:block glass-panel p-4 rounded-3xl h-[calc(100vh-6.5rem)] sticky top-24 shadow-glass">
        {sidebarContent}
      </aside>
    </>
  );
};
