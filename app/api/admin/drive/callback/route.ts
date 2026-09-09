import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthClient, getOrCreateTeamFolder } from "@/lib/googleDrive";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/admin/drive/callback`;
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    console.error("Google Drive OAuth error:", error);
    return NextResponse.redirect(`${origin}/admin?tab=settings&drive_error=${encodeURIComponent(error || "No authorization code returned")}`);
  }

  try {
    const oauth2Client = getGoogleOAuthClient(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userinfo = await oauth2.userinfo.get();
    const connectedEmail = userinfo.data.email || "";

    // Automatically create / get root Hackverse folder in admin's Google Drive
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    let folderId = "";
    const folderName = "HACKVERSE 2026 Team Uploads";

    try {
      const q = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      const searchRes = await drive.files.list({
        q,
        fields: "files(id, name)",
        spaces: "drive",
      });

      if (searchRes.data.files && searchRes.data.files.length > 0) {
        folderId = searchRes.data.files[0].id!;
      } else {
        const createRes = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id, name",
        });
        folderId = createRes.data.id!;
      }
    } catch (folderErr) {
      console.warn("Could not automatically create/find folder:", folderErr);
    }

    // Persist OAuth tokens and connection in systemSettings
    await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        googleDriveEnabled: true,
        googleDriveAuthType: "oauth",
        googleDriveConnectedEmail: connectedEmail,
        ...(tokens.refresh_token && { googleDriveRefreshToken: tokens.refresh_token }),
        ...(tokens.access_token && { googleDriveAccessToken: tokens.access_token }),
        ...(tokens.expiry_date && { googleDriveTokenExpiry: BigInt(tokens.expiry_date) }),
        ...(folderId && { googleDriveFolderId: folderId }),
        googleDriveFolderName: folderName,
      },
      create: {
        id: "default",
        googleDriveEnabled: true,
        googleDriveAuthType: "oauth",
        googleDriveConnectedEmail: connectedEmail,
        googleDriveRefreshToken: tokens.refresh_token || "",
        googleDriveAccessToken: tokens.access_token || "",
        googleDriveTokenExpiry: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        googleDriveFolderId: folderId,
        googleDriveFolderName: folderName,
      },
    });

    return NextResponse.redirect(`${origin}/admin?tab=settings&drive=connected`);
  } catch (err: any) {
    console.error("Error exchanging Google OAuth code:", err);
    return NextResponse.redirect(
      `${origin}/admin?tab=settings&drive_error=${encodeURIComponent(err.message || "Failed to exchange OAuth token")}`
    );
  }
}
