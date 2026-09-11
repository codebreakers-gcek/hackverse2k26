export type PhaseStatus = "completed" | "ongoing" | "upcoming";

export interface DynamicPhaseProgress {
  status: PhaseStatus;
  progressPercentage: number;
  daysRemaining?: number;
}

export interface SchedulePhase {
  phase: string;
  title: string;
  startDate: string;
  endDate: string;
  displayDates: string;
  status?: PhaseStatus;
  progressPercentage?: number;
  items: string[];
}

/**
 * Dynamically calculates the progress percentage and status of a phase based on current date.
 * - Prior to startDate: upcoming (0%)
 * - Between startDate and endDate: ongoing (1% - 100% proportionally)
 * - After endDate: completed (100%)
 */
export function calculatePhaseProgress(
  startDateStr: string,
  endDateStr: string,
  currentDate: Date = new Date()
): DynamicPhaseProgress {
  let start: Date;
  let end: Date;

  if (startDateStr.includes("T")) {
    start = new Date(startDateStr);
  } else {
    const [y, m, d] = startDateStr.split("-").map(Number);
    start = new Date(y, m - 1, d, 0, 0, 0, 0);
  }

  if (endDateStr.includes("T")) {
    end = new Date(endDateStr);
  } else {
    const [y, m, d] = endDateStr.split("-").map(Number);
    end = new Date(y, m - 1, d, 23, 59, 59, 999);
  }

  const now = currentDate.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (isNaN(startTime) || isNaN(endTime)) {
    return {
      status: "upcoming",
      progressPercentage: 0,
    };
  }

  if (now < startTime) {
    const msUntilStart = startTime - now;
    const daysUntilStart = Math.ceil(msUntilStart / (1000 * 60 * 60 * 24));
    return {
      status: "upcoming",
      progressPercentage: 0,
      daysRemaining: daysUntilStart,
    };
  }

  if (now > endTime) {
    return {
      status: "completed",
      progressPercentage: 100,
      daysRemaining: 0,
    };
  }

  // Ongoing phase - proportionally calculate progress between 0 and 100%
  const totalDuration = endTime - startTime;
  const elapsed = now - startTime;
  const rawPercentage = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
  const progressPercentage = Math.min(100, Math.max(1, Math.round(rawPercentage)));

  const msRemaining = endTime - now;
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return {
    status: "ongoing",
    progressPercentage,
    daysRemaining,
  };
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
    dates: "08th – 10th October 2026",
    venue: "Government College Of Engineering, Kalahandi, Bhawanipatna",
  },
  phases: [
    {
      phase: "Phase 1",
      title: "Launch & Registration",
      startDate: "2026-09-12",
      endDate: "2026-09-26",
      displayDates: "12 Sep 2026 – 26 Sep 2026",
      items: [
        "Official announcement and problem statements launch.",
        "Online team registration portal opens at https://hackverse.codebreakersgcek.tech.",
        "Eligibility verification and initial squad roster processing.",
      ],
    },
    {
      phase: "Phase 2",
      title: "CodeBreakers Mid-Level Evaluations",
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      displayDates: "01 Oct 2026 – 08 Oct 2026",
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
      startDate: "2026-10-08",
      endDate: "2026-10-10",
      displayDates: "08 Oct 2026 – 10 Oct 2026",
      items: [
        "Location: Main Auditorium & Advanced Computing Lab Complex, GCEK Bhawanipatna.",
        "Duration: 24 hours of continuous on-site prototyping, code sprint, mentorship check-ins, and jury review.",
        "Three progressive sub-rounds of judging and final live prototype demonstration.",
        "Facilities provided for uninterrupted development, meals, and accommodations.",
        "Grand Valedictory Ceremony and ₹35K+ Prize Distribution.",
      ],
    },
  ],
};
