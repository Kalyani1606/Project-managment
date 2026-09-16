"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TeamMember {
  name: string;
  email: string;
  regNo: string;
  role: string;
  status: "Accepted" | "Pending";
}

export interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  publication: string;
  year: string;
}

export interface Team {
  id: string;
  name: string;
  leaderEmail: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  mentorId: string | null;
  mentorName: string | null;
  mentorStatus: "Pending" | "Accepted" | "Rejected";
  domain: string;
  domainReason: string;
  projectTitle: string;
  problemStatement: string;
  shortDescription: string;
  currentSemester: string;
  members: TeamMember[];
  invitations: { email: string; status: string }[];
  researchPapers: ResearchPaper[];
  marks: {
    cia: { teamFormation: number; mentorSelection: number; domainSelection: number; problemIdentification: number; researchReview: number; total: number };
    endSem: { presentation: number; finalReport: number; total: number };
    totalMarks: number;
    status: "Draft" | "Verified" | "Finalized";
  };
}

export interface ProjectDiaryEntry {
  id: string;
  teamId: string;
  teamName: string;
  date: string;
  mentorName: string;
  studentsPresent: string[];
  discussion: string;
  guidanceGiven: string;
  workAssigned: string;
  nextMeetingDate: string;
}

export interface Evaluation {
  id: string;
  teamId: string;
  reviewerName: string;
  reviewName: string;
  reviewDate: string;
  scores: Record<string, number>;
  totalScore: number;
  comments: string;
}

export interface ReviewEvent {
  id: string;
  semester: string;
  reviewName: string;
  date: string;
  time: string;
  venue: string;
  assignedReviewer: string;
  teamsAssigned: string[];
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  author: string;
  priority: "normal" | "high";
  content: string;
}

export interface TemplateFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  url: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  maxTeams: number;
  assignedTeamsCount: number;
  expertise: string[];
}

export interface AcademicDataContextType {
  teams: Team[];
  mentors: Mentor[];
  projectDiary: ProjectDiaryEntry[];
  evaluations: Evaluation[];
  reviews: ReviewEvent[];
  notices: Notice[];
  templates: TemplateFile[];
  studentProfile: any;
  updateStudentProfile: (fields: any) => void;
  createTeam: (name: string, leaderEmail: string, leaderName: string, regNo: string) => void;
  sendInvitation: (teamId: string, email: string) => void;
  respondToInvitation: (teamId: string, email: string, accept: boolean) => void;
  selectMentor: (teamId: string, mentorId: string) => void;
  setDomainAndTopic: (teamId: string, domain: string, reason: string, title: string, problem: string, desc: string) => void;
  addResearchPaper: (teamId: string, paper: Omit<ResearchPaper, "id">) => void;
  respondToMentorRequest: (teamId: string, accept: boolean) => void;
  addProjectDiaryEntry: (entry: Omit<ProjectDiaryEntry, "id">) => void;
  submitEvaluation: (teamId: string, reviewName: string, reviewerName: string, scores: Record<string, number>, comments: string) => void;
  toggleRegisterLock: () => void;
  approveTeam: (teamId: string, status: "Approved" | "Rejected") => void;
  assignMentorToTeam: (teamId: string, mentorId: string) => void;
  scheduleReview: (event: Omit<ReviewEvent, "id">) => void;
  updateMarksStatus: (teamId: string, status: "Draft" | "Verified" | "Finalized") => void;
  publishNotice: (notice: Omit<Notice, "id" | "date" | "author">, author: string) => void;
  uploadTemplate: (template: Omit<TemplateFile, "id" | "updated">) => void;
  deleteTemplate: (id: string) => void;
}

