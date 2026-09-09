import { google } from "googleapis";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";

export interface GoogleDriveConfig {
  enabled: boolean;
  authType: "oauth" | "service_account";
  connectedEmail?: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: number | null;
  folderId?: string;
  folderName?: string;
  // Service Account fallback
  clientEmail?: string;
  privateKey?: string;
  serviceAccountJson?: string;
}

const GOOGLE_CLIENT_ID =
  process.env.AUTH_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  "";

const GOOGLE_CLIENT_SECRET =
  process.env.AUTH_GOOGLE_CLIENT_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET ||
  "";

/**
 * Creates a standard Google OAuth2 Client
 */
export function getGoogleOAuthClient(redirectUri?: string) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth Client ID and Secret are not configured in environment variables.");
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
}

/**
 * Generate Google OAuth authorization URL for Admin to connect their Google Drive
 */
export function getDriveAuthUrl(origin: string) {
  const redirectUri = `${origin}/api/admin/drive/callback`;
  const oauth2Client = getGoogleOAuthClient(redirectUri);

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
}

/**
 * Fetch Google Drive settings from database
 */
export async function getDriveConfig(): Promise<GoogleDriveConfig> {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (settings) {
      if (settings.googleDriveRefreshToken || settings.googleDriveAccessToken || settings.googleDriveConnectedEmail) {
        return {
          enabled: Boolean(settings.googleDriveEnabled),
          authType: "oauth",
          connectedEmail: settings.googleDriveConnectedEmail || undefined,
          refreshToken: settings.googleDriveRefreshToken || undefined,
          accessToken: settings.googleDriveAccessToken || undefined,
          tokenExpiry: settings.googleDriveTokenExpiry ? Number(settings.googleDriveTokenExpiry) : undefined,
          folderId: settings.googleDriveFolderId || undefined,
          folderName: settings.googleDriveFolderName || "HACKVERSE 2026 Team Uploads",
        };
      }

      // Service Account mode fallback
      if (settings.googleDriveServiceAccountJson?.trim()) {
        try {
          const parsed = JSON.parse(settings.googleDriveServiceAccountJson.trim());
          return {
            enabled: Boolean(settings.googleDriveEnabled),
            authType: "service_account",
            folderId: settings.googleDriveFolderId || undefined,
            folderName: settings.googleDriveFolderName || "HACKVERSE 2026 Team Uploads",
            clientEmail: parsed.client_email || settings.googleDriveClientEmail || undefined,
            privateKey: parsed.private_key || settings.googleDrivePrivateKey || undefined,
            serviceAccountJson: settings.googleDriveServiceAccountJson,
          };
        } catch {
          // ignore
        }
      }

      if (settings.googleDriveClientEmail && settings.googleDrivePrivateKey) {
        return {
          enabled: Boolean(settings.googleDriveEnabled),
          authType: "service_account",
          folderId: settings.googleDriveFolderId || undefined,
          folderName: settings.googleDriveFolderName || "HACKVERSE 2026 Team Uploads",
          clientEmail: settings.googleDriveClientEmail,
          privateKey: settings.googleDrivePrivateKey,
        };
      }
    }
  } catch (err) {
    console.error("Error reading Google Drive settings from DB:", err);
  }

  return {
    enabled: false,
    authType: "oauth",
  };
}

/**
 * Helper to construct an authenticated Google Drive API client
 */
export function createDriveClient(config: GoogleDriveConfig) {
  // 1. Prioritize Google OAuth (Admin's personal or org Google Account)
  if (config.refreshToken || config.accessToken) {
    const oauth2Client = getGoogleOAuthClient();
    oauth2Client.setCredentials({
      refresh_token: config.refreshToken,
      access_token: config.accessToken,
      expiry_date: config.tokenExpiry || undefined,
    });

    // Automatically listen for token refresh and persist new access token in background
    oauth2Client.on("tokens", async (tokens) => {
      try {
        await prisma.systemSettings.update({
          where: { id: "default" },
          data: {
            ...(tokens.access_token && { googleDriveAccessToken: tokens.access_token }),
            ...(tokens.refresh_token && { googleDriveRefreshToken: tokens.refresh_token }),
            ...(tokens.expiry_date && { googleDriveTokenExpiry: BigInt(tokens.expiry_date) }),
          },
        });
      } catch (e) {
        console.warn("Could not save refreshed tokens to DB:", e);
      }
    });

    return google.drive({ version: "v3", auth: oauth2Client });
  }

  // 2. Service Account fallback
  let clientEmail = config.clientEmail;
  let privateKey = config.privateKey;

  if (config.serviceAccountJson?.trim()) {
    try {
      const parsed = JSON.parse(config.serviceAccountJson.trim());
      if (parsed.client_email) clientEmail = parsed.client_email;
      if (parsed.private_key) privateKey = parsed.private_key;
    } catch {
      // ignore
    }
  }

  if (!clientEmail || !privateKey) {
    throw new Error("No Google Drive account connected. Please sign in with Google in Admin Settings.");
  }

  const formattedKey = privateKey.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: formattedKey,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  return google.drive({ version: "v3", auth });
}

