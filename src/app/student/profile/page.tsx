"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  User,
  Mail,
  Hash,
  GraduationCap,
  Building2,
  Github,
  Linkedin,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  X,
  ExternalLink,
  Info,
  FileText,
  Check,
  FileUp,
  File,
  Calendar,
  ChevronDown
} from "lucide-react";

export default function StudentProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState("");
  const [semester, setSemester] = useState(6);
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const mockSemester6Papers = [
    { id: "p1", title: "Blockchain based E-Voting System" },
    { id: "p2", title: "IoT Smart Home Automation Security" },
    { id: "p3", title: "Machine Learning for Crop Prediction" },
    { id: "p4", title: "Automated Traffic Management using Computer Vision" },
    { id: "p5", title: "Decentralized File Storage Network" }
  ];

  const [selectedPaper, setSelectedPaper] = useState("");
  const [review1Date, setReview1Date] = useState("");
  const [review1Faculty, setReview1Faculty] = useState("");
  const [review2Date, setReview2Date] = useState("");
  const [review2Faculty, setReview2Faculty] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGuide, setProjectGuide] = useState("");
  const [projectStatus, setProjectStatus] = useState("Not Started");
  const [projectDescription, setProjectDescription] = useState("");
  const [uploads, setUploads] = useState<Record<string, string>>({});

  const handleFileUpload = (docType: string) => {
    setUploads(prev => ({ ...prev, [docType]: `${docType.toLowerCase().replace(/ /g, '_')}.pdf` }));
  };

  // Sync form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.studentProfile) {
        setSemester(user.studentProfile.semester || 6);
        setDepartment(user.studentProfile.department || "Computer Science & Engineering");
        setBio(user.studentProfile.bio || "");
        setGithub(user.studentProfile.github || "");
        setLinkedin(user.studentProfile.linkedin || "");
        setSkills(user.studentProfile.skills || []);

        const complete = user.studentProfile.github && user.studentProfile.linkedin;
        setIsEditing(!complete);
      } else {
        setIsEditing(true);
      }
    }
  }, [user]);

  const handleAddSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || newSkillInput).trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          semester,
          department,
          bio,
          github,
          linkedin,
          skills,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Profile successfully updated and synced!", "success");
        await refreshUser();
        setIsEditing(false);
      } else {
        showToast(data.error || "Failed to update profile", "error");
      }
    } catch (err) {
      showToast("Network error saving profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const popularSkills = [
    "Python",
    "React",
    "Next.js",
    "Node.js",
    "PyTorch",
    "TensorFlow",
    "Docker",
    "FastAPI",
    "PostgreSQL",
    "Embedded C",
    "IoT",
    "Cybersecurity",
    "Rust",
    "Go",
    "Kubernetes",
    "Figma",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5044e4] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#5044e4]" />
            <span>Academic Identity</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your academic credentials, professional URLs, and skills for automated team syncing.
          </p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-2.5 max-w-sm text-xs text-blue-800 shadow-sm">
          <Info className="w-4 h-4 text-[#5044e4] shrink-0 mt-0.5" />
          <span>
            <strong>Auto-Sync Guarantee:</strong> Your GitHub, LinkedIn, and Skills are automatically reused when forming teams or submitting projects.
          </span>
        </div>
      </div>

      {!isEditing && (
        <div className="flex justify-end -mt-4">
          <button onClick={() => setIsEditing(true)} className="px-5 py-2 hover:bg-slate-100 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-2">
             Edit Profile
          </button>
        </div>
      )}

      {isEditing ? (
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Basic Academic Information */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Basic Academic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number / USN (Institutional Identifier)
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled
                  value={user?.studentProfile?.rollNumber || "1MS21CS001"}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email (Verified)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Semester
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                >
                  <option value={5}>Semester 5 (Mini Project)</option>
                  <option value={6}>Semester 6 (Academic Project)</option>
                  <option value={7}>Semester 7 (Major Project - Phase 1)</option>
                  <option value={8}>Semester 8 (Final Capstone)</option>
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                  <option value={3}>Semester 3</option>
                  <option value={4}>Semester 4</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Branch
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Science & Engineering">Information Science & Engineering</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Professional Information */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Github className="w-4 h-4 text-[#5044e4]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Professional Profiles & Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">GitHub Profile URL</label>
                {github && (
                  <a
                    href={github.startsWith("http") ? github : `https://${github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#5044e4] hover:text-[#4237d1] flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://github.com/yourhandle"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">LinkedIn Profile URL</label>
                {linkedin && (
                  <a
                    href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#5044e4] hover:text-[#4237d1] flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourhandle"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Short Bio */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#5044e4]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Technical Skills & Academic Bio
            </h2>
          </div>

          {/* Skills Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Skills & Domain Expertise (Used when teammates search for you)
            </label>

            {/* Existing Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 italic p-1">No skills added yet. Add below.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#5044e4] border border-[#d6d2fc] rounded-lg text-xs font-semibold shadow-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#5044e4] hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. GraphQL, Solidity, PyTorch)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Popular quick add chips */}
            <div className="mt-3">
              <div className="text-[11px] text-slate-500 mb-1.5">Quick add common technologies:</div>
              <div className="flex flex-wrap gap-1.5">
                {popularSkills.map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleAddSkill(sk)}
                    disabled={skills.includes(sk)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                      skills.includes(sk)
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-[#5044e4] text-slate-600 hover:text-[#5044e4] shadow-sm"
                    }`}
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Academic Statement / Bio
            </label>
            <textarea
              rows={3}
              placeholder="Describe your technical interests, project ambitions, or engineering focus..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] transition resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Section 4: Semester 7 - Research Project & Reviews */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-8 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
             <div className="flex items-center gap-2">
               <FileText className="w-4 h-4 text-[#5044e4]" />
               <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                 4. SEMESTER 7 — RESEARCH PROJECT & REVIEWS
               </h2>
             </div>
             <p className="text-xs text-slate-500 font-medium">Continue your research work by selecting one research paper from Semester 6.</p>
          </div>

          {/* Section 1: Research Paper Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Research Paper Selection</h3>
            <p className="text-xs text-slate-500 -mt-2 mb-4">Select one research paper from your Semester 6 submissions.</p>
            
            <div className="relative max-w-lg">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Research Paper from Semester 6 *</label>
              <div className="relative">
                 <File className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <select 
                   value={selectedPaper}
                   onChange={(e) => setSelectedPaper(e.target.value)}
                   className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] focus:ring-1 focus:ring-[#5044e4] shadow-sm appearance-none"
                 >
                   <option value="">Select one research paper</option>
                   {mockSemester6Papers.map(p => (
                     <option key={p.id} value={p.id}>{p.title}</option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {selectedPaper && (
              <div className="mt-4 p-4 border border-[#5044e4]/30 bg-[#5044e4]/5 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-[#5044e4] text-white rounded-lg shrink-0"><CheckCircle2 className="w-5 h-5"/></div>
                <div>
                  <div className="text-[10px] font-bold text-[#5044e4] uppercase tracking-wide mb-1">✓ Selected for Semester 7</div>
                  <h4 className="text-sm font-bold text-slate-900">{mockSemester6Papers.find(p=>p.id===selectedPaper)?.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Source: Semester 6 Research Paper</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Review Structure */}
          <div className="pt-6 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 mb-4">Semester 7 Review Structure</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                 <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                   <div>
                     <div className="font-bold text-slate-900 text-sm">Review - 1</div>
                     <div className="text-xs text-slate-500 font-medium">CA</div>
                   </div>
                   <div className="text-sm font-black text-[#5044e4]">50 Marks</div>
                 </div>
                 <div className="space-y-2 text-xs text-slate-600 font-medium pb-3 border-b border-slate-100">
                   <div className="flex justify-between"><span>Project Planning & Proposal</span><span>20 Marks</span></div>
                   <div className="flex justify-between"><span>Literature Survey</span><span>10 Marks</span></div>
                   <div className="flex justify-between"><span>Presentation & Report</span><span>20 Marks</span></div>
                 </div>
                 <div className="flex justify-between font-bold text-slate-800 text-sm mt-3">
                   <span>Total</span><span>50 Marks</span>
                 </div>
               </div>

               <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                 <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                   <div>
                     <div className="font-bold text-slate-900 text-sm">Review - 2</div>
                     <div className="text-xs text-slate-500 font-medium">ESF</div>
                   </div>
                   <div className="text-sm font-black text-[#5044e4]">50 Marks</div>
                 </div>
                 <div className="space-y-2 text-xs text-slate-600 font-medium pb-3 border-b border-slate-100">
                   <div className="flex justify-between"><span>Literature Survey Paper</span><span>15 Marks</span></div>
                   <div className="flex justify-between"><span>Review 2 Report</span><span>15 Marks</span></div>
                   <div className="flex justify-between"><span>Progress Monitoring</span><span>10 Marks</span></div>
                   <div className="flex justify-between"><span>Presentation</span><span>10 Marks</span></div>
                 </div>
                 <div className="flex justify-between font-bold text-slate-800 text-sm mt-3">
                   <span>Total</span><span>50 Marks</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Section 3: Review Schedule */}
          <div className="pt-6 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 mb-4">Review Schedule</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                 <div className="text-xs font-bold text-[#5044e4] uppercase tracking-wide">REVIEW 1</div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Review Date *</label>
                   <div className="relative">
                     <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="date" value={review1Date} onChange={e=>setReview1Date(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Review Conducted By</label>
                   <div className="relative">
                     <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <select value={review1Faculty} onChange={e=>setReview1Faculty(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm appearance-none focus:outline-none focus:border-[#5044e4] shadow-sm">
                       <option value="">Select Faculty / Review Panel</option>
                       <option value="Prof. Sharma">Prof. Sharma</option>
                       <option value="Dr. Patil">Dr. Patil</option>
                     </select>
                     <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                 </div>
               </div>

               <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                 <div className="text-xs font-bold text-[#5044e4] uppercase tracking-wide">REVIEW 2</div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Review Date *</label>
                   <div className="relative">
                     <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="date" value={review2Date} onChange={e=>setReview2Date(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Review Conducted By</label>
                   <div className="relative">
                     <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <select value={review2Faculty} onChange={e=>setReview2Faculty(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm appearance-none focus:outline-none focus:border-[#5044e4] shadow-sm">
                       <option value="">Select Faculty / Review Panel</option>
                       <option value="Prof. Sharma">Prof. Sharma</option>
                       <option value="Dr. Patil">Dr. Patil</option>
                     </select>
                     <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Section 4: Project Details */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <div className="relative">
                   <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input type="text" placeholder="Enter project title" value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Guide / Mentor</label>
                <div className="relative">
                   <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select value={projectGuide} onChange={e=>setProjectGuide(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm appearance-none focus:outline-none focus:border-[#5044e4] shadow-sm">
                     <option value="">Select Faculty / Enter Faculty Name</option>
                     <option value="Prof. Sharma">Prof. Sharma</option>
                     <option value="Dr. Patil">Dr. Patil</option>
                   </select>
                   <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Project Status</label>
                <div className="relative">
                   <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select value={projectStatus} onChange={e=>setProjectStatus(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm appearance-none focus:outline-none focus:border-[#5044e4] shadow-sm">
                     <option value="Not Started">Not Started</option>
                     <option value="Project Planning">Project Planning</option>
                     <option value="Proposal Submitted">Proposal Submitted</option>
                     <option value="Literature Survey">Literature Survey</option>
                     <option value="Development / Implementation">Development / Implementation</option>
                     <option value="Review 1 Completed">Review 1 Completed</option>
                     <option value="Review 2 Completed">Review 2 Completed</option>
                     <option value="Completed">Completed</option>
                   </select>
                   <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Project Description</label>
                <textarea rows={2} placeholder="Describe your project in 2-3 sentences..." value={projectDescription} onChange={e=>setProjectDescription(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#5044e4] resize-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Section 5: Document Submission */}
          <div className="pt-6 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 mb-4">Document Submission</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {["Project Proposal", "Literature Survey", "Review 1 Report", "Literature Survey Paper", "Review 2 Report", "Final Project Report"].map(doc => (
                 <div key={doc} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-white shadow-sm">
                    <div className="text-xs font-bold text-slate-700">{doc}</div>
                    {uploads[doc] ? (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                        <Check className="w-3 h-3"/> {uploads[doc]}
                      </div>
                    ) : (
                      <button type="button" onClick={() => handleFileUpload(doc)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-[#5044e4] hover:bg-white transition shadow-sm">
                        <FileUp className="w-3 h-3"/> Upload PDF
                      </button>
                    )}
                 </div>
               ))}
             </div>
          </div>

          {/* Section 6: Semester 7 Progress */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Semester 7 Progress</h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
               <span className={`px-3 py-1 rounded-full border ${selectedPaper ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 [ Research Paper Selected ] {selectedPaper ? "✓" : ""}
               </span>
               <span className={`px-3 py-1 rounded-full border ${projectTitle ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 [ Project Details ] {projectTitle ? "✓" : ""}
               </span>
               <span className={`px-3 py-1 rounded-full border ${uploads["Review 1 Report"] ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 [ Review 1 ] {uploads["Review 1 Report"] ? "✓" : "Pending"}
               </span>
               <span className={`px-3 py-1 rounded-full border ${uploads["Review 2 Report"] ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 [ Review 2 ] {uploads["Review 2 Report"] ? "✓" : "Pending"}
               </span>
               <span className={`px-3 py-1 rounded-full border ${uploads["Final Project Report"] ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 [ Final Submission ] {uploads["Final Project Report"] ? "✓" : "Pending"}
               </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-[#6e58ff] to-[#4c3cfa] hover:from-[#5944eb] hover:to-[#382ae8] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#5044e4]/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
      ) : (
        <div className="space-y-6">
           <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center relative overflow-hidden">
             
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100 to-[#5044e4]/10 rounded-t-3xl" />
             
             <div className="w-28 h-28 mx-auto bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 relative z-10 mt-6">
               <img src={user?.studentProfile?.profilePicture || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"} alt="Profile" className="w-full h-full object-cover" />
             </div>
             
             <h2 className="text-2xl font-black text-slate-900 relative z-10">{name}</h2>
             <p className="text-[#5044e4] font-bold mt-1 text-sm relative z-10">{department} &bull; Semester {semester}</p>
             <p className="text-slate-500 font-medium text-xs mt-1 relative z-10">{user?.studentProfile?.rollNumber} &bull; {user?.email}</p>
             
             <div className="mt-8 flex items-center justify-center gap-4 relative z-10">
               {github && <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:-translate-y-0.5 border border-slate-200 rounded-2xl text-slate-700 hover:bg-[#5044e4] hover:border-[#5044e4] hover:text-white transition-all shadow-sm text-sm font-bold w-40"><Github className="w-4 h-4"/> GitHub</a>}
               {linkedin && <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:-translate-y-0.5 border border-slate-200 rounded-2xl text-slate-700 hover:bg-[#5044e4] hover:border-[#5044e4] hover:text-white transition-all shadow-sm text-sm font-bold w-40"><Linkedin className="w-4 h-4"/> LinkedIn</a>}
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2"><User className="w-4 h-4 text-[#5044e4]"/> Academic Statement & Bio</h3>
               <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{bio || "No biography provided yet."}</p>
             </div>
             
             <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#5044e4]"/> Technical Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {skills.length > 0 ? skills.map(s => (
                   <span key={s} className="px-3 py-1 bg-[#5044e4]/10 text-[#5044e4] border border-[#5044e4]/20 rounded-lg text-xs font-bold shadow-sm inline-block">{s}</span>
                 )) : <span className="text-slate-500 text-sm italic">No technical skills listed</span>}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
