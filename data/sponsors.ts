export interface BenefitRow {
  name: string;
  gold: boolean;
  silver: boolean;
  bronze: boolean;
}

export const SPONSORS_DATA = {
  header: {
    tag: "★ SPONSORSHIP PACKET // HACKVERSE '26 ★",
    title: "SPONSORSHIP",
    highlight: "PACKET",
    subtitle:
      "Partner with Odisha's premier 24-hour flagship hackathon at Government College of Engineering Kalahandi. Empowering tomorrow's tech leaders.",
    organizedBy: "CodeBreakers | Government College Of Engineering Kalahandi, Bhawanipatna, Kalahandi, 766003",
  },
  whySponsor: {
    title: "WHY TO SPONSOR US ?",
    paragraph1:
      "Partnering with HACKVERSE '26 gives your brand a direct connection with a community of passionate developers, innovators, and tech enthusiasts. Engage with talented participants, showcase your products, APIs, tools, and technologies, and create meaningful brand visibility throughout the hackathon.",
    paragraph2:
      "Your sponsorship goes beyond branding. It helps us provide participants with better resources, workshops, prizes, mentorship, and an inspiring hackathon experience, while giving your organization the opportunity to discover emerging talent, encourage innovation, and build lasting connections with the next generation of technology leaders.",
    tagline: "Empowering Tomorrow's Tech Leaders.",
  },
  benefitsTable: [
    {
      name: "SPONSORS LOGO ON WEBSITE",
      gold: true,
      silver: true,
      bronze: true,
    },
    {
      name: "LOGOS ON EVERY PROMOTIONAL VIDEO",
      gold: true,
      silver: true,
      bronze: true,
    },
    {
      name: "LOGOS ON REGISTRATION DESK",
      gold: true,
      silver: true,
      bronze: true,
    },
    {
      name: "POSTER ALL AROUND CAMPUS",
      gold: true,
      silver: false,
      bronze: false,
    },
    {
      name: "LOGOS ON EVERY OFFICIAL MAIL SENT TO OTHER ORG.",
      gold: true,
      silver: true,
      bronze: false,
    },
    {
      name: "HONOURED FROM INSTITUTION HEAD",
      gold: true,
      silver: true,
      bronze: false,
    },
    {
      name: "DEDICATED MESSAGE ON SOCIAL MEDIA",
      gold: true,
      silver: true,
      bronze: false,
    },
    {
      name: "SPECIAL MENTION IN EVERY PROGRAM",
      gold: true,
      silver: false,
      bronze: false,
    },
    {
      name: "AWARD CEREMONY RECOGNITION",
      gold: true,
      silver: true,
      bronze: false,
    },
    {
      name: "LOGOS ON CERTIFICATE OF PARTICIPATION & WINNER",
      gold: true,
      silver: false,
      bronze: false,
    },
    {
      name: "MENTORSHIP OPPORTUNITY",
      gold: true,
      silver: false,
      bronze: false,
    },
    {
      name: "RECRUITMENT & NETWORKING OPPORTUNITIES",
      gold: true,
      silver: true,
      bronze: false,
    },
    {
      name: "POST-EVENT SOCIAL MEDIA RECOGNITION",
      gold: true,
      silver: true,
      bronze: true,
    },
  ] as BenefitRow[],
  tiers: [
    {
      id: "gold",
      name: "GOLD TIER",
      badge: "TIER 01 // GOLD GUILD",
      color: "#FFAA00",
      accentBg: "bg-[#FFAA00] text-black",
      borderClass: "border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]",
      badgeClass: "bg-[#FFAA00] text-black border-black",
      description: "Full-scale statewide campus branding, certificate logo placement, mentorship keynote, and VIP award ceremony honours.",
      features: [
        "Campus-wide Posters & Special Mention in Every Program",
        "Logos on All Participant & Winner Certificates",
        "Mentorship & Direct Recruitment Pipeline",
        "Honoured directly from Institution Head",
      ],
      slots: [
        { id: "gold-1", title: "GOLD PATRON 01", status: "revealing_soon" as const },
        { id: "gold-2", title: "GOLD PATRON 02", status: "revealing_soon" as const },
      ],
    },
    {
      id: "silver",
      name: "SILVER TIER",
      badge: "TIER 02 // SILVER GUILD",
      color: "#EAEAEA",
      accentBg: "bg-white text-black",
      borderClass: "border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#777777] border-b-[#777777]",
      badgeClass: "bg-white text-black border-black",
      description: "Broad reach across official mail dispatches, award ceremony recognition, social media campaigns, and recruitment networking.",
      features: [
        "Official Mail Dispatch to other Institutions",
        "Award Ceremony Recognition & Institution Head Honour",
        "Dedicated Social Media Broadcast",
        "Recruitment & Networking Access",
      ],
      slots: [
        { id: "silver-1", title: "SILVER PATRON 01", status: "revealing_soon" as const },
        { id: "silver-2", title: "SILVER PATRON 02", status: "revealing_soon" as const },
        { id: "silver-3", title: "SILVER PATRON 03", status: "revealing_soon" as const },
      ],
    },
    {
      id: "bronze",
      name: "BRONZE TIER",
      badge: "TIER 03 // BRONZE GUILD",
      color: "#D97706",
      accentBg: "bg-[#D97706] text-white",
      borderClass: "border-t-[#F59E0B] border-l-[#F59E0B] border-r-[#78350F] border-b-[#78350F]",
      badgeClass: "bg-[#D97706] text-white border-black",
      description: "Core branding presence across official website, promotional videos, registration desk, and post-event social channels.",
      features: [
        "Sponsor Logo on Website & Live Platforms",
        "Logos on Every Promotional Video",
        "Prominent Logo on Physical Registration Desk",
        "Post-Event Social Media Recognition",
      ],
      slots: [
        { id: "bronze-1", title: "BRONZE PATRON 01", status: "revealing_soon" as const },
        { id: "bronze-2", title: "BRONZE PATRON 02", status: "revealing_soon" as const },
        { id: "bronze-3", title: "BRONZE PATRON 03", status: "revealing_soon" as const },
        { id: "bronze-4", title: "BRONZE PATRON 04", status: "revealing_soon" as const },
      ],
    },
  ],
};
