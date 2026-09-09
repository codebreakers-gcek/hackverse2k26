import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { testDriveConnection, getDriveConfig } from "@/lib/googleDrive";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { folderId, clientEmail, privateKey, serviceAccountJson } = body;

    // Load active settings from database
    const savedConfig = await getDriveConfig();

    let configToTest: any;

    // If explicit Service Account credentials are sent in the test payload
    if (clientEmail || privateKey || serviceAccountJson) {
      configToTest = {
        enabled: true,
        authType: "service_account",
        folderId: folderId?.trim() || savedConfig.folderId,
        folderName: savedConfig.folderName || "HACKVERSE 2026 Team Uploads",
        clientEmail: clientEmail?.trim(),
        privateKey: privateKey?.trim(),
        serviceAccountJson: serviceAccountJson?.trim(),
      };
    } else {
      // Use saved OAuth or Service Account config, with optional folderId override
      configToTest = {
        ...savedConfig,
        enabled: true,
        folderId: folderId !== undefined && folderId !== "" ? folderId.trim() : savedConfig.folderId,
      };
    }

    const result = await testDriveConnection(configToTest);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Google Drive connection test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to Google Drive. Check permissions and credentials.",
      },
      { status: 400 }
    );
  }
}
