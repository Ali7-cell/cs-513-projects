import React from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { UserNav } from "./user-nav";
import { MobileNav } from "./mobile-nav";
import { getCurrentUser } from "@/lib/auth/session";
import { ShieldAlert, Users } from "lucide-react";

export const Header = async () => {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-xs px-3 sm:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <BrandMark />

        {/* Center / Right Links */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <nav className="hidden md:flex items-center gap-1.5 mr-2">
            {isAdmin && (
              <>
                <Link
                  href="/sections/m1"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-uaf-green hover:bg-emerald-50/60 transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-uaf-green" />
                  <span>Section M1</span>
                </Link>
                <Link
                  href="/sections/m2"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-uaf-green hover:bg-emerald-50/60 transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-uaf-green" />
                  <span>Section M2</span>
                </Link>
              </>
            )}

            {!isAdmin && user?.sectionCode?.toUpperCase() === "M1" && (
              <Link
                href="/sections/m1"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-uaf-green bg-emerald-50 border border-emerald-200 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-uaf-green" />
                <span>My Section (M1)</span>
              </Link>
            )}

            {!isAdmin && user?.sectionCode?.toUpperCase() === "M2" && (
              <Link
                href="/sections/m2"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>My Section (M2)</span>
              </Link>
            )}
          </nav>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-uaf-forest text-white text-xs font-bold shadow-sm hover:bg-uaf-darkgreen transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-uaf-gold" />
              <span>Admin Hub</span>
            </Link>
          )}

          <UserNav />

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav
            isAdmin={isAdmin}
            userSection={user?.sectionCode}
            userFullName={user?.fullName}
            userEmail={user?.email}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </header>
  );
};
