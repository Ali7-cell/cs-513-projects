"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Mail, Lock, Hash, BookOpen } from "lucide-react";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get("section")?.toUpperCase() === "M1" ? "M1" : "M2");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [sectionCode, setSectionCode] = useState<"M1" | "M2">(initialSection);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          regNumber,
          sectionCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}&section=${sectionCode}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-semibold backdrop-blur-sm animate-fade-in">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-semibold backdrop-blur-sm animate-fade-in">
          {successMsg}
        </div>
      )}

      <div>
        <label htmlFor="register-fullname" className="block text-xs font-bold text-gray-700 mb-1">
          Full Name (Team Leader) *
        </label>
        <div className="relative">
          <Input
            id="register-fullname"
            name="fullName"
            autoComplete="name"
            placeholder="e.g. Muhammad Ali"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="pl-3"
          />
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="block text-xs font-bold text-gray-700 mb-1">
          University Email Address *
        </label>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="e.g. student@uaf.edu.pk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="register-regnumber" className="block text-xs font-bold text-gray-700 mb-1">
            Registration Number *
          </label>
          <Input
            id="register-regnumber"
            name="regNumber"
            autoComplete="off"
            placeholder="e.g. 2022-AG-1234"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
            required
          />
          <p className="text-[10px] text-gray-400 mt-1">Format: YYYY-DEG-NUM</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Assigned Section *
          </label>
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => setSectionCode("M1")}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                sectionCode === "M1"
                  ? "bg-uaf-green text-white border-uaf-green shadow-md shadow-emerald-900/20"
                  : "bg-white/80 text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Section M1
            </button>
            <button
              type="button"
              onClick={() => setSectionCode("M2")}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                sectionCode === "M2"
                  ? "bg-uaf-green text-white border-uaf-green shadow-md shadow-emerald-900/20"
                  : "bg-white/80 text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Section M2
            </button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="register-password" className="block text-xs font-bold text-gray-700 mb-1">
          Password *
        </label>
        <Input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Choose a strong password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          id="register-submit-btn"
          disabled={loading}
          className="w-full py-2.5 bg-uaf-green hover:bg-uaf-forest text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all text-sm"
        >
          {loading ? "Creating Account..." : "Create Team Leader Account"}
        </Button>
      </div>

      <div className="text-center pt-3 border-t border-gray-200/60">
        <p className="text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-uaf-green hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
};
