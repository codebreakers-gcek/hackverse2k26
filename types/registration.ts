export type MemberRole = "Leader" | "Frontend" | "Backend" | "AI/ML" | "Designer" | "Hardware/IoT" | "Full Stack";

export interface TeamMember {
  fullName: string;
  email: string;
  phone: string;
  role: MemberRole;
  rollNumber?: string;
  githubUsername?: string;
}

export interface RegistrationFormData {
  teamName: string;
  collegeName: string;
  teamLeader: {
    fullName: string;
    email: string;
    phone: string;
    branch: string;
    yearOfStudy: string;
    githubUsername?: string;
  };
  members: TeamMember[]; // Additional 0 to 3 members
  selectedProblemStatementId: string;
  projectTitleIdea?: string;
  agreeToGuidelines: boolean;
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
