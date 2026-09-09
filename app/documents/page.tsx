import { Metadata } from "next";
import { DocumentsContent } from "@/features/documents/DocumentsContent";

export const metadata: Metadata = {
  title: "Documents & Templates | HACKVERSE '26 | CodeBreakers GCEK",
  description:
    "Official HackVerse '26 documents, ideation PPT template, presentation decks, and institutional authorization NOC letter format.",
};

export default function DocumentsPage() {
  return <DocumentsContent />;
}
