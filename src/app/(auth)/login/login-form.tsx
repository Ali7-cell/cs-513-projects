"use client";

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  User,
  Hash,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export const LoginForm: React.FC = () => {
  const router = useRouter();

  // Tab mode: "student" | "admin"
  const [mode, setMode] = useState<"student" | "admin">("student");

  // Student sub-mode: "signin" | "signup"
  const [studentAuthMode, setStudentAuthMode] = useState<"signin" | "signup">("signin");

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setMode("admin");
      }
      setCallbackUrl(params.get("callbackUrl"));
    }
  }, []);

  // Student Sign In Fields
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Student Sign Up Fields
  const [fullName, setFullName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [sectionCode, setSectionCode] = useState<"M1" | "M2">("M1");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Admin Fields
  const [adminEmail, setAdminEmail] = useState("admin.it@uaf.edu.pk");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Student Sign In
  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const cleanInput = loginIdentifier.trim();

      // Check if trying to sign in as admin from student tab
      if (cleanInput.toLowerCase() === "admin.it@uaf.edu.pk") {
        const res = await signIn("credentials", {
          redirect: false,
          email: cleanInput.toLowerCase(),
          password: loginPassword,
        });

        if (res?.error) {
          setError("Invalid administrator credentials.");
          setLoading(false);
          return;
        }

        router.push("/admin");
        router.refresh();
        return;
      }

      // Sign in using NextAuth credentials (accepts email or registration number)
      const res = await signIn("credentials", {
        redirect: false,
        email: cleanInput,
        password: loginPassword,
      });

      if (res?.error) {
        setError("Invalid credentials. Please verify your email/Ag No and password.");
        setLoading(false);
        return;
      }

      // Check session to determine target section
      const session = await getSession();
      const userSection = (session?.user as any)?.sectionCode?.toLowerCase() || "m1";

      router.push(callbackUrl || `/sections/${userSection}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected sign-in error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Student Account Registration (Sign Up)
  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanReg = regNumber.trim().toUpperCase();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: cleanEmail,
          regNumber: cleanReg,
          sectionCode,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account. Please check your details.");
        setLoading(false);
        return;
      }

      // Account created successfully! Return right back to the login interface on the same page
      setSuccessMessage("Account created successfully! Please sign in with your credentials below.");
      setLoginIdentifier(cleanEmail);
      setLoginPassword(signupPassword);
      setStudentAuthMode("signin");
    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Submission (Strict fixed credentials)
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const cleanEmail = adminEmail.trim().toLowerCase();

      // Step 1: Pre-verify against rate limiter & admin role
      const verifyRes = await fetch("/api/auth/admin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: adminPassword,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || "Administrator authentication failed.");
        setLoading(false);
        return;
      }

      // Step 2: Establish session
      const res = await signIn("credentials", {
        redirect: false,
        email: cleanEmail,
        password: adminPassword,
      });

      if (res?.error) {
        setError("Invalid administrator credentials. Access denied.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Admin authorization error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex p-1 rounded-2xl bg-gray-100/90 border border-gray-200 shadow-inner">
        <button
          type="button"
          id="student-tab-btn"
          onClick={() => {
            setMode("student");
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "student"
              ? "bg-white text-uaf-green shadow-sm border border-emerald-100"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </button>

        <button
          type="button"
          id="admin-tab-btn"
          onClick={() => {
            setMode("admin");
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "admin"
              ? "bg-uaf-forest text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Instructor / Admin</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50/95 border border-emerald-200 text-emerald-800 text-xs font-semibold backdrop-blur-sm animate-fade-in flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-semibold backdrop-blur-sm animate-fade-in">
          {error}
        </div>
      )}

      {mode === "student" ? (
        studentAuthMode === "signin" ? (
          /* 1. STUDENT SIGN IN FORM */
          <form onSubmit={handleStudentSignIn} className="space-y-3.5">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>BS IT 5th Semester Student Login</span>
            </div>

            {/* Email or Ag No */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                University Email or Ag No *
              </label>
              <Input
                placeholder="e.g. student.m2@uaf.edu.pk or 2024-AG-6959"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
              />
              <p className="text-[10px] text-gray-400 mt-0.5">
                Enter your student email or registration number (e.g. 2024-AG-6959)
              </p>
            </div>

            {/* Password with View / Hide toggle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "View password"}
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Enter Portal Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                id="enter-student-portal-btn"
                disabled={loading}
                className="w-full py-2.5 bg-uaf-green hover:bg-uaf-forest text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? "Verifying..." : "Enter Student Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Create Account Text Button (Directly below Enter Portal) */}
            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                id="create-account-toggle-btn"
                onClick={() => {
                  setStudentAuthMode("signup");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-medium text-gray-600 hover:text-uaf-green transition-all cursor-pointer inline-flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-emerald-50"
              >
                <span>Don't have an account?</span>
                <span className="font-bold text-uaf-green underline">Create Account</span>
              </button>
            </div>
          </form>
        ) : (
          /* 2. STUDENT CREATE ACCOUNT (REGISTRATION) FORM */
          <form onSubmit={handleStudentSignUp} className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs font-semibold">
              <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Create New Student Account</span>
            </div>

            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                placeholder="e.g. Muhammad Ali"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* 2. Ag No / Registration Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Ag No / Registration Number *
              </label>
              <Input
                placeholder="e.g. 2024-AG-6959 or AG001"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                required
              />
            </div>

            {/* 3. University Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                University Email Address *
              </label>
              <Input
                type="email"
                placeholder="e.g. student.m2@uaf.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* 4. Section Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Select Your Section *
              </label>
              <select
                value={sectionCode}
                onChange={(e) => setSectionCode(e.target.value as "M1" | "M2")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/90 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                required
              >
                <option value="M1">Section M1 (Morning)</option>
                <option value="M2">Section M2 (Morning)</option>
              </select>
            </div>

            {/* 5. Password with View / Hide toggle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Create a strong password (min 6 chars)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  title={showSignupPassword ? "Hide password" : "View password"}
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Create Account Button */}
            <div className="pt-2">
              <Button
                type="submit"
                id="create-account-submit-btn"
                disabled={loading}
                className="w-full py-2.5 bg-uaf-forest hover:bg-uaf-darkgreen text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Back to Login Text Button */}
            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                id="back-to-login-btn"
                onClick={() => {
                  setStudentAuthMode("signin");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-all cursor-pointer inline-flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-gray-100"
              >
                <span>Already have an account?</span>
                <span className="font-bold text-uaf-green underline">Back to Login</span>
              </button>
            </div>
          </form>
        )
      ) : (
        /* 3. ADMINISTRATOR LOGIN FORM */
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Course Instructor & Administrator (Sir Ramish Saleem)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Administrator Email *
            </label>
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin.it@uaf.edu.pk"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Administrator Password *
            </label>
            <div className="relative">
              <Input
                type={showAdminPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                title={showAdminPassword ? "Hide password" : "View password"}
              >
                {showAdminPassword ? (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-uaf-forest hover:bg-uaf-darkgreen text-white font-bold rounded-xl shadow-lg shadow-emerald-900/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Hub"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
