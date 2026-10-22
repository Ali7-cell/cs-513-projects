"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings } from "lucide-react";
import { clsx } from "clsx";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Section M1", href: "/sections/m1", icon: Users },
    { label: "Section M2", href: "/sections/m2", icon: Users },
    ...(isAdmin
      ? [
          { label: "Admin Hub", href: "/admin", icon: ShieldCheck },
          { label: "Admin M1", href: "/admin/sections/m1", icon: FileText },
          { label: "Admin M2", href: "/admin/sections/m2", icon: FileText },
        ]
      : []),
    { label: "Settings", href: "#", icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 hidden lg:block p-4">
      <div className="space-y-1.5 p-3 rounded-2xl bg-uaf-light shadow-neu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                isActive
                  ? "bg-uaf-navy text-white shadow-neu-sm"
                  : "text-gray-600 hover:text-uaf-navy hover:bg-uaf-surface"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
