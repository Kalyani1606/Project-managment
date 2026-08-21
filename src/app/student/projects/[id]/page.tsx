"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDisplay } from "@/types";
import Link from "next/link";
import {
  FolderGit2,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Github,
  Linkedin,
  ArrowLeft,
  Sparkles,
  Layers,
  Building2,
  Hash,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  Share2,
  Check,
} from "lucide-react";

export default function SingleProjectDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Project Not Found</h3>
        <p className="text-xs text-slate-500">
          The requested project record could not be retrieved from your academic roster.
        </p>
        <Link
          href="/student/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const leadGuide = project.guideRequests?.find((g) => g.roleType !== "Co-Guide");
  const coGuide = project.guideRequests?.find((g) => g.roleType === "Co-Guide");

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Back Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/projects"
          className="text-xs font-bold text-slate-500 hover:text-[#5044e4] flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>

        <button
          onClick={handleShare}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-sm"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Project</span>
            </>
          )}
        </button>
      </div>

      {/* ======================= PROJECT HERO HEADER BANNER ======================= */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden space-y-4">
        {/* Badges Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
            Semester {project.semester}
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold">
            Team: <strong className="text-slate-900">{project.teamName}</strong>
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{project.status.replace(/_/g, " ")}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold">
            {project.domain}
          </span>
        </div>

        {/* Project Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {project.projectTitle}
        </h1>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ======================= 2-COLUMN MAIN BODY ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Problem Statement & Team Members */}
        <div className="lg:col-span-8 space-y-6">
          {/* Problem Statement Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-[#5044e4]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Official Problem Statement
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {project.problemStatement}
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Proposed Solution & Methodology
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Team Members Roster */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5044e4]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Team Members ({project.members?.length || 0})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.members?.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2.5 relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        member.role === "CREATOR"
                          ? "bg-[#5044e4] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.role === "CREATOR" ? "Team Creator" : "Team Member"}
                    </span>
                    <span className="text-[10px] font-mono text-[#5044e4] font-bold">
                      {member.rollNumber}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900">{member.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{member.email}</div>
                  </div>

                  {/* Links */}
                  {(member.github || member.linkedin) && (
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-900 flex items-center gap-1 transition"
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
                          className="text-slate-500 hover:text-[#5044e4] flex items-center gap-1 transition"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span className="text-[10px]">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.skills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[9px] px-1.5 py-0.2 bg-slate-50 text-slate-600 border border-slate-200 rounded font-bold"
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
        </div>

        {/* RIGHT COLUMN: Faculty Guide Allocation & Milestone Roadmap */}
        <div className="lg:col-span-4 space-y-6">
          {/* Faculty Guide Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Compass className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Assigned Faculty Guide
              </h2>
            </div>

            {leadGuide ? (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    Lead Mentor
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    {leadGuide.status}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900">{leadGuide.teacherName}</div>
                <div className="text-xs text-slate-600 font-medium">{leadGuide.designation}</div>
                <div className="text-[11px] text-slate-500">{leadGuide.department}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-bold italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                No lead guide allocated yet.
              </div>
            )}

            {coGuide && (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Co-Guide
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                    {coGuide.status}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900">{coGuide.teacherName}</div>
                <div className="text-xs text-slate-600 font-medium">{coGuide.designation}</div>
              </div>
            )}
          </div>

          {/* Semester Timeline & Next Steps Roadmap */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-[#5044e4]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Semester Project Roadmap
              </h2>
            </div>

            <div className="space-y-4 text-xs relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Completed */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  ✓
                </span>
                <div className="font-bold text-slate-900">1. Team Formation</div>
                <div className="text-[11px] text-emerald-600 font-bold">Completed & Verified</div>
              </div>

              {/* Step 2: Completed */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  ✓
                </span>
                <div className="font-bold text-slate-900">2. Problem Statement Submission</div>
                <div className="text-[11px] text-emerald-600 font-bold">Registered in Curriculum</div>
              </div>

              {/* Step 3: Guide Allocation */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#5044e4] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  3
                </span>
                <div className="font-bold text-slate-900">3. Guide Allocation & Approval</div>
                <div className="text-[11px] text-[#5044e4] font-bold">
                  {leadGuide?.status === "APPROVED" ? "Approved by Faculty" : "Faculty Review In Progress"}
                </div>
              </div>

              {/* Step 4: Milestone 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                <div className="font-bold text-slate-700">4. Milestone 1 / Synopsis Evaluation</div>
                <div className="text-[11px] text-slate-500 font-bold">Upcoming in Week 6</div>
              </div>

              {/* Step 5: Final Evaluation */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
                  5
                </span>
                <div className="font-bold text-slate-700">5. Final Capstone & Rubrics</div>
                <div className="text-[11px] text-slate-500 font-bold">End of Semester</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
