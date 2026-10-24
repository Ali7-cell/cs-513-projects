import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/services/stats.service";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?admin=true&callbackUrl=/admin");

  const stats = await getDashboardStats();

  const recentGroups = await prisma.group.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      section: true,
      members: { orderBy: { displayOrder: "asc" } },
      project: true,
      presentation: true,
    },
  });

  const recentAudits = await prisma.auditLog.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { actor: true },
  });

  const m1Pct = stats.totalGroups > 0 ? Math.round((stats.totalM1 / stats.totalGroups) * 100) : 0;
  const m2Pct = stats.totalGroups > 0 ? Math.round((stats.totalM2 / stats.totalGroups) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            CS-513 Administrator Hub
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 font-medium">
            Course Instructor: <span className="font-bold text-gray-900">Mam Ramish Saleem</span> • CS-513: Web Programming (BS IT 5th)
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/sections/m1"
            className="flex-1 sm:flex-initial text-center px-3.5 py-2 rounded-xl glass-panel text-xs font-bold text-gray-700 hover:text-uaf-green transition-all"
          >
            Manage M1
          </Link>
          <Link
            href="/admin/sections/m2"
            className="flex-1 sm:flex-initial text-center px-3.5 py-2 rounded-xl glass-panel text-xs font-bold text-gray-700 hover:text-uaf-green transition-all"
          >
            Manage M2
          </Link>
        </div>
      </div>

      {/* 8 Statistics Cards from PostgreSQL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Groups</span>
            <Layers className="w-4 h-4 text-uaf-green" />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.totalGroups}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Across M1 & M2</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">M1 Groups</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.totalM1}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">{m1Pct}% of class</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">M2 Groups</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.totalM2}</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-1">{m2Pct}% of class</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">{stats.pendingReviews}</span>
          <span className="text-[10px] text-amber-700 block mt-1">Requires evaluation</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700">{stats.approvedGroups}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Ready for presentation</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-600">{stats.rejectedGroups}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Needs resubmission</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pres. Pending</span>
            <BarChart3 className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">{stats.presentationsPending}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Evaluation pending</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pres. Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700">{stats.presentationsCompleted}</span>
          <span className="text-[10px] text-emerald-700 block mt-1">Evaluated successfully</span>
        </div>
      </div>

      {/* Section Comparison Area */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-uaf-green" />
            <h3 className="text-sm font-bold text-gray-900">
              Section Distribution & Comparison
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {stats.totalGroups} total registered groups
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-800">Section M1: {stats.totalM1} Groups ({m1Pct}%)</span>
              <span className="text-gray-400">Target: ~20-25 groups</span>
            </div>
            <div className="w-full h-3 rounded-full bg-emerald-100 overflow-hidden">
              <div
                className="h-full bg-uaf-green rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, m1Pct)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-800">Section M2: {stats.totalM2} Groups ({m2Pct}%)</span>
              <span className="text-gray-400">Target: ~20-25 groups</span>
            </div>
            <div className="w-full h-3 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, m2Pct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Submissions & Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Recent Group Submissions</h3>
            <Link
              href="/admin/reviews"
              className="text-xs font-bold text-uaf-green hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentGroups.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No groups registered yet.</p>
          ) : (
            <div className="space-y-3">
              {recentGroups.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/70 hover:bg-white border border-gray-100 transition-all text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-gray-900 truncate">{g.groupName}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      Sec {g.section?.code} • {g.members?.[0]?.fullName} ({g.members?.length} members)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge type="review" status={g.reviewStatus} />
                    <Link
                      href={`/groups/${g.id}`}
                      className="p-1 text-gray-400 hover:text-uaf-green"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Logs */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Recent System Activity</h3>
            <Link
              href="/admin/audits"
              className="text-xs font-bold text-uaf-green hover:underline flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAudits.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No audit records logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentAudits.map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 rounded-xl bg-white/60 border border-gray-100 text-xs flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-uaf-forest block truncate">
                      {a.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      By {a.actor?.fullName || "System"} • {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                    {a.entityType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
