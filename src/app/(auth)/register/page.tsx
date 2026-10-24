import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl shadow-glass-lg relative overflow-hidden">
        {/* Glow accent */}
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
          <span className="text-3xl font-black text-uaf-green tracking-tight">
            CS-513
          </span>
          <h1 className="text-xl font-black text-gray-900 mt-1">
            Web Programming
          </h1>
          <p className="text-xs font-bold text-uaf-forest tracking-wide mt-0.5">
            Course Instructor: Sir Ramish Saleem • BS IT 5th Semester
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            Register your credentials as the group leader to submit and manage your
            M1/M2 project profile.
          </p>
        </div>

        <div className="relative z-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
