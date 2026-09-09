import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "default",
          upiId: "codebreakers@upi",
          payeeName: "HACKVERSE 2026 GCEK",
          registrationFee: 0,
          isPaymentMandatory: false,
          isRegistrationOpen: true,
          minSquadSize: 2,
          maxSquadSize: 4,
          contactPhone: "+91 9876543210",
          contactEmail: "hackverse26@codebreakersgcek.tech",
          googleDriveEnabled: false,
          googleDriveAuthType: "oauth",
          googleDriveFolderName: "HACKVERSE 2026 Team Uploads",
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        googleDrivePrivateKey: settings.googleDrivePrivateKey ? "********" : "",
        googleDriveServiceAccountJson: settings.googleDriveServiceAccountJson
          ? "********"
          : "",
        googleDriveTokenExpiry: settings.googleDriveTokenExpiry
          ? Number(settings.googleDriveTokenExpiry)
          : null,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load system settings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      upiId,
      payeeName,
      registrationFee,
      isPaymentMandatory,
      isRegistrationOpen,
      isProblemStatementsPublished,
      minSquadSize,
      maxSquadSize,
      contactPhone,
      contactEmail,
      googleDriveEnabled,
      googleDriveAuthType,
      googleDriveConnectedEmail,
      googleDriveFolderId,
      googleDriveFolderName,
      googleDriveClientEmail,
      googleDrivePrivateKey,
      googleDriveServiceAccountJson,
    } = body;

    const updated = await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        ...(upiId !== undefined && { upiId: upiId.trim() }),
        ...(payeeName !== undefined && { payeeName: payeeName.trim() }),
        ...(registrationFee !== undefined && {
          registrationFee: Number(registrationFee),
        }),
        ...(isPaymentMandatory !== undefined && {
          isPaymentMandatory: Boolean(isPaymentMandatory),
        }),
        ...(isRegistrationOpen !== undefined && {
          isRegistrationOpen: Boolean(isRegistrationOpen),
        }),
        ...(isProblemStatementsPublished !== undefined && {
          isProblemStatementsPublished: Boolean(isProblemStatementsPublished),
        }),
        ...(minSquadSize !== undefined && {
          minSquadSize: Number(minSquadSize),
        }),
        ...(maxSquadSize !== undefined && {
          maxSquadSize: Number(maxSquadSize),
        }),
        ...(contactPhone !== undefined && {
          contactPhone: contactPhone?.trim(),
        }),
        ...(contactEmail !== undefined && {
          contactEmail: contactEmail?.trim(),
        }),
        ...(googleDriveEnabled !== undefined && {
          googleDriveEnabled: Boolean(googleDriveEnabled),
        }),
        ...(googleDriveAuthType !== undefined && {
          googleDriveAuthType: googleDriveAuthType?.trim(),
        }),
        ...(googleDriveConnectedEmail !== undefined && {
          googleDriveConnectedEmail: googleDriveConnectedEmail?.trim(),
        }),
        ...(googleDriveFolderId !== undefined && {
          googleDriveFolderId: googleDriveFolderId?.trim(),
        }),
        ...(googleDriveFolderName !== undefined && {
          googleDriveFolderName: googleDriveFolderName?.trim(),
        }),
        ...(googleDriveClientEmail !== undefined && {
          googleDriveClientEmail: googleDriveClientEmail?.trim(),
        }),
        ...(googleDrivePrivateKey !== undefined && {
          googleDrivePrivateKey: googleDrivePrivateKey?.trim(),
        }),
        ...(googleDriveServiceAccountJson !== undefined && {
          googleDriveServiceAccountJson: googleDriveServiceAccountJson?.trim(),
        }),
      },
      create: {
        id: "default",
        upiId: upiId ? upiId.trim() : "codebreakers@upi",
        payeeName: payeeName ? payeeName.trim() : "HACKVERSE 2026 GCEK",
        registrationFee: Number(registrationFee) || 0,
        isPaymentMandatory: Boolean(isPaymentMandatory),
        isRegistrationOpen:
          isRegistrationOpen !== undefined ? Boolean(isRegistrationOpen) : true,
        isProblemStatementsPublished:
          isProblemStatementsPublished !== undefined
            ? Boolean(isProblemStatementsPublished)
            : true,
        minSquadSize: Number(minSquadSize) || 2,
        maxSquadSize: Number(maxSquadSize) || 4,
        contactPhone: contactPhone || "+91 9876543210",
        contactEmail: contactEmail || "hackverse26@codebreakersgcek.tech",
        googleDriveEnabled: Boolean(googleDriveEnabled),
        googleDriveAuthType: googleDriveAuthType
          ? googleDriveAuthType.trim()
          : "oauth",
        googleDriveConnectedEmail: googleDriveConnectedEmail
          ? googleDriveConnectedEmail.trim()
          : "",
        googleDriveFolderId: googleDriveFolderId
          ? googleDriveFolderId.trim()
          : "",
        googleDriveFolderName: googleDriveFolderName
          ? googleDriveFolderName.trim()
          : "HACKVERSE 2026 Team Uploads",
        googleDriveClientEmail: googleDriveClientEmail
          ? googleDriveClientEmail.trim()
          : "",
        googleDrivePrivateKey: googleDrivePrivateKey
          ? googleDrivePrivateKey.trim()
          : "",
        googleDriveServiceAccountJson: googleDriveServiceAccountJson
          ? googleDriveServiceAccountJson.trim()
          : "",
      },
    });

    const safeUpdated = JSON.parse(
      JSON.stringify(updated, (key, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
    );

    return NextResponse.json({
      success: true,
      settings: safeUpdated,
      message:
        "Hackathon payment and operational settings updated successfully.",
    });
  } catch (error: any) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}
