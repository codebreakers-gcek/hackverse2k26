import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { scannerPinService } from "@/services/scannerPinService";

// Helper to check admin access
async function checkAdminAuth() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { authorized: false, user: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true, email: true },
    });

    if (user?.role !== "admin") {
      return { authorized: false, user };
    }

    return { authorized: true, user };
  } catch (error) {
    console.error("Auth check error:", error);
    return { authorized: false, user: null };
  }
}

/**
 * GET: Fetch active PIN session, remaining seconds, and connected devices
 */
export async function GET(request: NextRequest) {
  const { authorized } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const result = await scannerPinService.getActiveSession();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch scanner PIN status:", error);
    return NextResponse.json(
      { error: "Failed to fetch scanner PIN status", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Generate PIN, Revoke PIN, or Revoke Device
 */
export async function POST(request: NextRequest) {
  const { authorized, user } = await checkAdminAuth();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action || "generate";

    if (action === "generate") {
      const session = await scannerPinService.generatePin(user?.name || "Admin");

      return NextResponse.json({
        success: true,
        message: "New 5-minute Scanner PIN generated successfully",
        session,
        remainingSeconds: 300,
      });
    }

    if (action === "revoke_pin") {
      await scannerPinService.revokePin();

      return NextResponse.json({
        success: true,
        message: "Active PIN session revoked",
      });
    }

    if (action === "revoke_device") {
      const deviceId = body.deviceId;
      if (!deviceId) {
        return NextResponse.json(
          { error: "Device ID is required" },
          { status: 400 }
        );
      }

      await scannerPinService.revokeDevice(deviceId);

      return NextResponse.json({
        success: true,
        message: "Device session revoked successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Scanner PIN action error:", error);
    return NextResponse.json(
      { error: "Operation failed", details: error.message },
      { status: 500 }
    );
  }
}
