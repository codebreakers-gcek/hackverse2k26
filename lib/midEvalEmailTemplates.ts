export interface EvaluationSlot {
  psId: string;
  psTitle: string;
  date: string;
  time: string;
  meetingLink: string;
}

export interface OnlineMidEvaluationEmailData {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  registrationNumber?: string;
  slots: EvaluationSlot[];
  customNotes?: string;
}

export function renderEmailShell(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #09090b;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
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
    .content {
      padding: 28px 24px;
    }
    a {
      color: #000000;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5;">
  <div class="wrapper">
    <div class="header">
      <div style="display: inline-block; background: #facc15; color: #000000; font-weight: 900; font-size: 11px; padding: 3px 8px; border: 2px solid #000000; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; font-family: monospace;">
        HACKVERSE '26
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; color: #ffffff;">CodeBreakers — GCE Kalahandi</h1>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
  </div>
</body>
</html>
  `;
}

export function generateOnlineMidEvaluationEmailHtml(data: OnlineMidEvaluationEmailData): string {
  const countWord = data.slots.length === 1 ? "one Problem Statement" : `${data.slots.length} Problem Statements`;

  const slotsHtml = data.slots
    .map(
      (slot, idx) => `
    <div style="border: 3px solid #000000; background: #fafafa; padding: 18px; margin: 16px 0; box-shadow: 4px 4px 0px #000000;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 12px;">
        <span style="font-family: monospace; font-size: 13px; font-weight: 900; background: #000000; color: #facc15; padding: 3px 10px; text-transform: uppercase;">
          Problem Statement ${idx + 1}
        </span>
        <span style="font-family: monospace; font-size: 12px; font-weight: 900; color: #000000; background: #e4e4e7; padding: 3px 8px; border: 1.5px solid #000000;">
          PS ID: ${slot.psId || "N/A"}
        </span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #52525b; vertical-align: top;">Problem Statement:</td>
          <td style="padding: 6px 0; font-weight: 900; color: #000000;">${slot.psTitle || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; color: #52525b;">Date:</td>
          <td style="padding: 6px 0; font-weight: 900; color: #000000; font-family: monospace;">${slot.date || "To be announced"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; color: #52525b;">Time:</td>
          <td style="padding: 6px 0; font-weight: 900; color: #000000; font-family: monospace;">${slot.time || "To be announced"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; color: #52525b; vertical-align: top;">Joining Link:</td>
          <td style="padding: 6px 0;">
            ${
              slot.meetingLink && slot.meetingLink.trim() !== ""
                ? `<a href="${slot.meetingLink.trim()}" target="_blank" style="display: inline-block; background: #facc15; color: #000000; font-weight: 900; padding: 8px 16px; border: 2px solid #000000; text-decoration: none; box-shadow: 2px 2px 0px #000000; font-family: monospace; font-size: 13px;">
                    🔗 JOIN EVALUATION SESSION
                  </a>`
                : `<span style="color: #a1a1aa; font-style: italic;">Link will be shared shortly</span>`
            }
          </td>
        </tr>
      </table>
    </div>
  `
    )
    .join("");

  const contentHtml = `
    <div style="background: #facc15; border: 3px solid #000000; padding: 18px; margin-bottom: 24px; box-shadow: 4px 4px 0px #000000;">
      <div style="color: #000000; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">
        OFFICIAL EVALUATION SCHEDULE
      </div>
      <h2 style="font-size: 22px; font-weight: 900; margin: 6px 0 0 0; color: #000000; text-transform: uppercase; letter-spacing: -0.5px;">
        Online Mid-Evaluation — HACKVERSE ’26
      </h2>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #18181b;">
      Dear <strong>${data.leaderName || "Team Leader"}</strong>,
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #27272a;">
      Greetings from <strong>CodeBreakers, GCE Kalahandi</strong>.
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #27272a;">
      This is to inform you that your team is scheduled to participate in the <strong>Online Mid-Evaluation of HACKVERSE ’26</strong>. Please find your team and evaluation details below:
    </p>

    <div style="border: 3px solid #000000; background: #ffffff; padding: 16px; margin: 20px 0; box-shadow: 4px 4px 0px #000000;">
      <div style="font-size: 12px; font-weight: 900; color: #000000; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #e4e4e7; padding-bottom: 6px;">
        TEAM DETAILS
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 4px 0; font-weight: bold; width: 140px; color: #52525b;">Team Name:</td>
          <td style="padding: 4px 0; font-weight: 900; color: #000000;">${data.teamName} ${data.registrationNumber ? `<span style="font-family: monospace; font-size: 12px; color: #71717a;">(${data.registrationNumber})</span>` : ""}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: bold; color: #52525b;">Team Leader:</td>
          <td style="padding: 4px 0; font-weight: 900; color: #000000;">${data.leaderName}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 24px 0 8px 0;">
      <div style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.5px;">
        SELECTED PROBLEM STATEMENT(S)
      </div>
    </div>

    ${slotsHtml}

    <div style="background: #f4f4f5; border: 2px solid #000000; padding: 14px; font-size: 13px; line-height: 1.6; color: #18181b; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;">
        As your team has selected <strong>${countWord}</strong>, please be prepared to discuss your progress, proposed solution, prototype, and implementation approach for the selected Problem Statement(s) during the evaluation.
      </p>
      <p style="margin: 0 0 10px 0;">
        <strong>SPOC Role:</strong> The Team Leader will serve as the <strong>SPOC (Single Point of Contact)</strong> for the team and is requested to join the session on time and ensure that the required team members are available.
      </p>
      <p style="margin: 0;">
        Please share the joining details with all members of your team and ensure that everyone is prepared for the evaluation.
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #27272a; margin: 16px 0;">
      We look forward to seeing your progress and ideas.
    </p>

    <div style="border-top: 2px dashed #a1a1aa; padding-top: 16px; margin-top: 24px; font-size: 13px; line-height: 1.5; color: #3f3f46;">
      <strong>Best regards,</strong><br>
      <strong>Organising Committee</strong><br>
      HACKVERSE ’26<br>
      CodeBreakers, Government College of Engineering Kalahandi<br>
      Bhawanipatna, Odisha<br>
      <strong>📞 +91 8895220675</strong>
    </div>
  `;

  return renderEmailShell("Online Mid-Evaluation Schedule | HACKVERSE '26", contentHtml);
}

export function generateOnlineMidEvaluationEmailText(data: OnlineMidEvaluationEmailData): string {
  const countWord = data.slots.length === 1 ? "one Problem Statement" : `${data.slots.length} Problem Statements`;

  const slotsText = data.slots
    .map(
      (s, idx) => `Problem Statement ${idx + 1}

PS ID: ${s.psId || "N/A"}
Problem Statement: ${s.psTitle || "N/A"}
Date: ${s.date || "TBD"}
Time: ${s.time || "TBD"}
Joining Link: ${s.meetingLink || "TBD"}`
    )
    .join("\n\n");

  return `Dear ${data.leaderName || "Team Leader"},

Greetings from CodeBreakers, GCE Kalahandi.

This is to inform you that your team is scheduled to participate in the Online Mid-Evaluation of HACKVERSE ’26. Please find your team and evaluation details below:

Team Details
Team Name: ${data.teamName}
Team Leader: ${data.leaderName}

Selected Problem Statement(s)
${slotsText}

As your team has selected ${countWord}, please be prepared to discuss your progress, proposed solution, prototype, and implementation approach for the selected Problem Statement(s) during the evaluation.

The Team Leader will serve as the SPOC (Single Point of Contact) for the team and is requested to join the session on time and ensure that the required team members are available.

Please share the joining details with all members of your team and ensure that everyone is prepared for the evaluation.

We look forward to seeing your progress and ideas.

Best regards,
Organising Committee
HACKVERSE ’26
CodeBreakers, Government College of Engineering Kalahandi
Bhawanipatna, Odisha
+91 8895220675`;
}
