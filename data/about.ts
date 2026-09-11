export interface AboutPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: "accent" | "secondary" | "muted" | "white";
}

export interface ClubMilestone {
  year: string;
  event: string;
  detail: string;
}

export const ABOUT_DATA = {
  festOverview: {
    title: "ABOUT HACKVERSE '26",
    tagline: "WHERE KALAHANDI'S COGNITIVE ENERGY MEETS STATE SCALE INNOVATION",
    paragraphs: [
      "HACKVERSE '26 is the signature STATE-level annual technology and engineering festival organized by CODEBREAKERS at Government College of Engineering Kalahandi (GCEK), Bhawanipatna, Odisha.",
      "Conceived as an intense incubator of ideas, the fest aims to demystify complex technologies, bridge academic theory with cut-throat industry execution, and provide ambitious student developers a STATE platform to ship production-grade solutions.",
      "Over 3 electrifying days, participants experience a curated ecosystem comprising the flagship 24-hour Hack Nova Hackathon, competitive algorithmic problem solving, hands-on masterclasses by industry veterans, and interactive hardware installations.",
    ],
  },
  pillars: [
    {
      number: "01",
      title: "INNOVATION OPPORTUNITIES",
      subtitle: "BUILDING BEYOND THE CLASSROOM",
      description:
        "Tackle unvarnished problem statements formulated with industry leaders and government domain advisors. From decentralized logistics to local language AI engines, build projects that address genuine friction points in society.",
      badge: "PROTOTYPING",
      color: "accent",
    },
    {
      number: "02",
      title: "LEARNING OPPORTUNITIES",
      subtitle: "ACCELERATED COGNITIVE GROWTH",
      description:
        "Immerse yourself in real-time code reviews, architecture critiques, and direct masterclasses on containerization, neural models, cyber forensics, and edge computing led by senior engineers and alumni.",
      badge: "MENTORSHIP",
      color: "secondary",
    },
    {
      number: "03",
      title: "COLLABORATION ECOSYSTEM",
      subtitle: "SYNERGY ACROSS DISCIPLINES",
      description:
        "CodeBreakers believes that true breakthrough software is forged when frontend designers, systems programmers, data scientists, and domain thinkers connect. Network with 500+ developers from across India.",
      badge: "COMMUNITY",
      color: "muted",
    },
    {
      number: "04",
      title: "PLACEMENT & INDUSTRY LAUNCHPAD",
      subtitle: "DIRECT RECRUITER VISIBILITY",
      description:
        "Top-performing teams and individual standouts receive direct referral opportunities, interview fast-tracks, and incubation mentorship for promising hardware and software ventures.",
      badge: "CAREERS",
      color: "white",
    },
  ] as AboutPillar[],
  institution: {
    name: "Government College of Engineering Kalahandi (GCEK)",
    location: "Bhawanipatna, Kalahandi, Odisha - 766002",
    description:
      "Established as a premier government technical institution in Western Odisha, GCEK is dedicated to nurturing technical talent, fostering scientific inquiry, and driving regional and STATE technological progress through robust engineering education.",
    portalUrl: "https://www.gcekbpatna.ac.in",
  },
  club: {
    name: "CODEBREAKERS",
    role: "The Premier Official Coding & Technical Club of GCEK",
    foundingYear: "2019",
    activeMembers: "500+",
    bio: "CodeBreakers is the heart of software engineering and developer culture at GCEK. Managing the college's digital infrastructure, tech fests, competitive coding teams, and open source initiatives, CodeBreakers has shaped alumni who now build critical systems across top global tech companies.",
    officialWebsite: "https://www.codebreakersgcek.tech",
    milestones: [
      {
        year: "2019",
        event: "CLUB FOUNDING",
        detail:
          "Established by passionate computer science students to cultivate competitive programming & development culture in GCEK.",
      },
      {
        year: "2021",
        event: "CAMPUS PLATFORM LAUNCH",
        detail:
          "Engineered and deployed the digital portal for college fests INSPRANO and UDAAN with 10,000+ hits.",
      },
      {
        year: "2023",
        event: "HACKVERSE'23 INCEPTION",
        detail:
          "Hosted the first edition of Hack Nova with 80+ participating teams and STATE recognition.",
      },
      {
        year: "2026",
        event: "HACKVERSE '26 STATE FEST",
        detail:
          "Expanding to a full-scale 3-day multi-track STATE tech symposium with ₹35K+ prize pool.",
      },
    ] as ClubMilestone[],
  },
};
