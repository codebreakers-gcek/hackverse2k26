import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface ScannerSessionData {
  id: string;
  pin: string;
  createdAt: string;
  expiresAt: string;
  maxDevices: number;
  isActive: boolean;
  createdBy: string | null;
  devices: ScannerDeviceData[];
}

export interface ScannerDeviceData {
  id: string;
  pinSessionId: string;
  verifierName: string;
  deviceToken: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: string | null;
  lastActiveAt: string;
  createdAt: string;
  isActive: boolean;
}

export const scannerPinService = {
  /**
   * Get active PIN session and its connected devices
   */
  async getActiveSession(): Promise<{
    active: boolean;
    session: (ScannerSessionData & { activeDeviceCount: number }) | null;
    remainingSeconds: number;
    recentSessions: any[];
  }> {
    const now = new Date();

    try {
      if (prisma.scannerPinSession) {
        const activeSession = await prisma.scannerPinSession.findFirst({
          where: {
            isActive: true,
            expiresAt: { gt: now },
          },
          include: {
            devices: {
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const recentSessions = await prisma.scannerPinSession.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { devices: true },
        });

        if (!activeSession) {
          return {
            active: false,
            session: null,
            remainingSeconds: 0,
            recentSessions: recentSessions.map((s) => ({
              ...s,
              createdAt: s.createdAt.toISOString(),
              expiresAt: s.expiresAt.toISOString(),
            })),
          };
        }

        const remainingSeconds = Math.max(
          0,
          Math.floor((activeSession.expiresAt.getTime() - now.getTime()) / 1000)
        );

        const activeDevices = activeSession.devices.filter((d) => d.isActive);

        return {
          active: true,
          session: {
            id: activeSession.id,
            pin: activeSession.pin,
            createdAt: activeSession.createdAt.toISOString(),
            expiresAt: activeSession.expiresAt.toISOString(),
            maxDevices: activeSession.maxDevices,
            isActive: activeSession.isActive,
            createdBy: activeSession.createdBy,
            activeDeviceCount: activeDevices.length,
            devices: activeSession.devices.map((d) => ({
              ...d,
              createdAt: d.createdAt.toISOString(),
              lastActiveAt: d.lastActiveAt.toISOString(),
            })),
          },
          remainingSeconds,
          recentSessions: recentSessions.map((s) => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
            expiresAt: s.expiresAt.toISOString(),
          })),
        };
      }
    } catch (e) {
      console.warn("Prisma model query fallback to SQL:", e);
    }

    // Direct SQL fallback if Prisma model is not yet warm in running dev server
    try {
      const activeRows: any = await prisma.$queryRawUnsafe(`
        SELECT id, pin, "createdAt", "expiresAt", "maxDevices", "isActive", "createdBy"
        FROM "scanner_pin_sessions"
        WHERE "isActive" = true AND "expiresAt" > NOW()
        ORDER BY "createdAt" DESC
        LIMIT 1
      `);

      if (!activeRows || activeRows.length === 0) {
        return { active: false, session: null, remainingSeconds: 0, recentSessions: [] };
      }

      const row = activeRows[0];
      const expiresAt = new Date(row.expiresAt);
      const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

      const deviceRows: any = await prisma.$queryRawUnsafe(
        `SELECT id, "pinSessionId", "verifierName", "deviceToken", "ipAddress", "userAgent", "deviceInfo", "lastActiveAt", "createdAt", "isActive"
         FROM "scanner_device_logins"
         WHERE "pinSessionId" = $1
         ORDER BY "createdAt" DESC`,
        row.id
      );

      const devices: ScannerDeviceData[] = (deviceRows || []).map((d: any) => ({
        id: d.id,
        pinSessionId: d.pinSessionId,
        verifierName: d.verifierName,
        deviceToken: d.deviceToken,
        ipAddress: d.ipAddress,
        userAgent: d.userAgent,
        deviceInfo: d.deviceInfo,
        lastActiveAt: new Date(d.lastActiveAt).toISOString(),
        createdAt: new Date(d.createdAt).toISOString(),
        isActive: Boolean(d.isActive),
      }));

      const activeDevices = devices.filter((d) => d.isActive);

      return {
        active: true,
        session: {
          id: row.id,
          pin: row.pin,
          createdAt: new Date(row.createdAt).toISOString(),
          expiresAt: expiresAt.toISOString(),
          maxDevices: row.maxDevices || 8,
          isActive: Boolean(row.isActive),
          createdBy: row.createdBy,
          activeDeviceCount: activeDevices.length,
          devices,
        },
        remainingSeconds,
        recentSessions: [],
      };
    } catch (err) {
      console.error("SQL fallback error in getActiveSession:", err);
      return { active: false, session: null, remainingSeconds: 0, recentSessions: [] };
    }
  },

  /**
   * Generate a fresh 5-minute PIN session
   */
  async generatePin(adminName: string = "Admin") {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    try {
      if (prisma.scannerPinSession) {
        await prisma.scannerPinSession.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        const session = await prisma.scannerPinSession.create({
          data: {
            pin,
            expiresAt,
            maxDevices: 8,
            isActive: true,
            createdBy: adminName,
          },
          include: { devices: true },
        });

        try {
          await prisma.systemSettings.upsert({
            where: { id: "default" },
            update: { judgeAuthPin: pin },
            create: { id: "default", judgeAuthPin: pin },
          });
        } catch {}

        return session;
      }
    } catch (e) {
      console.warn("Prisma model query fallback to SQL:", e);
    }

    // Direct SQL fallback
    const id = `sess_${crypto.randomBytes(12).toString("hex")}`;
    await prisma.$executeRawUnsafe(
      `UPDATE "scanner_pin_sessions" SET "isActive" = false WHERE "isActive" = true`
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO "scanner_pin_sessions" (id, pin, "createdAt", "expiresAt", "maxDevices", "isActive", "createdBy")
       VALUES ($1, $2, $3, $4, 8, true, $5)`,
      id,
      pin,
      now,
      expiresAt,
      adminName
    );

    try {
      await prisma.systemSettings.upsert({
        where: { id: "default" },
        update: { judgeAuthPin: pin },
        create: { id: "default", judgeAuthPin: pin },
      });
    } catch {}

    return {
      id,
      pin,
      createdAt: now,
      expiresAt,
      maxDevices: 8,
      isActive: true,
      createdBy: adminName,
      devices: [],
    };
  },

  /**
   * Revoke active PIN
   */
  async revokePin() {
    try {
      if (prisma.scannerPinSession) {
        await prisma.scannerPinSession.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
        return;
      }
    } catch (e) {
      console.warn("Fallback to raw SQL revokePin");
    }

    await prisma.$executeRawUnsafe(
      `UPDATE "scanner_pin_sessions" SET "isActive" = false WHERE "isActive" = true`
    );
  },

  /**
   * Revoke single device
   */
  async revokeDevice(deviceId: string) {
    try {
      if (prisma.scannerDeviceLogin) {
        await prisma.scannerDeviceLogin.update({
          where: { id: deviceId },
          data: { isActive: false },
        });
        return;
      }
    } catch (e) {
      console.warn("Fallback to raw SQL revokeDevice");
    }

    await prisma.$executeRawUnsafe(
      `UPDATE "scanner_device_logins" SET "isActive" = false WHERE id = $1`,
      deviceId
    );
  },

  /**
   * Verify PIN for /teams
   */
  async authenticateVerifier(params: {
    pin: string;
    verifierName: string;
    deviceToken?: string;
    deviceInfo: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<
    | {
        success: true;
        verifierName: string;
        deviceToken: string;
        pinSessionId: string;
        expiresAt: string;
      }
    | { success: false; error: string; status: number }
  > {
    const trimmedPin = params.pin.trim();
    const cleanName = params.verifierName.trim();
    const now = new Date();

    // 1. Find active PIN session
    let pinSession: any = null;
    try {
      if (prisma.scannerPinSession) {
        pinSession = await prisma.scannerPinSession.findFirst({
          where: {
            pin: trimmedPin,
            isActive: true,
            expiresAt: { gt: now },
          },
          include: { devices: true },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch {}

    if (!pinSession) {
      try {
        const rows: any = await prisma.$queryRawUnsafe(
          `SELECT id, pin, "createdAt", "expiresAt", "maxDevices", "isActive"
           FROM "scanner_pin_sessions"
           WHERE pin = $1 AND "isActive" = true AND "expiresAt" > NOW()
           ORDER BY "createdAt" DESC
           LIMIT 1`,
          trimmedPin
        );
        if (rows && rows.length > 0) {
          const s = rows[0];
          const devRows: any = await prisma.$queryRawUnsafe(
            `SELECT id, "deviceToken", "isActive" FROM "scanner_device_logins" WHERE "pinSessionId" = $1`,
            s.id
          );
          pinSession = { ...s, devices: devRows || [] };
        }
      } catch {}
    }

    // Check fallback
    if (!pinSession) {
      const settings = await prisma.systemSettings.findUnique({
        where: { id: "default" },
      });

      if (settings?.judgeAuthPin && settings.judgeAuthPin === trimmedPin) {
        return {
          success: true,
          verifierName: cleanName,
          deviceToken: params.deviceToken || crypto.randomUUID(),
          pinSessionId: "fallback",
          expiresAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
        };
      }

      return {
        success: false,
        error: "Invalid or expired Authorization PIN (5-minute window). Request a fresh PIN from Admin.",
        status: 401,
      };
    }

    // Check device quota
    const activeDevices = (pinSession.devices || []).filter((d: any) => d.isActive);
    const existingDevice = params.deviceToken
      ? pinSession.devices?.find((d: any) => d.deviceToken === params.deviceToken)
      : null;

    let finalDeviceToken = params.deviceToken;

    if (existingDevice) {
      finalDeviceToken = existingDevice.deviceToken;
      try {
        if (prisma.scannerDeviceLogin) {
          await prisma.scannerDeviceLogin.update({
            where: { id: existingDevice.id },
            data: {
              verifierName: cleanName,
              deviceInfo: params.deviceInfo,
              ipAddress: params.ipAddress,
              userAgent: params.userAgent,
              lastActiveAt: now,
              isActive: true,
            },
          });
        } else {
          await prisma.$executeRawUnsafe(
            `UPDATE "scanner_device_logins"
             SET "verifierName" = $1, "deviceInfo" = $2, "ipAddress" = $3, "userAgent" = $4, "lastActiveAt" = $5, "isActive" = true
             WHERE id = $6`,
            cleanName,
            params.deviceInfo,
            params.ipAddress,
            params.userAgent,
            now,
            existingDevice.id
          );
        }
      } catch {}
    } else {
      const maxLimit = pinSession.maxDevices || 8;
      if (activeDevices.length >= maxLimit) {
        return {
          success: false,
          error: `Maximum device limit reached (${activeDevices.length}/${maxLimit} devices). Contact admin to revoke or issue a new PIN.`,
          status: 429,
        };
      }

      finalDeviceToken = crypto.randomUUID();
      const devId = `dev_${crypto.randomBytes(12).toString("hex")}`;
      try {
        if (prisma.scannerDeviceLogin) {
          await prisma.scannerDeviceLogin.create({
            data: {
              pinSessionId: pinSession.id,
              verifierName: cleanName,
              deviceToken: finalDeviceToken,
              ipAddress: params.ipAddress,
              userAgent: params.userAgent,
              deviceInfo: params.deviceInfo,
              lastActiveAt: now,
              isActive: true,
            },
          });
        } else {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "scanner_device_logins" (id, "pinSessionId", "verifierName", "deviceToken", "ipAddress", "userAgent", "deviceInfo", "lastActiveAt", "createdAt", "isActive")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)`,
            devId,
            pinSession.id,
            cleanName,
            finalDeviceToken,
            params.ipAddress,
            params.userAgent,
            params.deviceInfo,
            now,
            now
          );
        }
      } catch (e) {
        console.error("Error creating device login:", e);
      }
    }

    return {
      success: true,
      verifierName: cleanName,
      deviceToken: finalDeviceToken || crypto.randomUUID(),
      pinSessionId: pinSession.id,
      expiresAt: new Date(pinSession.expiresAt).toISOString(),
    };
  },
};
