import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  sendRegistrationSubmissionEmail,
  sendRegistrationApprovedEmail,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { registrationId, type } = body; // type: 'submission' | 'approval'

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const reg = await prisma.teamRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const emailPayload = {
      registrationNumber: reg.registrationNumber,
      teamName: reg.teamName,
      collegeName: reg.collegeName,
      leaderName: reg.leaderName,
      leaderEmail: reg.leaderEmail,
      leaderPhone: reg.leaderPhone,
      problemStatementId: reg.problemStatementId,
      members: (reg.members as any) || [],
      paymentDetails: {
        paymentMode: reg.paymentMode || undefined,
        transactionId: reg.transactionId,
        paymentStatus: reg.paymentStatus || undefined,
        amount: (reg as any).amount || undefined,
      },
      accommodationRequired: Boolean(reg.accommodationRequired),
    };

    let result;
    if (type === "approval") {
      result = await sendRegistrationApprovedEmail(emailPayload);
    } else {
      result = await sendRegistrationSubmissionEmail(emailPayload);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to dispatch email via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email dispatched successfully to ${reg.leaderEmail}`,
    });
  } catch (error: any) {
    console.error("Manual email send error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
