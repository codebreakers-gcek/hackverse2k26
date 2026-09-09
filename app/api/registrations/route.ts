import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRegistrationForm } from "@/services/registrationService";
import { RegistrationFormData } from "@/types/registration";
import { sendRegistrationSubmissionEmail } from "@/lib/email";

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

    // 3. Generate unique registration ticket number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const registrationNumber = `HV26-${randomSuffix}`;

    // 3. Save into Supabase PostgreSQL using Prisma
    const newRegistration = await prisma.teamRegistration.create({
      data: {
        registrationNumber,
        teamName: data.teamName.trim(),
        collegeName: data.collegeName.trim(),
        collegeAddress: data.collegeAddress as any,
        problemStatementId: data.selectedProblemStatementId || null,
        status: "PENDING_VERIFICATION",

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

        // Members JSON
        members: data.members as any,

        // Payment
        paymentMode: data.paymentDetails?.paymentMode || "FREE_SPONSORED",
        transactionId: data.paymentDetails?.transactionId || null,
        paymentStatus: data.paymentDetails?.paymentMode === "FREE_SPONSORED" ? "FREE_TIER" : "PENDING",

        // Document Uploads
        documents: data.documentUploads as any,
      },
    });

    // 4. Trigger Resend Email in background (Registration Received & Payment Receipt)
    sendRegistrationSubmissionEmail({
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
        amount: (data.paymentDetails as any)?.amount,
      },
      accommodationRequired: Boolean((data as any).accommodationRequired || (data as any).accommodationRequested),
    }).catch((emailErr) => {
      console.warn("Could not dispatch registration email:", emailErr);
    });

    return NextResponse.json(
      {
        success: true,
        registrationId: newRegistration.id,
        ticketId: newRegistration.registrationNumber,
        teamName: newRegistration.teamName,
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
    const { auth } = await import("@/lib/auth");
    const { headers } = await import("next/headers");
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
        { success: false, message: "No registered team found to edit." },
        { status: 404 }
      );
    }

    // 2. Enforce Strict Edit Limit: Maximum 3 edits allowed
    const currentEditCount =
      (teamRegistration as any).editCount ??
      ((teamRegistration.documents as any)?.editCount || 0);

    const MAX_EDITS = 3;
    if (currentEditCount >= MAX_EDITS) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum edit limit reached (${MAX_EDITS}/${MAX_EDITS} edits used). You cannot edit your registration form anymore.`,
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
    const existingDocs = (teamRegistration.documents as Record<string, any>) || {};
    const updatedDocs = {
      ...existingDocs,
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
        editCount: newEditCount,
      },
    });

    const remainingEdits = Math.max(0, MAX_EDITS - newEditCount);

    return NextResponse.json({
      success: true,
      message: `Registration updated successfully! (Edit ${newEditCount} of ${MAX_EDITS} used, ${remainingEdits} edits remaining).`,
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
