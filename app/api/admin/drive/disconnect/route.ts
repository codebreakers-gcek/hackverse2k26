import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.systemSettings.update({
      where: { id: "default" },
      data: {
        googleDriveEnabled: false,
        googleDriveRefreshToken: "",
        googleDriveAccessToken: "",
        googleDriveConnectedEmail: "",
        googleDriveTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Google Drive account disconnected successfully.",
    });
  } catch (error: any) {
    console.error("Disconnect error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to disconnect Google Drive account." },
      { status: 500 }
    );
  }
}
