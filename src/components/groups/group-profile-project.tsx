import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, GitFork, Globe, ExternalLink } from "lucide-react";

export const GroupProfileProject: React.FC<{ project: any }> = ({
  project,
}) => {
  if (!project) return null;

  const links = [
    { label: "Project PDF / Google Drive", url: project.projectPdfUrl, icon: FileText },
    { label: "GitHub Repository", url: project.githubUrl, icon: GitFork },
    { label: "Live Website / Demo", url: project.websiteUrl, icon: Globe },
  ].filter((l) => l.url);

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-uaf-navy uppercase tracking-wider mb-2">
          Project / Idea Title
        </h3>
        <p className="text-base font-bold text-uaf-navy">{project.ideaName}</p>
      </div>
      <div>
        <h3 className="text-xs font-bold text-uaf-navy uppercase tracking-wider mb-2">
          Project Description
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>
      </div>
      {links.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-200/60">
          <h3 className="text-xs font-bold text-uaf-navy uppercase tracking-wider">
            External Links
          </h3>
          {links.map((l, idx) => {
            const Icon = l.icon;
            return (
              <a
                key={idx}
                href={l.url!}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-uaf-surface shadow-neu-sm hover:shadow-neu text-xs font-semibold text-uaf-navy hover:text-uaf-academic transition-all group"
              >
                <Icon className="w-4 h-4 text-uaf-academic shrink-0" />
                <span className="truncate flex-1">{l.label}: {l.url}</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-uaf-academic shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </Card>
  );
};
