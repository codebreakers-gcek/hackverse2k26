"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { registrationService } from "@/services/registrationService";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import {
  RegistrationFormData,
  TeamMember,
  RegistrationSubmissionResult,
  MemberRole,
} from "@/types/registration";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/ButtonNeo";
import { RegistrationSuccessReceipt } from "./RegistrationSuccessReceipt";
import { Plus, Trash2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export function RegistrationForm() {
  const searchParams = useSearchParams();
  const preselectedPsId = searchParams?.get("psId") || "";

  const initialFormState: RegistrationFormData = {
    teamName: "",
    collegeName: "",
    selectedProblemStatementId: preselectedPsId || (PROBLEM_STATEMENTS_DATA[0]?.id ?? ""),
    teamLeader: {
      fullName: "",
      email: "",
      phone: "",
      branch: "Computer Science & Engineering",
      yearOfStudy: "3rd Year",
      githubUsername: "",
    },
    members: [],
    agreeToGuidelines: false,
  };

  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<RegistrationSubmissionResult | null>(null);

  // Sync preselected ID from URL if provided
  useEffect(() => {
    if (preselectedPsId) {
      setFormData((prev) => ({
        ...prev,
        selectedProblemStatementId: preselectedPsId,
      }));
    }
  }, [preselectedPsId]);

  // Handle Leader inputs
  const handleLeaderChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      teamLeader: {
        ...prev.teamLeader,
        [field]: value,
      },
    }));
    // Clear error
    if (errors[`teamLeader.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`teamLeader.${field}`];
        return next;
      });
    }
  };

  // Add Member (Max 4 total team size: 1 leader + 3 members)
  const handleAddMember = () => {
    if (formData.members.length >= 3) return;
    const newMember: TeamMember = {
      fullName: "",
      email: "",
      phone: "",
      role: "Frontend",
    };
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  // Remove Member
  const handleRemoveMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    // Remove errors associated with this member
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`members.${index}.fullName`];
      delete next[`members.${index}.email`];
      return next;
    });
  };

  // Handle Member change
  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.members];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, members: updated };
    });

    if (errors[`members.${index}.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`members.${index}.${field}`];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await registrationService.submitRegistration(formData);
      if (result.success) {
        setSubmissionResult(result);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: result.message });
        }
      }
    } catch {
      setErrors({ form: "Unexpected submission error. Please check your network and retry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubmissionResult(null);
  };

  if (submissionResult) {
    return <RegistrationSuccessReceipt result={submissionResult} onReset={handleResetForm} />;
  }

  const roleOptions: { value: MemberRole; label: string }[] = [
    { value: "Frontend", label: "Frontend Engineer" },
    { value: "Backend", label: "Backend / Systems Engineer" },
    { value: "AI/ML", label: "AI / ML Specialist" },
    { value: "Full Stack", label: "Full Stack Generalist" },
    { value: "Designer", label: "UI / UX Designer" },
    { value: "Hardware/IoT", label: "Hardware / IoT Engineer" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* General Form Error Alert */}
      {errors.form && (
        <div className="border-4 border-black bg-neo-accent p-4 shadow-neo text-black flex items-center gap-3">
          <AlertCircle className="w-6 h-6 stroke-[3px] shrink-0" />
          <p className="font-black text-sm">{errors.form}</p>
        </div>
      )}

      {/* Block 1: Squad Profile & College */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="border-b-4 border-black pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
              01
            </span>
            <h3 className="font-black text-xl text-black uppercase tracking-tight">
              SQUAD PROFILE &amp; INSTITUTION
            </h3>
          </div>
          <span className="font-mono text-[10px] font-bold text-black/60 hidden sm:inline">
            REQUIRED FIELDS MARKED *
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="TEAM NAME"
            required
            placeholder="e.g. CyberVanguard, NeuralBytes"
            value={formData.teamName}
            onChange={(e) => {
              setFormData({ ...formData, teamName: e.target.value });
              if (errors.teamName) setErrors((prev) => ({ ...prev, teamName: "" }));
            }}
            error={errors.teamName}
            helperText="A unique, creative name for your hackathon squad."
          />

          <Input
            label="COLLEGE / INSTITUTION NAME"
            required
            placeholder="e.g. Government College of Engineering Kalahandi"
            value={formData.collegeName}
            onChange={(e) => {
              setFormData({ ...formData, collegeName: e.target.value });
              if (errors.collegeName) setErrors((prev) => ({ ...prev, collegeName: "" }));
            }}
            error={errors.collegeName}
            helperText="Your university, engineering college, or polytechnic campus."
          />
        </div>

        {/* Problem Statement Selection */}
        <div>
          <Select
            label="SELECT PROBLEM STATEMENT TRACK"
            required
            value={formData.selectedProblemStatementId}
            onChange={(e) => {
              setFormData({ ...formData, selectedProblemStatementId: e.target.value });
              if (errors.selectedProblemStatementId) {
                setErrors((prev) => ({ ...prev, selectedProblemStatementId: "" }));
              }
            }}
            error={errors.selectedProblemStatementId}
            helperText="Select which challenge specification your team will address during the 36-hour sprint."
          >
            {PROBLEM_STATEMENTS_DATA.map((ps) => (
              <option key={ps.id} value={ps.id}>
                [{ps.code}] {ps.title} ({ps.category} - {ps.difficulty})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Block 2: Primary Team Leader Details */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="border-b-4 border-black pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-neo-accent text-black">
              02
            </span>
            <h3 className="font-black text-xl text-black uppercase tracking-tight">
              TEAM LEADER CREDENTIALS
            </h3>
          </div>
          <span className="font-mono text-xs font-black uppercase bg-neo-secondary px-2 py-0.5 border border-black">
            PRIMARY LIAISON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="LEADER FULL NAME"
            required
            placeholder="e.g. Sambit Kumar Jena"
            value={formData.teamLeader.fullName}
            onChange={(e) => handleLeaderChange("fullName", e.target.value)}
            error={errors["teamLeader.fullName"]}
          />

          <Input
            label="LEADER EMAIL ADDRESS"
            required
            type="email"
            placeholder="e.g. leader@college.edu.in"
            value={formData.teamLeader.email}
            onChange={(e) => handleLeaderChange("email", e.target.value)}
            error={errors["teamLeader.email"]}
            helperText="Entry pass & discord invitation will be dispatched here."
          />

          <Input
            label="WHATSAPP / MOBILE NUMBER"
            required
            type="tel"
            placeholder="e.g. 9876543210 (10 digits)"
            value={formData.teamLeader.phone}
            onChange={(e) => handleLeaderChange("phone", e.target.value)}
            error={errors["teamLeader.phone"]}
          />

          <Input
            label="ENGINEERING BRANCH / DEPT"
            required
            placeholder="e.g. Computer Science, Electrical, Mechanical"
            value={formData.teamLeader.branch}
            onChange={(e) => handleLeaderChange("branch", e.target.value)}
            error={errors["teamLeader.branch"]}
          />

          <Select
            label="YEAR OF STUDY"
            required
            value={formData.teamLeader.yearOfStudy}
            onChange={(e) => handleLeaderChange("yearOfStudy", e.target.value)}
          >
            <option value="1st Year">1st Year (B.Tech / Diploma)</option>
            <option value="2nd Year">2nd Year (B.Tech / Diploma)</option>
            <option value="3rd Year">3rd Year (B.Tech)</option>
            <option value="4th Year">4th Year (B.Tech)</option>
            <option value="Postgraduate">Postgraduate (M.Tech / MCA / M.Sc)</option>
          </Select>

          <Input
            label="GITHUB / PORTFOLIO URL (OPTIONAL)"
            placeholder="e.g. https://github.com/username"
            value={formData.teamLeader.githubUsername}
            onChange={(e) => handleLeaderChange("githubUsername", e.target.value)}
          />
        </div>
      </div>

      {/* Block 3: Additional Team Members (Dynamic Squad Builder) */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="border-b-4 border-black pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-neo-muted text-black">
              03
            </span>
            <h3 className="font-black text-xl text-black uppercase tracking-tight">
              SQUAD MEMBERS ({formData.members.length + 1} / 4 TOTAL)
            </h3>
          </div>

          {formData.members.length < 3 && (
            <button
              type="button"
              onClick={handleAddMember}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neo-secondary text-black font-black text-xs uppercase border-2 border-black shadow-neo-sm hover:bg-neo-secondary/90 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>ADD SQUAD MEMBER</span>
            </button>
          )}
        </div>

        {formData.members.length === 0 ? (
          <div className="p-6 bg-neo-bg border-2 border-dashed border-black text-center space-y-2">
            <p className="font-bold text-sm text-black">
              Currently registered as a <strong>Solo Builder</strong>.
            </p>
            <p className="text-xs text-black/70">
              You can participate solo, or click &ldquo;ADD SQUAD MEMBER&rdquo; above to include up to 3 additional teammates (total team size 1-4).
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.members.map((member, idx) => (
              <div
                key={idx}
                className="border-3 border-black bg-neo-bg p-5 shadow-neo-sm space-y-4 relative"
              >
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
                  <span className="font-mono text-xs font-black uppercase text-black">
                    MEMBER 0{idx + 2} DETAILS
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    aria-label={`Remove member ${idx + 2}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span>REMOVE MEMBER</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    label="MEMBER FULL NAME"
                    required
                    placeholder="Full name"
                    value={member.fullName}
                    onChange={(e) => handleMemberChange(idx, "fullName", e.target.value)}
                    error={errors[`members.${idx}.fullName`]}
                  />

                  <Input
                    label="EMAIL ADDRESS"
                    required
                    type="email"
                    placeholder="teammate@email.com"
                    value={member.email}
                    onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                    error={errors[`members.${idx}.email`]}
                  />

                  <Input
                    label="CONTACT NUMBER"
                    type="tel"
                    placeholder="Phone number"
                    value={member.phone}
                    onChange={(e) => handleMemberChange(idx, "phone", e.target.value)}
                  />

                  <Select
                    label="ROLE IN SQUAD"
                    value={member.role}
                    onChange={(e) =>
                      handleMemberChange(idx, "role", e.target.value as MemberRole)
                    }
                    options={roleOptions}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block 4: Guidelines Acceptance & Submission */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agree-checkbox"
            checked={formData.agreeToGuidelines}
            onChange={(e) => {
              setFormData({ ...formData, agreeToGuidelines: e.target.checked });
              if (errors.agreeToGuidelines) {
                setErrors((prev) => ({ ...prev, agreeToGuidelines: "" }));
              }
            }}
            className="w-6 h-6 border-3 border-black accent-black rounded-none cursor-pointer shrink-0 mt-0.5"
          />
          <label
            htmlFor="agree-checkbox"
            className="text-xs sm:text-sm font-bold text-black cursor-pointer leading-snug"
          >
            I verify that all submitted member credentials are valid. Our team has reviewed and agrees to comply strictly with the{" "}
            <span className="font-black underline">HACKVERSE &apos;26 Code of Conduct</span>, intellectual property rules, and academic integrity policies.
          </label>
        </div>

        {errors.agreeToGuidelines && (
          <p className="text-xs font-black text-red-600 flex items-center gap-1">
            <span>⚠</span> {errors.agreeToGuidelines}
          </p>
        )}

        <div className="pt-4 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs font-bold text-black/60 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[2.5px]" />
            <span>SECURE REST DISPATCH // NO ENTRY FEE REQUIRED</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[240px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PROCESSING ENTRY...</span>
              </span>
            ) : (
              <span>CONFIRM &amp; GENERATE PASS</span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
