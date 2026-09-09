import { ContactPerson, OfficialEmail, VenueInfo } from "@/types/contact";

export const OFFICIAL_EMAILS: OfficialEmail[] = [
  {
    id: "email-club",
    email: "cse.codebreaker@gcekbpatna.ac.in",
    label: "INSTITUTIONAL & CLUB OFFICIAL DESK",
    description: "Official institutional correspondence, administrative approvals, college permissions, and faculty inquiries.",
    badge: "INSTITUTIONAL",
    primary: true,
  },
  {
    id: "email-hackverse-tech",
    email: "hackverse26@codebreakersgcek.tech",
    label: "HACKVERSE '26 OPERATIONS & SPONSORSHIPS",
    description: "Hackathon registrations, team queries, partnership proposals, brand sponsorships, and press relations.",
    badge: "FEST HEADQUARTERS",
    primary: true,
  },
  {
    id: "email-cbgcek-dev",
    email: "hackverse26@cbgcek.dev",
    label: "TECHNICAL DEVELOPERS & PORTAL SUPPORT",
    description: "Portal bug reports, submission API issues, payment UTR verification escalations, and platform feedback.",
    badge: "DEV & SYSTEMS",
    primary: false,
  },
];

export const TECHNICAL_TEAM: ContactPerson[] = [
  {
    id: "tech-lead-1",
    name: "Omprakash Behera",
    role: "Lead Systems Architect & Full-Stack Lead",
    category: "technical",
    categoryLabel: "Technical Dev",
    department: "Dept. of Computer Science & Engineering, GCEK",
    phone: "+917205252871",
    displayPhone: "+917205252871",
    email: "omprakash@cbgcek.dev",
    whatsapp: "+917205252871",
    github: "https://github.com/CodeByPrakash",
    linkedin: "https://linkedin.com/in/omprakash-cse",
    bio: "Manages portal infrastructure, Next.js fullstack stack, auth engines, and cloud deployments.",
    avatarColor: "bg-neo-secondary",
    featured: true,
  },
  {
    id: "tech-lead-2",
    name: "Deepankar Sahoo",
    role: "Frontend Engineer & UI/UX Specialist",
    category: "technical",
    categoryLabel: "Technical Dev",
    department: "Dept. of Computer Science & Engineering, GCEK",
    phone: "+917327007170",
    displayPhone: "+917327007170",
    email: "deepankar@cbgcek.dev",
    whatsapp: "+917327007170",
    github: "https://github.com/codebreakers-gcek",
    linkedin: "https://linkedin.com/company/codebreakers-gce-kalahandi",
    bio: "Architect of the Neo-Brutalist design system, responsive dashboards, and interactive animations.",
    avatarColor: "bg-neo-muted",
  },
];

export const MANAGEMENT_TEAM: ContactPerson[] = [
  {
    id: "mgmt-lead-1",
    name: "Gyanranjan Priyam",
    role: "Convenor & Treasurer",
    category: "management",
    categoryLabel: "Management Lead",
    department: "CodeBreakers Club, GCEK",
    phone: "+917735359677",
    displayPhone: "+917735359677",
    email: "priyam@cbgcek.dev",
    whatsapp: "+917735359677",
    github: "https://github.com/gyanranjan-priyam",
    linkedin: "https://www.linkedin.com/in/gyanranjan-priyam",
    bio: "Head coordinator for inter-college delegations, institutional liaisons, and event master schedule.",
    avatarColor: "bg-neo-secondary",
    featured: true,
  },
  {
    id: "mgmt-lead-2",
    name: "Smruti Ranjan Adhikari",
    role: "Assistant Secretary & Participant Support Lead",
    category: "management",
    categoryLabel: "Management Co-Lead",
    department: "CodeBreakers Student Council, GCEK",
    phone: "+91 88957 96609",
    displayPhone: "+91 88957 96609",
    email: "smruti@cbgcek.dev",
    whatsapp: "918895796609",
    github: "https://github.com/Smrutiranjan8895",
    linkedin: "https://www.linkedin.com/in/smruti-ranjan-adhikari-b83751370",
    bio: "Direct helpline for squad registrations, teammate changes, certificate queries, and team passes.",
    avatarColor: "bg-neo-accent",
  },
  {
    id: "mgmt-lead-3",
    name: "Chayakanta Maharana",
    role: "Secretary",
    category: "management",
    categoryLabel: "Event Organiser",
    department: "CodeBreakers Student Council, GCEK",
    phone: "+918260770510",
    displayPhone: "+918260770510",
    email: "chhayakanta@cbgcek.dev",
    whatsapp: "918260770510",
    github: "https://github.com/Chhayakanta-Maharana1",
    linkedin: "https://www.linkedin.com/in/chhayakanta-maharana-a231a2298/",
    bio: "Chief executive lead for club governance, hackathon protocols, and academic council coordination.",
    avatarColor: "bg-amber-400",
  },
];



export const ALL_CONTACTS: ContactPerson[] = [
  ...TECHNICAL_TEAM,
  ...MANAGEMENT_TEAM,
];

export const VENUE_DETAILS: VenueInfo = {
  institution: "Government College of Engineering Kalahandi (GCEK)",
  department: "Dept. of Computer Science & Engineering // CodeBreakers Lab",
  campus: "Academic Block 2 & Central Computing Complex",
  address: "Bandopala, Po: Risigaon, Bhawanipatna",
  city: "Bhawanipatna",
  state: "Odisha",
  pincode: "766003",
  googleMapsUrl: "https://maps.google.com/?q=Government+College+of+Engineering+Kalahandi+Bhawanipatna",
  railwayStations: [
    "Bhawanipatna Railway Station (BWIP) — 7 km",
    "Kesinga Junction (KSNG) — 35 km (College shuttles available)",
  ],
  airports: [
    "Utkela Airport (Bhawanipatna) — 22 km",
    "Swami Vivekananda Airport (Raipur - RPR) — 240 km",
    "Biju Patnaik Airport (Bhubaneswar - BBI) — 420 km",
  ],
};

export const SOCIAL_CHANNELS = {
  discord: "https://discord.gg/hackverse2026",
  whatsappGroup: "https://chat.whatsapp.com/hackverse2026-announcements",
  github: "https://github.com/codebreakers-gcek",
  linkedin: "https://linkedin.com/company/codebreakers-gce-kalahandi",
  instagram: "https://instagram.com/gcek.codebreakers",
  twitter: "https://twitter.com/codebreakers_gcek",
};
