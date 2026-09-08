import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "Register Team // INNOVEX '26",
  description:
    "Register your team for INNOVEX '26 National Tech Fest & Hackathon. Zero registration fee. Free food and certificates for all qualifiers.",
};

export default function RegisterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SectionTitle
        tag="ENROLLMENT // ZERO ENTRY FEE"
        title="REGISTER YOUR"
        highlightText="SQUAD"
        subtitle="Form a team of 1 to 4 members. Submit your team leader details, problem statement preference, and member credentials below."
      />
      <Suspense
        fallback={
          <div className="border-4 border-black bg-white p-8 font-black font-mono text-center">
            LOADING REGISTRATION PORTAL...
          </div>
        }
      >
        <RegistrationForm />
      </Suspense>
    </div>
  );
}
