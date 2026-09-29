import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  sendRegistrationApprovedEmail,
  sendEmailChangedNotification,
  sendUserPersonalDetailsChangedNotification,
  sendTeamDetailsUpdatedNotification,
} from "@/lib/email";
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
    const payment = searchParams.get("payment");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
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
      registrations: registrations,
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

/**
 * PUT: Full Squad Edit by Admin
 * - Edits all squad parameters (Team info, leader, roster, finance, accommodation, problem statement).
 * - Detects email changes, transfers user account authentication & destroys old sessions so old email loses access immediately.
 * - Dispatches notifications to old & new emails, and sends team change summary to leader.
 */
export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      teamName,
      collegeName,
      collegeAddress,
      problemStatementId,
      problemStatement2,
      selectedProblemStatements,
      status,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderWhatsapp,
      leaderDob,
      leaderBranch,
      leaderCustomBranch,
      leaderYear,
      leaderRole,
      leaderGithub,
      members,
      paymentStatus,
      paymentMode,
      transactionId,
      amount,
      documents,
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

    // Change detection accumulators
    const emailChanges: Array<{
      userType: "Leader" | "Member";
      userName: string;
      oldEmail: string;
      newEmail: string;
    }> = [];

    const personalChanges: Array<{
      email: string;
      userName: string;
      changedFields: Array<{ field: string; oldValue: string; newValue: string }>;
    }> = [];

    const teamChanges: Array<{ category: string; description: string }> = [];

    // 1. Leader Email & Personal Change Detection
    const oldLeaderEmail = (existingSquad.leaderEmail || "").toLowerCase().trim();
    const newLeaderEmail = (leaderEmail || existingSquad.leaderEmail).toLowerCase().trim();

    if (oldLeaderEmail && newLeaderEmail && oldLeaderEmail !== newLeaderEmail) {
      emailChanges.push({
        userType: "Leader",
        userName: leaderName || existingSquad.leaderName,
        oldEmail: oldLeaderEmail,
        newEmail: newLeaderEmail,
      });

      // AUTH MIGRATION FOR LEADER:
      // A. Destroy active sessions for old email
      await prisma.session.deleteMany({
        where: {
          user: {
            email: { equals: oldLeaderEmail, mode: "insensitive" },
          },
        },
      });

      // B. Remove OAuth account link for old email so new provider link can be established
      await prisma.account.deleteMany({
        where: {
          user: {
            email: { equals: oldLeaderEmail, mode: "insensitive" },
          },
        },
      });

      // C. Check if a User record with newLeaderEmail already exists
      const existingUserWithNewEmail = await prisma.user.findFirst({
        where: {
          email: { equals: newLeaderEmail, mode: "insensitive" },
        },
      });

      const oldLeaderUser = await prisma.user.findFirst({
        where: {
          email: { equals: oldLeaderEmail, mode: "insensitive" },
        },
      });

      if (existingUserWithNewEmail) {
        // Re-link team registration to existing user with new email
        // And delete old leader user if needed
        if (oldLeaderUser && oldLeaderUser.id !== existingUserWithNewEmail.id) {
          await prisma.user.delete({ where: { id: oldLeaderUser.id } }).catch(() => {});
        }
      } else if (oldLeaderUser) {
        // Update user record email to new email
        await prisma.user.update({
          where: { id: oldLeaderUser.id },
          data: {
            email: newLeaderEmail,
            name: leaderName || oldLeaderUser.name,
            emailVerified: true,
          },
        });
      }
    } else {
      // Leader personal fields diff
      const leaderFieldDiffs: Array<{ field: string; oldValue: string; newValue: string }> = [];
      if (leaderName && leaderName !== existingSquad.leaderName) {
        leaderFieldDiffs.push({ field: "Full Name", oldValue: existingSquad.leaderName, newValue: leaderName });
      }
      if (leaderPhone && leaderPhone !== existingSquad.leaderPhone) {
        leaderFieldDiffs.push({ field: "Phone", oldValue: existingSquad.leaderPhone, newValue: leaderPhone });
      }
      if (leaderBranch && leaderBranch !== existingSquad.leaderBranch) {
        leaderFieldDiffs.push({ field: "Branch", oldValue: existingSquad.leaderBranch, newValue: leaderBranch });
      }
      if (leaderYear && leaderYear !== existingSquad.leaderYear) {
        leaderFieldDiffs.push({ field: "Year", oldValue: existingSquad.leaderYear, newValue: leaderYear });
      }
      if (leaderGithub !== undefined && leaderGithub !== existingSquad.leaderGithub) {
        leaderFieldDiffs.push({ field: "GitHub", oldValue: existingSquad.leaderGithub || "", newValue: leaderGithub || "" });
      }

      if (leaderFieldDiffs.length > 0) {
        personalChanges.push({
          email: newLeaderEmail,
          userName: leaderName || existingSquad.leaderName,
          changedFields: leaderFieldDiffs,
        });
      }
    }

    // 2. Members Roster & Member Email Change Detection
    const existingMembersList = Array.isArray(existingSquad.members)
      ? (existingSquad.members as any[])
      : [];
    const newMembersList = Array.isArray(members) ? members : existingMembersList;

    newMembersList.forEach((newMem: any, idx: number) => {
      const oldMem = existingMembersList[idx];
      const oldEmail = (oldMem?.email || "").toLowerCase().trim();
      const newEmail = (newMem?.email || "").toLowerCase().trim();

      if (oldEmail && newEmail && oldEmail !== newEmail) {
        emailChanges.push({
          userType: "Member",
          userName: newMem.fullName || oldMem?.fullName || `Member #${idx + 1}`,
          oldEmail,
          newEmail,
        });

        // AUTH MIGRATION FOR MEMBER:
        prisma.session
          .deleteMany({
            where: {
              user: {
                email: { equals: oldEmail, mode: "insensitive" },
              },
            },
          })
          .catch(() => {});

        prisma.account
          .deleteMany({
            where: {
              user: {
                email: { equals: oldEmail, mode: "insensitive" },
              },
            },
          })
          .catch(() => {});

        prisma.user
          .updateMany({
            where: {
              email: { equals: oldEmail, mode: "insensitive" },
            },
            data: {
              email: newEmail,
              name: newMem.fullName || undefined,
            },
          })
          .catch(() => {});
      } else if (oldMem && newEmail) {
        const memFieldDiffs: Array<{ field: string; oldValue: string; newValue: string }> = [];
        if (newMem.fullName && newMem.fullName !== oldMem.fullName) {
          memFieldDiffs.push({ field: "Full Name", oldValue: oldMem.fullName, newValue: newMem.fullName });
        }
        if (newMem.phone && newMem.phone !== oldMem.phone) {
          memFieldDiffs.push({ field: "Phone", oldValue: oldMem.phone, newValue: newMem.phone });
        }
        if (newMem.branch && newMem.branch !== oldMem.branch) {
          memFieldDiffs.push({ field: "Branch", oldValue: oldMem.branch, newValue: newMem.branch });
        }
        if (newMem.yearOfStudy && newMem.yearOfStudy !== oldMem.yearOfStudy) {
          memFieldDiffs.push({ field: "Year", oldValue: oldMem.yearOfStudy, newValue: newMem.yearOfStudy });
        }
        if (memFieldDiffs.length > 0) {
          personalChanges.push({
            email: newEmail,
            userName: newMem.fullName || `Member #${idx + 1}`,
            changedFields: memFieldDiffs,
          });
        }
      }
    });

    if (existingMembersList.length !== newMembersList.length) {
      teamChanges.push({
        category: "Roster Size",
        description: `Squad roster updated to ${newMembersList.length + 1} total members (${newMembersList.length} teammates + leader).`,
      });
    }

    // 3. Team-Level Changes Detection
    if (teamName && teamName !== existingSquad.teamName) {
      teamChanges.push({
        category: "Team Name",
        description: `Team name changed from "${existingSquad.teamName}" to "${teamName}".`,
      });
    }

    if (collegeName && collegeName !== existingSquad.collegeName) {
      teamChanges.push({
        category: "Institution",
        description: `College changed from "${existingSquad.collegeName}" to "${collegeName}".`,
      });
    }

    if (problemStatementId !== undefined && problemStatementId !== existingSquad.problemStatementId) {
      teamChanges.push({
        category: "Problem Statement",
        description: problemStatementId
          ? `Problem statement assigned: ${problemStatementId}`
          : "Problem statement set to Open Innovation / Unassigned.",
      });
    }

    if (status && status !== existingSquad.status) {
      teamChanges.push({
        category: "Squad Status",
        description: `Registration status updated from ${existingSquad.status} to ${status}.`,
      });
    }

    if (
      paymentStatus !== undefined &&
      (paymentStatus !== existingSquad.paymentStatus ||
        amount !== existingSquad.amount ||
        transactionId !== existingSquad.transactionId)
    ) {
      teamChanges.push({
        category: "Payment & Finance",
        description: `Status: ${paymentStatus || "FREE_TIER"}, Amount: ₹${amount ?? existingSquad.amount ?? 0}, Transaction ID: ${transactionId || existingSquad.transactionId || "N/A"}`,
      });
    }

    // Build update object
    const updatePayload: any = {};
    if (teamName !== undefined) updatePayload.teamName = teamName;
    if (collegeName !== undefined) updatePayload.collegeName = collegeName;
    if (collegeAddress !== undefined) updatePayload.collegeAddress = collegeAddress;
    if (status !== undefined) updatePayload.status = status;

    // Handle problem statement & documents sync
    const currentDocs = (existingSquad.documents as Record<string, any>) || {};
    let finalDocs = documents !== undefined ? { ...documents } : { ...currentDocs };

    if (
      problemStatementId !== undefined ||
      problemStatement2 !== undefined ||
      selectedProblemStatements !== undefined
    ) {
      const resolvePs = (val?: string | null) => {
        if (!val) return null;
        return (
          PROBLEM_STATEMENTS_DATA.find(
            (p) =>
              p.id.toLowerCase() === String(val).toLowerCase() ||
              p.code.toLowerCase() === String(val).toLowerCase()
          ) || null
        );
      };

      const rawP1 =
        Array.isArray(selectedProblemStatements) && selectedProblemStatements[0]
          ? selectedProblemStatements[0]
          : problemStatementId;
      const rawP2 =
        Array.isArray(selectedProblemStatements) && selectedProblemStatements[1]
          ? selectedProblemStatements[1]
          : problemStatement2;

      const p1Obj = resolvePs(rawP1);
      const p2Obj = resolvePs(rawP2);

      if (p1Obj) {
        const finalList = [p1Obj.id, ...(p2Obj && p2Obj.id !== p1Obj.id ? [p2Obj.id] : [])];
        updatePayload.problemStatementId = p1Obj.id;
        finalDocs = {
          ...finalDocs,
          selectedProblemStatements: finalList,
          problemStatement1: p1Obj.id,
          problemStatement2: p2Obj && p2Obj.id !== p1Obj.id ? p2Obj.id : null,
          problemStatement1Code: p1Obj.code,
          problemStatement2Code: p2Obj && p2Obj.id !== p1Obj.id ? p2Obj.code : null,
          isPsLocked: true,
          psSubmittedAt: finalDocs.psSubmittedAt || new Date().toISOString(),
          psAdminModifiedAt: new Date().toISOString(),
          psAdminModifiedBy: admin.email || admin.name || "admin",
        };
      } else {
        updatePayload.problemStatementId = null;
        finalDocs = {
          ...finalDocs,
          selectedProblemStatements: [],
          problemStatement1: null,
          problemStatement2: null,
          problemStatement1Code: null,
          problemStatement2Code: null,
          isPsLocked: false,
        };
      }
    }

    if (leaderName !== undefined) updatePayload.leaderName = leaderName;
    if (leaderEmail !== undefined) updatePayload.leaderEmail = newLeaderEmail;
    if (leaderPhone !== undefined) updatePayload.leaderPhone = leaderPhone;
    if (leaderWhatsapp !== undefined) updatePayload.leaderWhatsapp = leaderWhatsapp;
    if (leaderDob !== undefined) updatePayload.leaderDob = leaderDob;
    if (leaderBranch !== undefined) updatePayload.leaderBranch = leaderBranch;
    if (leaderCustomBranch !== undefined) updatePayload.leaderCustomBranch = leaderCustomBranch;
    if (leaderYear !== undefined) updatePayload.leaderYear = leaderYear;
    if (leaderRole !== undefined) updatePayload.leaderRole = leaderRole;
    if (leaderGithub !== undefined) updatePayload.leaderGithub = leaderGithub;

    if (members !== undefined) updatePayload.members = members;

    if (paymentStatus !== undefined) updatePayload.paymentStatus = paymentStatus;
    if (paymentMode !== undefined) updatePayload.paymentMode = paymentMode;
    if (transactionId !== undefined) updatePayload.transactionId = transactionId;
    if (amount !== undefined) updatePayload.amount = Number(amount);
    updatePayload.documents = finalDocs;

    // Execute Database Update
    const updated = await prisma.teamRegistration.update({
      where: { id },
      data: updatePayload,
    });

    // 4. Dispatch Asynchronous Notifications
    // A. Email changes notifications (both old and new email IDs)
    for (const ec of emailChanges) {
      sendEmailChangedNotification({
        oldEmail: ec.oldEmail,
        newEmail: ec.newEmail,
        userName: ec.userName,
        userRole: ec.userType,
        teamName: updated.teamName,
        registrationNumber: updated.registrationNumber,
        adminEmail: admin.email || undefined,
      }).catch((err) => console.error("Email change notice dispatch error:", err));
    }

    // B. Personal details notifications (to affected user only)
    for (const pc of personalChanges) {
      sendUserPersonalDetailsChangedNotification({
        email: pc.email,
        userName: pc.userName,
        teamName: updated.teamName,
        registrationNumber: updated.registrationNumber,
        changedFields: pc.changedFields,
      }).catch((err) => console.error("Personal details notice dispatch error:", err));
    }

    // C. Team details notifications (to team leader only)
    if (teamChanges.length > 0) {
      sendTeamDetailsUpdatedNotification({
        leaderEmail: newLeaderEmail,
        leaderName: updated.leaderName,
        teamName: updated.teamName,
        registrationNumber: updated.registrationNumber,
        changedCategories: teamChanges,
      }).catch((err) => console.error("Team details notice dispatch error:", err));
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Squad details and authentication credentials successfully updated.",
      audit: {
        emailChangesCount: emailChanges.length,
        personalChangesCount: personalChanges.length,
        teamChangesCount: teamChanges.length,
        teamChanges,
      },
    });
  } catch (error: any) {
    console.error("Failed to update squad details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update squad details" },
      { status: 500 }
    );
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
