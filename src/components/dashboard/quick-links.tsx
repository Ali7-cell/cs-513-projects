import React from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, HelpCircle, Globe, ExternalLink } from "lucide-react";

export const QuickLinks: React.FC = () => {
  const links = [
    { label: "Course Materials", href: "#", icon: BookOpen },
    { label: "Timetable", href: "#", icon: Calendar },
    { label: "IT Helpdesk", href: "#", icon: HelpCircle },
    { label: "University Portal", href: "https://uaf.edu.pk", icon: Globe, external: true },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <ExternalLink className="w-3.5 h-3.5 text-uaf-academic" />
        <span>Quick Academic Links</span>
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {links.map((lnk, idx) => {
          const Icon = lnk.icon;
          return (
            <a
              key={idx}
              href={lnk.href}
              target={lnk.external ? "_blank" : undefined}
              rel={lnk.external ? "noreferrer" : undefined}
              className="p-3 rounded-xl bg-uaf-light shadow-neu-sm hover:shadow-neu hover:text-uaf-academic transition-all flex items-center justify-between text-xs font-semibold text-uaf-navy group"
            >
              <div className="flex items-center gap-2 truncate">
                <Icon className="w-4 h-4 text-uaf-navy group-hover:text-uaf-academic shrink-0" />
                <span className="truncate">{lnk.label}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
