import * as XLSX from "xlsx";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export interface ExportRegistrationRecord {
  id: string;
  registrationNumber: string;
  teamName: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  problemStatementId?: string;
  status: string;

  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderWhatsapp?: string;
  leaderDob?: string;
  leaderBranch: string;
  leaderCustomBranch?: string;
  leaderYear: string;
  leaderRole?: string;
  leaderGithub?: string;

  members: Array<{
    fullName: string;
    email: string;
    phone?: string;
    whatsappNumber?: string;
    dateOfBirth?: string;
    role?: string;
    branch?: string;
    customBranch?: string;
    yearOfStudy?: string;
    githubUsername?: string;
  }>;

  paymentMode?: string;
  transactionId?: string;
  paymentStatus?: string;
  amount?: number;

  accommodationRequired?: boolean;
  accommodationStatus?: string;
  roomNumber?: string;
  hostelBlock?: string;

  documents?: {
    collegeIdFileName?: string;
    collegeIdFileSize?: string;
    collegeIdDriveUrl?: string;
    collegeIdUrl?: string;
    synopsisFileName?: string;
    synopsisFileSize?: string;
    synopsisDriveUrl?: string;
    synopsisUrl?: string;
    githubRepoUrl?: string;
    driveFolderUrl?: string;
    selectedProblemStatements?: string[];
    problemStatement1?: string;
    problemStatement2?: string;
    psSubmittedAt?: string;
    [key: string]: any;
  };

  createdAt: string;
  updatedAt: string;
}

// Helper to resolve problem statement info
function resolveProblemStatement(idOrCode?: string | null) {
  if (!idOrCode) return { code: "UNASSIGNED", title: "No Problem Statement Selected" };
  const found = PROBLEM_STATEMENTS_DATA.find(
    (p) =>
      p.id.toLowerCase() === idOrCode.toLowerCase() ||
      p.code.toLowerCase() === idOrCode.toLowerCase()
  );
  if (found) {
    return { code: found.code, title: found.title };
  }
  return { code: idOrCode, title: idOrCode };
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return isoString;
  }
}

/**
 * 1. EXPORT SQUADS & ROSTERS TO EXCEL (.XLSX)
 * Generates a workbook with 2 sheets:
 *  - "Squads Overview": Full team records, leader contacts, tracks, and documents
 *  - "Participant Roster": Individual row for every single team member & leader
 */
