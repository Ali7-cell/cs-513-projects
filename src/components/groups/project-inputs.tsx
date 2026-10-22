import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectInputsProps {
  ideaName: string;
  description: string;
  ideaError?: string;
  descError?: string;
  onIdeaChange: (val: string) => void;
  onDescChange: (val: string) => void;
}

export const ProjectInputs: React.FC<ProjectInputsProps> = ({
  ideaName,
  description,
  ideaError,
  descError,
  onIdeaChange,
  onDescChange,
}) => {
  return (
    <div className="space-y-4">
      <Input
        label="Project / Idea Title *"
        placeholder="e.g. Smart IoT Agriculture and Precision Farming Portal"
        value={ideaName}
        error={ideaError}
        onChange={(e) => onIdeaChange(e.target.value)}
      />
      <Textarea
        label="Project Detailed Description *"
        placeholder="Provide a comprehensive technical description of the proposed project, target users, core features, and architectural scope..."
        value={description}
        error={descError}
        maxLength={2500}
        currentLength={description.length}
        onChange={(e) => onDescChange(e.target.value)}
      />
    </div>
  );
};
