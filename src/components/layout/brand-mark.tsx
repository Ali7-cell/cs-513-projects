import React from "react";
import Image from "next/image";
import Link from "next/link";

export const BrandMark: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full p-1 bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105">
        <Image
          src="/uaf-logo.png"
          alt="UAF Emblem"
          width={36}
          height={36}
          className="object-contain rounded-full"
          priority
        />
      </div>
      <div className="h-7 sm:h-8 w-[2px] bg-emerald-700/20 mx-0.5 hidden sm:block shrink-0" />
      <span className="text-xl sm:text-2xl font-black text-uaf-green tracking-tight font-sans shrink-0">
        BS IT
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] sm:text-xs font-bold text-gray-900 tracking-tight leading-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
          University of Agriculture
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-uaf-emerald tracking-wider truncate">
          5th Sem • Portal
        </span>
      </div>
    </Link>
  );
};
