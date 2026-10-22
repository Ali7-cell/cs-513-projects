import React from "react";
import { notFound, redirect } from "next/navigation";
import { getGroupById } from "@/lib/services/group-query.service";
import { getCurrentUser } from "@/lib/auth/session";
import { GroupForm } from "@/components/groups/group-form";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default async function EditGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=/groups/${params.id}/edit`);
  }

  const group = await getGroupById(params.id);
  if (!group) return notFound();

  // Allow creator, assigned members, or admin to edit
  const isCreator = group.createdById === user.id;
  const isMember = group.members?.some(
    (m: any) =>
      user.regNumber &&
      m.regNumber?.toUpperCase() === user.regNumber?.toUpperCase()
  );
  const isAdmin = user.role === "ADMIN";
  if (!isCreator && !isMember && !isAdmin) {
    redirect(`/groups/${params.id}`);
  }

  const leaderMember =
    group.members?.find((m: any) => m.role === "LEADER") || group.members?.[0];
  const secondMember = group.members?.[1];
  const optionalMembers = group.members?.slice(2) || [];

  const initialData = {
    groupName: group.groupName,
    leaderName: leaderMember?.fullName || "",
    leaderReg: leaderMember?.regNumber || "",
    m2Name: secondMember?.fullName || "",
    m2Reg: secondMember?.regNumber || "",
    members: group.members,
    project: group.project,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/groups/${group.id}`}
          className="p-2 rounded-xl glass-panel text-gray-600 hover:text-uaf-green transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Edit & Resubmit Group Profile
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Section {group.section?.code} • {group.groupName}
          </p>
        </div>
      </div>

      {group.reviewStatus === "REJECTED" && group.rejectionReason && (
        <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-xs space-y-1">
          <p className="font-bold text-red-800 uppercase">
            Correction Required by Evaluator:
          </p>
          <p className="text-red-700">{group.rejectionReason}</p>
          <p className="text-[11px] text-gray-500 pt-1">
            Updating and submitting will return your review status to Pending Review.
          </p>
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-glass">
        <GroupForm
          sectionCode={group.section?.code || "M1"}
          initialData={initialData}
          isEdit={true}
          groupId={group.id}
        />
      </div>
    </div>
  );
}
