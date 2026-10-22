import { z } from "zod";

export const normalizeRegNumber = (val: string): string =>
  val.trim().toUpperCase().replace(/\s+/g, "");

export const memberItemSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  regNumber: z
    .string()
    .min(4, "Registration number is required")
    .max(50, "Registration number is too long")
    .transform(normalizeRegNumber),
  role: z.enum(["LEADER", "MEMBER"]).default("MEMBER"),
  displayOrder: z.number().int().min(1).max(7),
});

export const optionalMemberItemSchema = z
  .object({
    fullName: z.string().trim().optional().or(z.literal("")),
    regNumber: z.string().trim().optional().or(z.literal("")),
    role: z.enum(["MEMBER"]).default("MEMBER"),
    displayOrder: z.number().int().min(3).max(7),
  })
  .refine(
    (data) => {
      const hasName = Boolean(data.fullName && data.fullName.length > 0);
      const hasReg = Boolean(data.regNumber && data.regNumber.length > 0);
      return (hasName && hasReg) || (!hasName && !hasReg);
    },
    {
      message: "Both name and registration number are required if adding a member",
      path: ["regNumber"],
    }
  );

export type MemberItemInput = z.infer<typeof memberItemSchema>;
