import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-25" />
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-wider text-uaf-green">
          CS-513 Web Programming
        </p>
        <p className="text-[11px] text-gray-500 font-medium">
          Loading portal data...
        </p>
      </div>
    </div>
  );
}
