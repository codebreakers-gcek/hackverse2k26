import { EventInfo } from "@/types/event";

export const EVENT_DATA: EventInfo = {
  name: "INNOVEX '26",
  edition: "Annual National Tech Fest & Hackathon",
  tagline: "BREAK CODE. FORGE REALITY. ELEVATE TOMORROW.",
  shortDescription:
    "The flagship annual national technology festival and hackathon organized by CODEBREAKERS, Government College of Engineering Kalahandi. 36 hours of intense prototyping, competitive engineering, and breakthrough innovation.",
  fullDescription:
    "INNOVEX '26 brings together the sharpest student minds, developers, designers, and tech enthusiasts across India. Organized by CodeBreakers—the official coding club of Government College of Engineering Kalahandi (GCEK)—this 3-day tech carnival features high-stakes hackathons, algorithmic code combats, hardware expositions, and direct mentorship from top industry engineers.",
  startDate: "2026-10-16T09:00:00+05:30",
  endDate: "2026-10-18T18:00:00+05:30",
  displayDates: "OCTOBER 16 - 18, 2026",
  location: {
    campus: "Government College of Engineering Kalahandi",
    venue: "Main Auditorium & Computing Lab Complex",
    city: "Bhawanipatna",
    state: "Odisha",
    postalCode: "766002",
    googleMapsUrl: "https://maps.google.com/?q=Government+College+of+Engineering+Kalahandi",
  },
  registrationDeadline: "OCTOBER 10, 2026 // 23:59 IST",
  totalPrizePool: "₹1,50,000+",
  organizer: {
    name: "CodeBreakers GCEK",
    club: "CodeBreakers - The Premier Coding Club of GCEK",
    institution: "Government College of Engineering Kalahandi",
    establishedYear: 2019,
    membersCount: "500+",
    website: "https://www.codebreakersgcek.tech",
    socials: {
      github: "https://github.com/codebreakers-gcek",
      linkedin: "https://www.linkedin.com/company/codebreakers-gce-kalahandi",
      instagram: "https://www.instagram.com/gcek.codebreakers",
      twitter: "https://twitter.com/codebreakers_gcek",
    },
  },
  stats: [
    { label: "PRIZE POOL", value: "₹1,50,000+", change: "CASH & PERKS" },
    { label: "HACKATHON HOURS", value: "36 HRS", change: "NON-STOP" },
    { label: "EXPECTED TEAMS", value: "120+", change: "PAN-INDIA" },
    { label: "COMMUNITY DEVELOPERS", value: "500+", change: "GCEK ACTIVE" },
  ],
  tracks: [
    {
      id: "hackathons",
      code: "TRK-01",
      name: "HACK NOVA (HACKATHON)",
      tagline: "36-Hour National Software & Hardware Sprint",
      description:
        "Engineers and builders collaborate under pressure to solve real-world industry and societal problem statements.",
      highlights: [
        "Flagship 36-hour sprint",
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
      amount: "₹60,000",
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
      amount: "₹40,000",
      perks: [
        "Silver Medals & Certificates of Excellence",
        "Mentorship Sprint with Industry Leaders",
        "Cloud Hosting Credit Vouchers",
      ],
      color: "accent",
    },
    {
      position: "THIRD PLACE // 2ND RUNNER UP",
      amount: "₹25,000",
      perks: [
        "Bronze Medals & Certificates of Excellence",
        "Premium Developer Subscriptions",
        "Exclusive CodeBreakers Merch Kit",
      ],
      color: "muted",
    },
    {
      position: "BEST ALL-WOMEN / SPECIAL TRACKS",
      amount: "₹25,000",
      perks: [
        "Track Winners: Best UI/UX, Best AI/ML Solution, Best Hardware/IoT Prototype",
        "Commendation Certificates & Swag Bags",
      ],
      color: "white",
    },
  ],
};
