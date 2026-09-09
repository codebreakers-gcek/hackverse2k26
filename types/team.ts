export interface OfficialIncharge {
  id: string;
  name: string;
  designation: string;
  role: string;
  image: string;
  quote: string;
  department: string;
  email?: string;
  linkedin?: string;
}

export interface TeamSocials {
  github?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
}

export interface TeamMember {
  image: string;
  title: string;
  subtitle?: string;
  handle: string;
  borderColor: string;
  gradient?: string;
  url?: string;
  email?: string;
  socials: TeamSocials;
}

export type TeamCategory = "all" | "officials" | "core" | "club";
