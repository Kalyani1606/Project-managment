"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProjectDisplay } from "@/types";
import Link from "next/link";
import {
  FolderGit2,
  PlusCircle,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | "ALL">("ALL");

  const currentSemester = user?.studentProfile?.semester || 6;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects by semester if selected
  const filteredProjects =
    selectedSemesterFilter === "ALL"
      ? projects
      : projects.filter((p) => p.semester === selectedSemesterFilter);

  // Group semesters dynamically
  const semesterList = [8, 7, 6, 5];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-white border border-[#EADBD0] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5F38] text-white text-xs font-mono font-bold tracking-wider shadow-sm mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Academic Curriculum Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Academic Projects by Semester
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-xl">
            Browse all your mini-projects, major projects, and capstone submissions organized across your engineering journey.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          href="/student/projects/new"
          className="px-7 py-3.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#FF5F38]/25 flex items-center justify-center gap-2 transition transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Team &amp; Register Project</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#EADBD0]">
        <button
          onClick={() => setSelectedSemesterFilter("ALL")}
          className={`px-5 py-2 text-xs font-bold rounded-full transition shadow-sm ${
            selectedSemesterFilter === "ALL"
              ? "bg-[#0B2E26] text-white"
              : "bg-white text-slate-700 hover:text-[#FF5F38] border border-[#EADBD0]"
          }`}
        >
          All Semesters ({projects.length})
        </button>

        {semesterList.map((sem) => {
          const semProjects = projects.filter((p) => p.semester === sem);
          const isCurrent = sem === currentSemester;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemesterFilter(sem)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-sm ${
                selectedSemesterFilter === sem
                  ? "bg-[#0B2E26] text-white"
                  : "bg-white text-slate-700 hover:text-[#FF5F38] border border-[#EADBD0]"
              }`}
            >
              <span>Semester {sem}</span>
              {isCurrent && (
                <span className={`w-2 h-2 rounded-full ${selectedSemesterFilter === sem ? 'bg-[#FF5F38]' : 'bg-[#FF5F38]'}`} title="Active Semester" />
              )}
              <span className={`text-[10px] px-2 py-0.2 rounded-full ${selectedSemesterFilter === sem ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {semProjects.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects List by Semester */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">
          <div className="w-8 h-8 border-3 border-[#0B2E26] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading semester projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#EADBD0] rounded-3xl space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5F38]/10 text-[#FF5F38] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-[#111827]">No Projects Found</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
            {selectedSemesterFilter === "ALL"
              ? "You have not registered any semester projects yet."
              : `No project registered for Semester ${selectedSemesterFilter} yet.`}
          </p>
          <Link
            href="/student/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B2E26] hover:bg-[#07211C] text-white text-xs font-bold rounded-full shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Team for Semester {selectedSemesterFilter === "ALL" ? currentSemester : selectedSemesterFilter}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const isCurrent = project.semester === currentSemester;
            return (
              <div
                key={project.id}
                className="p-6 sm:p-8 bg-white border border-[#EADBD0] rounded-3xl transition duration-300 shadow-sm relative overflow-hidden"
              >
                {/* Semester Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#EADBD0]">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#FF5F38]/10 text-[#FF5F38] font-bold text-xs rounded-full">
                      Semester {project.semester}
                    </span>
                    {isCurrent && (
                      <span className="px-3 py-1 bg-[#0B2E26] text-white text-[10px] font-bold rounded-full">
                        Current Active Semester
                      </span>
                    )}
                    <span className="text-xs text-slate-600 font-semibold">
                      Team: <strong className="text-[#111827]">{project.teamName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#0B2E26]/10 text-[#0B2E26]">
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Project Info */}
                  <div className="lg:col-span-8 space-y-3">
                    <h3 className="text-2xl font-black text-[#111827] hover:text-[#FF5F38] transition">
                      <Link href={`/student/projects/${project.id}`}>
                        {project.projectTitle}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {project.problemStatement}
                    </p>

                    {/* Domain & Technologies */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs px-3 py-1 bg-[#FAF2EC] text-[#111827] rounded-full border border-[#EADBD0] font-bold">
                        {project.domain}
                      </span>
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Faculty & Members */}
                  <div className="lg:col-span-4 bg-[#FAF2EC] border border-[#EADBD0] p-5 rounded-2xl flex flex-col justify-between gap-4">
                    {/* Faculty Mentor */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Project Guide
                      </div>
                      {project.guideRequests?.length > 0 ? (
                        <div>
                          <div className="font-bold text-sm text-[#111827]">
                            {project.guideRequests[0].teacherName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {project.guideRequests[0].department}
                          </div>
                          <div className="text-[10px] font-bold text-[#0B2E26] mt-1">
                            Status: {project.guideRequests[0].status}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-[#FF5F38] font-bold">No guide requested</div>
                      )}
                    </div>

                    {/* Team Members Avatar Row */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Team Members ({project.members?.length || 1})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.members?.map((m) => (
                          <div
                            key={m.id}
                            className="px-2.5 py-1 bg-white border border-[#EADBD0] rounded-full text-[11px] text-[#111827] font-semibold flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#FF5F38]" />
                            <span>{m.name}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/student/projects/${project.id}`}
                        className="w-full py-2.5 px-4 bg-[#0B2E26] hover:bg-[#07211C] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md"
                      >
                        <span>Open Project Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
