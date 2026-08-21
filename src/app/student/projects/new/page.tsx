"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { StudentCardInfo, TeacherGuideInfo } from "@/types";
import {
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  X,
  Sparkles,
  Github,
  Linkedin,
  ShieldCheck,
  Building2,
  Hash,
  Mail,
  GraduationCap,
  Layers,
  Send,
  UserPlus,
  HelpCircle,
  Edit2,
  AlertCircle,
  BookOpen,
} from "lucide-react";

export default function CreateTeamAndProjectPage() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const currentSemester = user?.studentProfile?.semester || 6;

  // Stepper State (1: Team Formation, 2: Project Details & Guide, 3: Review & Submit)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // ======================= STEP 1: TEAM FORMATION STATE =======================
  const [teamName, setTeamName] = useState("");
  const [semester, setSemester] = useState(currentSemester);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);

  // Search & Invite state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentCardInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [invitingStudentId, setInvitingStudentId] = useState<string | null>(null);

  // Members & Invitations attached to this team
  const [invitedMembers, setInvitedMembers] = useState<{
    id: string; // user id
    name: string;
    email: string;
    rollNumber: string;
    semester: number;
    department: string;
    skills: string[];
    github?: string | null;
    linkedin?: string | null;
    status: "ACCEPTED" | "PENDING" | "REJECTED";
    role: "Team Creator" | "Team Member";
  }[]>([]);

  // ======================= STEP 2: PROJECT DETAILS STATE =======================
  const [projectTitle, setProjectTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("AI / Machine Learning");
  const [technologies, setTechnologies] = useState<string[]>(["Python", "FastAPI", "React"]);
  const [customTechInput, setCustomTechInput] = useState("");

  // Guide Staff Selection state
  const [staffList, setStaffList] = useState<TeacherGuideInfo[]>([]);
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  const [selectedLeadGuide, setSelectedLeadGuide] = useState<TeacherGuideInfo | null>(null);
  const [selectedCoGuide, setSelectedCoGuide] = useState<TeacherGuideInfo | null>(null);
  const [showCoGuidePicker, setShowCoGuidePicker] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize creator as initial member
  useEffect(() => {
    if (user) {
      setInvitedMembers([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          rollNumber: user.studentProfile?.rollNumber || "1MS21CS001",
          semester: user.studentProfile?.semester || currentSemester,
          department: user.studentProfile?.department || "Computer Science",
          skills: user.studentProfile?.skills || ["React", "Python"],
          github: user.studentProfile?.github,
          linkedin: user.studentProfile?.linkedin,
          status: "ACCEPTED",
          role: "Team Creator",
        },
      ]);
    }
  }, [user, currentSemester]);

  // Fetch staff list for step 2
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        const res = await fetch("/api/staff");
        if (res.ok) {
          const data = await res.json();
          setStaffList(data.staff || []);
          if (data.staff?.length > 0 && !selectedLeadGuide) {
            setSelectedLeadGuide(data.staff[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load faculty staff:", err);
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Live search students across the college database
  const handleSearchStudents = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await fetch(`/api/students/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.students || []);
      }
    } catch (err) {
      console.error("Search student error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Ensure team is created in database and send invite
  const handleInviteStudent = async (student: StudentCardInfo) => {
    if (!teamName.trim()) {
      showToast("Please enter a Team Name before inviting peers.", "error");
      return;
    }

    try {
      setInvitingStudentId(student.id);

      let activeTeamId = createdTeamId;

      // 1. If team is not yet created in DB, create it first
      if (!activeTeamId) {
        const teamRes = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamName: teamName.trim(), semester }),
        });

        const teamData = await teamRes.json();
        if (!teamRes.ok) {
          showToast(teamData.error || "Failed to create team record.", "error");
          setInvitingStudentId(null);
          return;
        }
        activeTeamId = teamData.team.id;
        setCreatedTeamId(activeTeamId);
      }

      // 2. Dispatch invitation to student
      const inviteRes = await fetch(`/api/teams/${activeTeamId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: student.id }),
      });

      const inviteData = await inviteRes.json();
      if (inviteRes.ok) {
        showToast(`Team invitation dispatched to ${student.name}!`, "success");

        // Add to local display list with PENDING status
        setInvitedMembers((prev) => [
          ...prev,
          {
            id: student.id,
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            semester: student.semester,
            department: student.department,
            skills: student.skills,
            github: student.github,
            linkedin: student.linkedin,
            status: "PENDING",
            role: "Team Member",
          },
        ]);
        setIsSearchModalOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        showToast(inviteData.error || "Failed to send invitation.", "error");
      }
    } catch (err) {
      showToast("Network error dispatching invitation.", "error");
    } finally {
      setInvitingStudentId(null);
    }
  };

  // Add technology chip
  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setCustomTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  // Final Project Submission
  const handleSubmitProject = async () => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      let activeTeamId = createdTeamId;

      // Ensure team exists
      if (!activeTeamId) {
        const teamRes = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamName: teamName.trim(), semester }),
        });
        const teamData = await teamRes.json();
        if (!teamRes.ok) {
          setSubmitError(teamData.error || "Failed to finalize team record.");
          setSubmitting(false);
          return;
        }
        activeTeamId = teamData.team.id;
        setCreatedTeamId(activeTeamId);
      }

      // Submit project details
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: activeTeamId,
          semester,
          projectTitle,
          problemStatement,
          description,
          domain,
          technologies,
          leadGuideId: selectedLeadGuide?.id,
          coGuideId: selectedCoGuide?.id,
        }),
      });

      const projectData = await projectRes.json();
      if (!projectRes.ok) {
        setSubmitError(projectData.error || "Failed to create project.");
        setSubmitting(false);
        return;
      }

      showToast("Project created successfully!", "success");
      // Redirect to project dashboard
      router.push(`/student/projects/${projectData.projectId}`);
    } catch (err: any) {
      setSubmitError("Network error submitting project.");
    } finally {
      setSubmitting(false);
    }
  };

  const domainOptions = [
    "AI / Machine Learning",
    "Full Stack Web Systems",
    "IoT & Smart Embedded Devices",
    "Cybersecurity & Cryptography",
    "Cloud & Distributed Computing",
    "Mobile App Development",
    "Data Science & Big Data",
    "Robotics & Computer Vision",
    "Blockchain & Web3",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5044e4] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Project Lifecycle Wizard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Project & Form Team
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Follow the 3-step workflow to form your team, define your semester project, and select a faculty mentor.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#5044e4] font-semibold">
          <span>Target:</span>
          <span className="font-bold">Semester {semester}</span>
        </div>
      </div>

      {/* ======================= STEPPER PROGRESS INDICATOR ======================= */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
        <button
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2.5 p-3 rounded-xl transition text-left ${
            currentStep === 1
              ? "bg-[#5044e4] text-white shadow-md font-bold"
              : currentStep > 1
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold"
              : "text-slate-500 font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
              currentStep === 1
                ? "bg-white text-[#5044e4]"
                : currentStep > 1
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {currentStep > 1 ? "✓" : "1"}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs">Step 1</div>
            <div className="text-[11px] truncate">Team Formation</div>
          </div>
        </button>

        <button
          onClick={() => {
            if (teamName.trim()) setCurrentStep(2);
            else showToast("Please enter a team name first", "error");
          }}
          className={`flex items-center gap-2.5 p-3 rounded-xl transition text-left ${
            currentStep === 2
              ? "bg-[#5044e4] text-white shadow-md font-bold"
              : currentStep > 2
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold"
              : "text-slate-500 font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
              currentStep === 2
                ? "bg-white text-[#5044e4]"
                : currentStep > 2
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {currentStep > 2 ? "✓" : "2"}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs">Step 2</div>
            <div className="text-[11px] truncate">Project & Guide</div>
          </div>
        </button>

        <button
          onClick={() => {
            if (teamName.trim() && projectTitle.trim() && problemStatement.trim()) setCurrentStep(3);
            else showToast("Please complete Steps 1 and 2 before review.", "error");
          }}
          className={`flex items-center gap-2.5 p-3 rounded-xl transition text-left ${
            currentStep === 3
              ? "bg-[#5044e4] text-white shadow-md font-bold"
              : "text-slate-500 font-medium"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
              currentStep === 3 ? "bg-white text-[#5044e4]" : "bg-slate-200 text-slate-500"
            }`}
          >
            3
          </div>
          <div className="hidden sm:block">
            <div className="text-xs">Step 3</div>
            <div className="text-[11px] truncate">Review & Submit</div>
          </div>
        </button>
      </div>

      {/* =========================================================================
          STEP 1: TEAM FORMATION
      ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Team Basic Inputs */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-[#5044e4]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Team Setup & Semester Association
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeCrafters Alpha / NeuroVision Labs"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                >
                  <option value={5}>Semester 5 (Mini Project)</option>
                  <option value={6}>Semester 6 (Academic Project)</option>
                  <option value={7}>Semester 7 (Major Project - Phase 1)</option>
                  <option value={8}>Semester 8 (Final Capstone)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team Members Grid & Add Member Button */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Team Composition ({invitedMembers.length} Members)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  The team creator is automatically loaded. Search and invite peers using hackathon-style discovery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!teamName.trim()) {
                    showToast("Please enter a Team Name first.", "error");
                    return;
                  }
                  setIsSearchModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#6e58ff] to-[#4c3cfa] hover:from-[#5944eb] hover:to-[#382ae8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5044e4]/30 flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Team Member</span>
              </button>
            </div>

            {/* Team Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invitedMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl border transition relative overflow-hidden shadow-sm ${
                    member.role === "Team Creator"
                      ? "bg-[#f4f7fe] border-[#5044e4]/30"
                      : member.status === "ACCEPTED"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  {/* Top Status & Role Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        member.role === "Team Creator"
                          ? "bg-[#5044e4] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.role}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        member.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      {member.status === "ACCEPTED" ? "✓ Accepted" : "⏳ Pending Invite"}
                    </span>
                  </div>

                  {/* Member Details */}
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">{member.name}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      USN: {member.rollNumber} • Sem {member.semester}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {member.department}
                    </div>
                  </div>

                  {/* Professional Links */}
                  {(member.github || member.linkedin) && (
                    <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-100">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-900 text-xs flex items-center gap-1 transition"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span className="text-[10px]">GitHub</span>
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-[#5044e4] text-xs flex items-center gap-1 transition"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span className="text-[10px]">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Skills Tags */}
                  {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {member.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (!teamName.trim()) {
                  showToast("Please enter a team name before continuing.", "error");
                  return;
                }
                setCurrentStep(2);
              }}
              className="px-6 py-3 bg-[#5044e4] hover:bg-[#4237d1] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-[#5044e4]/30 flex items-center gap-2 transition"
            >
              <span>Next: Project Details & Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: PROJECT DETAILS & GUIDE SELECTION
      ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Project Details Form */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Project Proposal & Problem Statement
              </h2>
            </div>

            <div className="space-y-4">
              {/* Project Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Drone Surveillance using Edge AI and Computer Vision"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                />
              </div>

              {/* Problem Statement Helper Box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Problem Statement <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#5044e4] flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Structured Academic Rubric
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Guidance: Clearly outline (1) What specific problem exists, (2) Who is affected by this problem, and (3) Why solving it is critical.
                </p>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the core technical or societal problem your project addresses..."
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition resize-y shadow-sm"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Solution & Methodology <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide an overview of the proposed architecture, algorithms, hardware, or software stack..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition resize-y shadow-sm"
                />
              </div>

              {/* Domain & Technologies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Domain / Track
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                  >
                    {domainOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technology Stack Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tech (e.g. Next.js, PyTorch)..."
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech(customTechInput);
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTech(customTechInput)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Technologies Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Faculty Guide / Staff Selection */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>Faculty Project Guide Selection</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a certified department mentor. A formal Guide Request will be submitted upon project creation.
                </p>
              </div>

              {!showCoGuidePicker && (
                <button
                  type="button"
                  onClick={() => setShowCoGuidePicker(true)}
                  className="text-xs text-[#5044e4] hover:text-[#4237d1] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Co-Guide</span>
                </button>
              )}
            </div>

            {/* Staff Search Filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter faculty guides by name, department, or expertise (e.g. AI Lab, Cloud, IoT)..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
              />
            </div>

            {/* Staff Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
              {staffList
                .filter(
                  (s) =>
                    !staffSearchQuery ||
                    s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                    s.department.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                    s.areasOfExpertise.some((a) =>
                      a.toLowerCase().includes(staffSearchQuery.toLowerCase())
                    )
                )
                .map((staff) => {
                  const isLead = selectedLeadGuide?.id === staff.id;
                  const isCo = selectedCoGuide?.id === staff.id;

                  return (
                    <div
                      key={staff.id}
                      className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 shadow-sm ${
                        isLead
                          ? "bg-blue-50 border-blue-200 shadow-blue-100"
                          : isCo
                          ? "bg-purple-50 border-purple-200 shadow-purple-100"
                          : "bg-white border-slate-200 hover:border-[#5044e4]/30"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900">{staff.name}</span>
                          {isLead && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                              Lead Guide
                            </span>
                          )}
                          {isCo && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                              Co-Guide
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {staff.designation}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {staff.department}
                        </div>

                        {/* Areas of Expertise */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {staff.areasOfExpertise.map((area) => (
                            <span
                              key={area}
                              className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selection buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadGuide(staff)}
                          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition shadow-sm ${
                            isLead
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                          }`}
                        >
                          {isLead ? "✓ Selected as Lead" : "Select as Lead Guide"}
                        </button>

                        {showCoGuidePicker && (
                          <button
                            type="button"
                            disabled={isLead}
                            onClick={() => setSelectedCoGuide(isCo ? null : staff)}
                            className={`py-1.5 px-3 text-xs font-bold rounded-lg transition shadow-sm ${
                              isCo
                                ? "bg-purple-600 text-white"
                                : isLead
                                ? "opacity-30 cursor-not-allowed bg-slate-100 border border-slate-200 text-slate-400"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                            }`}
                          >
                            {isCo ? "Remove Co-Guide" : "+ Co-Guide"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Team</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!projectTitle.trim() || !problemStatement.trim() || !description.trim()) {
                  showToast("Please fill in Project Title, Problem Statement, and Description.", "error");
                  return;
                }
                setCurrentStep(3);
              }}
              className="px-6 py-3 bg-[#5044e4] hover:bg-[#4237d1] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-[#5044e4]/30 flex items-center gap-2 transition"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: REVIEW & SUBMIT
      ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {submitError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Team Summary Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5044e4]" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Team Information
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-[#5044e4] hover:text-[#4237d1] font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Team</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Team Name:</span>
                <div className="font-bold text-slate-900 text-sm">{teamName}</div>
              </div>
              <div>
                <span className="text-slate-500">Semester:</span>
                <div className="font-bold text-slate-900">Semester {semester}</div>
              </div>
              <div>
                <span className="text-slate-500">Total Members:</span>
                <div className="font-bold text-[#5044e4]">{invitedMembers.length} Registered</div>
              </div>
            </div>

            {/* Members preview */}
            <div className="flex flex-wrap gap-2 pt-2">
              {invitedMembers.map((m) => (
                <div
                  key={m.id}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.role === "Team Creator" ? "bg-[#5044e4]" : "bg-emerald-500"
                    }`}
                  />
                  <strong className="text-slate-900">{m.name}</strong>
                  <span className="text-slate-500">({m.rollNumber})</span>
                  <span className="text-[10px] text-[#5044e4]">[{m.role}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details Summary Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Project Proposal Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#5044e4] hover:text-[#4237d1] font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Project</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Project Title:</span>
                <div className="font-bold text-slate-900 text-base mt-0.5">{projectTitle}</div>
              </div>

              <div>
                <span className="text-slate-500">Problem Statement:</span>
                <p className="text-slate-700 leading-relaxed mt-0.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {problemStatement}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Proposed Solution & Description:</span>
                <p className="text-slate-700 leading-relaxed mt-0.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-500">Track / Domain:</span>
                  <div className="font-semibold text-purple-700 mt-0.5">{domain}</div>
                </div>
                <div>
                  <span className="text-slate-500">Technologies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Summary Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Faculty Guide Allocation Requests
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#5044e4] hover:text-[#4237d1] font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Lead Project Guide (Request Status: Pending)
                </span>
                <div className="font-bold text-sm text-slate-900 mt-1">
                  {selectedLeadGuide ? selectedLeadGuide.name : "No lead guide chosen"}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {selectedLeadGuide?.designation} • {selectedLeadGuide?.department}
                </div>
              </div>

              {selectedCoGuide && (
                <div className="p-3.5 bg-purple-50 border border-purple-100 rounded-xl">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Co-Guide (Request Status: Pending)
                  </span>
                  <div className="font-bold text-sm text-slate-900 mt-1">{selectedCoGuide.name}</div>
                  <div className="text-slate-600 mt-0.5">
                    {selectedCoGuide.designation} • {selectedCoGuide.department}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation & Create Project Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Details</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitProject}
              className="px-8 py-3.5 bg-gradient-to-r from-[#6e58ff] to-[#4c3cfa] hover:from-[#5944eb] hover:to-[#382ae8] text-white font-bold rounded-2xl text-sm shadow-xl shadow-[#5044e4]/30 flex items-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Create Academic Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD TEAM MEMBER SEARCH MODAL
      ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Dialog */}
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 my-6">
            <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5044e4]/10 border border-[#5044e4]/20 flex items-center justify-center text-[#5044e4]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Search & Invite Teammates</h3>
                  <p className="text-xs text-slate-500">
                    Find engineering students by Name, USN / Roll Number, or College Email
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type student name (e.g. Priya, Rahul), USN (1MS21CS...), or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchStudents(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] shadow-sm"
                />
              </div>

              {/* Search Results List */}
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {searchLoading ? (
                  <div className="py-10 text-center text-slate-500 text-xs">
                    <div className="w-6 h-6 border-2 border-[#5044e4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Searching student database...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-xs">
                    {searchQuery ? "No matching students found." : "Type to search peer students."}
                  </div>
                ) : (
                  searchResults.map((student) => {
                    const alreadyInvited = invitedMembers.some((m) => m.id === student.id);

                    return (
                      <div
                        key={student.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-[#5044e4]/30 transition shadow-sm"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">{student.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-50 text-slate-600 border border-slate-200">
                              {student.rollNumber}
                            </span>
                            <span className="text-[10px] text-slate-500">Sem {student.semester}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{student.email}</div>

                          {/* Skills */}
                          {student.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {student.skills.slice(0, 3).map((sk) => (
                                <span
                                  key={sk}
                                  className="text-[9px] px-1.5 py-0.2 bg-slate-50 text-slate-600 border border-slate-100 rounded"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={alreadyInvited || invitingStudentId === student.id}
                          onClick={() => handleInviteStudent(student)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                            alreadyInvited
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                              : "bg-[#5044e4] hover:bg-[#4237d1] text-white shadow-sm"
                          }`}
                        >
                          {alreadyInvited ? (
                            "Invited"
                          ) : invitingStudentId === student.id ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              <span>Send Invite</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
