import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "User session not found." },
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email.toLowerCase().trim();

    // Find team registration matching userId OR leaderEmail OR any member email
    let teamRegistration = await prisma.teamRegistration.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { leaderEmail: { equals: userEmail, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    let userRoleInTeam: "LEADER" | "MEMBER" = "LEADER";
    let matchedMemberData: any = null;

    // If not found by leader email or userId, search across all registrations' members array
    if (!teamRegistration) {
      const allRegistrations = await prisma.teamRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });

      for (const reg of allRegistrations) {
        if (reg.leaderEmail && reg.leaderEmail.toLowerCase().trim() === userEmail) {
          teamRegistration = reg;
          userRoleInTeam = "LEADER";
          break;
        }

        const membersList = Array.isArray(reg.members) ? (reg.members as any[]) : [];
        const foundMember = membersList.find(
          (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
        );
        if (foundMember) {
          teamRegistration = reg;
          userRoleInTeam = "MEMBER";
          matchedMemberData = foundMember;
          break;
        }
      }
    } else {
      if (teamRegistration.leaderEmail.toLowerCase().trim() === userEmail) {
        userRoleInTeam = "LEADER";
      } else {
        const membersList = Array.isArray(teamRegistration.members) ? (teamRegistration.members as any[]) : [];
        const foundMember = membersList.find(
          (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
        );
        if (foundMember) {
          userRoleInTeam = "MEMBER";
          matchedMemberData = foundMember;
        }
      }
    }

    if (!teamRegistration) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        registered: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: (user as any).role || "user",
        },
        message: "No team registration found for this account.",
      });
    }

    const docs = (teamRegistration.documents as Record<string, any>) || {};
    const selectedProblemStatements =
      docs.selectedProblemStatements ||
      (teamRegistration.problemStatementId ? [teamRegistration.problemStatementId] : []);

    const editCount = typeof docs.editCount === "number" ? docs.editCount : 0;
    const maxEdits = 3;
    const remainingEdits = Math.max(0, maxEdits - editCount);
    const canEdit = userRoleInTeam === "LEADER" && remainingEdits > 0;

    return NextResponse.json({
      success: true,
      authenticated: true,
      registered: true,
      userRoleInTeam,
      matchedMember: matchedMemberData,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: (user as any).role || "user",
      },
      team: {
        id: teamRegistration.id,
        registrationNumber: teamRegistration.registrationNumber,
        teamName: teamRegistration.teamName,
        collegeName: teamRegistration.collegeName,
        collegeAddress: teamRegistration.collegeAddress,
        status: teamRegistration.status,
        leader: {
          name: teamRegistration.leaderName,
          email: teamRegistration.leaderEmail,
          phone: teamRegistration.leaderPhone,
          whatsapp: teamRegistration.leaderWhatsapp,
          branch: teamRegistration.leaderBranch,
          customBranch: teamRegistration.leaderCustomBranch,
          year: teamRegistration.leaderYear,
          role: teamRegistration.leaderRole,
          github: teamRegistration.leaderGithub,
        },
        members: teamRegistration.members,
        paymentStatus: teamRegistration.paymentStatus,
        paymentMode: teamRegistration.paymentMode,
        transactionId: teamRegistration.transactionId,
        accommodationRequired: teamRegistration.accommodationRequired,
        accommodationStatus: teamRegistration.accommodationStatus,
        problemStatementId: teamRegistration.problemStatementId,
        selectedProblemStatements,
        problemStatement1: docs.problemStatement1 || teamRegistration.problemStatementId || null,
        problemStatement2: docs.problemStatement2 || null,
        psSubmittedAt: docs.psSubmittedAt || null,
        editCount,
        maxEdits,
        remainingEdits,
        canEdit,
        lastEditedAt: docs.lastEditedAt || null,
        documents: docs,
        createdAt: teamRegistration.createdAt,
        updatedAt: teamRegistration.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching my team details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team details.", error: error.message },
      { status: 500 }
    );
  }
}
