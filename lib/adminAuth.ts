import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// List of configured admin emails (from env or defaults)
const DEFAULT_ADMIN_EMAILS = [
  "contact.gyanranjan@gmail.com",
  "gyanranjan.gcek@gmail.com",
  "admin@codebreakers.tech",
  "admin@gcek.ac.in",
];

export async function verifyAdminSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    const user = session.user as any;
    const userEmail = (user.email || "").toLowerCase().trim();

    // Check environment admin email list
    const envAdminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
      .toLowerCase()
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const allowedEmails = [...DEFAULT_ADMIN_EMAILS, ...envAdminEmails];

    const isEmailAdmin = allowedEmails.includes(userEmail);
    const hasAdminRole = user.role === "admin";

    // In development or if email is in allowed list, auto-grant admin role
    if (isEmailAdmin || hasAdminRole || process.env.NODE_ENV !== "production") {
      // Auto-promote in database if not already marked as admin
      if (user.role !== "admin" && user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" as any },
          });
        } catch {
          // ignore if user table doesn't have role field or updated
        }
      }
      return {
        ...user,
        role: "admin",
      };
    }

    return null;
  } catch (error) {
    console.error("Admin verification error:", error);
    return null;
  }
}
