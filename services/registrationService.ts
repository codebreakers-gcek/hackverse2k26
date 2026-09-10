import { ENV } from "@/config/env";
import { RegistrationFormData, RegistrationSubmissionResult } from "@/types/registration";
import { apiClient } from "./api";

/**
 * Validates Step 1: Squad & College Details
 */
export function validateStep1(data: RegistrationFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.teamName || data.teamName.trim().length < 3) {
    errors.teamName = "Team name must be at least 3 characters long.";
  }

  if (!data.collegeName || data.collegeName.trim().length < 2) {
    errors.collegeName = "Please enter your college or institution name.";
  }

  if (!data.collegeAddress.fullAddress || data.collegeAddress.fullAddress.trim().length < 5) {
    errors["collegeAddress.fullAddress"] = "Please enter the college street address / campus location.";
  }

  if (!data.collegeAddress.city || data.collegeAddress.city.trim().length < 2) {
    errors["collegeAddress.city"] = "Please enter the city or district.";
  }

  if (!data.collegeAddress.state || data.collegeAddress.state.trim().length < 2) {
    errors["collegeAddress.state"] = "Please select or enter the state.";
  }

  const pinRegex = /^\d{6}$/;
  if (!data.collegeAddress.pincode || !pinRegex.test(data.collegeAddress.pincode.trim())) {
    errors["collegeAddress.pincode"] = "Enter a valid 6-digit postal PIN code.";
  }

  return errors;
}

/**
 * Validates Step 2: Leader & Team Members
 */
export function validateStep2(data: RegistrationFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  // Leader validation
  if (!data.teamLeader.fullName || data.teamLeader.fullName.trim().length < 2) {
    errors["teamLeader.fullName"] = "Leader full name is required.";
  }

  if (!data.teamLeader.email || !emailRegex.test(data.teamLeader.email.trim())) {
    errors["teamLeader.email"] = "Please enter a valid leader email address.";
  }

  const cleanLeaderPhone = data.teamLeader.phone?.replace(/[\s\-+]/g, "").slice(-10) || "";
  if (!phoneRegex.test(cleanLeaderPhone)) {
    errors["teamLeader.phone"] = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!data.teamLeader.sameAsPhone && data.teamLeader.whatsappNumber) {
    const cleanLeaderWa = data.teamLeader.whatsappNumber.replace(/[\s\-+]/g, "").slice(-10);
    if (!phoneRegex.test(cleanLeaderWa)) {
      errors["teamLeader.whatsappNumber"] = "Enter a valid 10-digit WhatsApp number.";
    }
  }

  if (!data.teamLeader.dateOfBirth) {
    errors["teamLeader.dateOfBirth"] = "Please select leader's date of birth.";
  }

  if (!data.teamLeader.branch) {
    errors["teamLeader.branch"] = "Please select an engineering branch / department.";
  } else if (data.teamLeader.branch === "Other" && (!data.teamLeader.customBranch || data.teamLeader.customBranch.trim().length < 2)) {
    errors["teamLeader.customBranch"] = "Please specify your branch / specialization.";
  }

  if (!data.teamLeader.yearOfStudy) {
    errors["teamLeader.yearOfStudy"] = "Select current year of study.";
  }

  // Squad Size Validation: Min 2 members (1 Leader + 1 Member), Max 4 members (1 Leader + 3 Members)
  if (!data.members || data.members.length < 1) {
    errors["members"] = "A squad must have a minimum of 2 members (1 Leader + at least 1 Co-hacker).";
  } else if (data.members.length > 3) {
    errors["members"] = "A squad can have a maximum of 4 members (1 Leader + up to 3 Co-hackers).";
  }

  // Additional members validation (identical to leader requirements)
  data.members.forEach((member, index) => {
    if (!member.fullName || member.fullName.trim().length < 2) {
      errors[`members.${index}.fullName`] = `Member ${index + 2} full name is required.`;
    }
    if (!member.email || !emailRegex.test(member.email.trim())) {
      errors[`members.${index}.email`] = `Member ${index + 2} valid email is required.`;
    }
    const cleanMemberPhone = member.phone?.replace(/[\s\-+]/g, "").slice(-10) || "";
    if (!cleanMemberPhone || !phoneRegex.test(cleanMemberPhone)) {
      errors[`members.${index}.phone`] = `Member ${index + 2} valid 10-digit mobile number is required.`;
    }
    if (!member.sameAsPhone && member.whatsappNumber) {
      const cleanMemberWa = member.whatsappNumber.replace(/[\s\-+]/g, "").slice(-10);
      if (!phoneRegex.test(cleanMemberWa)) {
        errors[`members.${index}.whatsappNumber`] = `Member ${index + 2} valid 10-digit WhatsApp number is required.`;
      }
    }
    if (!member.dateOfBirth) {
      errors[`members.${index}.dateOfBirth`] = `Member ${index + 2} date of birth is required.`;
    }
    if (!member.branch) {
      errors[`members.${index}.branch`] = `Member ${index + 2} branch is required.`;
    } else if (member.branch === "Other" && (!member.customBranch || member.customBranch.trim().length < 2)) {
      errors[`members.${index}.customBranch`] = `Specify branch for Member ${index + 2}.`;
    }
    if (!member.yearOfStudy) {
      errors[`members.${index}.yearOfStudy`] = `Member ${index + 2} year of study is required.`;
    }
  });

  return errors;
}

