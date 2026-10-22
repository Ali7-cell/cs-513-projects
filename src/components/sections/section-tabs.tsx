"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface SectionTabsProps {
  currentSection: "m1" | "m2";
  basePath?: string;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  currentSection,
  basePath = "/sections",
}) => {
  return (
    <div className="flex w-full max-w-sm mx-auto p-1.5 rounded-2xl glass-panel shadow-sm">
      <Link
        href={`${basePath}/m1`}
        className={clsx(
          "flex-1 py-2.5 text-center text-xs font-bold rounded-xl transition-all",
          currentSection === "m1"
            ? "bg-uaf-green text-white shadow-md shadow-emerald-900/20"
            : "text-gray-600 hover:text-uaf-green hover:bg-emerald-50/50"
        )}
      >
        Section M1
      </Link>
      <Link
        href={`${basePath}/m2`}
        className={clsx(
          "flex-1 py-2.5 text-center text-xs font-bold rounded-xl transition-all",
          currentSection === "m2"
            ? "bg-uaf-green text-white shadow-md shadow-emerald-900/20"
            : "text-gray-600 hover:text-uaf-green hover:bg-emerald-50/50"
        )}
      >
        Section M2
      </Link>
    </div>
  );
};
