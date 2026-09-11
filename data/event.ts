import { EventInfo } from "@/types/event";

export const EVENT_DATA: EventInfo = {
  name: "HACKVERSE '26",
  edition: "Tech Fest Hackathon 2026",
  tagline: "BREAK CODE. FORGE REALITY. ELEVATE TOMORROW.",
  shortDescription:
    "The flagship annual STATE technology festival and hackathon organized by CODEBREAKERS,an official Coding and Technical club of Government College of Engineering Kalahandi. 24 hours of intense prototyping, competitive engineering, and breakthrough innovation.",
  fullDescription:
    "HACKVERSE '26 brings together the sharpest student minds, developers, designers, and tech enthusiasts across Odisha. Organized by CodeBreakers—the official coding club of Government College of Engineering Kalahandi (GCEK)—this 3-day tech carnival features high-stakes hackathons, algorithmic code combats, hardware expositions, and direct mentorship from top industry engineers.",
  startDate: "2026-10-08T09:00:00+05:30",
  endDate: "2026-10-10T18:00:00+05:30",
  displayDates: "OCTOBER 08 - 10, 2026",
  location: {
    campus: "Government College of Engineering Kalahandi",
    venue: "Main Auditorium & Computing Lab Complex",
    city: "Bhawanipatna",
    state: "Odisha",
    postalCode: "766002",
    googleMapsUrl:
      "https://maps.google.com/?q=Government+College+of+Engineering+Kalahandi",
  },
  registrationDeadline: "SEPTEMBER 25, 2026 // 23:59 IST",
  totalPrizePool: "₹35K",
  organizer: {
    name: "CodeBreakers GCEK",
    club: "CodeBreakers - The Premier Coding Club of GCEK",
    institution: "Government College of Engineering Kalahandi",
    establishedYear: 2019,
    membersCount: "50+",
    website: "https://www.codebreakersgcek.tech",
    socials: {
      github: "https://github.com/codebreakers-gcek",
      linkedin: "https://www.linkedin.com/company/codebreakers-gce-kalahandi",
      instagram: "https://www.instagram.com/gcek.codebreakers",
      twitter: "https://twitter.com/codebreakers_gcek",
    },
  },
  stats: [
    { label: "PRIZE POOL", value: "₹35K+", change: "CASH & PERKS" },
    { label: "HACKATHON HOURS", value: "24 HRS", change: "NON-STOP" },
    { label: "EXPECTED TEAMS", value: "60+", change: "PAN-ODISHA" },
    { label: "COMMUNITY DEVELOPERS", value: "300+", change: "GCEK ACTIVE" },
  ],
  tracks: [
    {
      id: "hackathons",
      code: "TRK-01",
      name: "HACK NOVA (HACKATHON)",
      tagline: "24-Hour STATE Software & Hardware Sprint",
      description:
        "Engineers and builders collaborate under pressure to solve real-world industry and societal problem statements.",
      highlights: [
        "Flagship 24-hour sprint",
        "1-on-1 industry mentorship",
        "Direct fast-track interview perks",
      ],
      icon: "Terminal",
      flagship: true,
    },
    {
      id: "cp",
      code: "TRK-02",
      name: "9-LOCK CP CONTEST",
      tagline: "High-Speed Algorithmic Showdown",
      description:
        "Fast-paced competitive programming arena testing time complexity, data structures, and edge-case execution.",
      highlights: [
        "Dynamic difficulty scaling",
        "Live projected leaderboard",
        "Codeforces / CodeChef rated standards",
      ],
      icon: "Cpu",
    },
    {
      id: "ai-symposium",
      code: "TRK-03",
      name: "NEURAL SUMMIT",
      tagline: "Generative AI & Computer Vision Expo",
      description:
        "Demonstrate custom fine-tuned LLMs, neural networks, agents, and autonomous computer vision prototypes.",
      highlights: [
        "Hands-on AI workshops",
        "Model evaluation shootout",
        "Compute sponsor credit rewards",
      ],
      icon: "Sparkles",
    },
    {
      id: "open-source",
      code: "TRK-04",
      name: "OPEN FORGE",
      tagline: "Decentralized & Community Tech",
      description:
        "Showcase open-source dev tools, systems software, accessibility innovations, and public digital goods.",
      highlights: [
        "Open-source repo auditing",
        "Community voting mechanics",
        "Best documentation trophy",
      ],
      icon: "GitBranch",
    },
  ],
  prizes: [
    {
      position: "FIRST PLACE // CHAMPION",
      amount: "₹20K",
      perks: [
        "Official Champion Trophy & Gold Medals",
        "Direct Tech Interview Referrals",
        "Cloud Credits & Premium Dev Tool Licenses",
        "Featured on CodeBreakers Official Wall of Fame",
      ],
      color: "secondary",
    },
    {
      position: "RUNNER UP // 2ND PLACE",
      amount: "₹10K",
      perks: [
        "Silver Medals & Certificates of Excellence",
        "Mentorship Sprint with Industry Leaders",
        "Cloud Hosting Credit Vouchers",
      ],
      color: "accent",
    },
    {
      position: "THIRD PLACE // 2ND RUNNER UP",
      amount: "₹5K",
      perks: [
        "Bronze Medals & Certificates of Excellence",
        "Premium Developer Subscriptions",
        "Exclusive CodeBreakers Merch Kit",
      ],
      color: "muted",
    },
  ],
};
