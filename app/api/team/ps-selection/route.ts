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

    const body = await req.json().catch(() => ({}));
    const { selectedProblemStatements } = body || {};

    // 1. Validation: 1 problem statement is mandatory, 2nd is optional
    if (
      !Array.isArray(selectedProblemStatements) ||
      selectedProblemStatements.length < 1 ||
      selectedProblemStatements.length > 2
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select at least ONE (1) mandatory problem statement (and optionally a 2nd preference).",
        },
        { status: 400 }
      );
    }

    const ps1Raw = selectedProblemStatements[0];
    const ps2Raw = selectedProblemStatements.length === 2 ? selectedProblemStatements[1] : null;

    if (ps2Raw && ps1Raw === ps2Raw) {
      return NextResponse.json(
        { success: false, message: "Preference 1 and Preference 2 must be different problem statements." },
        { status: 400 }
      );
    }

    // 2. Validate and resolve that selected statements exist in the official dataset
    const resolvePs = (idOrCode: string) =>
      PROBLEM_STATEMENTS_DATA.find(
        (p) =>
          p.id.toLowerCase() === idOrCode.toLowerCase() ||
          p.code.toLowerCase() === idOrCode.toLowerCase()
      );

    const p1 = resolvePs(ps1Raw);
    const p2 = ps2Raw ? resolvePs(ps2Raw) : null;

    if (!p1 || (ps2Raw && !p2)) {
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

    // 4. Ban / Lock System: Check if squad preferences have already been finalized
    const currentDocs = (teamRegistration.documents as Record<string, any>) || {};
    if (
      currentDocs.isPsLocked === true ||
      (currentDocs.psSubmittedAt && currentDocs.selectedProblemStatements?.length > 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          message:
            "Problem statement preferences are already locked and confirmed for this squad. Further modifications are prohibited.",
        },
        { status: 403 }
      );
    }

    // 5. Update the team registration with the 1 or 2 choices and permanently lock
    const finalSelectedList = [p1.id, ...(p2 ? [p2.id] : [])];
    const updatedDocuments = {
      ...currentDocs,
      selectedProblemStatements: finalSelectedList,
      problemStatement1: p1.id,
      problemStatement2: p2 ? p2.id : null,
      problemStatement1Code: p1.code,
      problemStatement2Code: p2 ? p2.code : null,
      isPsLocked: true,
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
        problemStatementId: p1.id, // Primary PS ID
        documents: updatedDocuments,
      },
    });

    return NextResponse.json({
      success: true,
      message: p2
        ? "Primary and secondary problem statements successfully submitted and locked for your squad!"
        : "Primary problem statement successfully submitted and locked for your squad!",
      team: {
        id: updatedTeam.id,
        registrationNumber: updatedTeam.registrationNumber,
        teamName: updatedTeam.teamName,
        problemStatementId: updatedTeam.problemStatementId,
        selectedProblemStatements: finalSelectedList,
        problemStatement1: p1.id,
        problemStatement2: p2 ? p2.id : null,
        problemStatement1Code: p1.code,
        problemStatement2Code: p2 ? p2.code : null,
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
