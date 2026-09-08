import { ENV } from "@/config/env";
import { RegistrationFormData, RegistrationSubmissionResult } from "@/types/registration";
import { apiClient } from "./api";

/**
 * Validates registration form data on client side.
 * Note: Client-side validation improves user experience, but server-side validation is still mandatory on backend.
 */
export function validateRegistrationForm(data: RegistrationFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.teamName || data.teamName.trim().length < 3) {
    errors.teamName = "Team name must be at least 3 characters long.";
  }

  if (!data.collegeName || data.collegeName.trim().length < 2) {
    errors.collegeName = "Please enter your college or institution name.";
  }

  if (!data.selectedProblemStatementId) {
    errors.selectedProblemStatementId = "Please select a problem statement or track.";
  }

  // Leader validation
  if (!data.teamLeader.fullName || data.teamLeader.fullName.trim().length < 2) {
    errors["teamLeader.fullName"] = "Leader full name is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.teamLeader.email || !emailRegex.test(data.teamLeader.email.trim())) {
    errors["teamLeader.email"] = "Please enter a valid leader email address.";
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = data.teamLeader.phone.replace(/[\s\-+]/g, "").slice(-10);
  if (!phoneRegex.test(cleanPhone)) {
    errors["teamLeader.phone"] = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!data.teamLeader.branch || data.teamLeader.branch.trim().length < 2) {
    errors["teamLeader.branch"] = "Leader engineering branch is required (e.g., CSE, EE).";
  }

  if (!data.teamLeader.yearOfStudy) {
    errors["teamLeader.yearOfStudy"] = "Select current year of study.";
  }

  // Additional members validation
  data.members.forEach((member, index) => {
    if (!member.fullName || member.fullName.trim().length < 2) {
      errors[`members.${index}.fullName`] = `Member ${index + 2} name is required.`;
    }
    if (!member.email || !emailRegex.test(member.email.trim())) {
      errors[`members.${index}.email`] = `Member ${index + 2} valid email is required.`;
    }
  });

  if (!data.agreeToGuidelines) {
    errors.agreeToGuidelines = "You must accept the Hackathon Guidelines and Code of Conduct.";
  }

  return errors;
}

export const registrationService = {
  async submitRegistration(data: RegistrationFormData): Promise<RegistrationSubmissionResult> {
    // 1. Run client-side validation
    const validationErrors = validateRegistrationForm(data);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        message: "Please correct the highlighted form errors.",
        errors: validationErrors,
      };
    }

    // 2. Mock mode execution
    if (ENV.USE_MOCK_API) {
      // Simulate real network latency (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Generate deterministic pass / ticket ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `HACKVERSE-GCEK-${randomSuffix}`;
      const registrationId = `REG-${Date.now().toString().slice(-6)}`;

      return {
        success: true,
        registrationId,
        ticketId,
        teamName: data.teamName,
        submittedAt: new Date().toISOString(),
        message: `Registration confirmed for ${data.teamName}! Your digital pass has been generated.`,
      };
    }

    // 3. Real REST Backend execution: POST /api/registrations
    const response = await apiClient<RegistrationSubmissionResult>("/registrations", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.error || !response.data) {
      return {
        success: false,
        message: response.error || "Submission failed. Please check your network and retry.",
      };
    }

    return response.data;
  },
};
