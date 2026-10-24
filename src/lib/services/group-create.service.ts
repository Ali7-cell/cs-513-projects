import { prisma } from "@/lib/prisma";
import { CreateGroupInput } from "@/lib/validation/group.schema";
import { findConflictingRegNumbers } from "./group-check.service";
import { checkSubmissionDeadlineAllowed } from "./deadline.service";

export async function createGroupTransactional(
  input: CreateGroupInput,
  userId: string,
  isAdmin: boolean = false
) {
  // Check deadline unless admin override
  if (!isAdmin) {
    const deadlineCheck = await checkSubmissionDeadlineAllowed();
    if (!deadlineCheck.allowed) {
      throw new Error(`DEADLINE_CLOSED: ${deadlineCheck.message}`);
    }
  }

  // Intra-group duplicate check
  const normalizedMembers = input.members.map((m) => ({
    ...m,
    fullName: m.fullName.trim(),
    regNumber: m.regNumber.trim().toUpperCase(),
  }));

  const regNumbers = normalizedMembers.map((m) => m.regNumber);
  const uniqueRegs = new Set(regNumbers);
  if (uniqueRegs.size !== regNumbers.length) {
    throw new Error(
      "Duplicate registration numbers found inside the same group. Each member must have a distinct registration number."
    );
  }

  // Cross-group uniqueness check (across all active M1 & M2 groups)
  const conflicts = await findConflictingRegNumbers(regNumbers);
  if (conflicts.length > 0) {
    throw new Error(
      `This registration number is already assigned to another group: ${conflicts.join(", ")}`
    );
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!userExists) {
    throw new Error(
      "USER_NOT_FOUND: Your user session is invalid or the account was not found in the database. Please log out and log back in."
    );
  }

  const section = await prisma.section.findUnique({
    where: { code: input.sectionCode.toUpperCase() },
  });
  if (!section) throw new Error("SECTION_NOT_FOUND");

  return prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        groupName: input.groupName.trim(),
        sectionId: section.id,
        createdById: userId,
        reviewStatus: "PENDING_REVIEW",
      },
    });

    await tx.groupMember.createMany({
      data: normalizedMembers.map((m) => ({
        groupId: group.id,
        fullName: m.fullName,
        regNumber: m.regNumber,
        role: m.role,
        displayOrder: m.displayOrder,
      })),
    });

    await tx.project.create({
      data: {
        groupId: group.id,
        ideaName: input.ideaName.trim(),
        description: input.description.trim(),
        projectPdfUrl: input.projectPdfUrl?.trim() || null,
        githubUrl: input.githubUrl?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
      },
    });

    await tx.presentation.create({
      data: { groupId: group.id, status: "PENDING" },
    });

    // Create review history entry
    await tx.groupReviewHistory.create({
      data: {
        groupId: group.id,
        status: "PENDING_REVIEW",
        actorId: userId,
        reason: "Initial group profile submission",
      },
    });

    // Audit log
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: "GROUP_CREATED",
        entityType: "Group",
        entityId: group.id,
        newValue: JSON.stringify({
          groupName: group.groupName,
          sectionCode: input.sectionCode,
          memberCount: normalizedMembers.length,
        }),
      },
    });

    return group;
  });
}

export async function updateGroupTransactional(
  groupId: string,
  input: CreateGroupInput,
  userId: string,
  isAdmin: boolean = false
) {
  // Check deadline unless admin override
  if (!isAdmin) {
    const deadlineCheck = await checkSubmissionDeadlineAllowed();
    if (!deadlineCheck.allowed) {
      throw new Error(`DEADLINE_CLOSED: ${deadlineCheck.message}`);
    }
  }

  const normalizedMembers = input.members.map((m) => ({
    ...m,
    fullName: m.fullName.trim(),
    regNumber: m.regNumber.trim().toUpperCase(),
  }));

  const regNumbers = normalizedMembers.map((m) => m.regNumber);
  const uniqueRegs = new Set(regNumbers);
  if (uniqueRegs.size !== regNumbers.length) {
    throw new Error(
      "Duplicate registration numbers found inside the same group. Each member must have a distinct registration number."
    );
  }

  // Cross-group uniqueness check excluding this group
  const conflicts = await findConflictingRegNumbers(regNumbers, groupId);
  if (conflicts.length > 0) {
    throw new Error(
      `This registration number is already assigned to another group: ${conflicts.join(", ")}`
    );
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.group.findUnique({
      where: { id: groupId },
      include: { members: true, project: true },
    });
    if (!existing) throw new Error("GROUP_NOT_FOUND");

    // Update group header
    const updatedGroup = await tx.group.update({
      where: { id: groupId },
      data: {
        groupName: input.groupName.trim(),
        reviewStatus: "PENDING_REVIEW", // Reset to pending review on resubmission
        rejectionReason: null,
      },
    });

    // Delete existing members and recreate to reflect changes safely
    await tx.groupMember.deleteMany({
      where: { groupId },
    });

    await tx.groupMember.createMany({
      data: normalizedMembers.map((m) => ({
        groupId,
        fullName: m.fullName,
        regNumber: m.regNumber,
        role: m.role,
        displayOrder: m.displayOrder,
      })),
    });

    // Update project
    await tx.project.upsert({
      where: { groupId },
      create: {
        groupId,
        ideaName: input.ideaName.trim(),
        description: input.description.trim(),
        projectPdfUrl: input.projectPdfUrl?.trim() || null,
        githubUrl: input.githubUrl?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
      },
      update: {
        ideaName: input.ideaName.trim(),
        description: input.description.trim(),
        projectPdfUrl: input.projectPdfUrl?.trim() || null,
        githubUrl: input.githubUrl?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
      },
    });

    // Create review history entry
    await tx.groupReviewHistory.create({
      data: {
        groupId,
        status: "PENDING_REVIEW",
        actorId: userId,
        reason: "Group profile edited and resubmitted",
      },
    });

    // Audit log
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: "GROUP_RESUBMITTED",
        entityType: "Group",
        entityId: groupId,
        previousValue: JSON.stringify({ reviewStatus: existing.reviewStatus }),
        newValue: JSON.stringify({
          reviewStatus: "PENDING_REVIEW",
          memberCount: normalizedMembers.length,
        }),
      },
    });

    return updatedGroup;
  });
}