const initialTeams: Team[] = [
  {
    id: "TEAM-01",
    name: "Team Alpha",
    leaderEmail: "alex.vance@university.edu",
    status: "Approved",
    mentorId: "MENTOR-01",
    mentorName: "Dr. Sarah Jenkins",
    mentorStatus: "Accepted",
    domain: "Artificial Intelligence",
    domainReason: "Intense interest in automated medical image diagnosis and healthcare AI accessibility.",
    projectTitle: "Explainable AI for Diabetic Retinopathy Screening",
    problemStatement: "Early detection of diabetic retinopathy is critical to prevent vision loss. Existing deep learning models lack explainability for clinicians.",
    shortDescription: "Developing a novel Grad-CAM augmented CNN model that highlights subtle retinal lesions while providing confidence scores for ophthalmologists.",
    currentSemester: "6th Semester",
    members: [
      { name: "Alex Vance", email: "alex.vance@university.edu", regNo: "21BCA042", role: "Team Leader", status: "Accepted" },
      { name: "David Miller", email: "david.m@university.edu", regNo: "21BCA043", role: "Member", status: "Accepted" },
      { name: "Elena Rostova", email: "elena.r@university.edu", regNo: "21BCA045", role: "Member", status: "Accepted" },
      { name: "Siddharth Rao", email: "siddharth.r@university.edu", regNo: "21BCA048", role: "Member", status: "Accepted" }
    ],
    invitations: [],
    researchPapers: [
      { id: 1, title: "Deep Residual Learning for Image Recognition", authors: "He, K., Zhang, X., Ren, S., & Sun, J.", publication: "IEEE CVPR", year: "2016" },
      { id: 2, title: "Grad-CAM: Visual Explanations from Deep Networks", authors: "Selvaraju, R. R., et al.", publication: "IEEE ICCV", year: "2017" },
      { id: 3, title: "Deep Learning for Detection of Diabetic Retinopathy", authors: "Gulshan, V., Rajan, R. P., et al.", publication: "JAMA Journal", year: "2016" },
      { id: 4, title: "Attention Is All You Need in Medical Vision Transformers", authors: "Vaswani, A., & Dosovitskiy, A.", publication: "NeurIPS", year: "2021" },
      { id: 5, title: "Explainable AI in Clinical Decision Support: A Review", authors: "Amann, J., et al.", publication: "BMC Medical Informatics", year: "2020" }
    ],
    marks: {
      cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 5, problemIdentification: 5, researchReview: 5, total: 25 },
      endSem: { presentation: 9, finalReport: 14, total: 23 },
      totalMarks: 48,
      status: "Verified"
    }
  },
  {
    id: "TEAM-02",
    name: "Team CyberShield",
    leaderEmail: "priya.s@university.edu",
    status: "Approved",
    mentorId: "MENTOR-02",
    mentorName: "Prof. Alan Turing",
    mentorStatus: "Accepted",
    domain: "Cybersecurity",
    domainReason: "Addressing zero-day IoT vulnerability threats in smart home networks.",
    projectTitle: "AI-Powered Anomaly Detection System for IoT Traffic",
    problemStatement: "IoT devices lack standard hardware encryption and are vulnerable to botnet amplification attacks.",
    shortDescription: "Implementing lightweight eBPF packet capture with isolation forest machine learning.",
    currentSemester: "6th Semester",
    members: [
      { name: "Priya Sharma", email: "priya.s@university.edu", regNo: "21BCA012", role: "Team Leader", status: "Accepted" },
      { name: "Kevin Durant", email: "kevin.d@university.edu", regNo: "21BCA015", role: "Member", status: "Accepted" },
      { name: "Ananya Roy", email: "ananya.r@university.edu", regNo: "21BCA019", role: "Member", status: "Accepted" }
    ],
    invitations: [],
    researchPapers: [
      { id: 1, title: "eBPF-Based Network Packet Inspection", authors: "Smith, J.", publication: "ACM SIGCOMM", year: "2022" },
      { id: 2, title: "IoT Security Challenges and Machine Learning Defense", authors: "Zheng, C.", publication: "IEEE IoT Journal", year: "2021" },
      { id: 3, title: "Isolation Forest for High-Dimensional Network Intrusion", authors: "Liu, F. T.", publication: "IEEE ICDM", year: "2008" },
      { id: 4, title: "Zero-Day Vulnerability Mitigation in Edge Networks", authors: "Kumar, A.", publication: "IEEE Access", year: "2023" },
      { id: 5, title: "Mirai Botnet Architecture & Remediation Strategies", authors: "Antonakakis, M.", publication: "USENIX Security", year: "2017" }
    ],
    marks: {
      cia: { teamFormation: 5, mentorSelection: 5, domainSelection: 4, problemIdentification: 5, researchReview: 4, total: 23 },
      endSem: { presentation: 8, finalReport: 13, total: 21 },
      totalMarks: 44,
      status: "Draft"
    }
  }
];