/**
 * Test the Google Drive connection and folder permissions
 */
export async function testDriveConnection(overrideConfig?: GoogleDriveConfig) {
  const config = overrideConfig || (await getDriveConfig());
  const drive = createDriveClient(config);

  if (!config.folderId) {
    const res = await drive.files.list({
      pageSize: 5,
      fields: "files(id, name)",
    });
    return {
      success: true,
      message: `Successfully connected to Google Drive${config.connectedEmail ? ` (${config.connectedEmail})` : ""}!`,
      connectedEmail: config.connectedEmail,
      filesCount: res.data.files?.length || 0,
    };
  }

  // Verify access to target folder
  try {
    const folderRes = await drive.files.get({
      fileId: config.folderId.trim(),
      fields: "id, name, mimeType, capabilities, webViewLink",
      supportsAllDrives: true,
    });

    return {
      success: true,
      folderName: folderRes.data.name,
      folderId: folderRes.data.id,
      webViewLink: folderRes.data.webViewLink,
      canAddChildren: folderRes.data.capabilities?.canAddChildren ?? true,
      connectedEmail: config.connectedEmail,
      message: `Connected successfully! Target Folder: "${folderRes.data.name}" (${config.connectedEmail || "Google Account"})`,
    };
  } catch (folderErr: any) {
    // If folder was not found or inaccessible, still verify connection
    const res = await drive.files.list({
      pageSize: 5,
      fields: "files(id, name)",
    });
    return {
      success: true,
      connectedEmail: config.connectedEmail,
      message: `Connected to Google Drive (${config.connectedEmail || "Google Account"}), but target folder ID was not accessible (${folderErr.message || "recreating on next upload"}).`,
      filesCount: res.data.files?.length || 0,
    };
  }
}

/**
 * Find or create a subfolder in Google Drive
 */
export async function getOrCreateTeamFolder(
  drive: ReturnType<typeof google.drive>,
  parentFolderId: string,
  teamFolderName: string
): Promise<string> {
  const q = `'${parentFolderId}' in parents and name = '${teamFolderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const existing = await drive.files.list({
    q,
    fields: "files(id, name)",
    spaces: "drive",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (existing.data.files && existing.data.files.length > 0) {
    return existing.data.files[0].id!;
  }

  // Create subfolder
  const createRes = await drive.files.create({
    requestBody: {
      name: teamFolderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });

  return createRes.data.id!;
}

export interface UploadOptions {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  teamName: string;
  registrationNumber?: string;
  category: "college_id" | "synopsis" | "other";
}

/**
 * Upload a document buffer to Google Drive inside the configured root folder / team subfolder
 */
export async function uploadDocumentToDrive(options: UploadOptions) {
  const config = await getDriveConfig();
  if (!config.enabled) {
    throw new Error("Google Drive storage is not enabled in System Settings.");
  }

  const drive = createDriveClient(config);
  const targetParentId = config.folderId?.trim();

  let destinationFolderId = targetParentId;

  // Create team-specific subfolder if parent folder exists
  if (targetParentId) {
    const cleanTeamName = options.teamName.replace(/[/\\?%*:|"<>]/g, "_").trim();
    const subfolderName = options.registrationNumber
      ? `[${options.registrationNumber}] ${cleanTeamName}`
      : cleanTeamName;

    try {
      destinationFolderId = await getOrCreateTeamFolder(drive, targetParentId, subfolderName);
    } catch (folderErr) {
      console.warn("Could not create team subfolder, uploading to root target folder:", folderErr);
      destinationFolderId = targetParentId;
    }
  }

  // Format file name
  const prefix = options.category === "college_id" ? "CollegeID_" : options.category === "synopsis" ? "Synopsis_" : "Doc_";
  const finalFileName = `${prefix}${options.fileName.replace(/[/\\?%*:|"<>]/g, "_")}`;

  const mediaStream = Readable.from(options.buffer);

  const fileMetadata: any = {
    name: finalFileName,
    parents: destinationFolderId ? [destinationFolderId] : undefined,
  };

  const uploadRes = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: options.mimeType,
      body: mediaStream,
    },
    fields: "id, name, webViewLink, webContentLink, size, mimeType",
    supportsAllDrives: true,
  });

  const fileId = uploadRes.data.id!;
  const webViewLink = uploadRes.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

  // Make the file readable with link
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });
  } catch (permErr) {
    console.warn("Could not set public permission on uploaded file:", permErr);
  }

  return {
    fileId,
    fileName: finalFileName,
    originalName: options.fileName,
    webViewLink,
    webContentLink: uploadRes.data.webContentLink || webViewLink,
    fileSize: uploadRes.data.size,
    mimeType: uploadRes.data.mimeType,
  };
}
