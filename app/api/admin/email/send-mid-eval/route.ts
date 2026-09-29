import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  sendOnlineMidEvaluationEmail,
  OnlineMidEvaluationEmailData,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Check if bulk or single send
    if (Array.isArray(body.items)) {
      const items: OnlineMidEvaluationEmailData[] = body.items;
      if (items.length === 0) {
        return NextResponse.json(
          { error: "No email items provided in batch." },
          { status: 400 }
        );
      }

      const results: Array<{
        teamName: string;
        leaderEmail: string;
        success: boolean;
        error?: string;
      }> = [];

      let successCount = 0;
      let failureCount = 0;

      for (const item of items) {
        if (!item.leaderEmail || !item.teamName) {
          results.push({
            teamName: item.teamName || "Unknown",
            leaderEmail: item.leaderEmail || "None",
            success: false,
            error: "Missing required email or team name.",
          });
          failureCount++;
          continue;
        }

        try {
          const res = await sendOnlineMidEvaluationEmail(item);
          if (res.success) {
            successCount++;
            results.push({
              teamName: item.teamName,
              leaderEmail: item.leaderEmail,
              success: true,
            });
          } else {
            failureCount++;
            results.push({
              teamName: item.teamName,
              leaderEmail: item.leaderEmail,
              success: false,
              error: res.error || "Unknown error",
            });
          }
        } catch (err: any) {
          failureCount++;
          results.push({
            teamName: item.teamName,
            leaderEmail: item.leaderEmail,
            success: false,
            error: err.message,
          });
        }
      }

      return NextResponse.json({
        success: true,
        total: items.length,
        sent: successCount,
        failed: failureCount,
        results,
      });
    }

    // Single item send
    const singleData: OnlineMidEvaluationEmailData = body;
    if (!singleData.leaderEmail || !singleData.teamName) {
      return NextResponse.json(
        { error: "Missing required fields: leaderEmail or teamName" },
        { status: 400 }
      );
    }

    const result = await sendOnlineMidEvaluationEmail(singleData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send mid-evaluation email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mid-Evaluation email successfully dispatched to ${singleData.teamName} (${singleData.leaderEmail})`,
      result,
    });
  } catch (error: any) {
    console.error("Error in send-mid-eval API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