export function exportSquadsAndRostersExcel(registrations: ExportRegistrationRecord[]) {
  if (!registrations || registrations.length === 0) {
    throw new Error("No squad registrations available to export.");
  }

  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: Squads Overview
  // -------------------------------------------------------------
  const squadsData = registrations.map((squad, index) => {
    const docs = squad.documents || {};
    const selectedList: string[] = Array.isArray(docs.selectedProblemStatements)
      ? docs.selectedProblemStatements
      : [];
    const p1Raw = squad.problemStatementId || docs.problemStatement1 || selectedList[0] || null;
    const p2Raw = docs.problemStatement2 || selectedList[1] || null;

    const p1Info = resolveProblemStatement(p1Raw);
    const p2Info = p2Raw ? resolveProblemStatement(p2Raw) : { code: "-", title: "-" };

    const member1 = squad.members?.[0];
    const member2 = squad.members?.[1];
    const member3 = squad.members?.[2];

    return {
      "Sl No": index + 1,
      "Ticket ID": squad.registrationNumber || "N/A",
      "Squad Name": squad.teamName || "N/A",
      "Registration Status": squad.status || "PENDING_VERIFICATION",
      "College / Institution": squad.collegeName || "N/A",
      "College City": squad.collegeAddress?.city || "",
      "College State": squad.collegeAddress?.state || "",
      "College Pincode": squad.collegeAddress?.pincode || "",
      "College Full Address": squad.collegeAddress?.fullAddress || "",
      "Primary Track Code": p1Info.code,
      "Primary Track Title": p1Info.title,
      "Secondary Track Code": p2Info.code,
      "Secondary Track Title": p2Info.title,
      "Team Leader Name": squad.leaderName || "",
      "Leader Email": squad.leaderEmail || "",
      "Leader Phone": squad.leaderPhone || "",
      "Leader WhatsApp": squad.leaderWhatsapp || "",
      "Leader Branch": squad.leaderCustomBranch || squad.leaderBranch || "",
      "Leader Year": squad.leaderYear || "",
      "Leader Role": squad.leaderRole || "Team Lead",
      "Leader GitHub": squad.leaderGithub || "",
      "Total Squad Size": 1 + (squad.members?.length || 0),
      "Member 1 Name": member1?.fullName || "",
      "Member 1 Email": member1?.email || "",
      "Member 1 Phone": member1?.phone || "",
      "Member 1 Branch": member1?.customBranch || member1?.branch || "",
      "Member 1 Role": member1?.role || "",
      "Member 2 Name": member2?.fullName || "",
      "Member 2 Email": member2?.email || "",
      "Member 2 Phone": member2?.phone || "",
      "Member 2 Branch": member2?.customBranch || member2?.branch || "",
      "Member 2 Role": member2?.role || "",
      "Member 3 Name": member3?.fullName || "",
      "Member 3 Email": member3?.email || "",
      "Member 3 Phone": member3?.phone || "",
      "Member 3 Branch": member3?.customBranch || member3?.branch || "",
      "Member 3 Role": member3?.role || "",
      "Payment Status": squad.paymentStatus || "PENDING",
      "Payment Mode": squad.paymentMode || "UPI_QR",
      "Transaction UTR": squad.transactionId || "N/A",
      "Amount (INR)": squad.amount ?? 0,
      "Hostel Accommodation": squad.accommodationRequired ? "YES" : "NO",
      "Hostel Status": squad.accommodationStatus || (squad.accommodationRequired ? "REQUESTED" : "NOT_REQUESTED"),
      "Hostel Block": squad.hostelBlock || "",
      "Hostel Room": squad.roomNumber || "",
      "College ID File / Link": docs.collegeIdDriveUrl || docs.collegeIdUrl || docs.collegeIdFileName || "",
      "Synopsis File / Link": docs.synopsisDriveUrl || docs.synopsisUrl || docs.synopsisFileName || "",
      "Registered At (IST)": formatDate(squad.createdAt),
      "Last Updated (IST)": formatDate(squad.updatedAt),
    };
  });

  const wsSquads = XLSX.utils.json_to_sheet(squadsData);
  wsSquads["!cols"] = [
    { wch: 6 },  // Sl No
    { wch: 16 }, // Ticket ID
    { wch: 22 }, // Squad Name
    { wch: 18 }, // Status
    { wch: 32 }, // College
    { wch: 16 }, // City
    { wch: 16 }, // State
    { wch: 12 }, // Pincode
    { wch: 30 }, // Full Address
    { wch: 16 }, // Track 1 Code
    { wch: 40 }, // Track 1 Title
    { wch: 16 }, // Track 2 Code
    { wch: 30 }, // Track 2 Title
    { wch: 20 }, // Leader Name
    { wch: 26 }, // Leader Email
    { wch: 15 }, // Leader Phone
    { wch: 15 }, // Leader WhatsApp
    { wch: 20 }, // Leader Branch
    { wch: 12 }, // Leader Year
    { wch: 16 }, // Leader Role
    { wch: 16 }, // Leader GitHub
    { wch: 14 }, // Total Squad Size
    { wch: 20 }, // Member 1 Name
    { wch: 24 }, // Member 1 Email
    { wch: 14 }, // Member 1 Phone
    { wch: 18 }, // Member 1 Branch
    { wch: 14 }, // Member 1 Role
    { wch: 20 }, // Member 2 Name
    { wch: 24 }, // Member 2 Email
    { wch: 14 }, // Member 2 Phone
    { wch: 18 }, // Member 2 Branch
    { wch: 14 }, // Member 2 Role
    { wch: 20 }, // Member 3 Name
    { wch: 24 }, // Member 3 Email
    { wch: 14 }, // Member 3 Phone
    { wch: 18 }, // Member 3 Branch
    { wch: 14 }, // Member 3 Role
    { wch: 16 }, // Payment Status
    { wch: 14 }, // Payment Mode
    { wch: 20 }, // Transaction UTR
    { wch: 12 }, // Amount
    { wch: 18 }, // Hostel
    { wch: 16 }, // Hostel Status
    { wch: 14 }, // Block
    { wch: 14 }, // Room
    { wch: 35 }, // College ID
    { wch: 35 }, // Synopsis
    { wch: 22 }, // Registered At
    { wch: 22 }, // Updated At
  ];

  XLSX.utils.book_append_sheet(wb, wsSquads, "Squads Overview");

  // -------------------------------------------------------------
  // Sheet 2: Participant Roster (Individual Row Per Hacker)
  // -------------------------------------------------------------
  const rosterData: any[] = [];
  let participantSlNo = 1;

  registrations.forEach((squad) => {
    const docs = squad.documents || {};
    const selectedList: string[] = Array.isArray(docs.selectedProblemStatements)
      ? docs.selectedProblemStatements
      : [];
    const p1Raw = squad.problemStatementId || docs.problemStatement1 || selectedList[0] || null;
    const p1Info = resolveProblemStatement(p1Raw);

    // 1. Team Leader
    rosterData.push({
      "Sl No": participantSlNo++,
      "Ticket ID": squad.registrationNumber,
      "Squad Name": squad.teamName,
      "Participant Type": "TEAM LEADER",
      "Full Name": squad.leaderName,
      "Email Address": squad.leaderEmail,
      "Phone Number": squad.leaderPhone,
      "WhatsApp Number": squad.leaderWhatsapp || "",
      "College / Institution": squad.collegeName,
      "Branch / Specialization": squad.leaderCustomBranch || squad.leaderBranch || "",
      "Year of Study": squad.leaderYear || "",
      "Designation / Role": squad.leaderRole || "Team Lead",
      "GitHub Profile": squad.leaderGithub || "",
      "Squad Status": squad.status,
      "Primary Track": `${p1Info.code} - ${p1Info.title}`,
      "Hostel Required": squad.accommodationRequired ? "YES" : "NO",
      "Hostel Allocation": squad.hostelBlock ? `${squad.hostelBlock} - Room ${squad.roomNumber}` : squad.accommodationRequired ? "PENDING" : "NO",
      "Payment Verified": squad.paymentStatus === "VERIFIED" ? "YES" : "NO",
      "Registration Date": formatDate(squad.createdAt),
    });

    // 2. Members
    (squad.members || []).forEach((member, mIdx) => {
      rosterData.push({
        "Sl No": participantSlNo++,
        "Ticket ID": squad.registrationNumber,
        "Squad Name": squad.teamName,
        "Participant Type": `TEAM MEMBER ${mIdx + 1}`,
        "Full Name": member.fullName,
        "Email Address": member.email,
        "Phone Number": member.phone || "",
        "WhatsApp Number": member.whatsappNumber || "",
        "College / Institution": squad.collegeName,
        "Branch / Specialization": member.customBranch || member.branch || "",
        "Year of Study": member.yearOfStudy || "",
        "Designation / Role": member.role || "Member",
        "GitHub Profile": member.githubUsername || "",
        "Squad Status": squad.status,
        "Primary Track": `${p1Info.code} - ${p1Info.title}`,
        "Hostel Required": squad.accommodationRequired ? "YES" : "NO",
        "Hostel Allocation": squad.hostelBlock ? `${squad.hostelBlock} - Room ${squad.roomNumber}` : squad.accommodationRequired ? "PENDING" : "NO",
        "Payment Verified": squad.paymentStatus === "VERIFIED" ? "YES" : "NO",
        "Registration Date": formatDate(squad.createdAt),
      });
    });
  });

  const wsRoster = XLSX.utils.json_to_sheet(rosterData);
  wsRoster["!cols"] = [
    { wch: 6 },  // Sl No
    { wch: 16 }, // Ticket ID
    { wch: 22 }, // Squad Name
    { wch: 18 }, // Type
    { wch: 22 }, // Full Name
    { wch: 26 }, // Email
    { wch: 15 }, // Phone
    { wch: 15 }, // WhatsApp
    { wch: 32 }, // College
    { wch: 22 }, // Branch
    { wch: 14 }, // Year
    { wch: 18 }, // Role
    { wch: 18 }, // GitHub
    { wch: 16 }, // Status
    { wch: 36 }, // Primary Track
    { wch: 16 }, // Hostel
    { wch: 20 }, // Allocation
    { wch: 16 }, // Payment Verified
    { wch: 22 }, // Date
  ];

  XLSX.utils.book_append_sheet(wb, wsRoster, "Participant Roster");

  // Output File
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Hackverse2026_Squads_and_Rosters_${dateStr}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
}

