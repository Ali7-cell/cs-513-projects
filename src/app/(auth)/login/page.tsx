import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-glass-lg relative overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-uaf-green/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-uaf-gold/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-18 h-18 rounded-full p-2 bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center mb-3 overflow-hidden">
            <Image
              src="/uaf-logo.png"
              alt="UAF Logo"
              width={56}
              height={56}
              className="object-contain rounded-full"
              priority
            />
          </div>
          <span className="text-3xl font-black text-uaf-green font-sans tracking-tight">
            CS-513
          </span>
          <h1 className="text-xl font-black text-gray-900 mt-1">
            Web Programming
          </h1>
          <p className="text-xs font-bold text-uaf-forest tracking-wide mt-0.5">
            Course Instructor: Mam Ramish Saleem
          </p>
          <p className="text-xs text-gray-500 mt-1">
            BS IT 5th Semester • Project Group Portal
          </p>
        </div>

        <div className="relative z-10">
          <LoginForm />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200/60 text-center text-[11px] text-gray-400 relative z-10">
          CS-513 Web Programming • BS Information Technology 5th Semester
        </div>
      </div>
    </div>
  );
}
