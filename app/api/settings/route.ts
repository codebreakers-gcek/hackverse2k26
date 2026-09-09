import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
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
          isProblemStatementsPublished: false,
          minSquadSize: 2,
          maxSquadSize: 4,
          contactPhone: "+91 9876543210",
          contactEmail: "hackverse26@codebreakersgcek.tech",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        settings: {
          upiId: settings.upiId,
          payeeName: settings.payeeName,
          registrationFee: settings.registrationFee,
          isPaymentMandatory: settings.isPaymentMandatory,
          isRegistrationOpen: settings.isRegistrationOpen,
          isProblemStatementsPublished: settings.isProblemStatementsPublished,
          minSquadSize: settings.minSquadSize,
          maxSquadSize: settings.maxSquadSize,
          contactPhone: settings.contactPhone,
          contactEmail: settings.contactEmail,
          isGoogleDriveEnabled: Boolean(settings.googleDriveEnabled),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error: any) {
    console.error("Failed to load public settings:", error);
    // Return fallback defaults
    return NextResponse.json({
      success: true,
      settings: {
        upiId: "codebreakers@upi",
        payeeName: "HACKVERSE 2026 GCEK",
        registrationFee: 0,
        isPaymentMandatory: false,
        isRegistrationOpen: true,
        isProblemStatementsPublished: false,
        minSquadSize: 2,
        maxSquadSize: 4,
      },
    });
  }
}
