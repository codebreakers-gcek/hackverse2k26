export type ProblemCategory = 
  | "All"
  | "AI / ML"
  | "Web Development"
  | "Cybersecurity"
  | "IoT"
  | "Open Innovation";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ProblemStatement {
  id: string;
  code: string; // e.g., "CB-AI-01"
  title: string;
  domain: string;
  category: Exclude<ProblemCategory, "All">;
  shortDescription: string;
  fullDescription: string;
  difficulty: DifficultyLevel;
  suggestedStack: string[];
  keyDeliverables: string[];
  constraints?: string[];
  evaluationFocus: string[];
  sponsorOrMentor?: string;
  driveUrl?: string; // Google Drive / Document link placeholder
}

export interface ProblemFilterOptions {
  category: ProblemCategory;
  searchQuery?: string;
  difficulty?: DifficultyLevel | "All";
}
