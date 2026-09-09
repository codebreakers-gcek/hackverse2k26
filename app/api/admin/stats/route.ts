import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";

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

    allRegistrations.forEach((r) => {
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

      // Problem statements
      const ps = r.problemStatementId || "UNASSIGNED";
      psDistribution[ps] = (psDistribution[ps] || 0) + 1;
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
      },
      recentRegistrations,
    });
  } catch (error: any) {
    console.error("Failed to compute stats:", error);
    return NextResponse.json({ error: error.message || "Failed to load stats" }, { status: 500 });
  }
}
