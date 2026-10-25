"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Timer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
  Power,
  RefreshCw,
} from "lucide-react";

export default function SubmissionDeadlinePage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [activeDeadline, setActiveDeadline] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [deadlineInput, setDeadlineInput] = useState("");
  const [titleInput, setTitleInput] = useState(
    "BS IT 5th Semester Group Registration Deadline"
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const fetchDeadline = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deadline");
      const json = await res.json();
      if (json.success) {
        setActiveDeadline(json.data.active);
        setHistory(json.data.history || []);
        if (json.data.active) {
          // Format for datetime-local input: YYYY-MM-DDTHH:mm
          const d = new Date(json.data.active.deadline);
          const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setDeadlineInput(iso);
          setTitleInput(json.data.active.title);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "loading") return;
    if (!isAdmin) {
      router.push("/login?admin=true");
      return;
    }
    fetchDeadline();
  }, [authStatus, isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineInput) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/deadline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadline: new Date(deadlineInput).toISOString(),
          title: titleInput,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update deadline");
      setMessage({ text: "Submission deadline configured and enforced successfully!", type: "success" });
      fetchDeadline();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/deadline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      fetchDeadline();
    } catch (err: any) {
      console.error(err);
    }
  };

  const isClosed =
    activeDeadline &&
    (!activeDeadline.isActive || new Date(activeDeadline.deadline) < new Date());

  if (authStatus === "loading" || !isAdmin) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 glass-panel rounded-3xl">
        Verifying administrator privileges...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
          <Timer className="w-3.5 h-3.5" />
          <span>Policy Control</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Submission Deadline Management
        </h1>
        <p className="text-xs text-gray-500">
          Configure and strictly enforce the portal submission cutoff in Asia/Karachi (PKT).
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border backdrop-blur-md ${
            message.type === "success"
              ? "bg-emerald-50/90 text-emerald-800 border-emerald-200"
              : "bg-red-50/90 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Current Deadline Status Card */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Current Enforcement Status
            </span>
            <div className="flex items-center gap-2">
              {activeDeadline ? (
                isClosed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>SUBMISSIONS CLOSED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SUBMISSIONS ACTIVE & OPEN</span>
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                  NO DEADLINE CONFIGURED (OPEN BY DEFAULT)
                </span>
              )}
            </div>
            {activeDeadline && (
              <p className="text-xs text-gray-600 pt-1">
                <strong>Configured Cutoff:</strong>{" "}
                {new Date(activeDeadline.deadline).toLocaleString("en-PK", {
                  timeZone: "Asia/Karachi",
                  dateStyle: "full",
                  timeStyle: "medium",
                })}{" "}
                (PKT)
              </p>
            )}
          </div>

          {activeDeadline && (
            <Button
              size="sm"
              variant={activeDeadline.isActive ? "danger" : "primary"}
              onClick={() => handleToggle(activeDeadline.id, activeDeadline.isActive)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{activeDeadline.isActive ? "Deactivate Deadline" : "Activate Deadline"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Set Deadline Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-glass">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-uaf-green" />
          <span>Configure / Update Cutoff Date & Time</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Deadline Label / Description *
            </label>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              required
              placeholder="e.g. BS IT 5th Semester Final Project Group Cutoff"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Date & Time (Asia/Karachi PKT) *
            </label>
            <Input
              type="datetime-local"
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-uaf-green hover:bg-uaf-forest text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-900/15"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Policy..." : "Save & Enforce Deadline"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Deadline Configuration History</h3>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-gray-400 py-3">No previous deadlines recorded.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-2xl bg-white/70 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-gray-900 block">{h.title}</span>
                  <span className="text-[11px] text-gray-500">
                    Cutoff: {new Date(h.deadline).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })} (PKT)
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                    h.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {h.isActive ? "Active" : "Archived"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
