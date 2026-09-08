export interface RuleItem {
  id: string;
  number: string;
  heading: string;
  content: string;
  importantNotes?: string[];
}

export interface GuidelineCategory {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  rules: RuleItem[];
}

export interface EvaluationCriterion {
  parameter: string;
  weightage: number; // percentage, e.g. 25
  description: string;
  scoringFocus: string[];
}
