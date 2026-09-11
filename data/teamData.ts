import { OfficialIncharge, TeamMember } from "@/types/team";

export const officialIncharges: OfficialIncharge[] = [
  {
    id: "principal",
    name: "Prof.(Dr) Subhransu Sekhar Dash",
    designation: "Principal & Patron-in-Chief",
    role: "Government College of Engineering Kalahandi",
    image: "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786821219/773725407_17976388644114016_5470375353953459513_n_hjyuvt.jpg",
    quote: "Empowering young technical minds to innovate, lead, and shape the digital future of our nation through technology.",
    department: "Administration, GCEK",
  },
  {
    id: "dsw",
    name: "Prof.(Dr) Chitaranjan Dash",
    designation: "Dean Student Welfare (DSW)",
    role: "Government College of Engineering Kalahandi",
    image: "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786979088/WhatsApp_Image_2026-08-15_at_10.11.03_PM_yox4ea.jpg",
    quote: "Fostering an ecosystem of holistic student growth, technical excellence, and vibrant campus leadership.",
    department: "Student Welfare, GCEK",
  },
  {
    id: "pic",
    name: "Dr. Ashok Kumar Bhoi",
    designation: "Professor In-Charge (PIC)",
    role: "Assistant Professor, Dept. of CSE",
    image: "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786979305/IMG_0701_t1nojn.jpg", // Fallback / Cloudinary asset
    quote: "Guiding and mentoring students to master modern software engineering, competitive programming, and technological innovation.",
    department: "Department of CSE, GCEK",
  },
];

export const coreLeads: TeamMember[] = [];

export const clubLeads: TeamMember[] = [
    {
    image:
      "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786779293/IMG_0230_2_vmnw90.jpg",
    title: "Gyanranjan Priyam",
    subtitle: "Chief Co-ordinator",
    handle: "@gyanranjanpriyam",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(225deg,#8B5CF6,#000)",
    url: "https://priyam.tech",
    email: "hello@priyam.tech",
    socials: {
      github: "https://github.com/gyanranjan-priyam",
      instagram: "https://www.instagram.com/gyanranjanpriyam/",
      linkedin: "https://www.linkedin.com/in/gyanranjan-priyam",
      website: "https://priyam.tech/",
    },
  },
    {
    image:
      "https://res.cloudinary.com/dw47ib0sh/image/upload/v1764687111/dcamoaxh8imtoetrydzn.jpg",
    title: "Smruti Ranjan Adhikari",
    subtitle: "Management Head",
    handle: "@Smrutiranjan8895",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(145deg, #F59E0B, #000)",
    url: "https://github.com/Smrutiranjan8895",
    email: "smrutiranjanadhikari17@gmail.com",
    socials: {
      github: "https://github.com/Smrutiranjan8895",
      instagram: "https://www.instagram.com/smrutiranjan_adhikari?igsh=Mjdrbmk0ZHQ3eDRm",
      linkedin: "https://www.linkedin.com/in/smruti-ranjan-adhikari-b83751370",
      website: "https://smrutiranjanadhikari.vercel.app/",
    },
  },
  {
    image:
      "https://res.cloudinary.com/dw47ib0sh/image/upload/v1764699535/iner68oti4yr5encnv1f.jpg",
    title: "Chayakanta Maharana",
    subtitle: "Management Co-Lead",
    handle: "@chayakanta",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://www.linkedin.com/in/chhayakanta-maharana-a231a2298",
    email: "chhayakantamaharan@gmail.com",
    socials: {
      github: "https://github.com/Chhayakanta-Maharana1",
      instagram: "#",
      linkedin: "https://www.linkedin.com/in/chhayakanta-maharana-a231a2298/",
      website: "https://portfolio-chhaya.netlify.app/",
    },
  },

  {
    image:
      "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786816638/WhatsApp_Image_2026-08-15_at_11.25.32_PM_vqijmi.jpg",
    title: "Omprakash Behera",
    subtitle: "Technical Lead",
    handle: "@Prakash",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://omprakashbehera.me/",
    email: "omprakashbehera.cse@gmail.com",
    socials: {
      github: "https://github.com/CodeByPrakash",
      instagram: "https://instagram.com/quasar_om",
      linkedin: "https://linkedin.com/in/omprakash-cse",
      website: "https://omprakashbehera.me/",
    },
  },
    {
    image:
      "https://res.cloudinary.com/dw47ib0sh/image/upload/v1764686998/qqpuw8paqkzjx0iqv9vd.jpg",
    title: "Deepankar Sahoo",
    subtitle:"Teachnical Co-Lead",
    handle: "@codebydeepankar",
    borderColor: "#06B6D4",
    gradient: "linear-gradient(135deg, #06B6D4, #000)",
    url: "https://github.com/codebydeepankar",
    email: "deepankarsahoo68@gmail.com",
    socials: {
      github: "https://github.com/codebydeepankar",
      instagram: "",
      linkedin: "",
      website: "https://www.deepankar.tech",
    },
  },
  {
    image:
      "https://res.cloudinary.com/dhyxx8qjf/image/upload/v1786815150/32042072951_whoo1r.png",
    title: "Barsha Priyadarshini Das",
    subtitle:"Event Head",
    handle: "@Dbarsha_1118",
    borderColor: "#EC4899",
    gradient: "linear-gradient(180deg, #EC4899, #000)",
    url: "https://www.linkedin.com/in/barsha-priyadarshini-das",
    email: "dasbarshapriyadarshini1803@gmail.com",
    socials: {
      github: "https://github.com/Dbarsha-hub",
      instagram: "",
      linkedin: "https://www.linkedin.com/in/barsha-priyadarshini-das",
      website: "",
    },
  },

];

const items = [...coreLeads, ...clubLeads];
export default items;
