"use client";

import React from "react";
import { useGroupForm } from "./use-group-form";
import { submitGroupForm, buildGroupPayload } from "./group-form-submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LeaderInputs } from "./leader-inputs";
import { Member2Inputs } from "./member2-inputs";
import { OptionalMembers } from "./optional-members";
import { ProjectInputs } from "./project-inputs";
import { LinkInputs } from "./link-inputs";

export const GroupForm: React.FC<{ sectionCode: string; initialData?: any; isEdit?: boolean; groupId?: string }> = ({
  sectionCode, initialData, isEdit, groupId
}) => {
  const { state, setters, handlers } = useGroupForm(sectionCode, initialData);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setters.setErrorMsg(null);
    setters.setLoading(true);
    try {
      const payload = buildGroupPayload(state, sectionCode);
      const res = await submitGroupForm(payload, isEdit, groupId);
      handlers.router.push(`/groups/${res.data.id}`);
    } catch (err: any) {
      setters.setErrorMsg(err.message);
    } finally {
      setters.setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {state.errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          {state.errorMsg}
        </div>
      )}
      <Input label="Group Name *" placeholder="e.g. NextGen Innovators" value={state.groupName} onChange={(e) => setters.setGroupName(e.target.value)} />
      <LeaderInputs name={state.leaderName} regNumber={state.leaderReg} onNameChange={setters.setLeaderName} onRegChange={setters.setLeaderReg} />
      <Member2Inputs name={state.m2Name} regNumber={state.m2Reg} onNameChange={setters.setM2Name} onRegChange={setters.setM2Reg} />
      <OptionalMembers members={state.optionals} errors={{}} onAdd={handlers.addOptional} onUpdate={handlers.updateOptional} onRemove={handlers.removeOptional} />
      <ProjectInputs ideaName={state.ideaName} description={state.description} onIdeaChange={setters.setIdeaName} onDescChange={setters.setDescription} />
      <LinkInputs pdfUrl={state.pdfUrl} githubUrl={state.githubUrl} websiteUrl={state.websiteUrl} onPdfChange={setters.setPdfUrl} onGithubChange={setters.setGithubUrl} onWebsiteChange={setters.setWebsiteUrl} />
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200/60">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handlers.router.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={state.loading}
          className="w-full sm:w-auto bg-uaf-green hover:bg-uaf-forest text-white"
        >
          {state.loading
            ? "Saving Group..."
            : isEdit
            ? "Update Group Profile"
            : "Save / Submit Group Profile"}
        </Button>
      </div>
    </form>
  );
};
