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

      {/* Main Profile Form */}
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
    </div>
  );
}
