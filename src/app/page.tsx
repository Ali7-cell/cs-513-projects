import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getActiveDeadline } from "@/lib/services/deadline.service";
import { CountdownTimer } from "@/components/dashboard/countdown-timer";
import { LoginForm } from "./(auth)/login/login-form";
import {
  Users,
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const userSection = user?.sectionCode?.toUpperCase();
  const deadline = await getActiveDeadline();

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center py-6 sm:py-8 px-2 sm:px-4">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-uaf-green/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Branding Section (Centered) */}
      <div className="w-full max-w-md text-center space-y-3 mb-6 px-2">
        {/* Circle Shape Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2 bg-white/95 shadow-glass border-2 border-emerald-500 mb-1 overflow-hidden">
          <Image
            src="/uaf-logo.png"
            alt="UAF Logo"
            width={60}
            height={60}
            className="object-contain rounded-full"
            priority
          />
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 text-uaf-forest text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5 border border-emerald-200">
            Department of Information Technology
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            BS IT <span className="text-uaf-green">5th Semester</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 font-medium">
            University of Agriculture Faisalabad
          </p>
        </div>

        {/* Live Deadline Countdown Timer if active */}
        {deadline && (
          <div className="w-full pt-1">
            <CountdownTimer
              deadline={deadline.deadline}
              title={deadline.title}
            />
          </div>
        )}
      </div>

      {/* Main Centered Container */}
      {!user ? (
        /* When NOT logged in: Centered Login Card only */
        <div className="w-full max-w-md">
          <div className="glass-panel p-5 sm:p-8 rounded-3xl shadow-glass-lg relative overflow-hidden border border-white/80">
            <div className="mb-5 text-center">
              <h2 className="text-lg font-black text-gray-900">
                Direct Portal Access
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter student details or switch to Faculty / Admin
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      ) : (
        /* When ALREADY LOGGED IN: Centered User Portal Card */
        <div className="w-full max-w-md">
          <div className="glass-panel p-5 sm:p-8 rounded-3xl shadow-glass-lg text-center space-y-5 border border-white/80">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-uaf-green flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-uaf-forest text-xs font-bold mb-2 border border-emerald-200">
                {isAdmin ? "Faculty Administrator" : `Section ${userSection || "Student"}`}
              </span>
              <h2 className="text-xl font-black text-gray-900">
                Welcome, {user.fullName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                You are currently signed in with your official account.
              </p>
            </div>

            {isAdmin ? (
              <div className="pt-2 space-y-3">
                <Link
                  href="/admin"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-uaf-forest hover:bg-uaf-darkgreen text-white font-bold text-xs shadow-md transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-uaf-gold" />
                  <span>Enter Administrator Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/sections/m1"
                    className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-gray-800 text-xs font-bold text-center transition-all"
                  >
                    Section M1
                  </Link>
                  <Link
                    href="/sections/m2"
                    className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-gray-800 text-xs font-bold text-center transition-all"
                  >
                    Section M2
                  </Link>
                </div>
              </div>
            ) : (
              /* Student: ONLY show their assigned section, strictly isolated */
              <div className="pt-2">
                <Link
                  href={`/sections/${userSection?.toLowerCase() || "m1"}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white font-bold text-xs shadow-md transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Go to Section {userSection} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
