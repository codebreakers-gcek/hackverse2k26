import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminAuth";
import { generateInvoicePdfBuffer } from "@/lib/invoiceGenerator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const ticketId = searchParams.get("ticketId");

    if (!id && !ticketId) {
      return NextResponse.json({ error: "Registration ID or Ticket ID is required" }, { status: 400 });
    }

    const registration = await prisma.teamRegistration.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(ticketId ? [{ registrationNumber: ticketId }] : []),
        ],
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const issueDate = new Date(registration.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const paidDate = new Date(registration.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const pdfBuffer = await generateInvoicePdfBuffer({
      invoiceNumber: `HV26-INV-${registration.registrationNumber.replace("HV26-", "")}`,
      dateOfIssue: issueDate,
      datePaid: paidDate,
      teamName: registration.teamName,
      leaderName: registration.leaderName,
      leaderEmail: registration.leaderEmail,
      collegeName: registration.collegeName,
      collegeAddress: registration.collegeAddress as any,
      amount: registration.amount || 0,
      paymentMode: registration.paymentMode || "UPI_QR",
      transactionId: registration.transactionId || undefined,
      paymentStatus: registration.paymentStatus || "VERIFIED",
    });

    const response = new NextResponse(new Uint8Array(pdfBuffer));
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `inline; filename="invoice-${registration.registrationNumber}.pdf"`
    );
    response.headers.set("Cache-Control", "public, max-age=3600");

    return response;
  } catch (error: any) {
    console.error("Failed to generate invoice PDF:", error);
    return NextResponse.json({ error: error.message || "Failed to generate invoice" }, { status: 500 });
  }
}
