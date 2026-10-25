import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { History, ShieldCheck, User } from "lucide-react";

export default async function AuditLogsPage() {
  await requireAdmin();
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      actor: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
          <History className="w-3.5 h-3.5" />
          <span>Security & Accountability</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">
          System Audit Trail
        </h1>
        <p className="text-xs text-gray-500">
          Immutable audit records of administrator evaluations, reviews, deadline modifications, and status transitions.
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 glass-panel rounded-2xl">
            No audit entries recorded yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={`m-audit-${log.id}`}
              className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-uaf-forest border border-emerald-200">
                  {log.action.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  {new Date(log.createdAt).toLocaleString("en-PK", {
                    timeZone: "Asia/Karachi",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="font-bold text-gray-900 block">
                    {log.actor?.fullName || "System Administrator"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {log.actor?.email}
                  </span>
                </div>
                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {log.entityType} ({log.entityId.slice(-6)})
                </span>
              </div>

              {(log.newValue || log.previousValue) && (
                <div className="p-2 rounded-xl bg-gray-50 text-[10px] font-mono text-gray-600 border border-gray-100 break-all">
                  {log.newValue || log.previousValue}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-3xl glass-panel shadow-glass touch-scroll">
        <table className="w-full text-left border-collapse min-w-[700px] text-xs">
          <thead>
            <tr className="border-b border-gray-200/80 bg-emerald-950/5 text-[11px] font-bold text-uaf-forest uppercase tracking-wider">
              <th className="p-3">Timestamp (PKT)</th>
              <th className="p-3">Actor / Admin</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Details / Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No audit entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100/70 hover:bg-white/80 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap font-mono text-[11px] text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-PK", {
                      timeZone: "Asia/Karachi",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-bold text-gray-900 block">
                      {log.actor?.fullName || "System"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {log.actor?.email}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-uaf-forest border border-emerald-200">
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-gray-600 font-medium">
                    {log.entityType} ({log.entityId.slice(-6)})
                  </td>
                  <td className="p-3 max-w-xs truncate text-gray-500 font-mono text-[10px]" title={log.newValue || log.previousValue || ""}>
                    {log.newValue || log.previousValue || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
