import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { updatePresentationStatus } from "@/lib/services/presentation.service";
import { presentationStatusSchema } from "@/lib/validation/review.schema";

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
    const { groupId, status } = body;
    const parsed = presentationStatusSchema.safeParse({ status });
    if (!parsed.success || !groupId) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid payload" } },
        { status: 400 }
      );
    }

    const updated = await updatePresentationStatus(
      groupId,
      parsed.data.status,
      user.id
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
