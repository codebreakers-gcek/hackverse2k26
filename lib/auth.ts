import { betterAuth, APIError } from "better-auth";
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
    },
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userEmail = (user.email || "").toLowerCase().trim();
          if (!userEmail) {
            throw new APIError("FORBIDDEN", {
              message: "Sorry registration is close we will happy to se you in next year.",
            });
          }

          // Check if admin email
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          if (adminEmail && userEmail === adminEmail) {
            return { data: { ...user, role: "admin" } };
          }

          // Check if user is an existing admin
          const existingAdmin = await prisma.user.findFirst({
            where: {
              email: { equals: userEmail, mode: "insensitive" },
              role: "admin",
            },
          });
          if (existingAdmin) {
            return { data: user };
          }

          // Check if user's email is a leader of a registered team
          const teamAsLeader = await prisma.teamRegistration.findFirst({
            where: {
              leaderEmail: { equals: userEmail, mode: "insensitive" },
            },
          });
          if (teamAsLeader) {
            return { data: user };
          }

          // Check if user's email is a member of any registered team
          const allTeams = await prisma.teamRegistration.findMany({
            select: { members: true },
          });

          const isMember = allTeams.some((team) => {
            if (!Array.isArray(team.members)) return false;
            return (team.members as any[]).some(
              (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
            );
          });

          if (isMember) {
            return { data: user };
          }

          // If not registered as leader, member, or admin, reject registration/login
          throw new APIError("FORBIDDEN", {
            message: "Sorry registration is close we will happy to se you in next year.",
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

