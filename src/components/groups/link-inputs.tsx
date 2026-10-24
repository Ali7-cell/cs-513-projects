import React from "react";
import { Input } from "@/components/ui/input";
import { FileText, GitFork, Globe, Info } from "lucide-react";

interface LinkInputsProps {
  pdfUrl: string;
  githubUrl: string;
  websiteUrl: string;
  pdfError?: string;
  githubError?: string;
  websiteError?: string;
  onPdfChange: (val: string) => void;
  onGithubChange: (val: string) => void;
  onWebsiteChange: (val: string) => void;
}

export const LinkInputs: React.FC<LinkInputsProps> = ({
  pdfUrl,
  githubUrl,
  websiteUrl,
  pdfError,
  githubError,
  websiteError,
  onPdfChange,
  onGithubChange,
  onWebsiteChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Google Drive PDF Link (Optional)
        </label>
        <Input
          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
          value={pdfUrl}
          error={pdfError}
          onChange={(e) => onPdfChange(e.target.value)}
        />
        <div className="flex items-start gap-1.5 mt-1.5 text-[11px] text-gray-500">
          <Info className="w-3.5 h-3.5 text-uaf-green shrink-0 mt-0.5" />
          <span>
            Optional link. You can submit now and add or update it later by editing your group profile. If provided, ensure permissions are set to
            &ldquo;Anyone with the link can view&rdquo;.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            GitHub Repository URL (Optional)
          </label>
          <Input
            placeholder="https://github.com/organization/repo"
            value={githubUrl}
            error={githubError}
            onChange={(e) => onGithubChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Project Website / Live Demo (Optional)
          </label>
          <Input
            placeholder="https://myproject.uaf.edu.pk"
            value={websiteUrl}
            error={websiteError}
            onChange={(e) => onWebsiteChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
