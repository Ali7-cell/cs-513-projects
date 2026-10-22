import { z } from "zod";

export const reviewStatusSchema = z
  .object({
    reviewStatus: z.enum(["APPROVED", "REJECTED"]),
    rejectionReason: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.reviewStatus === "REJECTED") {
        return Boolean(data.rejectionReason && data.rejectionReason.length >= 5);
      }
      return true;
    },
    {
      message: "A rejection reason of at least 5 characters is required",
      path: ["rejectionReason"],
    }
  );

export const presentationStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED"]),
});

export type ReviewStatusInput = z.infer<typeof reviewStatusSchema>;
export type PresentationStatusInput = z.infer<typeof presentationStatusSchema>;
