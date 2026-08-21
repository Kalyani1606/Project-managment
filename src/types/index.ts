export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "HOD";
  createdAt: string;
  studentProfile?: {
    id: string;
    rollNumber: string;
    semester: number;
    department: string;
    bio: string | null;
    github: string | null;
    linkedin: string | null;
    skills: string[];
    profilePicture: string | null;
  } | null;
}

export interface StudentCardInfo {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  semester: number;
  department: string;
  skills: string[];
  github?: string | null;
  linkedin?: string | null;
  profilePicture?: string | null;
}

export interface TeacherGuideInfo {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  areasOfExpertise: string[];
  maxProjects: number;
  activeProjectsCount?: number;
}

export interface TeamMemberDisplay {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  semester: number;
  department: string;
  role: string;
  status: string;
  skills: string[];
  github?: string | null;
  linkedin?: string | null;
  profilePicture?: string | null;
}

export interface TeamInvitationDisplay {
  id: string;
  teamId: string;
  teamName: string;
  senderName: string;
  senderRoll: string;
  semester: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface ProjectDisplay {
  id: string;
  teamId: string;
  teamName: string;
  semester: number;
  projectTitle: string;
  problemStatement: string;
  description: string;
  domain: string;
  technologies: string[];
  status: string;
  createdAt: string;
  creatorName?: string;
  members: TeamMemberDisplay[];
  guideRequests: {
    id: string;
    teacherId: string;
    teacherName: string;
    department: string;
    designation: string;
    roleType: string;
    status: string;
  }[];
}

export interface NotificationItem {
  id: string;
  type: "TEAM_INVITE" | "INVITE_ACCEPTED" | "INVITE_REJECTED" | "GUIDE_REQUEST" | "PROJECT_CREATED" | "SYSTEM";
  title: string;
  message: string;
  link?: string | null;
  metadata?: any;
  read: boolean;
  createdAt: string;
}

export interface EmailLogItem {
  id: string;
  toEmail: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  sentAt: string;
}
