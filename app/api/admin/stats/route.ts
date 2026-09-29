import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { getSquadProblemStatements } from "@/lib/adminProblemUtils";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const allRegistrations = await prisma.teamRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const totalSquads = allRegistrations.length;
    let totalParticipants = 0;
    let confirmedTeams = 0;
    let pendingTeams = 0;
    let rejectedTeams = 0;

    let accommodationRequested = 0;
    let accommodationAllocated = 0;

    let paymentVerified = 0;
    let paymentPending = 0;
    let paymentFreeTier = 0;

    const psDistribution: Record<string, number> = {};
    const psPrimaryDistribution: Record<string, number> = {};
    const psSecondaryDistribution: Record<string, number> = {};

    PROBLEM_STATEMENTS_DATA.forEach((p) => {
      psDistribution[p.id] = 0;
      psPrimaryDistribution[p.id] = 0;
      psSecondaryDistribution[p.id] = 0;
    });
    psDistribution["UNASSIGNED"] = 0;

    allRegistrations.forEach((r) => {
      // Don't count rejected or banned teams in competition allocation metrics if needed, or count all active
      // Members count (1 leader + members)
      const members = Array.isArray(r.members) ? r.members : [];
      totalParticipants += 1 + members.length;

      // Status
      if (r.status === "CONFIRMED") confirmedTeams++;
      else if (r.status === "PENDING_VERIFICATION") pendingTeams++;
      else if (r.status === "REJECTED" || r.status === "REJECTED_NAME_RULE") rejectedTeams++;

      // Accommodation
      if (r.accommodationRequired || r.accommodationStatus === "REQUESTED") accommodationRequested++;
      if (r.accommodationStatus === "ALLOCATED") accommodationAllocated++;

      // Payments
      if (r.paymentStatus === "VERIFIED") paymentVerified++;
      else if (r.paymentStatus === "PENDING") paymentPending++;
      else paymentFreeTier++;

      // Problem statements (Count all selections including secondary)
      const { primary, secondary, hasSelection } = getSquadProblemStatements(r);

      if (primary) {
        psDistribution[primary.id] = (psDistribution[primary.id] || 0) + 1;
        psPrimaryDistribution[primary.id] = (psPrimaryDistribution[primary.id] || 0) + 1;
      }
      if (secondary) {
        psDistribution[secondary.id] = (psDistribution[secondary.id] || 0) + 1;
        psSecondaryDistribution[secondary.id] = (psSecondaryDistribution[secondary.id] || 0) + 1;
      }
      if (!hasSelection) {
        psDistribution["UNASSIGNED"] = (psDistribution["UNASSIGNED"] || 0) + 1;
      }
    });

    const recentRegistrations = allRegistrations.slice(0, 5).map((r) => ({
      id: r.id,
      ticketId: r.registrationNumber,
      teamName: r.teamName,
      leaderName: r.leaderName,
      collegeName: r.collegeName,
      status: r.status,
      membersCount: 1 + (Array.isArray(r.members) ? r.members.length : 0),
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalSquads,
        totalParticipants,
        confirmedTeams,
        pendingTeams,
        rejectedTeams,
        accommodationRequested,
        accommodationAllocated,
        paymentVerified,
        paymentPending,
        paymentFreeTier,
        psDistribution,
        psPrimaryDistribution,
        psSecondaryDistribution,
      },
      recentRegistrations,
    });
  } catch (error: any) {
    console.error("Failed to compute stats:", error);
    return NextResponse.json({ error: error.message || "Failed to load stats" }, { status: 500 });
  }
}
