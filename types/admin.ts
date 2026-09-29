export interface MemberRecord {
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
}

export interface RegistrationRecord {
  id: string;
  registrationNumber: string;
  teamName: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    street?: string;
  };
  problemStatementId?: string | null;
  status: "CONFIRMED" | "PENDING_VERIFICATION" | "REJECTED" | string;

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

  members: MemberRecord[];

  paymentMode?: string;
  transactionId?: string;
  paymentStatus?: "VERIFIED" | "PENDING" | "REJECTED" | "FREE_TIER" | string;
  amount?: number;

  accommodationRequired?: boolean;
  accommodationStatus?: "REQUESTED" | "ALLOCATED" | "REJECTED" | "NOT_REQUESTED" | string;
  roomNumber?: string;
  hostelBlock?: string;

  documents?: {
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
    [key: string]: any;
  } | null;

  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalSquads: number;
  totalParticipants: number;
  confirmedTeams: number;
  pendingTeams: number;
  rejectedTeams: number;
  accommodationRequested: number;
  accommodationAllocated: number;
  paymentVerified: number;
  paymentPending: number;
  paymentFreeTier: number;
  psDistribution?: Record<string, number>;
}

export interface SystemSettingsState {
  upiId: string;
  payeeName: string;
  registrationFee: number;
  isPaymentMandatory: boolean;
  isRegistrationOpen: boolean;
  isProblemStatementsPublished: boolean;
  minSquadSize: number;
  maxSquadSize: number;
  contactPhone?: string;
  contactEmail?: string;
  judgeAuthPin?: string;
  googleDriveEnabled?: boolean;
  googleDriveAuthType?: string;
  googleDriveConnectedEmail?: string;
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  googleDriveClientEmail?: string;
  googleDrivePrivateKey?: string;
  googleDriveServiceAccountJson?: string;
}

export interface ScannerPinSession {
  id: string;
  label?: string;
  role?: string;
  activeDeviceCount: number;
  createdAt: string;
  expiresAt: string;
  ipAddresses?: string[];
  userAgents?: string[];
}

export interface ScannerPinData {
  active: boolean;
  pin?: string;
  role?: string;
  label?: string;
  remainingSeconds: number;
  session?: ScannerPinSession | null;
  history?: ScannerPinSession[];
}
