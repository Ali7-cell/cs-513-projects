import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { checkSubmissionDeadlineAllowed } from "@/lib/services/deadline.service";
import { GroupForm } from "@/components/groups/group-form";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default async function CreateGroupM1Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/sections/m1/create");
  }

  // Cross-section prevention
  if (user.role !== "ADMIN" && user.sectionCode && user.sectionCode.toUpperCase() !== "M1") {
    return (
      <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Section Mismatch</h2>
        <p className="text-xs text-gray-600">
          Your account is registered under <strong>Section {user.sectionCode}</strong>.
          You are not permitted to submit a group profile under Section M1.
        </p>
        <Link
          href={`/sections/${user.sectionCode.toLowerCase()}/create`}
          className="inline-block px-4 py-2 rounded-xl bg-uaf-green text-white text-xs font-bold shadow-md"
        >
          Go to Section {user.sectionCode} Group Registration
        </Link>
      </div>
    );
  }

  // Check deadline
  const deadlineCheck = await checkSubmissionDeadlineAllowed();
  if (!deadlineCheck.allowed && user.role !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Submissions Closed</h2>
        <p className="text-xs text-red-600">{deadlineCheck.message}</p>
        <Link
          href="/sections/m1"
          className="inline-block px-4 py-2 rounded-xl glass-panel text-xs font-bold text-gray-700 shadow-sm"
        >
          Return to Section M1
        </Link>
      </div>
    );
  }

  const initialLeaderData = {
    leaderName: user.fullName || "",
    leaderReg: user.regNumber || "",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/sections/m1"
          className="p-2 rounded-xl glass-panel text-gray-600 hover:text-uaf-green transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Create Group Profile — Section M1
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            CS-513: Web Programming • Instructor: Sir Ramish Saleem
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-glass">
        <GroupForm sectionCode="M1" initialData={initialLeaderData} />
      </div>
    </div>
  );
}
