"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Filter,
  Users,
} from "lucide-react";

export default function UpcomingPresentationsPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Scheduling modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [scheduledAtInput, setScheduledAtInput] = useState("");
  const [venueInput, setVenueInput] = useState("CS Lab 1 / IT Department");
  const [notesInput, setNotesInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url =
        selectedSection !== "ALL"
          ? `/api/admin/schedule?section=${selectedSection}`
          : "/api/admin/schedule";
      const [schedRes, groupsRes] = await Promise.all([
        fetch(url),
        fetch("/api/groups?section=m1"),
      ]);
      const schedJson = await schedRes.json();
      setSchedules(schedJson.data || []);

      // Also fetch both M1 and M2 groups for scheduling selector
      const [gM1, gM2] = await Promise.all([
        fetch("/api/groups?section=m1").then((r) => r.json()),
        fetch("/api/groups?section=m2").then((r) => r.json()),
      ]);
      setGroups([...(gM1.data || []), ...(gM2.data || [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSection]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !scheduledAtInput) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroupId,
          scheduledAt: new Date(scheduledAtInput).toISOString(),
          venue: venueInput,
          notes: notesInput,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setSelectedGroupId("");
        setScheduledAtInput("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const now = new Date();
  const upcoming = schedules.filter((s) => new Date(s.scheduledAt) >= now);
  const past = schedules.filter((s) => new Date(s.scheduledAt) < now);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-uaf-forest text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Evaluation Scheduling</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Presentation Schedule & Tracking
            </h1>
            <p className="text-xs text-gray-500">
              Coordinate presentation dates, times, and venues for approved student project groups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-uaf-green hover:bg-uaf-forest text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-900/15"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Presentation</span>
            </Button>
          </div>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-4">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">Filter:</span>
          {["ALL", "M1", "M2"].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? "bg-uaf-green text-white shadow-sm"
                  : "bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {sec === "ALL" ? "All Sections" : `Section ${sec}`}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Presentations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-uaf-green" />
            <span>Upcoming Presentations ({upcoming.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 glass-panel rounded-3xl">
            Loading presentation schedules from database...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 glass-panel rounded-3xl">
            No upcoming presentations scheduled. Click "Schedule Presentation" to assign a session.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((s) => (
              <div
                key={s.id}
                className="glass-panel p-5 rounded-2xl border-l-4 border-uaf-green space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Section {s.group?.section?.code}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {s.group?.groupName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {s.group?.project?.ideaName}
                    </p>
                  </div>
                  <Badge
                    type="presentation"
                    status={s.group?.presentation?.status || "PENDING"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 bg-white/70 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-uaf-green shrink-0" />
                    <span>
                      {new Date(s.scheduledAt).toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-uaf-green shrink-0" />
                    <span>
                      {new Date(s.scheduledAt).toLocaleTimeString("en-PK", {
                        timeZone: "Asia/Karachi",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-uaf-green shrink-0" />
                    <span>{s.venue || "IT Department"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Presentations Section */}
      {past.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Past Presentation Sessions ({past.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {past.map((s) => (
              <div key={s.id} className="glass-panel p-4 rounded-xl text-xs space-y-1 opacity-75">
                <span className="font-bold text-gray-800 block truncate">
                  {s.group?.groupName} (Sec {s.group?.section?.code})
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {new Date(s.scheduledAt).toLocaleDateString("en-PK")}
                </span>
                <Badge type="presentation" status={s.group?.presentation?.status || "COMPLETED"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 bg-white/98 max-h-[90vh] overflow-y-auto touch-scroll">
            <h3 className="text-base font-bold text-gray-900">
              Schedule Presentation Session
            </h3>

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Select Group *
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Choose a group --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      [{g.section?.code}] {g.groupName} — {g.project?.ideaName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Presentation Date & Time (PKT) *
                </label>
                <Input
                  type="datetime-local"
                  value={scheduledAtInput}
                  onChange={(e) => setScheduledAtInput(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Venue / Location *
                </label>
                <Input
                  value={venueInput}
                  onChange={(e) => setVenueInput(e.target.value)}
                  required
                  placeholder="e.g. CS Lab 1 / IT Department Room 12"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Internal Notes / Instructions (Optional)
                </label>
                <Input
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Bring working prototype & 10 slides"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving}
                  className="bg-uaf-green hover:bg-uaf-forest text-white font-bold"
                >
                  {saving ? "Scheduling..." : "Confirm Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
