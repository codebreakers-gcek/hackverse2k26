import { NextRequest, NextResponse } from "next/server";
import { uploadDocumentToDrive, getDriveConfig } from "@/lib/googleDrive";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const teamName = (formData.get("teamName") as string) || "Squad";
    const category = (formData.get("category") as "college_id" | "synopsis" | "other") || "other";
    const registrationNumber = (formData.get("registrationNumber") as string) || undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No document file provided in upload request." },
        { status: 400 }
      );
    }

    // Limit size (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds maximum allowed limit of 25MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. First save local copy to public/uploads/ for guaranteed fast local previews
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const sanitizedTeam = teamName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}_${sanitizedTeam}_${sanitizedOriginal}`;
    const localFilePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(localFilePath, buffer);

    const localUrl = `/uploads/${uniqueFileName}`;

    // 2. If Google Drive is enabled, also upload to Google Drive
    try {
      const driveConfig = await getDriveConfig();
      if (driveConfig.enabled) {
        const driveResult = await uploadDocumentToDrive({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          buffer,
          teamName,
          registrationNumber,
          category,
        });

        return NextResponse.json({
          success: true,
          message: "Document successfully uploaded to Google Drive & local server storage.",
          data: {
            ...driveResult,
            localUrl,
            webViewLink: driveResult.webViewLink || localUrl,
            downloadUrl: driveResult.webContentLink || localUrl,
          },
        });
      }
    } catch (driveErr) {
      console.warn("Google Drive upload skipped/failed, using local storage:", driveErr);
    }

    // Fallback: return local storage URL
    return NextResponse.json({
      success: true,
      message: "Document successfully saved to secure server storage.",
      data: {
        fileId: `local_${Date.now()}`,
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        webViewLink: localUrl,
        downloadUrl: localUrl,
        localUrl,
      },
    });
  } catch (error: any) {
    console.error("Document upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload document file.",
      },
      { status: 500 }
    );
  }
}
