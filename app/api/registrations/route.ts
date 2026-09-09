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
