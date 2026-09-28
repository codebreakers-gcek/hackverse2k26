import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";
import { sendRegistrationApprovedEmail } from "@/lib/email";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const accommodation = searchParams.get("accommodation");
    const payment = searchParams.get("payment");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (accommodation && accommodation !== "ALL") {
      if (accommodation === "REQUESTED") {
        where.accommodationRequired = true;
      } else if (accommodation === "ALLOCATED") {
        where.accommodationStatus = "ALLOCATED";
      } else if (accommodation === "NOT_REQUESTED") {
        where.accommodationRequired = false;
      } else {
        where.accommodationStatus = accommodation;
      }
    }

    if (payment && payment !== "ALL") {
      where.paymentStatus = payment;
    }

    if (search) {
      where.OR = [
        { teamName: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { leaderName: { contains: search, mode: "insensitive" } },
        { leaderEmail: { contains: search, mode: "insensitive" } },
        { collegeName: { contains: search, mode: "insensitive" } },
        { problemStatementId: { contains: search, mode: "insensitive" } },
      ];
    }

    const registrations = await prisma.teamRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: registrations,
      total: registrations.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      status,
      accommodationStatus,
      accommodationRequired,
      roomNumber,
      hostelBlock,
      paymentStatus,
      transactionId,
      problemStatementId,
      problemStatement2,
      selectedProblemStatements,
      unlockPs,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const existingSquad = await prisma.teamRegistration.findUnique({
      where: { id },
    });

    if (!existingSquad) {
      return NextResponse.json({ error: "Team registration not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (accommodationStatus !== undefined) {
      updateData.accommodationStatus = accommodationStatus;
      if (accommodationStatus === "ALLOCATED" || accommodationStatus === "REQUESTED") {
        updateData.accommodationRequired = true;
      } else if (accommodationStatus === "NOT_REQUESTED") {
        updateData.accommodationRequired = false;
      }
    }
    if (accommodationRequired !== undefined) {
      updateData.accommodationRequired = Boolean(accommodationRequired);
    }
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
    if (hostelBlock !== undefined) updateData.hostelBlock = hostelBlock;
    if (paymentStatus !== undefined) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "VERIFIED" && status === undefined) {
        updateData.status = "CONFIRMED";
      }
    }
    if (transactionId !== undefined) updateData.transactionId = transactionId;

    // Handle Admin Modification of Problem Statement
    const currentDocs = (existingSquad.documents as Record<string, any>) || {};

    if (unlockPs === true || problemStatementId === "" || (problemStatementId === null && selectedProblemStatements === undefined)) {
      // Clear / Unlock Problem Statement
      updateData.problemStatementId = null;
      updateData.documents = {
        ...currentDocs,
        selectedProblemStatements: [],
        problemStatement1: null,
        problemStatement2: null,
        problemStatement1Code: null,
        problemStatement2Code: null,
        isPsLocked: false,
        psSubmittedAt: null,
        psAdminModifiedAt: new Date().toISOString(),
        psAdminModifiedBy: admin.email || admin.name || "admin",
      };
    } else if (problemStatementId !== undefined || selectedProblemStatements !== undefined) {
      const resolvePs = (val?: string | null) => {
        if (!val) return null;
        return (
          PROBLEM_STATEMENTS_DATA.find(
            (p) =>
              p.id.toLowerCase() === val.toLowerCase() ||
              p.code.toLowerCase() === val.toLowerCase()
          ) || null
        );
      };

      const rawP1 = Array.isArray(selectedProblemStatements) && selectedProblemStatements[0]
        ? selectedProblemStatements[0]
        : problemStatementId;
      const rawP2 = Array.isArray(selectedProblemStatements) && selectedProblemStatements[1]
        ? selectedProblemStatements[1]
        : problemStatement2;

      const p1Obj = resolvePs(rawP1);
      const p2Obj = resolvePs(rawP2);

      if (p1Obj) {
        const finalList = [p1Obj.id, ...(p2Obj && p2Obj.id !== p1Obj.id ? [p2Obj.id] : [])];
        updateData.problemStatementId = p1Obj.id;
        updateData.documents = {
          ...currentDocs,
          selectedProblemStatements: finalList,
          problemStatement1: p1Obj.id,
          problemStatement2: p2Obj && p2Obj.id !== p1Obj.id ? p2Obj.id : null,
          problemStatement1Code: p1Obj.code,
          problemStatement2Code: p2Obj && p2Obj.id !== p1Obj.id ? p2Obj.code : null,
          isPsLocked: true,
          psSubmittedAt: currentDocs.psSubmittedAt || new Date().toISOString(),
          psAdminModifiedAt: new Date().toISOString(),
          psAdminModifiedBy: admin.email || admin.name || "admin",
        };
      }
    }

    const updated = await prisma.teamRegistration.update({
      where: { id },
      data: updateData,
    });

    // If status is CONFIRMED or payment verified, send Approval Email + PNG Entry Pass + PDF Invoice Attachment
    if (status === "CONFIRMED" || (paymentStatus === "VERIFIED" && updated.status === "CONFIRMED")) {
      sendRegistrationApprovedEmail({
        registrationNumber: updated.registrationNumber,
        teamName: updated.teamName,
        collegeName: updated.collegeName,
        collegeAddress: updated.collegeAddress as any,
        leaderName: updated.leaderName,
        leaderEmail: updated.leaderEmail,
        leaderPhone: updated.leaderPhone,
        problemStatementId: updated.problemStatementId,
        members: updated.members as any,
        paymentDetails: {
          paymentMode: updated.paymentMode || undefined,
          transactionId: updated.transactionId,
          paymentStatus: updated.paymentStatus || undefined,
          amount: (updated as any).amount || undefined,
        },
        accommodationRequired: Boolean(updated.accommodationRequired),
      }).catch((err) => {
        console.warn("Could not dispatch approval email:", err);
      });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Registration record updated successfully.",
    });
  } catch (error: any) {
    console.error("Failed to update registration:", error);
    return NextResponse.json({ error: error.message || "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    await prisma.teamRegistration.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Registration record deleted successfully.",
    });
  } catch (error: any) {
    console.error("Failed to delete registration:", error);
    return NextResponse.json({ error: error.message || "Failed to delete record" }, { status: 500 });
  }
}