const initialMentors: Mentor[] = [
  { id: "MENTOR-01", name: "Dr. Sarah Jenkins", email: "s.jenkins@university.edu", department: "Computer Science", designation: "Associate Professor", maxTeams: 8, assignedTeamsCount: 5, expertise: ["Artificial Intelligence", "Machine Learning", "Computer Vision"] },
  { id: "MENTOR-02", name: "Prof. Alan Turing", email: "a.turing@university.edu", department: "Cybersecurity", designation: "Professor", maxTeams: 8, assignedTeamsCount: 4, expertise: ["Cybersecurity", "IoT Security", "Cryptography"] },
  { id: "MENTOR-03", name: "Dr. Grace Hopper", email: "g.hopper@university.edu", department: "Cloud Systems", designation: "Professor", maxTeams: 8, assignedTeamsCount: 7, expertise: ["Cloud Computing", "DevOps", "Distributed Systems"] },
  { id: "MENTOR-04", name: "Dr. Raj Patel", email: "r.patel@university.edu", department: "Data Science", designation: "Assistant Professor", maxTeams: 8, assignedTeamsCount: 6, expertise: ["Data Science", "Big Data Analytics", "NLP"] }
];

const initialDiary: ProjectDiaryEntry[] = [
  {
    id: "DIARY-101",
    teamId: "TEAM-01",
    teamName: "Team Alpha",
    date: "2025-09-02",
    mentorName: "Dr. Sarah Jenkins",
    studentsPresent: ["Alex Vance", "David Miller", "Elena Rostova", "Siddharth Rao"],
    discussion: "Reviewed problem statement and initial literature survey of 5 research papers.",
    guidanceGiven: "Refine the Grad-CAM visualization pipeline. Focus on Kaggle Diabetic Retinopathy dataset pre-processing.",
    workAssigned: "Complete dataset preprocessing and execute baseline ResNet50 model training.",
    nextMeetingDate: "2025-09-16"
  },
  {
    id: "DIARY-102",
    teamId: "TEAM-01",
    teamName: "Team Alpha",
    date: "2025-08-20",
    mentorName: "Dr. Sarah Jenkins",
    studentsPresent: ["Alex Vance", "Elena Rostova"],
    discussion: "Initial project domain identification and scope discussion.",
    guidanceGiven: "Approved AI domain selection. Suggested narrowing focus to healthcare diagnostics.",
    workAssigned: "Draft problem statement and identify 5 high-impact peer-reviewed journals.",
    nextMeetingDate: "2025-09-02"
  },
  {
    id: "DIARY-103",
    teamId: "TEAM-02",
    teamName: "Team CyberShield",
    date: "2025-08-28",
    mentorName: "Prof. Alan Turing",
    studentsPresent: ["Priya Sharma", "Kevin Durant", "Ananya Roy"],
    discussion: "eBPF kernel module implementation overview and setup environment test.",
    guidanceGiven: "Ensure Linux kernel compatibility (v5.15+). Use BCC toolkit for rapid prototyping.",
    workAssigned: "Set up virtualized testbed for IoT packet capture.",
    nextMeetingDate: "2025-09-12"
  }
];

