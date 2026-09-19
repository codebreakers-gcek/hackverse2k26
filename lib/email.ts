import { Resend } from "resend";
import { generateInvoicePdfBuffer } from "@/lib/invoiceGenerator";
import { EVENT_DATA } from "@/data/event";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "HACKVERSE '26 <onboarding@resend.dev>";

// Lazy initialize Resend client
function getResendClient() {
  if (!RESEND_API_KEY) {
    console.warn("[EMAIL_SERVICE] RESEND_API_KEY is not set in environment variables. Email sending is in mock/log mode.");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

export interface RegistrationEmailData {
  registrationNumber: string;
  teamName: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string;
  problemStatementId?: string | null;
  members?: Array<{
    fullName: string;
    email: string;
    role?: string;
    branch?: string;
  }>;
  paymentDetails?: {
    paymentMode?: string;
    transactionId?: string | null;
    paymentStatus?: string;
    amount?: number;
  };
  accommodationRequired?: boolean;
}

/**
 * Common HTML email header and style
 */
function renderEmailShell(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #09090b;
    }
    .wrapper {
      max-width: 620px;
      margin: 30px auto;
      background: #ffffff;
      border: 4px solid #000000;
      box-shadow: 8px 8px 0px #000000;
    }
    .header {
      background: #000000;
      color: #ffffff;
      padding: 24px;
      border-bottom: 4px solid #000000;
    }
    .badge {
      display: inline-block;
      background: #facc15;
      color: #000000;
      font-weight: 900;
      font-size: 11px;
      padding: 3px 8px;
      border: 2px solid #000000;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 28px 24px;
    }
    .card {
      border: 3px solid #000000;
      background: #fafafa;
      padding: 16px;
      margin: 18px 0;
      box-shadow: 4px 4px 0px #000000;
    }
    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .receipt-table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      padding: 8px 6px;
      border-bottom: 2px solid #000000;
      color: #71717a;
      font-family: monospace;
    }
    .receipt-table td {
      padding: 10px 6px;
      font-size: 13px;
      border-bottom: 1px solid #e4e4e7;
    }
    .btn {
      display: inline-block;
      background: #facc15;
      color: #000000;
      font-weight: 900;
      font-size: 13px;
      padding: 12px 24px;
      text-decoration: none;
      border: 3px solid #000000;
      box-shadow: 4px 4px 0px #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 16px;
    }
    .footer {
      background: #000000;
      color: #a1a1aa;
      padding: 16px 24px;
      font-size: 11px;
      font-family: monospace;
      border-top: 4px solid #000000;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <div class="badge">CODEBREAKERS // GCE KALAHANDI</div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; color: #ffffff;">
              HACKVERSE &apos;26
            </h1>
            <div style="font-size: 12px; color: #facc15; font-family: monospace; margin-top: 4px; font-weight: bold;">
              24-HOUR CONTINUOUS STATE HACKATHON
            </div>
          </td>
          <td style="width: 58px; text-align: right; vertical-align: middle;">
            <img src="https://hackverse.codebreakersgcek.tech/cbhack.png" alt="HACKVERSE Logo" width="54" height="54" style="border: none; outline: none; display: inline-block; vertical-align: middle;" />
          </td>
        </tr>
      </table>
    </div>

    <div class="content">
      ${contentHtml}
    </div>

    <div class="footer">
      <div>HACKVERSE 2026 // GOVERNMENT COLLEGE OF ENGINEERING KALAHANDI</div>
      <div style="margin-top: 4px; color: #71717a;">Bhawanipatna, Odisha &bull; ${EVENT_DATA.displayDates}</div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 1. Send Email when Registration Form is Submitted (Under Review / Captured Status)
 */
export async function sendRegistrationSubmissionEmail(data: RegistrationEmailData) {
  const resend = getResendClient();
  const recipients = [data.leaderEmail];

  // Add team member emails if available
  if (data.members && data.members.length > 0) {
    data.members.forEach((m) => {
      if (m.email && m.email.trim() && !recipients.includes(m.email.trim().toLowerCase())) {
        recipients.push(m.email.trim().toLowerCase());
      }
    });
  }

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 900; margin-top: 0; text-transform: uppercase; color: #000000;">
      Registration Captured &amp; Under Review
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #3f3f46;">
      Greetings <strong>${data.leaderName}</strong>! Your registration for squad <strong>${data.teamName}</strong> has been successfully captured for <strong>HACKVERSE &apos;26</strong>.
    </p>

    <!-- Under Review Notice Box -->
    <div style="background: #fef3c7; border: 3px solid #f59e0b; padding: 14px 18px; margin: 18px 0; font-size: 13px; line-height: 1.6; color: #78350f;">
      <div style="font-weight: 900; font-size: 14px; text-transform: uppercase; margin-bottom: 4px;">
        ⏳ Status: Under Review
      </div>
      <div>
        Our organizing team will review your squad registration details and submitted payment proof. Once approved by the admin, your official <strong>Entry Pass</strong> will be generated and emailed to you.
      </div>
    </div>

    <!-- Registration Summary Card -->
    <div class="card">
      <div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #71717a; text-transform: uppercase;">
        REGISTRATION TICKET IDENTIFIER
      </div>
      <div style="font-size: 24px; font-weight: 900; color: #000000; font-family: monospace; margin: 4px 0 12px 0;">
        ${data.registrationNumber}
      </div>

      <table style="width: 100%; font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="color: #71717a; width: 40%;">Squad Name:</td>
          <td><strong>${data.teamName}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Institution:</td>
          <td><strong>${data.collegeName}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Team Leader:</td>
          <td>${data.leaderName} (${data.leaderEmail})</td>
        </tr>
        <tr>
          <td style="color: #71717a;">Problem Statement:</td>
          <td><strong>${data.problemStatementId || "General Hackathon Track"}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Verification Status:</td>
          <td>
            <span style="background: #fef08a; padding: 2px 8px; border: 1px solid #000; font-weight: bold; font-size: 11px; font-family: monospace;">
              PENDING ADMIN APPROVAL
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Payment & Submission Info -->
    <div class="card" style="background: #ffffff;">
      <div style="font-family: monospace; font-size: 12px; font-weight: 900; color: #000000; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 6px;">
        SUBMISSION &amp; PAYMENT DETAILS
      </div>

      <table class="receipt-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Mode / Txn ID</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HACKVERSE 2026 Squad Registration</strong><br>
              <span style="font-size: 11px; color: #71717a;">Includes 24h Arena, Snacks &amp; Goodies</span>
            </td>
            <td style="font-family: monospace; font-size: 12px;">
              ${data.paymentDetails?.paymentMode || "UPI_QR"}<br>
              <span style="color: #71717a;">${data.paymentDetails?.transactionId || "N/A"}</span>
            </td>
            <td style="text-align: right; font-weight: 900; font-size: 14px;">
              ${data.paymentDetails?.amount ? `₹${data.paymentDetails.amount}` : "PAID"}
            </td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; padding: 8px; background: #f4f4f5; font-size: 11px; font-family: monospace; border: 1px dashed #71717a;">
        <strong>CAPTURE DATE:</strong> ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} &bull; 
        <strong>QUEUE:</strong> AWAITING ORGANIZER VERIFICATION
      </div>
    </div>

    <!-- Next Steps Notice -->
    <div style="margin-top: 20px; font-size: 13px; color: #52525b; line-height: 1.6;">
      Please keep your <strong>Ticket ID (${data.registrationNumber})</strong> handy. You will receive an automated notification once our administration team completes document review and confirms your squad admission.
    </div>

    <center>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" class="btn">
        VISIT HACKVERSE DASHBOARD
      </a>
    </center>
  `;

  const html = renderEmailShell("HACKVERSE '26 - Registration Captured & Under Review", contentHtml);

  if (!resend) {
    console.log(`[Email Mock] Submission email triggered for ${recipients.join(", ")} (${data.registrationNumber})`);
    return { success: true, mocked: true };
  }

  try {
    const res = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: recipients,
      subject: `⏳ HACKVERSE '26 | Registration Captured & Under Review: ${data.teamName} (${data.registrationNumber})`,
      html,
    });
    return { success: true, id: res.data?.id };
  } catch (error: any) {
    console.error("Failed to send registration submission email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Send Email when Registration is Approved
 * - Sends official Tax Invoice (PDF) attachment to Team Leader only.
 */
export async function sendRegistrationApprovedEmail(data: RegistrationEmailData) {
  const resend = getResendClient();
  const leaderRecipient = data.leaderEmail?.trim()?.toLowerCase();

  if (!leaderRecipient) {
    console.warn("[EMAIL_SERVICE] No leader email found for registration approval email dispatch.");
    return { success: false, error: "Leader email missing" };
  }

  // 1. Generate the crisp official PDF Invoice buffer
  let invoiceBuffer: Buffer | null = null;
  try {
    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    invoiceBuffer = await generateInvoicePdfBuffer({
      invoiceNumber: `HV26-INV-${data.registrationNumber.replace("HV26-", "")}`,
      dateOfIssue: issueDate,
      datePaid: issueDate,
      teamName: data.teamName,
      leaderName: data.leaderName,
      leaderEmail: data.leaderEmail,
      collegeName: data.collegeName,
      collegeAddress: data.collegeAddress,
      amount: data.paymentDetails?.amount || 0,
      paymentMode: data.paymentDetails?.paymentMode || "UPI_QR",
      transactionId: data.paymentDetails?.transactionId || undefined,
      paymentStatus: "VERIFIED",
    });
  } catch (invErr) {
    console.error("Failed to generate invoice PDF for email attachment:", invErr);
  }

  // =========================================================================
  // TEAM LEADER EMAIL (Official Tax Invoice PDF Attached)
  // =========================================================================
  const contentHtml = `
    <div style="background: #dcfce7; border: 3px solid #15803d; padding: 14px; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 900; margin: 0; color: #15803d; text-transform: uppercase;">
        SQUAD REGISTRATION APPROVED &amp; CONFIRMED
      </h2>
      <div style="font-size: 13px; color: #166534; margin-top: 4px; font-weight: bold;">
        Your squad and documents have been verified and confirmed on the HACKVERSE '26 Roster.
      </div>
    </div>

    <p style="font-size: 14px; line-height: 1.5; color: #3f3f46;">
      Dear <strong>${data.leaderName}</strong>,<br><br>
      Congratulations! Your squad <strong>${data.teamName}</strong> has been officially approved by the organizing committee. Your official <strong>Tax Invoice (PDF)</strong> is attached to this email for your records.
    </p>

    <!-- Registration Overview Card -->
    <div class="card" style="background: #ffffff; border-color: #000000;">
      <div style="color: #ca8a04; font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 1px;">
        OFFICIAL REGISTRATION DETAILS
      </div>
      <div style="font-size: 24px; font-weight: 900; color: #000000; font-family: monospace; margin: 6px 0 12px 0;">
        ${data.registrationNumber}
      </div>

      <table style="width: 100%; font-size: 13px; line-height: 1.6;">
        <tr>
          <td style="color: #71717a; width: 40%;">Squad Name:</td>
          <td><strong>${data.teamName}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Institution:</td>
          <td><strong>${data.collegeName}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Team Leader:</td>
          <td>${data.leaderName} (${data.leaderEmail})</td>
        </tr>
        <tr>
          <td style="color: #71717a;">Payment Mode:</td>
          <td>${data.paymentDetails?.paymentMode || "UPI_QR"}</td>
        </tr>
        <tr>
          <td style="color: #71717a;">Transaction ID:</td>
          <td>${data.paymentDetails?.transactionId || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #71717a;">Amount Paid:</td>
          <td><strong>${data.paymentDetails?.amount ? `₹${data.paymentDetails.amount}` : "PAID"}</strong></td>
        </tr>
        <tr>
          <td style="color: #71717a;">Event Dates:</td>
          <td>${EVENT_DATA.displayDates}</td>
        </tr>
        <tr>
          <td style="color: #71717a;">Venue:</td>
          <td>${EVENT_DATA.location?.campus}, ${EVENT_DATA.location?.city}</td>
        </tr>
      </table>
    </div>

    <!-- Invoice Attachment Notice -->
    <div style="background: #f4f4f5; border: 2px solid #000000; padding: 14px; font-size: 12px; line-height: 1.5; margin: 16px 0;">
      <strong>Attached Document:</strong>
      <div style="margin-top: 4px; color: #52525b;">
        Your official Tax Invoice (<code>invoice-${data.registrationNumber}.pdf</code>) is attached to this email. Please preserve it for college reimbursement and tournament records.
      </div>
    </div>

    <center style="margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://hackverse.cbgcek.dev"}" class="btn">
        OPEN EVENT DASHBOARD
      </a>
    </center>
  `;

  const emailHtml = renderEmailShell("HACKVERSE '26 - Registration Approved & Tax Invoice", contentHtml);

  if (!resend) {
    console.log(`[Email Mock] Approved invoice email triggered for leader: ${leaderRecipient} (${data.registrationNumber})`);
    return { success: true, mocked: true };
  }

  try {
    const attachments: any[] = [];
    if (invoiceBuffer) {
      attachments.push({
        filename: `invoice-${data.registrationNumber}.pdf`,
        content: invoiceBuffer,
      });
    }

    const res = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [leaderRecipient],
      subject: `HACKVERSE '26 | Registration Approved & Official Tax Invoice: ${data.teamName} (${data.registrationNumber})`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return { success: true, id: res.data?.id || "" };
  } catch (error: any) {
    console.error("Failed to send leader approval invoice email:", error);
    return { success: false, error: error.message };
  }
}
