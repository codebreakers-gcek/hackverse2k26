import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePassPngBuffer } from "@/lib/passImageGenerator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json(
      { error: "Squad ticket identifier or ID is required" },
      { status: 400 }
    );
  }

  try {
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
        { error: `No squad found for ID "${normalizedId}"` },
        { status: 404 }
      );
    }

    const pngBuffer = await generatePassPngBuffer({
      ticketNumber: squad.registrationNumber,
      teamName: squad.teamName,
      venueCampus: squad.collegeName || undefined,
    });

    return new Response(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${squad.registrationNumber}-ENTRY-PASS.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Pass generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate pass image", details: error.message },
      { status: 500 }
    );
  }
}
