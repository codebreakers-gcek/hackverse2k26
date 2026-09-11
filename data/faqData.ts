import { FaqItem, FaqCategoryConfig } from "@/types/faq";

export const FAQ_CATEGORIES: FaqCategoryConfig[] = [
  {
    id: "all",
    label: "ALL QUESTIONS",
    iconName: "HelpCircle",
    description: "Browse all frequently asked questions across categories.",
  },
  {
    id: "general",
    label: "GENERAL & ABOUT",
    iconName: "Sparkles",
    description: "What is HACKVERSE, venue location, dates, and event overview.",
  },
  {
    id: "registration",
    label: "REGISTRATION & FEES",
    iconName: "CreditCard",
    description: "How to register, entry fees, payment verification, and deadlines.",
  },
  {
    id: "teams",
    label: "TEAMS & ELIGIBILITY",
    iconName: "Users",
    description: "Team sizing, cross-college squads, solo participation, and eligibility.",
  },
  {
    id: "logistics",
    label: "VENUE & ACCOMMODATION",
    iconName: "Building2",
    description: "Hostel stay, food, Wi-Fi, travel, and campus facilities at GCEK.",
  },
  {
    id: "submissions",
    label: "PROBLEMS & SUBMISSIONS",
    iconName: "Code2",
    description: "Problem statement tracks, code repository guidelines, and demo rules.",
  },
  {
    id: "prizes",
    label: "EVALUATION & PRIZES",
    iconName: "Award",
    description: "Judging rubrics, prize pool distribution, certificates, and goodies.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  // ==========================================
  // GENERAL & ABOUT
  // ==========================================
  {
    id: "gen-1",
    question: "WHAT IS HACKVERSE '26?",
    answer:
      "HACKVERSE '26 is the flagship national-level 24-hour offline hackathon organized by the CodeBreakers Club at Government College of Engineering, Kalahandi (GCEK), Bhawanipatna, Odisha. It brings together brilliant developers, designers, and innovators to solve pressing real-world engineering challenges across AI/ML, Web3, Cybersecurity, IoT, and Open Innovation.",
    category: "general",
    categoryLabel: "General & About",
    tags: ["hackverse", "overview", "gcek", "what is"],
    popular: true,
  },
  {
    id: "gen-2",
    question: "WHEN AND WHERE WILL HACKVERSE '26 TAKE PLACE?",
    answer:
      "The Grand Finale will take place on October 8-10, 2026, in an immersive offline mode at the Government College of Engineering Kalahandi (GCEK) Campus, Bandopala, Bhawanipatna, Odisha - 766003. Round 1 online evaluations precede the offline round.",
    category: "general",
    categoryLabel: "General & About",
    tags: ["venue", "dates", "location", "offline"],
    popular: true,
    actionLink: {
      label: "VIEW EVENT SCHEDULE",
      href: "/schedule",
    },
  },
  {
    id: "gen-3",
    question: "IS HACKVERSE AN ONLINE OR OFFLINE HACKATHON?",
    answer:
      "HACKVERSE '26 follows a hybrid 2-tier format: Round 1 (Idea & Prototype Submission) is 100% online. Shortlisted finalist squads are invited to the physical 24-hour Grand Finale hackathon at the GCEK Campus in Bhawanipatna.",
    category: "general",
    categoryLabel: "General & About",
    tags: ["hybrid", "online", "offline", "format"],
  },

  // ==========================================
  // REGISTRATION & FEES
  // ==========================================
  {
    id: "reg-1",
    question: "HOW DO I REGISTER MY TEAM FOR HACKVERSE '26?",
    answer:
      "You can register directly on our official portal by clicking the 'REGISTER SQUAD' button. The Team Leader must sign up, provide squad details (member names, emails, colleges, GitHub profiles), and submit the registration.",
    category: "registration",
    categoryLabel: "Registration & Fees",
    tags: ["register", "how to apply", "portal", "signup"],
    popular: true,
    actionLink: {
      label: "REGISTER SQUAD NOW",
      href: "/register",
    },
  },
  {
    id: "reg-2",
    question: "IS THERE ANY REGISTRATION FEE TO PARTICIPATE?",
    answer:
      "Registration for Round 1 (Online Idea Submission) is completely FREE. Teams shortlisted for the Grand Finale offline round will pay a nominal confirmation & accommodation fee (inclusive of food, stay, official delegate kits, and 24/7 facility access) processed securely via the dashboard UPI gateway.",
    category: "registration",
    categoryLabel: "Registration & Fees",
    tags: ["fee", "cost", "free", "payment", "upi"],
    popular: true,
  },
  {
    id: "reg-3",
    question: "WHAT IS THE DEADLINE TO REGISTER?",
    answer:
      "Online squad registrations and Phase 1 abstract submissions close on September 26, 2026 at 23:59 IST. We strongly recommend completing registration early to receive mentorship updates and problem statement document packs.",
    category: "registration",
    categoryLabel: "Registration & Fees",
    tags: ["deadline", "last date", "closing time"],
  },
  {
    id: "reg-4",
    question: "HOW DO I VERIFY MY PAYMENT AND SUBMIT THE UTR / TRANSACTION ID?",
    answer:
      "Once your team is shortlisted, navigate to your Team Dashboard > Payment tab. Scan the official administrator QR code or copy the UPI ID, complete the payment in your preferred UPI app, and enter the 12-digit UTR / Reference number and upload a payment receipt screenshot. The admin team verifies it within 12-24 hours.",
    category: "registration",
    categoryLabel: "Registration & Fees",
    tags: ["payment", "utr", "qr code", "upi", "verification"],
  },

  // ==========================================
  // TEAMS & ELIGIBILITY
  // ==========================================
  {
    id: "team-1",
    question: "WHAT IS THE TEAM SIZE REQUIREMENT?",
    answer:
      "Teams must consist of 2 to 4 members. Inter-disciplinary squads (combining software engineers, UI/UX designers, hardware enthusiasts, and domain thinkers) are highly encouraged.",
    category: "teams",
    categoryLabel: "Teams & Eligibility",
    tags: ["team size", "members", "min max"],
    popular: true,
  },
  {
    id: "team-2",
    question: "CAN MEMBERS BE FROM DIFFERENT COLLEGES OR DIFFERENT MAJORS?",
    answer:
      "NO. Cross-college teams are not permitted. All members of a squad must belong to the same college/institution. However, cross-department and cross-year teams from the same college are fully permitted and welcomed.",
    category: "teams",
    categoryLabel: "Teams & Eligibility",
    tags: ["same college", "cross college not allowed", "eligibility", "branches"],
  },
  {
    id: "team-3",
    question: "CAN I PARTICIPATE AS A SOLO DEVELOPER?",
    answer:
      "To foster collaboration, hackathon rules require a minimum of 2 members per team. If you do not have a squad yet, you can join our official HackVerse Discord community to find potential teammates with complementary skill sets.",
    category: "teams",
    categoryLabel: "Teams & Eligibility",
    tags: ["solo", "single", "find team", "matchmaking"],
  },
  {
    id: "team-4",
    question: "WHO IS ELIGIBLE TO PARTICIPATE?",
    answer:
      "All undergraduate (B.Tech, B.E., B.Sc, BCA), postgraduate (M.Tech, MCA, M.Sc), and diploma students enrolled in any recognized educational institution with a valid student ID card are eligible to compete.",
    category: "teams",
    categoryLabel: "Teams & Eligibility",
    tags: ["eligibility", "students", "degree", "btech"],
  },

  // ==========================================
  // VENUE & ACCOMMODATION
  // ==========================================
  {
    id: "log-1",
    question: "WILL ACCOMMODATION AND FOOD BE PROVIDED DURING THE OFFLINE EVENT?",
    answer:
      "YES! All shortlisted participants attending the Grand Finale at GCEK Campus will receive complimentary hostel/guest accommodation, 24/7 snacks & energy drinks, breakfast, lunch, and dinner throughout the 24-hour sprint.",
    category: "logistics",
    categoryLabel: "Venue & Accommodation",
    tags: ["food", "hostel", "accommodation", "stay", "meals"],
    popular: true,
  },
  {
    id: "log-2",
    question: "WHAT FACILITIES AND INFRASTRUCTURE WILL BE AVAILABLE AT GCEK?",
    answer:
      "The campus provides high-speed enterprise Wi-Fi, dedicated squad workstations, power strips at every desk, hardware prototyping labs, soldering stations, mentor helpdesks, and resting lounges with medical first aid support.",
    category: "logistics",
    categoryLabel: "Venue & Accommodation",
    tags: ["wifi", "power", "hardware", "facilities", "labs"],
  },
  {
    id: "log-3",
    question: "HOW DO I REACH GCEK BHAWANIPATNA?",
    answer:
      "Bhawanipatna is well-connected by rail (Bhawanipatna Railway Station - BWIP / Kesinga Junction - KSNG, ~35 km away) and road via National Highways. The nearest airports are Utkela Airport (Bhawanipatna) and Raipur / Bhubaneswar. College shuttle buses will operate from major transit points for registered participants.",
    category: "logistics",
    categoryLabel: "Venue & Accommodation",
    tags: ["travel", "how to reach", "train", "airport", "bus"],
  },

  // ==========================================
  // PROBLEMS & SUBMISSIONS
  // ==========================================
  {
    id: "sub-1",
    question: "WHERE CAN I FIND AND DOWNLOAD THE PROBLEM STATEMENT SPECS?",
    answer:
      "All 8 official problem statements across AI/ML, Web Development, Cybersecurity, IoT, and Open Innovation are listed on the Problem Statements page. Click 'VIEW DETAILS' on any card to slide open the comprehensive specification sheet and click 'DOWNLOAD DOCUMENT' to access the detailed Google Drive folder.",
    category: "submissions",
    categoryLabel: "Problems & Submissions",
    tags: ["problem statements", "spec", "drive", "download"],
    popular: true,
    actionLink: {
      label: "EXPLORE PROBLEM STATEMENTS",
      href: "/problem-statements",
    },
  },
  {
    id: "sub-2",
    question: "CAN WE CHOOSE AN OPEN INNOVATION THEME INSTEAD OF A PRESET PROBLEM?",
    answer:
      "YES! Track CB-OPEN-08 is dedicated to Open Innovation. If you have an original breakthrough idea in Fintech, EdTech, Healthcare, GreenTech, or Smart Governance that doesn't fit standard categories, you are welcome to pitch and build it under Open Innovation.",
    category: "submissions",
    categoryLabel: "Problems & Submissions",
    tags: ["open innovation", "custom problem", "own idea"],
  },
  {
    id: "sub-3",
    question: "CAN WE USE PRE-EXISTING CODE OR LIBRARIES?",
    answer:
      "Open-source libraries, frameworks, APIs, and boilerplate templates are completely acceptable. However, the core business logic, feature implementation, and user interface must be engineered during the 24-hour hackathon window. Pre-built complete projects are strictly prohibited and will lead to immediate disqualification.",
    category: "submissions",
    categoryLabel: "Problems & Submissions",
    tags: ["pre-existing code", "open source", "plagiarism", "rules"],
  },
  {
    id: "sub-4",
    question: "WHAT ARE THE SUBMISSION REQUIREMENTS AT THE END OF THE HACKATHON?",
    answer:
      "Teams must submit: 1) A public GitHub / GitLab repository containing cleanly documented source code and a descriptive README.md, 2) A live deployment URL (or video demo for hardware projects), and 3) A 5-slide pitch deck summarizing problem, architecture, tech stack, and impact.",
    category: "submissions",
    categoryLabel: "Problems & Submissions",
    tags: ["github", "deliverables", "repo", "pitch deck", "demo"],
  },

  // ==========================================
  // EVALUATION & PRIZES
  // ==========================================
  {
    id: "priz-1",
    question: "WHAT IS THE TOTAL PRIZE POOL AND WHAT ARE THE AWARDS?",
    answer:
      "HACKVERSE '26 boasts a massive prize pool including cash awards for 1st, 2nd, and 3rd Overall Winners, Category Track Champions, Best All-Women Squad, Best UI/UX Design, and Best First-Year Freshers Team, alongside sponsor bounties, cloud credits, and swags.",
    category: "prizes",
    categoryLabel: "Evaluation & Prizes",
    tags: ["prizes", "cash", "rewards", "bounties", "swag"],
    popular: true,
  },
  {
    id: "priz-2",
    question: "HOW WILL PROJECTS BE EVALUATED BY THE JURY?",
    answer:
      "Projects are evaluated on 5 key pillars: 1) Technical Complexity & Architecture (30%), 2) Innovation & Originality (25%), 3) Practical Utility & Business Viability (20%), 4) UI/UX Design & Usability (15%), and 5) Final Pitch & Live Q&A Performance (10%).",
    category: "prizes",
    categoryLabel: "Evaluation & Prizes",
    tags: ["rubric", "judging", "evaluation", "scoring"],
    actionLink: {
      label: "VIEW DETAILED GUIDELINES",
      href: "/guidelines",
    },
  },
  {
    id: "priz-3",
    question: "WILL ALL PARTICIPANTS RECEIVE CERTIFICATES?",
    answer:
      "YES! Every participant who submits an eligible Round 1 abstract and all finalist attendees at the Grand Finale will receive verified digital certificates of participation / excellence issued by GCEK and CodeBreakers Club.",
    category: "prizes",
    categoryLabel: "Evaluation & Prizes",
    tags: ["certificate", "participation", "recognition"],
  },
];

export const FAQ_SUPPORT_INFO = {
  discordUrl: "https://discord.gg/hackverse2026",
  email: "hackverse@gcekbpatna.ac.in",
  phone: "+91 98765 43210",
  venueName: "Govt. College of Engineering Kalahandi (GCEK)",
  venueAddress: "Bandopala, Bhawanipatna, Kalahandi, Odisha - 766003",
};
