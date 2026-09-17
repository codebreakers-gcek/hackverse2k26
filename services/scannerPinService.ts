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

// Global In-Memory Store for Scanner PIN Sessions (5-min life)
const globalStore = globalThis as unknown as {
  __scannerSessions?: {
    current: {
      id: string;
      pin: string;
      createdAt: Date;
      expiresAt: Date;
      maxDevices: number;
      isActive: boolean;
      createdBy: string;
      devices: Array<{
        id: string;
        pinSessionId: string;
        verifierName: string;
        deviceToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        deviceInfo: string | null;
        lastActiveAt: Date;
        createdAt: Date;
        isActive: boolean;
      }>;
    } | null;
    history: any[];
  };
};

if (!globalStore.__scannerSessions) {
  globalStore.__scannerSessions = {
    current: null,
    history: [],
  };
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
    const store = globalStore.__scannerSessions!;
    const now = new Date();

    if (!store.current || !store.current.isActive || store.current.expiresAt <= now) {
      if (store.current && store.current.expiresAt <= now) {
        store.current.isActive = false;
      }
      return {
        active: false,
        session: null,
        remainingSeconds: 0,
        recentSessions: store.history.slice(0, 5),
      };
    }

    const session = store.current;
    const remainingSeconds = Math.max(
      0,
      Math.floor((session.expiresAt.getTime() - now.getTime()) / 1000)
    );

    const activeDevices = session.devices.filter((d) => d.isActive);

    return {
      active: true,
      session: {
        id: session.id,
        pin: session.pin,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        maxDevices: session.maxDevices,
        isActive: session.isActive,
        createdBy: session.createdBy,
        activeDeviceCount: activeDevices.length,
        devices: session.devices.map((d) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
          lastActiveAt: d.lastActiveAt.toISOString(),
        })),
      },
      remainingSeconds,
      recentSessions: store.history.slice(0, 5),
    };
  },

  /**
   * Generate a fresh 5-minute PIN session
   */
  async generatePin(adminName: string = "Admin") {
    const store = globalStore.__scannerSessions!;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    if (store.current) {
      store.current.isActive = false;
      store.history.unshift({
        id: store.current.id,
        pin: store.current.pin,
        createdAt: store.current.createdAt.toISOString(),
        expiresAt: store.current.expiresAt.toISOString(),
        devices: store.current.devices,
      });
    }

    const newSession = {
      id: `sess_${crypto.randomBytes(8).toString("hex")}`,
      pin,
      createdAt: now,
      expiresAt,
      maxDevices: 8,
      isActive: true,
      createdBy: adminName,
      devices: [],
    };

    store.current = newSession;

    return {
      id: newSession.id,
      pin: newSession.pin,
      createdAt: newSession.createdAt.toISOString(),
      expiresAt: newSession.expiresAt.toISOString(),
      maxDevices: newSession.maxDevices,
      isActive: newSession.isActive,
      createdBy: newSession.createdBy,
      devices: [],
    };
  },

  /**
   * Revoke active PIN
   */
  async revokePin() {
    const store = globalStore.__scannerSessions!;
    if (store.current) {
      store.current.isActive = false;
      store.history.unshift({
        id: store.current.id,
        pin: store.current.pin,
        createdAt: store.current.createdAt.toISOString(),
        expiresAt: store.current.expiresAt.toISOString(),
        devices: store.current.devices,
      });
      store.current = null;
    }
  },

  /**
   * Revoke single device
   */
  async revokeDevice(deviceId: string) {
    const store = globalStore.__scannerSessions!;
    if (store.current) {
      const dev = store.current.devices.find((d) => d.id === deviceId);
      if (dev) {
        dev.isActive = false;
      }
    }
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
    const store = globalStore.__scannerSessions!;

    // 1. Fallback master pin: "2026"
    if (trimmedPin === "2026") {
      return {
        success: true,
        verifierName: cleanName,
        deviceToken: params.deviceToken || crypto.randomUUID(),
        pinSessionId: "master_pin",
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      };
    }

    // 2. Check active generated PIN session
    const session = store.current;
    if (!session || !session.isActive || session.expiresAt <= now || session.pin !== trimmedPin) {
      return {
        success: false,
        error: "Invalid or expired Authorization PIN (5-minute window). Request a fresh PIN from Admin.",
        status: 401,
      };
    }

    // Check device quota
    const activeDevices = session.devices.filter((d) => d.isActive);
    let existingDevice = params.deviceToken
      ? session.devices.find((d) => d.deviceToken === params.deviceToken)
      : null;

    let finalDeviceToken = params.deviceToken;

    if (existingDevice) {
      existingDevice.verifierName = cleanName;
      existingDevice.deviceInfo = params.deviceInfo;
      existingDevice.ipAddress = params.ipAddress;
      existingDevice.userAgent = params.userAgent;
      existingDevice.lastActiveAt = now;
      existingDevice.isActive = true;
      finalDeviceToken = existingDevice.deviceToken;
    } else {
      const maxLimit = session.maxDevices || 8;
      if (activeDevices.length >= maxLimit) {
        return {
          success: false,
          error: `Maximum device limit reached (${activeDevices.length}/${maxLimit} devices). Contact admin to issue a new PIN.`,
          status: 429,
        };
      }

      finalDeviceToken = crypto.randomUUID();
      const devId = `dev_${crypto.randomBytes(8).toString("hex")}`;
      session.devices.push({
        id: devId,
        pinSessionId: session.id,
        verifierName: cleanName,
        deviceToken: finalDeviceToken,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        deviceInfo: params.deviceInfo,
        lastActiveAt: now,
        createdAt: now,
        isActive: true,
      });
    }

    return {
      success: true,
      verifierName: cleanName,
      deviceToken: finalDeviceToken || crypto.randomUUID(),
      pinSessionId: session.id,
      expiresAt: session.expiresAt.toISOString(),
    };
  },
};
