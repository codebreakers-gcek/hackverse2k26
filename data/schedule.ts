export interface SchedulePhase {
  phase: string;
  title: string;
  startDate: string;
  endDate: string;
  displayDates: string;
  status: "completed" | "ongoing" | "upcoming";
  progressPercentage: number;
  items: string[];
}

export interface ScheduleData {
  pageTitle: string;
  subtitle: string;
  metaInfo: {
    dates: string;
    venue: string;
  };
  phases: SchedulePhase[];
}

export const SCHEDULE_DATA: ScheduleData = {
  pageTitle: "Event Schedule",
  subtitle:
    "The complete event timeline for CodeBreakers 2026, including registration, mid-level evaluations, and the Grand Finale.",
  metaInfo: {
    dates: "16th – 18th October 2026",
    venue: "Government College Of Engineering, Kalahandi, Bhawanipatna",
  },
  phases: [
    {
      phase: "Phase 1",
      title: "Launch & Registration",
      startDate: "2026-09-10",
      endDate: "2026-10-05",
      displayDates: "10 Sep 2026 – 05 Oct 2026",
      status: "upcoming" as const,
      progressPercentage: 0,
      items: [
        "Official announcement and problem statements launch.",
        "Online team registration portal opens at https://codebreakersgcek.tech.",
        "Eligibility verification and initial squad roster processing.",
      ],
    },
    {
      phase: "Phase 2",
      title: "CodeBreakers Mid-Level Evaluations",
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      displayDates: "01 Oct 2026 – 08 Oct 2026",
      status: "upcoming" as const,
      progressPercentage: 0,
      items: [
        "Online & on-campus evaluation through CodeBreakers portal.",
        "Round 1: Initial concept, ideation, and problem understanding assessment.",
        "Round 2: Prototype development, progress validation, and mentor feedback.",
        "Selection of the Top finalist teams per problem statement for the Grand Finale.",
      ],
    },
    {
      phase: "Phase 3",
      title: "Grand Finale at GCEK Campus",
      startDate: "2026-10-16",
      endDate: "2026-10-18",
      displayDates: "16 Oct 2026 – 18 Oct 2026",
      status: "upcoming" as const,
      progressPercentage: 0,
      items: [
        "Location: Main Auditorium & Advanced Computing Lab Complex, GCEK Bhawanipatna.",
        "Duration: 36 hours of continuous on-site prototyping, code sprint, mentorship check-ins, and jury review.",
        "Three progressive sub-rounds of judging and final live prototype demonstration.",
        "Facilities provided for uninterrupted development, meals, and accommodations.",
        "Grand Valedictory Ceremony and ₹1,50,000+ Prize Distribution.",
      ],
    },
  ],
};
