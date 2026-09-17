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

  // Fallback token check or scannerPinService check
  const activeSessionResult = await scannerPinService.getActiveSession();
  if (activeSessionResult.active && activeSessionResult.session) {
    const dev = activeSessionResult.session.devices.find(
      (d) => d.deviceToken === token && d.isActive
    );
    if (dev) {
      return NextResponse.json({
        valid: true,
        verifierName: dev.verifierName,
        deviceInfo: dev.deviceInfo,
      });
    }
  }

  return NextResponse.json({ valid: false });
}
