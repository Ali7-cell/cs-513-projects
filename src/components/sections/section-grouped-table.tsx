"use client";

import React, { useState } from "react";
import { TeamGroupRowData } from "@/lib/services/section-table-data";
import { Link2, ExternalLink, LayoutGrid, Table as TableIcon, Users, User, ArrowRight } from "lucide-react";

interface SectionGroupedTableProps {
  sectionCode: string;
  data: TeamGroupRowData[];
}

// Pastel backgrounds for the Group Name column matching the reference design
const GROUP_PASTEL_BG = [
  "bg-[#E3EDF7] text-gray-900 border-[#C5DCF2]", // 1. Light Ice Blue
  "bg-[#E2F2E5] text-gray-900 border-[#C2E4C8]", // 2. Light Mint Green
  "bg-[#FBEBD8] text-gray-900 border-[#F5D8B8]", // 3. Light Peach/Cream
  "bg-[#EEE6FA] text-gray-900 border-[#DDD0F5]", // 4. Light Lavender/Purple
  "bg-[#E0F3F8] text-gray-900 border-[#BFE5F0]", // 5. Light Sky Blue/Cyan
];

export const SectionGroupedTable: React.FC<SectionGroupedTableProps> = ({
  sectionCode,
  data,
}) => {
  const isM2 = sectionCode.toUpperCase() === "M2";
  const title = `CS-513: Web Programming — Section ${isM2 ? "M2" : "M1"} Project Directory`;
  const [viewMode, setViewMode] = useState<"auto" | "cards" | "table">("auto");

  return (
    <div className="w-full space-y-4">
      {/* 1. Dark Navy Blue Title Bar */}
      <div className="w-full bg-[#0E366C] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide">
            {title}
          </h1>
          <p className="text-xs text-blue-200 mt-0.5 font-medium">
            Course Instructor: Sir Ramish Saleem • BS IT 5th Semester ({data.length} Groups)
          </p>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center gap-1 bg-white/15 p-1 rounded-xl backdrop-blur-md border border-white/20 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === "cards" || (viewMode === "auto")
                ? "bg-white text-[#0E366C] shadow-sm"
                : "text-white/80 hover:text-white"
            } md:hidden`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-[#0E366C] shadow-sm"
                : "text-white/80 hover:text-white"
            } md:hidden`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Spreadsheet</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-blue-100 font-semibold px-2">
            <TableIcon className="w-4 h-4 text-emerald-300" />
            <span>Standard Spreadsheet View</span>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint for Spreadsheet Mode */}
      <div
        className={`md:hidden flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold ${
          viewMode === "table" ? "flex" : "hidden"
        }`}
      >
        <span className="animate-pulse">👉</span>
        <span>Swipe horizontally to view all columns</span>
      </div>

      {/* 2A. MOBILE CARDS VIEW (Visible on mobile by default or when cards selected) */}
      <div
        className={`space-y-4 ${
          viewMode === "table" ? "hidden" : "block md:hidden"
        }`}
      >
        {data.map((group, groupIndex) => {
          const pastelClass = GROUP_PASTEL_BG[groupIndex % GROUP_PASTEL_BG.length];

          return (
            <div
              key={`mobile-group-${group.sr}-${group.groupName}`}
              className="bg-white rounded-2xl border-2 border-[#94BFE6] shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Header with SR & Group Name */}
              <div
                className={`p-3.5 flex items-center justify-between border-b ${pastelClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#0E366C] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {group.sr}
                  </span>
                  <h3 className="font-black text-sm text-[#0E366C] tracking-tight">
                    {group.groupName}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full border border-gray-200">
                  {group.members.length + 1} Members
                </span>
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                {/* Team Leader */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                        Team Leader
                      </span>
                      <span className="font-bold text-gray-900 text-xs">
                        {group.teamLeader}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                    {group.teamLeaderAG}
                  </span>
                </div>

                {/* Team Members List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>Team Members</span>
                  </span>
                  <div className="space-y-1.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    {group.members.map((member, mIdx) => (
                      <div
                        key={`m-${group.sr}-${mIdx}`}
                        className="flex items-center justify-between py-1 border-b border-gray-200/60 last:border-0"
                      >
                        <span className="font-medium text-gray-800 truncate max-w-[160px]">
                          {mIdx + 1}. {member.name || "—"}
                        </span>
                        <span className="font-mono text-[11px] text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                          {member.agNumber || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Links (Touch Buttons) */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    Project Deliverables
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {/* GitHub */}
                    {group.githubUrl ? (
                      <a
                        href={group.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-black transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 fill-current text-white shrink-0"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                          </svg>
                          <span>Open GitHub Repository</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="p-2 rounded-xl bg-gray-100 text-gray-400 text-xs italic flex items-center justify-between">
                        <span>GitHub Repository</span>
                        <span className="text-[10px]">Not Provided</span>
                      </div>
                    )}

                    {/* Live Demo */}
                    {group.liveDemoUrl ? (
                      <a
                        href={group.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#1967D2] text-white font-bold text-xs hover:bg-[#0C419A] transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-white shrink-0" />
                          <span>View Live Demo</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="p-2 rounded-xl bg-gray-100 text-gray-400 text-xs italic flex items-center justify-between">
                        <span>Live Demo</span>
                        <span className="text-[10px]">Not Provided</span>
                      </div>
                    )}

                    {/* Google Drive */}
                    {group.googleDriveUrl ? (
                      <a
                        href={group.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="none">
                            <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA" />
                            <path d="M43.65 25L29.9 1.2C28.55.4 27 0 25.45 0H18.2c-1.55 0-3.1.4-4.5 1.2L0 25h43.65z" fill="#00AC47" />
                            <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 5.05-8.75c.8-1.4 1.2-2.95 1.2-4.5H40.75l6.85 11.9 6.85 7.4h19.1z" fill="#EA4335" />
                            <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0h-9.3L29.9 25h13.75z" fill="#00832D" />
                            <path d="M59.85 53.2L46.1 29.4H18.6l13.75 23.8h27.5z" fill="#2684FC" />
                            <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28.2h27.45c0-1.55-.4-3.1-1.2-4.5L73.4 26.5z" fill="#FFBA00" />
                          </svg>
                          <span>Open Google Drive Files</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="p-2 rounded-xl bg-gray-100 text-gray-400 text-xs italic flex items-center justify-between">
                        <span>Google Drive</span>
                        <span className="text-[10px]">Not Provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2B. FULL RESPONSIVE SPREADSHEET TABLE */}
      <div
        className={`w-full border-2 border-[#94BFE6] rounded-2xl overflow-hidden bg-white shadow-sm ${
          viewMode === "cards" ? "hidden md:block" : "block"
        }`}
      >
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full border-collapse text-xs sm:text-[13px] text-gray-800 min-w-[980px]">
            {/* Table Header Row */}
            <thead>
              <tr className="bg-[#D2E4F7] text-[#0E366C] font-extrabold border-b-2 border-[#94BFE6]">
                <th className="py-3 px-2 border border-[#A6CBEC] text-center w-[50px] uppercase">
                  SR
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[160px]">
                  Group Name
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[130px]">
                  Team Leader
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[140px]">
                  Team Leader<br />AG Number
                </th>
                <th
                  colSpan={2}
                  className="py-3 px-3 border border-[#A6CBEC] text-center w-[280px]"
                >
                  Team Members (Name + AG Number)
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[120px]">
                  GitHub
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[130px]">
                  Live Demo
                </th>
                <th className="py-3 px-3 border border-[#A6CBEC] text-center w-[140px]">
                  Google Drive
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((group, groupIndex) => {
                const memberCount = Math.max(1, group.members.length);
                const pastelClass = GROUP_PASTEL_BG[groupIndex % GROUP_PASTEL_BG.length];

                return (
                  <React.Fragment key={`group-${group.sr}-${group.groupName}`}>
                    {/* First Row of the Group: Contains all merged/rowspan cells */}
                    <tr className="border-b border-[#B8D7F3] hover:bg-blue-50/20 transition-colors">
                      {/* 1. SR */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-2 text-center font-bold text-gray-800 border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.sr}
                      </td>

                      {/* 2. Group Name (with pastel background) */}
                      <td
                        rowSpan={memberCount}
                        className={`py-3 px-3 text-center font-black border border-[#B8D7F3] align-middle ${pastelClass}`}
                      >
                        <div className="font-extrabold text-sm sm:text-base">
                          {group.groupName}
                        </div>
                      </td>

                      {/* 3. Team Leader */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-3 text-center font-semibold text-gray-800 border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.teamLeader}
                      </td>

                      {/* 4. Team Leader AG Number */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-3 text-center font-semibold text-gray-800 border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.teamLeaderAG}
                      </td>

                      {/* 5. Team Member 0 - Name */}
                      <td className="py-2.5 px-3 font-medium text-gray-800 border border-[#B8D7F3] align-middle w-[140px]">
                        {group.members[0]?.name || "—"}
                      </td>

                      {/* 6. Team Member 0 - AG Number */}
                      <td className="py-2.5 px-3 font-medium text-gray-800 border border-[#B8D7F3] align-middle w-[140px]">
                        {group.members[0]?.agNumber || "—"}
                      </td>

                      {/* 7. GitHub Link (rowSpan) */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-3 text-center border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.githubUrl ? (
                          <a
                            href={group.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1967D2] hover:text-[#0C419A] font-bold underline transition-colors group cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 fill-current text-gray-900 group-hover:text-black shrink-0"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              />
                            </svg>
                            <span>GitHub</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic font-normal">Not Provided</span>
                        )}
                      </td>

                      {/* 8. Live Demo Link (rowSpan) */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-3 text-center border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.liveDemoUrl ? (
                          <a
                            href={group.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1967D2] hover:text-[#0C419A] font-bold underline transition-colors group cursor-pointer"
                          >
                            <Link2 className="w-4 h-4 text-[#1967D2] shrink-0" />
                            <span>Live Demo</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic font-normal">Not Provided</span>
                        )}
                      </td>

                      {/* 9. Google Drive Link (rowSpan) */}
                      <td
                        rowSpan={memberCount}
                        className="py-3 px-3 text-center border border-[#B8D7F3] align-middle bg-white"
                      >
                        {group.googleDriveUrl ? (
                          <a
                            href={group.googleDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1967D2] hover:text-[#0C419A] font-bold underline transition-colors group cursor-pointer"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="none">
                              <path
                                d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z"
                                fill="#0066DA"
                              />
                              <path
                                d="M43.65 25L29.9 1.2C28.55.4 27 0 25.45 0H18.2c-1.55 0-3.1.4-4.5 1.2L0 25h43.65z"
                                fill="#00AC47"
                              />
                              <path
                                d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 5.05-8.75c.8-1.4 1.2-2.95 1.2-4.5H40.75l6.85 11.9 6.85 7.4h19.1z"
                                fill="#EA4335"
                              />
                              <path
                                d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0h-9.3L29.9 25h13.75z"
                                fill="#00832D"
                              />
                              <path
                                d="M59.85 53.2L46.1 29.4H18.6l13.75 23.8h27.5z"
                                fill="#2684FC"
                              />
                              <path
                                d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28.2h27.45c0-1.55-.4-3.1-1.2-4.5L73.4 26.5z"
                                fill="#FFBA00"
                              />
                            </svg>
                            <span>Google Drive</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic font-normal">Not Provided</span>
                        )}
                      </td>
                    </tr>

                    {/* Subsequent Rows for Remaining Team Members in the Group */}
                    {group.members.slice(1).map((member, mIdx) => (
                      <tr
                        key={`group-${group.sr}-member-${mIdx + 1}`}
                        className="border-b border-[#B8D7F3] hover:bg-blue-50/20 transition-colors"
                      >
                        <td className="py-2 px-3 font-medium text-gray-800 border border-[#B8D7F3] align-middle">
                          {member.name}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800 border border-[#B8D7F3] align-middle">
                          {member.agNumber}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Footer / Explanation Card */}
      <div className="w-full bg-[#EDF5FD] border border-[#B9D8F5] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-gray-700 shadow-xs">
        {/* Left Side: How the Links Work */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0E366C] flex items-center justify-center shrink-0 mt-0.5">
            <Link2 className="w-4 h-4 text-[#0E366C]" />
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-gray-900 text-xs sm:text-[13px]">
              How the Deliverable Links Work:
            </div>
            <ul className="space-y-0.5 text-[11px] sm:text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>
                  Click on <strong>"GitHub"</strong> to open the team's repository.
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>
                  Click on <strong>"Live Demo"</strong> to visit the deployed project.
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>
                  Click on <strong>"Google Drive"</strong> to access the project files.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Vertical divider on desktop */}
        <div className="hidden md:block w-px h-16 bg-[#B9D8F5]" />

        {/* Right Side: Note */}
        <div className="md:max-w-xs text-[11px] sm:text-xs text-gray-600 bg-white/60 p-3 rounded-xl border border-blue-100">
          <span className="font-extrabold text-gray-900 block mb-0.5">Note:</span>
          All links open automatically in new secure tabs. You can view in Card mode on mobile or switch to full spreadsheet at any time.
        </div>
      </div>
    </div>
  );
};
