export type ContactCategory = "all" | "technical" | "management" | "faculty";

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  category: "technical" | "management" | "faculty";
  categoryLabel: string;
  department: string;
  phone: string;
  displayPhone: string;
  email: string;
  whatsapp?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  avatarColor?: string;
  featured?: boolean;
}

export interface OfficialEmail {
  id: string;
  email: string;
  label: string;
  description: string;
  badge: string;
  primary?: boolean;
}

export interface VenueInfo {
  institution: string;
  department: string;
  campus: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  railwayStations: string[];
  airports: string[];
}
