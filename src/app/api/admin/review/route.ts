import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { updateGroupReviewStatus } from "@/lib/services/review.service";
import { reviewStatusSchema } from "@/lib/validation/review.schema";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { message: "Forbidden: Admin only" } },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { groupId, reviewStatus, rejectionReason } = body;
    const parsed = reviewStatusSchema.safeParse({
      reviewStatus,
      rejectionReason,
    });
    if (!parsed.success || !groupId) {
      return NextResponse.json(
        { success: false, error: { message: parsed.error?.errors[0]?.message || "Invalid payload" } },
        { status: 400 }
      );
    }

    const updated = await updateGroupReviewStatus(
      groupId,
      parsed.data.reviewStatus,
      user.id,
      parsed.data.rejectionReason
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