const initialEvaluations: Evaluation[] = [
  {
    id: "EVAL-01",
    teamId: "TEAM-01",
    reviewerName: "Prof. Robert Langford",
    reviewName: "6th Semester Mid-Term Review",
    reviewDate: "2025-09-10",
    scores: { problemUnderstanding: 9, literatureReview: 10, technicalKnowledge: 9, progress: 8, presentation: 9 },
    totalScore: 45,
    comments: "Exceptional clarity in literature review. Grad-CAM methodology design is very well grounded."
  }
];

const initialReviews: ReviewEvent[] = [
  { id: "REV-EVENT-01", semester: "6th Semester", reviewName: "6th Semester CIA Review & Viva", date: "2025-10-20", time: "10:00 AM - 01:00 PM", venue: "Seminar Hall 2, Science Block", assignedReviewer: "Prof. Robert Langford", teamsAssigned: ["TEAM-01", "TEAM-02"] },
  { id: "REV-EVENT-02", semester: "7th Semester", reviewName: "7th Semester Prototype Demo", date: "2025-11-15", time: "02:00 PM - 05:00 PM", venue: "Project Lab 4, IT Wing", assignedReviewer: "Dr. Emily Watson", teamsAssigned: ["TEAM-03"] }
];

const initialNotices: Notice[] = [
  { id: "NOTE-01", title: "6th Semester Research Paper & Topic Finalization Deadline", date: "2025-09-08", author: "Dr. Marcus Sterling (Coordinator)", priority: "high", content: "All 6th Semester teams must complete domain selection, problem statement, and 5 research paper entries by September 25th, 2025." },
  { id: "NOTE-02", title: "CIA Presentation & Evaluation Schedule Released", date: "2025-09-05", author: "Dr. Marcus Sterling (Coordinator)", priority: "normal", content: "The 6th Semester CIA Review will be held on October 20th, 2025 in Seminar Hall 2. Check your review schedule tab for venue details." },
  { id: "NOTE-03", title: "Official E-Report & PPT Templates Uploaded", date: "2025-09-01", author: "Dr. Marcus Sterling (Coordinator)", priority: "normal", content: "Official project report layout templates and presentation slides have been updated in the Resources & Templates section." }
];

const initialTemplates: TemplateFile[] = [
  { id: "T-01", name: "Official 6th Sem Structured E-Report Format", type: "PDF / Document Guide", size: "1.2 MB", updated: "Sep 01, 2025", url: "#" },
  { id: "T-02", name: "Official Mid-Semester Presentation Deck (.pptx)", type: "PowerPoint Template", size: "3.4 MB", updated: "Sep 01, 2025", url: "#" }
];

const initialStudentProfile = {
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  fullName: "Alex Vance",
  registerNo: "21BCA042",
  registerNoLocked: true,
  email: "alex.vance@university.edu",
  phone: "+91 98765 43210",
  department: "Department of Computer Applications",
  programme: "B.C.A",
  course: "Project Work & Viva-Voce",
  semester: "6th Semester",
  academicYear: "2025 - 2026",
  teamId: "TEAM-01"
};

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

