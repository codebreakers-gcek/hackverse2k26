import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { getDriveAuthUrl } from "@/lib/googleDrive";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const origin = req.nextUrl.origin;
    const authUrl = getDriveAuthUrl(origin);

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("Google Drive OAuth initiation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start Google Drive OAuth flow." },
      { status: 500 }
    );
  }
}
