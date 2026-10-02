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
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
          profilePicture: profileImage || undefined,
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
    <div className="max-w-4xl mx-auto flex flex-col gap-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200 hover:border-[#5044e4] transition-colors rounded-3xl flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md cursor-default">
        {/* Profile Avatar Corner */}
        <div className="relative shrink-0 flex self-start sm:self-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 sm:border-[6px] border-white shadow-sm overflow-hidden bg-slate-100">
             <img src={profileImage || user?.studentProfile?.profilePicture || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"} alt="Profile" className="w-full h-full object-cover object-top" />
          </div>
          {isEditing && (
            <label className="absolute bottom-2 right-1 sm:bottom-2 sm:right-2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-colors cursor-pointer z-10" title="Upload New Photo">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#5044e4]" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                 if (e.target.files && e.target.files[0]) {
                   const file = e.target.files[0];
                   const reader = new FileReader();
                   reader.onloadend = () => {
                     setProfileImage(reader.result as string);
                     showToast("Profile photo selected for upload", "success");
                   };
                   reader.readAsDataURL(file);
                 }
              }} />
            </label>
          )}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#5044e4] mb-1">
              <span>👋 Welcome back,</span>
            </div>
            <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight">Student Profile</h1>
            <p className="text-[13px] text-slate-500 mt-1.5 max-w-md">
              Manage your academic information, profile and showcase your skills all in one place.
            </p>
          </div>

          <div className="p-4 bg-[#f6f5ff] rounded-2xl flex items-center gap-4 max-w-md text-[13px] text-slate-700 shadow-sm border border-[#ebe8ff]/50">
            <div className="p-2.5 bg-[#ebe8ff] rounded-full shrink-0">
              <GraduationCap className="w-5 h-5 text-[#5044e4]" />
            </div>
            <span className="font-medium leading-relaxed">
              Keep your academic, professional and personal details up to date for a better learning and placement experience.
            </span>
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="flex justify-end z-10 relative -my-1">
          <button onClick={() => setIsEditing(true)} className="px-5 py-2 hover:bg-slate-100 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-2">
             Edit Profile
          </button>
        </div>
      )}

      {isEditing ? (
      <form onSubmit={handleSaveProfile} className="p-6 md:p-8 bg-white border border-slate-200 hover:border-[#5044e4] transition-colors rounded-3xl shadow-sm hover:shadow-md cursor-default flex flex-col gap-8">
        {/* Section 1: Basic Academic Information */}
        <div className="space-y-5">
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
        <div className="space-y-5 pt-4 border-t border-slate-100">
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

        {/* Action Button */}
        <div className="mt-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
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
        <div className="space-y-4">
           <div className="px-8 pt-8 pb-6 bg-white border border-slate-200 hover:border-[#5044e4] transition-colors rounded-3xl shadow-sm hover:shadow-md text-center relative overflow-hidden cursor-default">
             
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-100 to-[#5044e4]/10 rounded-t-3xl" />
             
             <div className="w-28 h-28 mx-auto bg-slate-200 rounded-full overflow-hidden border-[5px] border-white shadow-md mb-3 relative z-10 mt-2">
               <img src={user?.studentProfile?.profilePicture || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"} alt="Profile" className="w-full h-full object-cover object-top" />
             </div>
             
             <h2 className="text-2xl font-black text-slate-900 relative z-10">{name}</h2>
             <p className="text-[#5044e4] font-bold mt-1 text-sm relative z-10">{department} &bull; Semester {semester}</p>
             <p className="text-slate-500 font-medium text-xs mt-1 relative z-10">{user?.studentProfile?.rollNumber} &bull; {user?.email}</p>
             
             <div className="mt-6 flex items-center justify-center gap-4 relative z-10">
               {github && <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:-translate-y-0.5 border border-slate-200 rounded-2xl text-slate-700 hover:bg-[#5044e4] hover:border-[#5044e4] hover:text-white transition-all shadow-sm text-sm font-bold w-40"><Github className="w-4 h-4"/> GitHub</a>}
               {linkedin && <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:-translate-y-0.5 border border-slate-200 rounded-2xl text-slate-700 hover:bg-[#5044e4] hover:border-[#5044e4] hover:text-white transition-all shadow-sm text-sm font-bold w-40"><Linkedin className="w-4 h-4"/> LinkedIn</a>}
             </div>
           </div>
           
           <div className="p-6 md:p-8 bg-white border border-slate-200 hover:border-[#5044e4] transition-colors rounded-3xl shadow-sm hover:shadow-md cursor-default">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
               <User className="w-4 h-4 text-[#5044e4]"/> Academic Statement & Bio
             </h3>
             <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">
               {bio || "No biography provided yet."}
             </p>
           </div>
        </div>
      )}
    </div>
  );
}
