import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to submit your problem statement choices." },
        { status: 401 }
      );
    }

    // Check system settings for problem statements gate
    const settings = await prisma.systemSettings.findFirst();
    if (settings && settings.isProblemStatementsPublished === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Problem statement selection is currently locked. Problem statements have not yet been published by the organizers.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { selectedProblemStatements } = body;

    // 1. Validation: Exactly 2 problem statements must be selected
    if (!Array.isArray(selectedProblemStatements) || selectedProblemStatements.length !== 2) {
      return NextResponse.json(
        {
          success: false,
          message: "You must select exactly TWO (2) problem statements (Preference 1 & Preference 2).",
        },
        { status: 400 }
      );
    }

    const [ps1, ps2] = selectedProblemStatements;
    if (ps1 === ps2) {
      return NextResponse.json(
        { success: false, message: "Preference 1 and Preference 2 must be different problem statements." },
        { status: 400 }
      );
    }

    // 2. Validate that both statements exist in the official dataset
    const validPsIds = new Set(PROBLEM_STATEMENTS_DATA.map((p) => p.id));
    if (!validPsIds.has(ps1) || !validPsIds.has(ps2)) {
      return NextResponse.json(
        { success: false, message: "One or more selected problem statements are invalid." },
        { status: 400 }
      );
    }

    const user = session.user;
    const userEmail = user.email.toLowerCase().trim();

    // 3. Find the team registration matching userId OR leaderEmail OR any member email
    let teamRegistration = await prisma.teamRegistration.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { leaderEmail: { equals: userEmail, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!teamRegistration) {
      const allRegistrations = await prisma.teamRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });

      for (const reg of allRegistrations) {
        if (reg.leaderEmail && reg.leaderEmail.toLowerCase().trim() === userEmail) {
          teamRegistration = reg;
          break;
        }

        const membersList = Array.isArray(reg.members) ? (reg.members as any[]) : [];
        const foundMember = membersList.find(
          (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
        );
        if (foundMember) {
          teamRegistration = reg;
          break;
        }
      }
    }

    if (!teamRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: "No registered team found for your account. Please complete squad registration first.",
        },
        { status: 404 }
      );
    }

    // 4. Update the team registration with the 2 choices
    const currentDocs = (teamRegistration.documents as Record<string, any>) || {};
    const updatedDocuments = {
      ...currentDocs,
      selectedProblemStatements: [ps1, ps2],
      problemStatement1: ps1,
      problemStatement2: ps2,
      psSubmittedAt: new Date().toISOString(),
      psSubmittedBy: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    };

    const updatedTeam = await prisma.teamRegistration.update({
      where: { id: teamRegistration.id },
      data: {
        problemStatementId: ps1, // Set primary preference
        documents: updatedDocuments,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Problem statements successfully submitted and locked for your squad!",
      team: {
        id: updatedTeam.id,
        registrationNumber: updatedTeam.registrationNumber,
        teamName: updatedTeam.teamName,
        problemStatementId: updatedTeam.problemStatementId,
        selectedProblemStatements: [ps1, ps2],
        problemStatement1: ps1,
        problemStatement2: ps2,
        psSubmittedAt: updatedDocuments.psSubmittedAt,
      },
    });
  } catch (error: any) {
    console.error("Error saving problem statements:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save problem statement choices.", error: error.message },
      { status: 500 }
    );
  }
}
