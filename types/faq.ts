export type FaqCategory =
  | "all"
  | "general"
  | "registration"
  | "teams"
  | "logistics"
  | "submissions"
  | "prizes";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: Exclude<FaqCategory, "all">;
  categoryLabel: string;
  tags?: string[];
  popular?: boolean;
  actionLink?: {
    label: string;
    href: string;
  };
}

export interface FaqCategoryConfig {
  id: FaqCategory;
  label: string;
  iconName: string;
  description: string;
}
