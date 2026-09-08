export interface StageItem {
  stageNumber: string;
  stageBadgeColor: string;
  title: string;
  points: string[];
}

export interface FacilityItem {
  text: string;
}

export interface DeliverableOutcome {
  title: string;
  desc: string;
}

export const EVENT_FORMAT_DATA = {
  pageTitle: "Event Format",
  noticeHeader: {
    title: "Please read the event format carefully before participating in the hackathon.",
    subtitle: "Understand the multi-stage evaluation process, Grand Finale structure, and event deliverables.",
  },
  evaluationProcess: {
    title: "Evaluation Process and Criteria",
    subtitle: "The evaluation process consists of multiple competitive rounds focusing on feasibility, innovation, and implementation.",
    stages: [
      {
        stageNumber: "STAGE 1",
        stageBadgeColor: "bg-purple-600 text-white",
        title: "Registration & Initial Screening",
        points: [
          "Teams register for a specific Problem Statement. All registrations will undergo a detailed verification process, and only eligible teams that successfully clear the screening will be allowed to participate in the hackathon.",
        ],
      },
      {
        stageNumber: "STAGE 2",
        stageBadgeColor: "bg-cyan-600 text-white",
        title: "Mid-Level Regional Evaluations",
        points: [
          "Online & On-Campus Evaluations coordinated through the CodeBreakers Digital Portal and GCEK Computing Labs.",
          "Teams will be evaluated on Ideation, Problem Relevance, Technical Depth, Prototype Architecture, and Execution Feasibility. The Top 5 teams from each Problem Statement will qualify for the Grand Finale.",
          "Expert jury panel: Representatives from CodeBreakers alumni network, GCEK faculty, and industry engineering leaders.",
        ],
      },
      {
        stageNumber: "STAGE 3",
        stageBadgeColor: "bg-pink-600 text-white",
        title: "Hackathon Day: The Grand Finale",
        points: [
          "Two day on-site Grand Finale at Government College of Engineering Kalahandi (GCEK) Campus, Bhawanipatna.",
          "36-hour non-stop development with intense coding, mentor check-ins, and prototype refinement.",
          "Evaluation Criteria: Innovation & Originality, Technical Complexity, Real-world Impact, UI/UX Design, Presentation Quality.",
          "The Mid Evaluation will be conducted in three sub-rounds by the jury members. The first two sub-rounds will include team evaluation, scoring, and mentorship, allowing teams to improve their solutions based on the jury’s feedback. The third sub-round will serve as the final scoring round. A weighted average of the scores from all three sub-rounds will be calculated to determine the final score and finalize the winning teams.",
        ],
      },
    ],
  },
  facilities: {
    title: "Accommodation, Hospitality, and Facilities",
    subtitle: "Provided for all shortlisted finalists attending the on-site Grand Finale at GCEK Bhawanipatna:",
    items: [
      "Free accommodation in college hostels and guest houses.",
      "All meals, energy refreshments, and midnight snacks provided throughout the 36-hour sprint.",
      "Round-the-clock emergency medical support and campus security.",
      "24x7 high-speed internet connectivity and powered workstations with uninterrupted power backup.",
    ],
  },
  expectedOutcomes: {
    title: "Expected Deliverables & Outcomes",
    items: [
      {
        title: "Innovative Solutions",
        desc: "Development of novel and practical solutions to industry-relevant problems.",
      },
      {
        title: "Talent Showcase",
        desc: "Providing a platform for students to demonstrate their skills and creativity to potential employers.",
      },
      {
        title: "Skill Enhancement",
        desc: "Opportunities for participants to learn new technologies and improve their problem-solving abilities & gain internship opportunities.",
      },
      {
        title: "Industry Collaboration",
        desc: "Fostering strong connections between academia and industry through shared challenges and mentorship with incubation support.",
      },
    ],
  },
};
