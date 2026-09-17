import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { scannerPinService } from "@/services/scannerPinService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, pin, verifierName } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Registration Ticket Identifier is required." },
        { status: 400 }
      );
    }

    if (!verifierName || typeof verifierName !== "string" || verifierName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (Judge / Verifier)." },
        { status: 400 }
      );
    }

    if (!pin || typeof pin !== "string" || pin.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Authorization PIN is required to unlock squad details." },
        { status: 400 }
      );
    }

    // 1. Check Authorization PIN
    const authResult = await scannerPinService.authenticateVerifier({
      pin: pin.trim(),
      verifierName: verifierName.trim(),
      deviceInfo: "Scanner Web Interface",
      ipAddress: "127.0.0.1",
      userAgent: "Browser/Judge",
    });

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: (authResult as any).error || "Invalid or expired Authorization PIN.",
        },
        { status: 401 }
      );
    }

    // 2. Query team registration by ticket number or database ID
    const normalizedId = id.trim();
    const withPrefix = normalizedId.toUpperCase().startsWith("HV26-")
      ? normalizedId.toUpperCase()
      : `HV26-${normalizedId}`;

    const squad = await prisma.teamRegistration.findFirst({
      where: {
        OR: [
          { registrationNumber: { equals: normalizedId, mode: "insensitive" } },
          { registrationNumber: { equals: withPrefix, mode: "insensitive" } },
          { id: normalizedId },
        ],
      },
    });

    if (!squad) {
      return NextResponse.json(
        {
          success: false,
          error: `No squad found matching ticket identifier "${normalizedId}". Please verify the pass.`,
        },
        { status: 404 }
      );
    }

    // 3. Match Problem Statement
    let psInfo = null;
    if (squad.problemStatementId) {
      const foundPs = PROBLEM_STATEMENTS_DATA.find(
        (p) => p.id === squad.problemStatementId
      );
      if (foundPs) {
        psInfo = {
          id: foundPs.id,
          title: foundPs.title,
          category: foundPs.category,
          domain: foundPs.domain,
          brief: foundPs.shortDescription,
        };
      } else {
        psInfo = {
          id: squad.problemStatementId,
          title: `Problem Statement ${squad.problemStatementId}`,
          category: "General Track",
          domain: "Open Innovation",
        };
      }
    }

    // 4. Construct comprehensive authorized team payload
    const teamData = {
      id: squad.id,
      registrationNumber: squad.registrationNumber,
      teamName: squad.teamName,
      status: squad.status,
      createdAt: squad.createdAt,
      collegeName: squad.collegeName,
      collegeAddress: squad.collegeAddress || null,
      problemStatementId: squad.problemStatementId,
      problemStatement: psInfo,
      leader: {
        fullName: squad.leaderName,
        email: squad.leaderEmail,
        phone: squad.leaderPhone,
        whatsapp: squad.leaderWhatsapp || squad.leaderPhone,
        branch: squad.leaderBranch,
        customBranch: squad.leaderCustomBranch || null,
        yearOfStudy: squad.leaderYear,
        role: squad.leaderRole || "Team Leader",
        githubUsername: squad.leaderGithub || null,
        dateOfBirth: squad.leaderDob || null,
      },
      members: Array.isArray(squad.members) ? squad.members : [],
      payment: {
        paymentMode: squad.paymentMode || "FREE_SPONSORED",
        transactionId: squad.transactionId || null,
        paymentStatus: squad.paymentStatus || "FREE_TIER",
        amount: squad.amount || 0,
      },
      accommodation: {
        required: Boolean(squad.accommodationRequired),
        status: squad.accommodationStatus || "NOT_REQUESTED",
        roomNumber: squad.roomNumber || null,
        hostelBlock: squad.hostelBlock || null,
      },
      documents: squad.documents || null,
      verifiedBy: verifierName.trim(),
      verifiedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      team: teamData,
    });
  } catch (error: any) {
    console.error("Team verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while verifying squad details." },
      { status: 500 }
    );
  }
}
