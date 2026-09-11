import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { getDriveFileStream, extractDriveFileId } from "@/lib/googleDrive";
import fs from "fs";
import path from "path";

function getMimeType(filePathOrName: string): string {
  const ext = path.extname(filePathOrName).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".doc":
      return "application/msword";
    case ".pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case ".ppt":
      return "application/vnd.ms-powerpoint";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");
    const rawUrl = searchParams.get("url");
    const isDownload = searchParams.get("download") === "1";

    const target = fileId || rawUrl;
    if (!target) {
      return NextResponse.json({ error: "No fileId or url provided." }, { status: 400 });
    }

    // 1. Check if this is a local upload reference (e.g., /uploads/xyz or local_123)
    if (target.startsWith("/uploads/") || target.startsWith("local_")) {
      const fileName = target.startsWith("/uploads/")
        ? target.replace(/^\/uploads\//, "")
        : target;

      const localPath = path.join(process.cwd(), "public", "uploads", fileName);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        const mimeType = getMimeType(fileName);
        const disposition = isDownload ? "attachment" : "inline";

        return new Response(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `${disposition}; filename="${encodeURIComponent(fileName)}"`,
            "Cache-Control": "private, max-age=86400",
          },
        });
      }
    }

    // 2. Fetch from Google Drive directly using stored server credentials
    const driveId = extractDriveFileId(target);
    if (driveId) {
      try {
        const { stream, metadata } = await getDriveFileStream(driveId);

        // Convert Node stream to web ReadableStream
        const webStream = new ReadableStream({
          start(controller) {
            stream.on("data", (chunk: any) => {
              controller.enqueue(chunk);
            });
            stream.on("end", () => {
              controller.close();
            });
            stream.on("error", (err: any) => {
              controller.error(err);
            });
          },
        });

        const disposition = isDownload ? "attachment" : "inline";
        const fileName = metadata.name || `file_${driveId}`;
        const mimeType = metadata.mimeType || getMimeType(fileName);

        return new Response(webStream, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `${disposition}; filename="${encodeURIComponent(fileName)}"`,
            "Cache-Control": "private, max-age=86400",
          },
        });
      } catch (driveErr: any) {
        console.warn("Could not stream directly from Google Drive, checking local fallback:", driveErr?.message || driveErr);
      }
    }

    // 3. Fallback: Search local public/uploads directory for any matching file
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        // Find if any file matches or contains part of target
        const matched = files.find((f) => target.includes(f) || f.includes(target) || (driveId && f.includes(driveId)));
        if (matched) {
          const fileBuffer = fs.readFileSync(path.join(uploadsDir, matched));
          const mimeType = getMimeType(matched);
          const disposition = isDownload ? "attachment" : "inline";

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": mimeType,
              "Content-Disposition": `${disposition}; filename="${encodeURIComponent(matched)}"`,
              "Cache-Control": "private, max-age=86400",
            },
          });
        }
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      { error: "Document file not found or inaccessible in Google Drive and local storage." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error in admin drive preview route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load document stream." },
      { status: 500 }
    );
  }
}
