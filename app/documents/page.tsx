import { Metadata } from "next";
import { DocumentsContent } from "@/features/documents/DocumentsContent";

export const metadata: Metadata = {
  title: "Documents & Templates | HACKVERSE '26 | CodeBreakers GCEK",
  description:
    "Official HackVerse '26 documents, ideation PPT template, official rule book, and event brochure.",
  keywords: [
    "hackathon documents",
    "HACKVERSE PPT template",
    "hackathon ideation template",
    "hackathon presentation deck",
    "HACKVERSE rulebook PDF",
    "hackathon rulebook Odisha",
    "hackathon brochure PDF download",
    "official event brochure hackverse",
    "hackathon submission template",
    "hackathon slides download",
    "ideation pitch deck format",
    "GCEK hackathon documents",
    "hackathon document download",
    "PPT format for hackathon",
    "hackathon presentation PPT",
    "hackathon round 1 template",
    "hackathon round 2 template",
    "hackathon final pitch template",
    "CodeBreakers official templates",
    "Hackverse downloadable documents",
    "hackathon project report format",
    "hackathon architecture diagram template",
    "hackathon submission guidelines PDF",
    "hackathon event schedule PDF",
    "hackathon problem statements PDF",
    "team registration confirmation doc",
    "evaluation scoring sheet PDF",
    "code of conduct declaration format",
    "hackathon mentor feedback form",
    "pitch deck guidelines 2026",
    "5 slide deck template hackathon",
    "problem solution architecture deck",
    "demo video submission guide",
    "GitHub repo documentation template",
    "README template for hackathons",
    "participation certificate format",
    "winner certificate verification document",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/documents",
  },
  openGraph: {
    title: "Documents & Templates // HACKVERSE '26",
    description:
      "Official HackVerse '26 documents, ideation PPT template, official rule book, and event brochure.",
    url: "https://hackverse.codebreakersgcek.tech/documents",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Documents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documents & Templates // HACKVERSE '26",
    description: "Download official PPT templates, rule book, and event brochure for HACKVERSE '26.",
    images: ["/og-image.png"],
  },
};

export default function DocumentsPage() {
  return <DocumentsContent />;
}
