import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "hackverse-2026-super-secret-auth-key-change-in-production-12345",
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(
        (process.env.AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID) &&
        (process.env.AUTH_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET)
      ),
    },
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
      enabled: Boolean(
        (process.env.AUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID) &&
        (process.env.AUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET)
      ),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