/**
 * Validates Step 3: Payment
 */
export function validateStep3(data: RegistrationFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (data.paymentDetails.paymentMode !== "FREE_SPONSORED") {
    if (!data.paymentDetails.transactionId || data.paymentDetails.transactionId.trim().length < 4) {
      errors["paymentDetails.transactionId"] = "Please enter your transaction reference ID / UTR.";
    }
  }
  return errors;
}

/**
 * Validates Step 4: Documents & Final Agreement
 */
export function validateStep4(data: RegistrationFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const hasPaymentProof =
    (data.documentUploads?.paymentProofFileName && data.documentUploads.paymentProofFileName.trim().length > 0) ||
    (data.documentUploads?.collegeIdFileName && data.documentUploads.collegeIdFileName.trim().length > 0);

  const hasAuthLetter =
    (data.documentUploads?.authorizationLetterFileName && data.documentUploads.authorizationLetterFileName.trim().length > 0) ||
    (data.documentUploads?.synopsisFileName && data.documentUploads.synopsisFileName.trim().length > 0);

  if (!hasPaymentProof) {
    errors["documentUploads.paymentProofFileName"] = "Payment proof / transaction screenshot is required.";
  }

  if (!hasAuthLetter) {
    errors["documentUploads.authorizationLetterFileName"] = "Institutional authorization letter / NOC format is required.";
  }

  if (!data.agreeToGuidelines) {
    errors.agreeToGuidelines = "You must accept the Hackathon Guidelines and Code of Conduct.";
  }

  return errors;
}

/**
 * Validates whole registration form
 */
export function validateRegistrationForm(data: RegistrationFormData): Record<string, string> {
  return {
    ...validateStep1(data),
    ...validateStep2(data),
    ...validateStep3(data),
    ...validateStep4(data),
  };
}

export const registrationService = {
  async submitRegistration(data: RegistrationFormData): Promise<RegistrationSubmissionResult> {
    // 1. Run client-side validation
    const validationErrors = validateRegistrationForm(data);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        message: "Please correct the highlighted form errors before submitting.",
        errors: validationErrors,
      };
    }

    try {
      // 2. Real REST Backend execution: POST /api/registrations
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Submission failed. Please check your network and retry.",
          errors: result.errors,
        };
      }

      return result;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Failed to reach registration server. Please retry.",
      };
    }
  },

  async updateRegistration(data: RegistrationFormData): Promise<RegistrationSubmissionResult> {
    // 1. Run client-side validation
    const validationErrors = validateRegistrationForm(data);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        message: "Please correct the highlighted form errors before saving changes.",
        errors: validationErrors,
      };
    }

    try {
      // 2. Real REST Backend execution: PUT /api/registrations
      const res = await fetch("/api/registrations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Failed to update registration details.",
          errors: result.errors,
        };
      }

      return result;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Failed to reach registration server to update details.",
      };
    }
  },
};
