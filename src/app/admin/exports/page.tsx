import React from "react";
import { getSectionGroups } from "@/lib/services/group-query.service";
import { FileDown, Download, Users, FileText } from "lucide-react";

export default async function PdfExportsHubPage() {
  const [m1Groups, m2Groups] = await Promise.all([
    getSectionGroups("M1"),
    getSectionGroups("M2"),
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
          <FileDown className="w-3.5 h-3.5" />
          <span>Document Generation Hub</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">
          Official PDF Reports & Exports
        </h1>
        <p className="text-xs text-gray-500">
          Generate official CS-513: Web Programming evaluation sheets, section rosters, and project dossiers. Instructor: Sir Ramish Saleem.
        </p>
      </div>

      {/* Section-wide Exports Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-uaf-green flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Section M1 Complete Report
              </h3>
              <p className="text-xs text-gray-500">
                {m1Groups.length} registered groups in Section M1
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Generates official multi-page A4 PDF including course header, complete team rosters, registration numbers, project descriptions, Drive links, and presentation status.
          </p>
          <a
            href="/api/export/section/m1"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Section M1 PDF</span>
          </a>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Section M2 Complete Report
              </h3>
              <p className="text-xs text-gray-500">
                {m2Groups.length} registered groups in Section M2
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Generates official multi-page A4 PDF including course header, complete team rosters, registration numbers, project descriptions, Drive links, and presentation status.
          </p>
          <a
            href="/api/export/section/m2"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-uaf-green hover:bg-uaf-forest text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Section M2 PDF</span>
          </a>
        </div>
      </div>

      {/* Individual Group PDF Fast List */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-uaf-green" />
          <span>Individual Project Dossiers ({m1Groups.length + m2Groups.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...m1Groups, ...m2Groups].map((g) => (
            <div
              key={g.id}
              className="p-3.5 rounded-2xl bg-white/70 border border-gray-100 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-gray-900 truncate block">
                  {g.groupName}
                </span>
                <span className="text-[11px] text-gray-500">
                  Sec {g.section?.code} • {g.members?.[0]?.fullName}
                </span>
              </div>
              <a
                href={`/api/export/group/${g.id}`}
                className="p-2 rounded-xl text-uaf-green hover:bg-emerald-50 shrink-0 transition-all"
                title="Download Single PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
