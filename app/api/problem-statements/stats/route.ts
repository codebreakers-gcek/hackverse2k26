/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const allRegistrations = await prisma.teamRegistration.findMany({
      select: {
        id: true,
        teamName: true,
        registrationNumber: true,
        status: true,
        problemStatementId: true,
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const stats: Record<
      string,
      {
        count: number;
        primaryCount: number;
        secondaryCount: number;
        teams: Array<{ name: string; regNo: string; status: string; isPrimary: boolean }>;
      }
    > = {};

    // Initialize map with all known problem statements
    PROBLEM_STATEMENTS_DATA.forEach((p) => {
      stats[p.id] = {
        count: 0,
        primaryCount: 0,
        secondaryCount: 0,
        teams: [],
      };
      // Also map by code
      stats[p.code.toUpperCase()] = stats[p.id];
    });

    let totalSelections = 0;

    allRegistrations.forEach((r) => {
      // Don't count rejected teams towards live competition selections
      if (r.status === "REJECTED" || r.status === "REJECTED_NAME_RULE" || r.status === "BANNED") {
        return;
      }

      const docs = (r.documents as any) || {};
      const ps1 =
        r.problemStatementId ||
        docs.problemStatement1 ||
        (Array.isArray(docs.selectedProblemStatements) ? docs.selectedProblemStatements[0] : null);
      const ps2 =
        docs.problemStatement2 ||
        (Array.isArray(docs.selectedProblemStatements) && docs.selectedProblemStatements.length > 1
          ? docs.selectedProblemStatements[1]
          : null);

      if (ps1) {
        const p1Key = String(ps1).trim();
        const resolved =
          PROBLEM_STATEMENTS_DATA.find(
            (p) =>
              p.id.toLowerCase() === p1Key.toLowerCase() ||
              p.code.toLowerCase() === p1Key.toLowerCase()
          )?.id || p1Key;

        if (!stats[resolved]) {
          stats[resolved] = { count: 0, primaryCount: 0, secondaryCount: 0, teams: [] };
          stats[p1Key.toUpperCase()] = stats[resolved];
        }

        stats[resolved].count++;
        stats[resolved].primaryCount++;
        stats[resolved].teams.push({
          name: r.teamName,
          regNo: r.registrationNumber,
          status: r.status,
          isPrimary: true,
        });
        totalSelections++;
      }

      if (ps2) {
        const p2Key = String(ps2).trim();
        const resolved =
          PROBLEM_STATEMENTS_DATA.find(
            (p) =>
              p.id.toLowerCase() === p2Key.toLowerCase() ||
              p.code.toLowerCase() === p2Key.toLowerCase()
          )?.id || p2Key;

        if (!stats[resolved]) {
          stats[resolved] = { count: 0, primaryCount: 0, secondaryCount: 0, teams: [] };
          stats[p2Key.toUpperCase()] = stats[resolved];
        }

        stats[resolved].count++;
        stats[resolved].secondaryCount++;
        stats[resolved].teams.push({
          name: r.teamName,
          regNo: r.registrationNumber,
          status: r.status,
          isPrimary: false,
        });
        totalSelections++;
      }
    });

    // Extract cleanly keyed by ID
    const formattedStats: Record<
      string,
      {
        count: number;
        primaryCount: number;
        secondaryCount: number;
      }
    > = {};

    PROBLEM_STATEMENTS_DATA.forEach((p) => {
      const data = stats[p.id] || { count: 0, primaryCount: 0, secondaryCount: 0 };
      formattedStats[p.id] = {
        count: data.count,
        primaryCount: data.primaryCount,
        secondaryCount: data.secondaryCount,
      };
      formattedStats[p.code] = formattedStats[p.id];
    });

    return NextResponse.json(
      {
        success: true,
        stats: formattedStats,
        totalSquads: allRegistrations.length,
        totalSelections,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching problem statement stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch stats",
        stats: {},
      },
      { status: 500 }
    );
  }
}
