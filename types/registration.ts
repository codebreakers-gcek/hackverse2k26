export type MemberRole =
  | "Leader"
  | "Frontend"
  | "Backend"
  | "AI/ML"
  | "Designer"
  | "Hardware/IoT"
  | "Full Stack";

export interface ParticipantDetails {
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  sameAsPhone?: boolean;
  dateOfBirth?: string;
  branch: string;
  customBranch?: string;
  yearOfStudy: string;
  role: MemberRole;
  githubUsername?: string;
}

export interface TeamMember extends ParticipantDetails {
  rollNumber?: string;
}

export interface CollegeAddress {
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentDetails {
  paymentMode: "FREE_SPONSORED" | "UPI_QR" | "BANK_TRANSFER";
  transactionId?: string;
  upiRefNumber?: string;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "FREE_TIER";
}

export interface DocumentUploads {
  collegeIdFileName?: string;
  collegeIdFileSize?: string;
  collegeIdDriveUrl?: string;
  collegeIdDriveFileId?: string;
  synopsisFileName?: string;
  synopsisFileSize?: string;
  synopsisDriveUrl?: string;
  synopsisDriveFileId?: string;
  githubRepoUrl?: string;
  driveFolderUrl?: string;
}

export interface RegistrationFormData {
  // Step 1: Squad & College Details
  teamName: string;
  collegeName: string;
  collegeAddress: CollegeAddress;

  // Step 2: Leader & Members (Identical Comprehensive Fields)
  teamLeader: ParticipantDetails;
  members: TeamMember[];

  // Step 3: Payment
  paymentDetails: PaymentDetails;

  // Step 4: Documents & Confirmation
  documentUploads: DocumentUploads;
  accommodationRequired?: boolean;
  agreeToGuidelines: boolean;

  // Optional legacy reference
  selectedProblemStatementId?: string;
}

export interface RegistrationSubmissionResult {
  success: boolean;
  registrationId?: string;
  ticketId?: string;
  teamName?: string;
  message: string;
  submittedAt?: string;
  errors?: Record<string, string>;
}
