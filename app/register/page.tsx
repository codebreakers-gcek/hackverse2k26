import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "Squad Registration Portal & Verification Dossier",
  description:
    "Enroll your squad (1-4 members) for HACKVERSE '26 State Hackathon at GCEK Kalahandi. Secure your entry pass, select challenges, and unlock ₹35K+ in rewards.",
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/register",
  },
  openGraph: {
    title: "Squad Registration // HACKVERSE '26",
    description:
      "Form a team of 1 to 4 members. Submit your team leader details, problem statement preference, and member credentials.",
    url: "https://hackverse.codebreakersgcek.tech/register",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Registration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squad Registration Portal // HACKVERSE '26",
    description: "Form your squad of 1-4 hackers and compete in Odisha's premier 24H hackathon.",
    images: ["/og-image.png"],
  },
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
