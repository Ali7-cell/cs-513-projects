"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface CountdownTimerProps {
  deadline: string | Date;
  title?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline,
  title = "Registration Deadline",
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    const target = new Date(deadline).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  if (timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold backdrop-blur-md">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Submissions are closed. The deadline has passed.</span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/60 shadow-glass">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-uaf-green animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-uaf-forest">
            {title}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-gray-500">
          Closes in:
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 sm:p-3 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
          <span className="text-lg sm:text-2xl font-black text-uaf-forest block leading-none">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">
            Days
          </span>
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
          <span className="text-lg sm:text-2xl font-black text-uaf-forest block leading-none">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">
            Hours
          </span>
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
          <span className="text-lg sm:text-2xl font-black text-uaf-forest block leading-none">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">
            Mins
          </span>
        </div>
        <div className="p-2 sm:p-3 rounded-xl bg-white/80 border border-emerald-100 shadow-sm">
          <span className="text-lg sm:text-2xl font-black text-uaf-green block leading-none">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">
            Secs
          </span>
        </div>
      </div>
    </div>
  );
};
