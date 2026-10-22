import { z } from "zod";
import { memberItemSchema } from "./member.schema";

const safeOptionalUrlSchema = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .refine((url) => /^https?:\/\//i.test(url), "Must use HTTP or HTTPS protocol")
  .optional()
  .or(z.literal(""));

export const createGroupSchema = z
  .object({
    groupName: z
      .string()
      .min(3, "Group name must be at least 3 characters")
      .max(100, "Group name cannot exceed 100 characters")
      .trim(),
    sectionCode: z.enum(["M1", "M2"]),
    ideaName: z
      .string()
      .min(3, "Project idea name must be at least 3 characters")
      .max(150, "Project idea name cannot exceed 150 characters")
      .trim(),
    description: z
      .string()
      .min(20, "Project description must be at least 20 characters")
      .max(2500, "Project description cannot exceed 2500 characters")
      .trim(),
    projectPdfUrl: z
      .string()
      .trim()
      .min(1, "Google Drive PDF link is required")
      .url("Must be a valid URL")
      .refine((url) => /^https:\/\//i.test(url), "Google Drive link must use HTTPS"),
    githubUrl: safeOptionalUrlSchema,
    websiteUrl: safeOptionalUrlSchema,
    members: z
      .array(memberItemSchema)
      .min(2, "At least 2 members (Leader and Member 2) are required")
      .max(7, "A group cannot have more than 7 members"),
  })
  .refine(
    (data) => {
      const regNums = data.members.map((m) => m.regNumber.toUpperCase().trim());
      return new Set(regNums).size === regNums.length;
    },
    {
      message: "Duplicate registration numbers within the group are not allowed",
      path: ["members"],
    }
  );

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