/**
 * 2. EXPORT PAYMENT DETAILS TO EXCEL (.XLSX)
 * Generates a workbook with 2 sheets:
 *  - "Payment Audit & Ledger": Full transaction details, UTR numbers, amounts, and verification statuses
 *  - "Financial Summary": Metric aggregates and status breakdown
 */
export function exportPaymentDetailsExcel(registrations: ExportRegistrationRecord[]) {
  if (!registrations || registrations.length === 0) {
    throw new Error("No registration records available for payment export.");
  }

  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: Payment Audit & Ledger
  // -------------------------------------------------------------
  const paymentLedgerData = registrations.map((squad, index) => {
    const docs = squad.documents || {};
    return {
      "Sl No": index + 1,
      "Ticket ID": squad.registrationNumber || "N/A",
      "Squad Name": squad.teamName || "N/A",
      "College / Institution": squad.collegeName || "N/A",
      "College Location": `${squad.collegeAddress?.city || ""}${squad.collegeAddress?.state ? ", " + squad.collegeAddress.state : ""}`,
      "Team Leader Name": squad.leaderName || "",
      "Leader Email": squad.leaderEmail || "",
      "Leader Phone": squad.leaderPhone || "",
      "Total Squad Size": 1 + (squad.members?.length || 0),
      "Payment Status": squad.paymentStatus || "PENDING",
      "Payment Mode": squad.paymentMode || "UPI_QR",
      "Transaction ID / UTR": squad.transactionId || "N/A",
      "Amount (INR)": squad.amount ?? 0,
      "Registration Status": squad.status || "PENDING_VERIFICATION",
      "Hostel Accommodation": squad.accommodationRequired ? "YES" : "NO",
      "Payment Proof URL": docs.paymentProofUrl || docs.collegeIdDriveUrl || "",
      "Registered At (IST)": formatDate(squad.createdAt),
      "Last Audited (IST)": formatDate(squad.updatedAt),
    };
  });

  const wsPayment = XLSX.utils.json_to_sheet(paymentLedgerData);
  wsPayment["!cols"] = [
    { wch: 6 },  // Sl No
    { wch: 16 }, // Ticket ID
    { wch: 22 }, // Squad Name
    { wch: 32 }, // College
    { wch: 24 }, // Location
    { wch: 20 }, // Leader Name
    { wch: 26 }, // Leader Email
    { wch: 15 }, // Leader Phone
    { wch: 14 }, // Total Squad Size
    { wch: 18 }, // Payment Status
    { wch: 16 }, // Payment Mode
    { wch: 24 }, // UTR
    { wch: 14 }, // Amount
    { wch: 20 }, // Reg Status
    { wch: 18 }, // Hostel
    { wch: 35 }, // Proof URL
    { wch: 22 }, // Registered At
    { wch: 22 }, // Last Audited
  ];

  XLSX.utils.book_append_sheet(wb, wsPayment, "Payment Audit & Ledger");

  // -------------------------------------------------------------
  // Sheet 2: Financial Summary Metrics
  // -------------------------------------------------------------
  const totalSquads = registrations.length;
  const verifiedPayments = registrations.filter((r) => r.paymentStatus === "VERIFIED");
  const pendingPayments = registrations.filter((r) => r.paymentStatus === "PENDING");
  const rejectedPayments = registrations.filter((r) => r.paymentStatus === "REJECTED");
  const freeTierPayments = registrations.filter((r) => !r.paymentStatus || r.paymentStatus === "FREE_TIER");

  const totalCollectedAmount = verifiedPayments.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalPendingAmount = pendingPayments.reduce((sum, r) => sum + (r.amount || 0), 0);

  const summaryData = [
    { "Metric": "Total Registered Squads", "Value": totalSquads },
    { "Metric": "Verified Payments (Approved)", "Value": verifiedPayments.length },
    { "Metric": "Pending Payment Audits (UTR Submitted)", "Value": pendingPayments.length },
    { "Metric": "Rejected / Disputed Payments", "Value": rejectedPayments.length },
    { "Metric": "Free Tier / Direct Registrations", "Value": freeTierPayments.length },
    { "Metric": "Total Revenue Verified (INR)", "Value": `Rs. ${totalCollectedAmount}` },
    { "Metric": "Estimated Pending Amount (INR)", "Value": `Rs. ${totalPendingAmount}` },
    { "Metric": "Report Generated On", "Value": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary["!cols"] = [
    { wch: 36 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, "Financial Summary");

  // Output File
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Hackverse2026_Payment_Details_Export_${dateStr}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
}