export function AcademicDataProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [projectDiary, setProjectDiary] = useState<ProjectDiaryEntry[]>(initialDiary);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [reviews, setReviews] = useState<ReviewEvent[]>(initialReviews);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [templates, setTemplates] = useState<TemplateFile[]>(initialTemplates);
  const [studentProfile, setStudentProfile] = useState(initialStudentProfile);

  const updateStudentProfile = (fields: any) => {
    setStudentProfile(prev => ({ ...prev, ...fields }));
  };

  const createTeam = (name: string, leaderEmail: string, leaderName: string, regNo: string) => {
    const newId = `TEAM-${String(teams.length + 1).padStart(2, "0")}`;
    const newTeam: Team = {
      id: newId,
      name,
      leaderEmail,
      status: "Pending Approval",
      mentorId: null,
      mentorName: null,
      mentorStatus: "Pending",
      domain: "",
      domainReason: "",
      projectTitle: "",
      problemStatement: "",
      shortDescription: "",
      currentSemester: "6th Semester",
      members: [{ name: leaderName, email: leaderEmail, regNo, role: "Team Leader", status: "Accepted" }],
      invitations: [],
      researchPapers: [],
      marks: {
        cia: { teamFormation: 5, mentorSelection: 0, domainSelection: 0, problemIdentification: 0, researchReview: 0, total: 5 },
        endSem: { presentation: 0, finalReport: 0, total: 0 },
        totalMarks: 5,
        status: "Draft"
      }
    };
    setTeams(prev => [...prev, newTeam]);
    setStudentProfile(prev => ({ ...prev, teamId: newId }));
  };

  const sendInvitation = (teamId: string, email: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (t.invitations.some(i => i.email === email)) return t;
        return { ...t, invitations: [...t.invitations, { email, status: "Pending" }] };
      }
      return t;
    }));
  };

  const respondToInvitation = (teamId: string, email: string, accept: boolean) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const updatedInvites = t.invitations.filter(i => i.email !== email);
        let updatedMembers = [...t.members];
        if (accept) {
          updatedMembers.push({
            name: email.split("@")[0].replace(".", " ").toUpperCase(),
            email,
            regNo: `21BCA${Math.floor(100 + Math.random() * 800)}`,
            role: "Member",
            status: "Accepted"
          });
        }
        return { ...t, invitations: updatedInvites, members: updatedMembers };
      }
      return t;
    }));
  };

  const selectMentor = (teamId: string, mentorId: string) => {
    const mentorObj = mentors.find(m => m.id === mentorId);
    if (!mentorObj) return;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, mentorId: mentorObj.id, mentorName: mentorObj.name, mentorStatus: "Pending" } : t));
  };

  const setDomainAndTopic = (teamId: string, domain: string, reason: string, title: string, problem: string, desc: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const newCiaTotal = (t.marks.cia.teamFormation || 5) + (t.marks.cia.mentorSelection || 5) + 5 + 5 + (t.marks.cia.researchReview || 0);
        return {
          ...t,
          domain,
          domainReason: reason,
          projectTitle: title,
          problemStatement: problem,
          shortDescription: desc,
          marks: {
            ...t.marks,
            cia: { ...t.marks.cia, domainSelection: 5, problemIdentification: 5, total: newCiaTotal },
            totalMarks: newCiaTotal + (t.marks.endSem?.total || 0)
          }
        };
      }
      return t;
    }));
  };

  const addResearchPaper = (teamId: string, paper: Omit<ResearchPaper, "id">) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const newPapers = [...t.researchPapers, { id: t.researchPapers.length + 1, ...paper }];
        const ciaReviewScore = newPapers.length >= 5 ? 5 : Math.floor((newPapers.length / 5) * 5);
        const newCiaTotal = (t.marks.cia.teamFormation || 5) + (t.marks.cia.mentorSelection || 5) + (t.marks.cia.domainSelection || 5) + (t.marks.cia.problemIdentification || 5) + ciaReviewScore;
        return {
          ...t,
          researchPapers: newPapers,
          marks: {
            ...t.marks,
            cia: { ...t.marks.cia, researchReview: ciaReviewScore, total: newCiaTotal },
            totalMarks: newCiaTotal + (t.marks.endSem?.total || 0)
          }
        };
      }
      return t;
    }));
  };

  const respondToMentorRequest = (teamId: string, accept: boolean) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const newCiaTotal = (t.marks.cia.teamFormation || 5) + (accept ? 5 : 0) + (t.marks.cia.domainSelection || 0) + (t.marks.cia.problemIdentification || 0) + (t.marks.cia.researchReview || 0);
        return {
          ...t,
          mentorStatus: accept ? "Accepted" : "Rejected",
          status: accept ? "Approved" : t.status,
          marks: {
            ...t.marks,
            cia: { ...t.marks.cia, mentorSelection: accept ? 5 : 0, total: newCiaTotal },
            totalMarks: newCiaTotal + (t.marks.endSem?.total || 0)
          }
        };
      }
      return t;
    }));
  };

  const addProjectDiaryEntry = (entry: Omit<ProjectDiaryEntry, "id">) => {
    const newEntry: ProjectDiaryEntry = { id: `DIARY-${Date.now()}`, ...entry };
    setProjectDiary(prev => [newEntry, ...prev]);
  };

  const submitEvaluation = (teamId: string, reviewName: string, reviewerName: string, scores: Record<string, number>, comments: string) => {
    const totalScore = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);
    const newEval: Evaluation = {
      id: `EVAL-${Date.now()}`,
      teamId,
      reviewerName,
      reviewName,
      reviewDate: new Date().toISOString().split("T")[0],
      scores,
      totalScore,
      comments
    };
    setEvaluations(prev => [newEval, ...prev]);
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const endSemTotal = Math.min(25, Math.floor(totalScore / 2));
        return {
          ...t,
          marks: {
            ...t.marks,
            endSem: {
              presentation: scores.presentation || 9,
              finalReport: Math.min(15, (scores.problemUnderstanding || 8) + (scores.progress || 7)),
              total: endSemTotal
            },
            totalMarks: (t.marks.cia?.total || 25) + endSemTotal
          }
        };
      }
      return t;
    }));
  };

  const toggleRegisterLock = () => {
    setStudentProfile(prev => ({ ...prev, registerNoLocked: !prev.registerNoLocked }));
  };

  const approveTeam = (teamId: string, status: "Approved" | "Rejected") => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status } : t));
  };

  const assignMentorToTeam = (teamId: string, mentorId: string) => {
    const mentorObj = mentors.find(m => m.id === mentorId);
    if (!mentorObj) return;
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, mentorId: mentorObj.id, mentorName: mentorObj.name, mentorStatus: "Accepted" } : t));
  };

  const scheduleReview = (event: Omit<ReviewEvent, "id">) => {
    const newReview: ReviewEvent = { id: `REV-EVENT-${Date.now()}`, ...event };
    setReviews(prev => [...prev, newReview]);
  };

  const updateMarksStatus = (teamId: string, status: "Draft" | "Verified" | "Finalized") => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, marks: { ...t.marks, status } } : t));
  };

  const publishNotice = (notice: Omit<Notice, "id" | "date" | "author">, author: string) => {
    const newNotice: Notice = {
      id: `NOTE-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      author,
      ...notice
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const uploadTemplate = (template: Omit<TemplateFile, "id" | "updated">) => {
    const newTemplate: TemplateFile = {
      id: `T-${Date.now()}`,
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      ...template
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AcademicDataContext.Provider
      value={{
        teams,
        mentors,
        projectDiary,
        evaluations,
        reviews,
        notices,
        templates,
        studentProfile,
        updateStudentProfile,
        createTeam,
        sendInvitation,
        respondToInvitation,
        selectMentor,
        setDomainAndTopic,
        addResearchPaper,
        respondToMentorRequest,
        addProjectDiaryEntry,
        submitEvaluation,
        toggleRegisterLock,
        approveTeam,
        assignMentorToTeam,
        scheduleReview,
        updateMarksStatus,
        publishNotice,
        uploadTemplate,
        deleteTemplate
      }}
    >
      {children}
    </AcademicDataContext.Provider>
  );
}

export function useAcademicData() {
  const context = useContext(AcademicDataContext);
  if (!context) throw new Error("useAcademicData must be used within AcademicDataProvider");
  return context;
}
