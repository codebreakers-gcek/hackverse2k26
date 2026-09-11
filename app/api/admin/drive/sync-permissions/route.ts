import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { syncAllDrivePermissions } from "@/lib/googleDrive";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 403 });
    }

    const result = await syncAllDrivePermissions();

    return NextResponse.json({
      success: true,
      message: `Permission synchronization complete! Updated ${result.updatedCount} files to public link reader access (${result.errorCount} skipped / unchanged).`,
      data: result,
    });
  } catch (error: any) {
    console.error("Error syncing Drive permissions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to synchronize Google Drive permissions.",
      },
      { status: 500 }
    );
  }
}
