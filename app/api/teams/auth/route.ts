import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scannerPinService } from "@/services/scannerPinService";

function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown Device";
  let browser = "Browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  let os = "Desktop";
  let isMobile = false;
  if (ua.includes("Android")) {
    os = "Android";
    isMobile = true;
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    os = ua.includes("iPad") ? "iPadOS" : "iOS";
    isMobile = true;
  } else if (ua.includes("Windows")) {
    os = "Windows";
  } else if (ua.includes("Macintosh")) {
    os = "macOS";
  } else if (ua.includes("Linux")) {
    os = "Linux";
  }

  return `${browser} on ${os} (${isMobile ? "Mobile" : "Desktop"})`;
}

/**
 * POST /api/teams/auth
 * Authenticate Verifier Name & 5-Min PIN, enforce 8 device limit, record device session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, verifierName, deviceToken } = body;

    if (!pin || !verifierName?.trim()) {
      return NextResponse.json(
        { error: "Both Verifier Name and Authorization PIN are required." },
        { status: 400 }
      );
    }

    // Extract device metadata
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";
    const deviceInfo = parseUserAgent(userAgent);

    const authResult = await scannerPinService.authenticateVerifier({
      pin,
      verifierName,
      deviceToken,
      deviceInfo,
      ipAddress,
      userAgent,
    });

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    return NextResponse.json(authResult);
  } catch (error: any) {
    console.error("Teams auth error:", error);
    return NextResponse.json(
      { error: "Authentication service error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/teams/auth?token=...
 * Check if the active device token is still valid
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  try {
    if (prisma.scannerDeviceLogin) {
      const deviceLogin = await prisma.scannerDeviceLogin.findUnique({
        where: { deviceToken: token },
        include: { pinSession: true },
      });

      if (!deviceLogin || !deviceLogin.isActive) {
        return NextResponse.json({ valid: false });
      }

      return NextResponse.json({
        valid: true,
        verifierName: deviceLogin.verifierName,
        deviceInfo: deviceLogin.deviceInfo,
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT d."verifierName", d."deviceInfo", d."isActive"
         FROM "scanner_device_logins" d
         WHERE d."deviceToken" = $1
         LIMIT 1`,
        token
      );

      if (!rows || rows.length === 0 || !rows[0].isActive) {
        return NextResponse.json({ valid: false });
      }

      const row = rows[0];
      return NextResponse.json({
        valid: true,
        verifierName: row.verifierName,
        deviceInfo: row.deviceInfo,
      });
    }
  } catch (error) {
    return NextResponse.json({ valid: false });
  }
}
