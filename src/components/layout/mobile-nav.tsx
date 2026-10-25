"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  Users,
  ShieldAlert,
  Clock,
  CheckSquare,
  Calendar,
  Timer,
  FileDown,
  History,
  Settings,
  LogOut,
  LogIn,
  User as UserIcon,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

interface MobileNavProps {
  isAdmin: boolean;
  userSection?: string | null;
  userFullName?: string | null;
  userEmail?: string | null;
  isLoggedIn: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isAdmin,
  userSection,
  userFullName,
  userEmail,
  isLoggedIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sec = userSection?.toUpperCase();

  return (
    <div className="md:hidden flex items-center">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
        className="p-2 rounded-xl text-gray-700 hover:text-uaf-green hover:bg-emerald-50 transition-colors border border-gray-200/80 shadow-xs touch-target flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Drawer Overlay & Content via Portal */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <aside className="relative w-80 max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl overflow-y-auto touch-scroll">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-950 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <span className="text-[11px] font-black text-uaf-gold">513</span>
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">CS-513: Web Programming</p>
                  <p className="text-[10px] text-emerald-300">Instructor: VF. Lecturer Ramish Saleem</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card in Drawer */}
            {isLoggedIn ? (
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-uaf-green text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                    {userFullName ? userFullName.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {userFullName || "Student"}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate font-mono">
                      {userEmail}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-uaf-forest border border-emerald-200">
                      {isAdmin ? "Course Instructor (Admin)" : `Section ${sec || "Student"}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border-b border-gray-100 text-center">
                <p className="text-xs text-gray-600 mb-2">Sign in to access your section</p>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-uaf-green text-white text-xs font-bold shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Navigation Sections */}
            <div className="flex-1 p-3 space-y-4">
              {/* Main Links */}
              <div>
                <p className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Main Portal
                </p>
                <div className="space-y-1 mt-1">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      pathname === "/"
                        ? "bg-emerald-50 text-uaf-green font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="w-4 h-4 text-uaf-green shrink-0" />
                    <span>Home & Dashboard</span>
                  </Link>

                  {(isAdmin || sec === "M1" || !isLoggedIn) && (
                    <Link
                      href="/sections/m1"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        pathname.startsWith("/sections/m1")
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Section M1 Portal</span>
                      </div>
                      {sec === "M1" && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          My Sec
                        </span>
                      )}
                    </Link>
                  )}

                  {(isAdmin || sec === "M2" || !isLoggedIn) && (
                    <Link
                      href="/sections/m2"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        pathname.startsWith("/sections/m2")
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Section M2 Portal</span>
                      </div>
                      {sec === "M2" && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                          My Sec
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              </div>

              {/* Student Quick Action */}
              {isLoggedIn && !isAdmin && sec && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Group Management
                  </p>
                  <div className="space-y-1 mt-1">
                    <Link
                      href={`/sections/${sec.toLowerCase()}/create`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-uaf-green shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4 shrink-0" />
                      <span>Create Group Profile</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Administrator Workspace Links */}
              {isAdmin && (
                <div>
                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Faculty Admin Workspace
                  </p>
                  <div className="space-y-1 mt-1">
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-uaf-gold shrink-0" />
                      <span>Admin Overview</span>
                    </Link>

                    <Link
                      href="/admin/sections/m1"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/sections/m1"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>M1 Groups Management</span>
                    </Link>

                    <Link
                      href="/admin/sections/m2"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/sections/m2"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>M2 Groups Management</span>
                    </Link>

                    <Link
                      href="/admin/reviews"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/reviews"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Pending Reviews</span>
                    </Link>

                    <Link
                      href="/admin/presentations"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/presentations"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-uaf-green shrink-0" />
                      <span>Presentation Tracking</span>
                    </Link>

                    <Link
                      href="/admin/schedule"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/schedule"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Presentation Schedule</span>
                    </Link>

                    <Link
                      href="/admin/deadline"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/deadline"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Submission Deadline</span>
                    </Link>

                    <Link
                      href="/admin/exports"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/exports"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>PDF Reports & Exports</span>
                    </Link>

                    <Link
                      href="/admin/audits"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/audits"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <History className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Audit Logs</span>
                    </Link>

                    <Link
                      href="/admin/settings"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === "/admin/settings"
                          ? "bg-emerald-50 text-uaf-green font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer with Sign Out */}
            {isLoggedIn && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            )}
          </aside>
        </div>,
        document.body
      )}
    </div>
  );
};
