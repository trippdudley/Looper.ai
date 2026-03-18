export interface Coach {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  certifications: string[];
  yearsExperience: number;
  studentCount: number;
  avgImprovement: number;
  connectedSystems: string[];
}

export const coaches: Coach[] = [
  {
    id: "coach-austin",
    name: "Austin Reed",
    title: "PGA",
    specialty: "Full Swing & Ball Flight Control",
    bio: "15-year PGA professional specializing in data-driven instruction. Combines Trackman analysis with feel-based coaching to accelerate improvement.",
    certifications: ["PGA Class A", "Trackman Level 2", "TPI Certified"],
    yearsExperience: 15,
    studentCount: 42,
    avgImprovement: 3.2,
    connectedSystems: ["trackman", "arccos", "ghin"],
  },
  {
    id: "coach-sarah",
    name: "Sarah Kim",
    title: "LPGA",
    specialty: "Short Game & Course Strategy",
    bio: "Former mini-tour player turned instructor. Known for her short game expertise and strategic approach to scoring.",
    certifications: ["LPGA Class A", "Foresight Certified", "TPI Level 1"],
    yearsExperience: 10,
    studentCount: 35,
    avgImprovement: 2.8,
    connectedSystems: ["foresight", "arccos", "ghin"],
  },
];
