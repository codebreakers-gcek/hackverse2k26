import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRegistrationForm } from "@/services/registrationService";
import { RegistrationFormData } from "@/types/registration";
import { sendRegistrationSubmissionEmail } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MAX_EDITS_ALLOWED = 3;

export async function POST(req: NextRequest) {
  try {
    const data: RegistrationFormData = await req.json();

    // 1. Check Registration Open Gate
    const settings = await prisma.systemSettings.findUnique({ where: { id: "default" } });
    if (settings && !settings.isRegistrationOpen) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration is currently closed by the organizers. Please check back later.",
        },
        { status: 403 }
      );
    }

    // 2. Validate Form Data
    const validationErrors = validateRegistrationForm(data);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Form validation failed. Please check input errors.",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // 3. Get Authenticated Session if available
    let sessionUser: { id: string; email: string; name?: string } | null = null;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user) {
        sessionUser = {
          id: session.user.id,
          email: session.user.email.toLowerCase().trim(),
          name: session.user.name,
        };
      }
    } catch {
      // Unauthenticated submissions permitted if public, but session is preferred
    }

    const leaderEmailNormalized = data.teamLeader.email.trim().toLowerCase();

    // 4. Check if a team registration already exists for this leader / user account
    let existingRegistration = await prisma.teamRegistration.findFirst({
      where: {
        OR: [
          ...(sessionUser ? [{ userId: sessionUser.id }] : []),
          { leaderEmail: { equals: leaderEmailNormalized, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!existingRegistration) {
      // Also check if leader email exists anywhere across registrations
      const allRegs = await prisma.teamRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });
      for (const reg of allRegs) {
        if (reg.leaderEmail && reg.leaderEmail.toLowerCase().trim() === leaderEmailNormalized) {
          existingRegistration = reg;
          break;
        }
      }
    }

    // Determine actual fee amount from admin system settings
    const paymentMode = data.paymentDetails?.paymentMode || "UPI_QR";
    const feeAmount = Number(settings?.registrationFee ?? (data.paymentDetails as any)?.amount ?? 0);

    // =========================================================================
    // CASE A: EXISTING REGISTRATION FOUND -> UPDATE IN-PLACE (SINGLE RESPONSE ID)
    // =========================================================================
    if (existingRegistration) {
      // Check Leader Authorization
      if (sessionUser) {
        const isLeader =
          (existingRegistration.userId && existingRegistration.userId === sessionUser.id) ||
          (existingRegistration.leaderEmail &&
            existingRegistration.leaderEmail.toLowerCase().trim() === sessionUser.email);

        if (!isLeader) {
          return NextResponse.json(
            {
              success: false,
              message: "Permission Denied. Only the designated Team Leader can edit squad details.",
            },
            { status: 403 }
          );
        }
      }

      // Enforce 3-Edit Quota
      const currentDocs = (existingRegistration.documents as Record<string, any>) || {};
      const currentEditCount =
        typeof currentDocs.editCount === "number"
          ? currentDocs.editCount
          : typeof (existingRegistration as any).editCount === "number"
          ? (existingRegistration as any).editCount
          : 0;

      if (currentEditCount >= MAX_EDITS_ALLOWED) {
        return NextResponse.json(
          {
            success: false,
            message: `Maximum edit quota reached (${MAX_EDITS_ALLOWED}/${MAX_EDITS_ALLOWED} edits used). Team details cannot be modified further.`,
            editCount: currentEditCount,
            remainingEdits: 0,
          },
          { status: 403 }
        );
      }

      const newEditCount = currentEditCount + 1;
      const remainingEdits = Math.max(0, MAX_EDITS_ALLOWED - newEditCount);
      const nowIso = new Date().toISOString();

      const updatedDocs = {
        ...currentDocs,
        ...(data.documentUploads || {}),
        editCount: newEditCount,
        lastEditedAt: nowIso,
        lastEditedBy: sessionUser || {
          email: leaderEmailNormalized,
          name: data.teamLeader.fullName,
        },
      };

      const updated = await prisma.teamRegistration.update({
        where: { id: existingRegistration.id },
        data: {
          teamName: data.teamName.trim(),
          collegeName: data.collegeName.trim(),
          collegeAddress: data.collegeAddress as any,
          problemStatementId: data.selectedProblemStatementId || existingRegistration.problemStatementId,

          // Leader details
          leaderName: data.teamLeader.fullName.trim(),
          leaderEmail: leaderEmailNormalized,
          leaderPhone: data.teamLeader.phone.trim(),
          leaderWhatsapp: data.teamLeader.whatsappNumber?.trim() || data.teamLeader.phone.trim(),
          leaderDob: data.teamLeader.dateOfBirth || null,
          leaderBranch: data.teamLeader.branch || "Computer Science & Engineering",
          leaderCustomBranch: data.teamLeader.customBranch?.trim() || null,
          leaderYear: data.teamLeader.yearOfStudy || "3rd Year",
          leaderRole: data.teamLeader.role || "Leader",
          leaderGithub: data.teamLeader.githubUsername?.trim() || null,

          // Members JSON
          members: data.members as any,

          // Payment Details (maintain or update if provided)
          paymentMode: paymentMode,
          transactionId: data.paymentDetails?.transactionId || existingRegistration.transactionId,
          paymentStatus: existingRegistration.paymentStatus || "PENDING",
          amount: feeAmount,

          // Accommodation
          accommodationRequired: Boolean(data.accommodationRequired || (data as any).accommodationRequested),
          accommodationStatus: Boolean(data.accommodationRequired || (data as any).accommodationRequested)
            ? existingRegistration.accommodationStatus === "ALLOCATED"
              ? "ALLOCATED"
              : "REQUESTED"
            : "NOT_REQUESTED",

          // Documents & Edit tracking
          documents: updatedDocs,
          ...(sessionUser?.id && !existingRegistration.userId ? { userId: sessionUser.id } : {}),
        },
      });

      return NextResponse.json(
        {
          success: true,
          registrationId: updated.id,
          ticketId: updated.registrationNumber,
          teamName: updated.teamName,
          editCount: newEditCount,
          maxEdits: MAX_EDITS_ALLOWED,
          remainingEdits,
          submittedAt: updated.updatedAt.toISOString(),
          message: `Squad details updated successfully under pass #${updated.registrationNumber}! (${newEditCount}/${MAX_EDITS_ALLOWED} edits used).`,
        },
        { status: 200 }
      );
    }

    // =========================================================================
    // CASE B: NEW SQUAD REGISTRATION (CREATE SINGLE UNIQUE RECORD)
    // =========================================================================
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const registrationNumber = `HV26-${randomSuffix}`;

    const initialDocs = {
      ...(data.documentUploads || {}),
      editCount: 0,
      initialSubmittedAt: new Date().toISOString(),
    };

    const newRegistration = await prisma.teamRegistration.create({
      data: {
        registrationNumber,
        userId: sessionUser?.id || null,
        teamName: data.teamName.trim(),
        collegeName: data.collegeName.trim(),
        collegeAddress: data.collegeAddress as any,
        problemStatementId: data.selectedProblemStatementId || null,
        status: "PENDING_VERIFICATION",

        // Leader details
        leaderName: data.teamLeader.fullName.trim(),
        leaderEmail: leaderEmailNormalized,
        leaderPhone: data.teamLeader.phone.trim(),
        leaderWhatsapp: data.teamLeader.whatsappNumber?.trim() || data.teamLeader.phone.trim(),
        leaderDob: data.teamLeader.dateOfBirth || null,
        leaderBranch: data.teamLeader.branch || "Computer Science & Engineering",
        leaderCustomBranch: data.teamLeader.customBranch?.trim() || null,
        leaderYear: data.teamLeader.yearOfStudy || "3rd Year",
        leaderRole: data.teamLeader.role || "Leader",
        leaderGithub: data.teamLeader.githubUsername?.trim() || null,

        // Members JSON
        members: data.members as any,

        // Payment Details with exact admin fee
        paymentMode: paymentMode,
        transactionId: data.paymentDetails?.transactionId || null,
        paymentStatus: "PENDING",
        amount: feeAmount,

        // Accommodation
        accommodationRequired: Boolean(data.accommodationRequired || (data as any).accommodationRequested),
        accommodationStatus: Boolean(data.accommodationRequired || (data as any).accommodationRequested)
          ? "REQUESTED"
          : "NOT_REQUESTED",

        // Document Uploads & edit count initialization
        documents: initialDocs,
      },
    });

    // Dispatch Registration Confirmation Email via Resend
    try {
      await sendRegistrationSubmissionEmail({
        registrationNumber: newRegistration.registrationNumber,
        teamName: newRegistration.teamName,
        collegeName: newRegistration.collegeName,
        leaderName: newRegistration.leaderName,
        leaderEmail: newRegistration.leaderEmail,
        leaderPhone: newRegistration.leaderPhone,
        problemStatementId: newRegistration.problemStatementId,
        members: data.members,
        paymentDetails: {
          paymentMode: newRegistration.paymentMode || undefined,
          transactionId: newRegistration.transactionId,
          paymentStatus: newRegistration.paymentStatus || undefined,
          amount: feeAmount,
        },
        accommodationRequired: Boolean((data as any).accommodationRequired || (data as any).accommodationRequested),
      });
    } catch (emailErr) {
      console.warn("Could not dispatch registration email:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        registrationId: newRegistration.id,
        ticketId: newRegistration.registrationNumber,
        teamName: newRegistration.teamName,
        editCount: 0,
        maxEdits: MAX_EDITS_ALLOWED,
        remainingEdits: MAX_EDITS_ALLOWED,
        submittedAt: newRegistration.createdAt.toISOString(),
        message: `Registration confirmed for ${newRegistration.teamName}! Your digital pass is generated.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process registration on server.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to edit your registration." },
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email.toLowerCase().trim();
    const data: RegistrationFormData = await req.json();

    // 1. Locate existing team registration for this user
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
        const isMember = membersList.some(
          (m) => m && m.email && m.email.toLowerCase().trim() === userEmail
        );
        if (isMember) {
          return NextResponse.json(
            {
              success: false,
              message: "Permission Denied. Only the Team Leader can update squad registration details.",
            },
            { status: 403 }
          );
        }
      }
    }

    if (!teamRegistration) {
      return NextResponse.json(
        { success: false, message: "No registered team found to edit." },
        { status: 404 }
      );
    }

    // Double check that user is strictly the leader
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

    // 2. Enforce Strict Edit Limit: Maximum 3 edits allowed
    const currentDocs = (teamRegistration.documents as Record<string, any>) || {};
    const currentEditCount =
      typeof currentDocs.editCount === "number"
        ? currentDocs.editCount
        : typeof (teamRegistration as any).editCount === "number"
        ? (teamRegistration as any).editCount
        : 0;

    if (currentEditCount >= MAX_EDITS_ALLOWED) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum edit limit reached (${MAX_EDITS_ALLOWED}/${MAX_EDITS_ALLOWED} edits used). You cannot edit your registration form anymore.`,
          editCount: currentEditCount,
          remainingEdits: 0,
        },
        { status: 403 }
      );
    }

    // 3. Validate updated form data
    const validationErrors = validateRegistrationForm(data);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Form validation failed. Please correct input errors.",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // 4. Update the record and increment editCount
    const newEditCount = currentEditCount + 1;
    const remainingEdits = Math.max(0, MAX_EDITS_ALLOWED - newEditCount);
    const updatedDocs = {
      ...currentDocs,
      ...(data.documentUploads || {}),
      editCount: newEditCount,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    const updated = await prisma.teamRegistration.update({
      where: { id: teamRegistration.id },
      data: {
        teamName: data.teamName.trim(),
        collegeName: data.collegeName.trim(),
        collegeAddress: data.collegeAddress as any,
        problemStatementId: data.selectedProblemStatementId || teamRegistration.problemStatementId,

        // Leader details
        leaderName: data.teamLeader.fullName.trim(),
        leaderEmail: data.teamLeader.email.trim().toLowerCase(),
        leaderPhone: data.teamLeader.phone.trim(),
        leaderWhatsapp: data.teamLeader.whatsappNumber?.trim() || data.teamLeader.phone.trim(),
        leaderDob: data.teamLeader.dateOfBirth || null,
        leaderBranch: data.teamLeader.branch || "Computer Science & Engineering",
        leaderCustomBranch: data.teamLeader.customBranch?.trim() || null,
        leaderYear: data.teamLeader.yearOfStudy || "3rd Year",
        leaderRole: data.teamLeader.role || "Leader",
        leaderGithub: data.teamLeader.githubUsername?.trim() || null,

        // Members
        members: data.members as any,

        // Documents & Edit count tracking
        documents: updatedDocs,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Registration updated successfully! (Edit ${newEditCount} of ${MAX_EDITS_ALLOWED} used, ${remainingEdits} edit${remainingEdits === 1 ? "" : "s"} remaining).`,
      editCount: newEditCount,
      remainingEdits,
      team: {
        id: updated.id,
        registrationNumber: updated.registrationNumber,
        teamName: updated.teamName,
        collegeName: updated.collegeName,
        collegeAddress: updated.collegeAddress,
        status: updated.status,
        editCount: newEditCount,
        remainingEdits,
        documents: updatedDocs,
      },
    });
  } catch (error: any) {
    console.error("Edit registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update registration.",
      },
      { status: 500 }
    );
  }
}
