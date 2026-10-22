import React from "react";
import { Calendar } from "lucide-react";

export const WelcomeBanner: React.FC<{ userName: string }> = ({ userName }) => {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-uaf-light shadow-neu">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-uaf-navy">
          Welcome back, {userName}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Stay updated with your classes, groups and presentation evaluations.
        </p>
      </div>
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-uaf-surface shadow-neu-sm text-xs font-semibold text-uaf-navy self-start sm:self-auto">
        <Calendar className="w-4 h-4 text-uaf-academic" />
        <span>{today}</span>
      </div>
    </div>
  );
};
