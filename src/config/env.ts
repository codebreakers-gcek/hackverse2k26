/**
 * Centralized Application Configuration
 * Ready for seamless transition between Mock Data and future backend API
 */
export const ENV = {
  // API base URL configured via environment variable (or defaults to mock API)
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  
  // Flag to enforce local mock simulation when no external backend is connected
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",

  // Application Metadata
  APP_NAME: "INNOVEX '26 // CODEBREAKERS GCEK",
  ORG_NAME: "CodeBreakers - GCE Kalahandi",
  COLLEGE_NAME: "Government College of Engineering Kalahandi, Bhawanipatna",
  OFFICIAL_CLUB_URL: "https://www.codebreakersgcek.tech",
  COLLEGE_URL: "https://www.gcekbpatna.ac.in",
  CONTACT_EMAIL: "info@codebreakers.tech",
  SUPPORT_EMAIL: "cse.codebreaker@gcekbpatna.ac.in",
} as const;
