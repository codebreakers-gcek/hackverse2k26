import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MAX_EDITS_ALLOWED = 3; //max edit allowed to team or user

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to edit team details." },
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email.toLowerCase().trim();

    // 1. Locate the team registration for this user
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
      // Check if user is a member only (not leader)
      const allRegistrations = await prisma.teamRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });

      for (const reg of allRegistrations) {
        if (reg.leaderEmail && reg.leaderEmail.toLowerCase().trim() === userEmail) {
          teamRegistration = reg;
          break;
        }
        const membersList = Array.isArray(reg.members) ? (reg.members as any[]) : [];
        const isMember = membersList.some(
          (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
        );
        if (isMember) {
          return NextResponse.json(
            {
              success: false,
              message: "Permission Denied. Only the designated Team Leader / Squad Captain can edit squad details.",
            },
            { status: 403 }
          );
        }
      }
    }

    if (!teamRegistration) {
      return NextResponse.json(
        { success: false, message: "No registered squad found associated with your account." },
        { status: 404 }
      );
    }

    // Double check that the caller is indeed the team leader
    const isLeader =
      (teamRegistration.userId && teamRegistration.userId === user.id) ||
      (teamRegistration.leaderEmail && teamRegistration.leaderEmail.toLowerCase().trim() === userEmail);

    if (!isLeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission Denied. Only the Team Leader is authorized to edit team details.",
        },
        { status: 403 }
      );
    }

    // 2. Check current edit quota
    const currentDocs = (teamRegistration.documents as Record<string, any>) || {};
    const currentEditCount = typeof currentDocs.editCount === "number" ? currentDocs.editCount : 0;

    if (currentEditCount >= MAX_EDITS_ALLOWED) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum edit quota reached! Team details can only be edited a maximum of ${MAX_EDITS_ALLOWED} times. Please contact HACKVERSE '26 organizers if you require urgent corrections.`,
          editCount: currentEditCount,
          remainingEdits: 0,
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate payload
    const body = await req.json();
    const {
      teamName,
      collegeName,
      collegeAddress,
      leader,
      members,
      accommodationRequired,
    } = body;

    // Team name validation
    if (!teamName || typeof teamName !== "string" || teamName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Team name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    // College name validation
    if (!collegeName || typeof collegeName !== "string" || collegeName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "College / University name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    // Leader contact validation
    if (!leader || typeof leader !== "object") {
      return NextResponse.json(
        { success: false, message: "Leader details are missing or malformed." },
        { status: 400 }
      );
    }

    const cleanLeaderPhone = (leader.phone || "").replace(/\D/g, "");
    if (cleanLeaderPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: "Leader phone number must be a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Members validation (Total squad size: 1 Leader + 1-3 Members = 2 to 4 members)
    if (!Array.isArray(members) || members.length < 1 || members.length > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Squad must have between 1 and 3 co-hackers (total squad size 2 to 4 including leader).",
        },
        { status: 400 }
      );
    }

    // Email deduplication and validation
    const seenEmails = new Set<string>();
    seenEmails.add(teamRegistration.leaderEmail.toLowerCase().trim());

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m || !m.fullName || m.fullName.trim().length < 2) {
        return NextResponse.json(
          { success: false, message: `Member #${i + 2} must have a valid full name.` },
          { status: 400 }
        );
      }
      if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
        return NextResponse.json(
          { success: false, message: `Member #${i + 2} has an invalid email address.` },
          { status: 400 }
        );
      }
      const memberEmailNormalized = m.email.toLowerCase().trim();
      if (seenEmails.has(memberEmailNormalized)) {
        return NextResponse.json(
          {
            success: false,
            message: `Duplicate email detected: "${m.email}". Each squad member must have a unique email address.`,
          },
          { status: 400 }
        );
      }
      seenEmails.add(memberEmailNormalized);

      const memberPhoneClean = (m.phone || "").replace(/\D/g, "");
      if (memberPhoneClean.length < 10) {
        return NextResponse.json(
          { success: false, message: `Member #${i + 2} must have a valid 10-digit phone number.` },
          { status: 400 }
        );
      }
    }

    // 4. Update data and increment edit quota
    const newEditCount = currentEditCount + 1;
    const remainingEdits = Math.max(0, MAX_EDITS_ALLOWED - newEditCount);
    const nowIso = new Date().toISOString();

    const editHistory = Array.isArray(currentDocs.editHistory) ? [...currentDocs.editHistory] : [];
    editHistory.push({
      editNumber: newEditCount,
      editedAt: nowIso,
      editedBy: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });

    const updatedDocuments: Record<string, any> = {
      ...currentDocs,
      editCount: newEditCount,
      lastEditedAt: nowIso,
      editHistory,
    };

    const sanitizedMembers = members.map((m: any) => ({
      fullName: m.fullName.trim(),
      email: m.email.toLowerCase().trim(),
      phone: m.phone.trim(),
      whatsappNumber: m.whatsappNumber ? m.whatsappNumber.trim() : m.phone.trim(),
      sameAsPhone: Boolean(m.sameAsPhone),
      dateOfBirth: m.dateOfBirth || null,
      branch: m.branch || "Computer Science & Engineering",
      customBranch: m.customBranch ? m.customBranch.trim() : null,
      yearOfStudy: m.yearOfStudy || "3rd Year",
      role: m.role && m.role !== "Leader" ? m.role : "Frontend",
      githubUsername: m.githubUsername ? m.githubUsername.trim() : null,
      rollNumber: m.rollNumber ? m.rollNumber.trim() : null,
    }));

    const updatedTeam = await prisma.teamRegistration.update({
      where: { id: teamRegistration.id },
      data: {
        teamName: teamName.trim(),
        collegeName: collegeName.trim(),
        collegeAddress: collegeAddress || teamRegistration.collegeAddress,
        leaderPhone: leader.phone.trim(),
        leaderWhatsapp: leader.whatsapp ? leader.whatsapp.trim() : leader.phone.trim(),
        leaderBranch: leader.branch || teamRegistration.leaderBranch,
        leaderCustomBranch: leader.customBranch ? leader.customBranch.trim() : null,
        leaderYear: leader.year || teamRegistration.leaderYear,
        leaderRole: leader.role || teamRegistration.leaderRole,
        leaderGithub: leader.github ? leader.github.trim() : null,
        leaderDob: leader.dateOfBirth || teamRegistration.leaderDob,
        members: sanitizedMembers,
        accommodationRequired: Boolean(accommodationRequired),
        accommodationStatus: Boolean(accommodationRequired)
          ? teamRegistration.accommodationStatus === "ALLOCATED"
            ? "ALLOCATED"
            : "REQUESTED"
          : "NOT_REQUESTED",
        documents: updatedDocuments,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Squad profile details updated successfully! (${newEditCount}/${MAX_EDITS_ALLOWED} edits used. ${remainingEdits} edit${remainingEdits === 1 ? "" : "s"} remaining.)`,
      editCount: newEditCount,
      maxEdits: MAX_EDITS_ALLOWED,
      remainingEdits,
      team: {
        id: updatedTeam.id,
        registrationNumber: updatedTeam.registrationNumber,
        teamName: updatedTeam.teamName,
        collegeName: updatedTeam.collegeName,
        collegeAddress: updatedTeam.collegeAddress,
        status: updatedTeam.status,
        leader: {
          name: updatedTeam.leaderName,
          email: updatedTeam.leaderEmail,
          phone: updatedTeam.leaderPhone,
          whatsapp: updatedTeam.leaderWhatsapp,
          branch: updatedTeam.leaderBranch,
          customBranch: updatedTeam.leaderCustomBranch,
          year: updatedTeam.leaderYear,
          role: updatedTeam.leaderRole,
          github: updatedTeam.leaderGithub,
        },
        members: updatedTeam.members,
        paymentStatus: updatedTeam.paymentStatus,
        paymentMode: updatedTeam.paymentMode,
        transactionId: updatedTeam.transactionId,
        accommodationRequired: updatedTeam.accommodationRequired,
        accommodationStatus: updatedTeam.accommodationStatus,
        problemStatementId: updatedTeam.problemStatementId,
        selectedProblemStatements: updatedDocuments.selectedProblemStatements || [],
        problemStatement1: updatedDocuments.problemStatement1 || updatedTeam.problemStatementId || null,
        problemStatement2: updatedDocuments.problemStatement2 || null,
        editCount: newEditCount,
        maxEdits: MAX_EDITS_ALLOWED,
        remainingEdits,
        canEdit: remainingEdits > 0,
        lastEditedAt: nowIso,
        createdAt: updatedTeam.createdAt,
        updatedAt: updatedTeam.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating team details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update squad details. Please check form inputs and try again.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
