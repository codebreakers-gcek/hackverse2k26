export interface EventTrack {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  highlights: string[];
  icon: string;
  flagship?: boolean;
}

export interface EventStat {
  label: string;
  value: string;
  change?: string;
}

export interface PrizeItem {
  position: string;
  amount: string;
  perks: string[];
  color: "accent" | "secondary" | "muted" | "white";
}

export interface EventInfo {
  name: string;
  edition: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  startDate: string; // ISO format or display date
  endDate: string;
  displayDates: string;
  location: {
    campus: string;
    venue: string;
    city: string;
    state: string;
    postalCode: string;
    googleMapsUrl?: string;
  };
  registrationDeadline: string;
  totalPrizePool: string;
  organizer: {
    name: string;
    club: string;
    institution: string;
    establishedYear: number;
    membersCount: string;
    website: string;
    socials: {
      github: string;
      linkedin: string;
      instagram: string;
      twitter: string;
    };
  };
  stats: EventStat[];
  tracks: EventTrack[];
  prizes: PrizeItem[];
}
