import { Metadata } from "next";
import { DocumentsContent } from "@/features/documents/DocumentsContent";

export const metadata: Metadata = {
  title: "Documents & Templates | HACKVERSE '26 | CodeBreakers GCEK",
  description:
    "Official HackVerse '26 documents, ideation PPT template, presentation decks, and institutional authorization NOC letter format.",
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/documents",
  },
  openGraph: {
    title: "Documents & Templates // HACKVERSE '26",
    description:
      "Official HackVerse '26 documents, ideation PPT template, presentation decks, and institutional authorization NOC letter format.",
    url: "https://hackverse.codebreakersgcek.tech/documents",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Documents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documents & Templates // HACKVERSE '26",
    description: "Download official PPT templates, presentation decks, and sample NOC docs for HACKVERSE '26.",
    images: ["/og-image.png"],
  },
};

export default function DocumentsPage() {
  return <DocumentsContent />;
}
