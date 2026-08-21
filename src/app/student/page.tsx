"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { ProjectDisplay } from "@/types";
import Link from "next/link";
import {
  Sparkles,
  Users,
  ArrowRight,
  FolderPlus,
  Clock,
  ExternalLink,
  Building2,
  Hash,
  Mail,
  GraduationCap,
  Check,
  X,
  PlusCircle
} from "lucide-react";

export default function StudentHomePage() {
  const { user } = useAuth();
  const { showToast, refreshNotifications } = useNotification();

  const [currentProject, setCurrentProject] = useState<ProjectDisplay | null>(null);
  const [incomingInvites, setIncomingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const studentSemester = user?.studentProfile?.semester || 6;

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch projects for active semester
      const projRes = await fetch(`/api/projects?semester=${studentSemester}`);
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.projects?.length > 0) {
          setCurrentProject(projData.projects[0]);
        } else {
          setCurrentProject(null);
        }
      }

      // Fetch incoming invitations
      const invRes = await fetch("/api/teams/invitations");
      if (invRes.ok) {
        const invData = await invRes.json();
        const pending = (invData.incoming || []).filter((i: any) => i.status === "PENDING");
        setIncomingInvites(pending);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [studentSemester]);

  // Handle invitation respond
  const handleRespond = async (inviteId: string, action: "ACCEPT" | "REJECT") => {
    try {
      setActionLoadingId(inviteId);
      const res = await fetch(`/api/teams/invitations/${inviteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message, action === "ACCEPT" ? "success" : "info");
        await loadDashboardData();
        refreshNotifications();
      } else {
        showToast(data.error || "Failed to process invitation", "error");
      }
    } catch (err) {
      showToast("Network error responding to invitation", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ======================= 1. STUDENT INFORMATION BANNER ======================= */}
      <div className="relative p-6 sm:p-8 bg-white border border-[#EADBD0] rounded-3xl overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5F38]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5F38] text-white text-xs font-mono font-bold tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Workspace • Semester {studentSemester}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
              Track your semester project deliverables, collaborate with your team, and stay aligned with your faculty guide.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/student/profile"
              className="px-5 py-2.5 bg-[#FAF2EC] hover:bg-[#F2E6DC] text-[#111827] text-xs font-bold rounded-full border border-[#EADBD0] transition shadow-sm"
            >
              Edit Profile
            </Link>
            <Link
              href="/student/projects"
              className="px-5 py-2.5 bg-[#0B2E26] hover:bg-[#07211C] text-white text-xs font-bold rounded-full shadow-md transition flex items-center gap-2"
            >
              <span>All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Student Quick Meta Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#EADBD0] text-xs">
          <div className="p-3 bg-[#FAF2EC]/60 border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5 text-[#FF5F38]" />
              <span>USN / Roll Number</span>
            </div>
            <div className="font-extrabold text-[#111827] font-mono">
              {user?.studentProfile?.rollNumber || "1MS21CS001"}
            </div>
          </div>

          <div className="p-3 bg-[#FAF2EC]/60 border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#0B2E26]" />
              <span>Current Semester</span>
            </div>
            <div className="font-extrabold text-[#111827]">Semester {studentSemester}</div>
          </div>

          <div className="p-3 bg-[#FAF2EC]/60 border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Department</span>
            </div>
            <div className="font-extrabold text-[#111827] truncate">
              {user?.studentProfile?.department || "Computer Science"}
            </div>
          </div>

          <div className="p-3 bg-[#FAF2EC]/60 border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>College Email</span>
            </div>
            <div className="font-extrabold text-[#111827] truncate font-mono">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* ======================= 2. INCOMING TEAM INVITATIONS ======================= */}
      {incomingInvites.length > 0 && (
        <div className="p-6 bg-white border border-[#EADBD0] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-black text-[#111827]">
              <Users className="w-5 h-5 text-[#FF5F38]" />
              <span>Pending Team Invitations ({incomingInvites.length})</span>
            </div>
            <span className="text-xs text-[#FF5F38] font-bold uppercase tracking-wider bg-[#FF5F38]/10 px-3 py-1 rounded-full">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingInvites.map((inv) => (
              <div
                key={inv.id}
                className="p-5 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#111827] text-base">{inv.teamName}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B2E26] text-white font-bold text-[10px]">
                      Semester {inv.semester}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    <strong className="text-[#111827]">{inv.senderName}</strong> ({inv.senderRoll}) invited you to join their project team.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#EADBD0]">
                  <button
                    disabled={actionLoadingId === inv.id}
                    onClick={() => handleRespond(inv.id, "ACCEPT")}
                    className="flex-1 py-2 px-4 bg-[#0B2E26] hover:bg-[#07211C] text-white text-xs font-bold rounded-full shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Invitation</span>
                  </button>
                  <button
                    disabled={actionLoadingId === inv.id}
                    onClick={() => handleRespond(inv.id, "REJECT")}
                    className="py-2 px-4 bg-white border border-[#EADBD0] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full shadow-sm transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= 3. CURRENT PROJECT SPOTLIGHT ======================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-[#111827] tracking-tight">
            Semester {studentSemester} Academic Project
          </h2>
          <Link
            href="/student/projects"
            className="text-xs text-[#FF5F38] hover:underline font-bold"
          >
            View all semesters &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white border border-[#EADBD0] rounded-3xl text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-[#0B2E26] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading project information...
          </div>
        ) : currentProject ? (
          /* ACTIVE PROJECT CARD */
          <div className="p-6 sm:p-8 bg-white border border-[#EADBD0] rounded-3xl relative overflow-hidden shadow-sm hover:shadow-md transition duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF5F38]/10 text-[#FF5F38]">
                    Team: {currentProject.teamName}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B2E26]/10 text-[#0B2E26]">
                    Status: {currentProject.status.replace(/_/g, " ")}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    Domain: {currentProject.domain}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#111827]">
                  {currentProject.projectTitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-2">
                  {currentProject.problemStatement}
                </p>

                {currentProject.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2.5 py-0.5 bg-[#FAF2EC] text-slate-700 rounded-full font-bold border border-[#EADBD0]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side Guide & Action */}
              <div className="lg:w-72 bg-[#FAF2EC] border border-[#EADBD0] p-5 rounded-2xl space-y-4 shrink-0">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Project Guide
                  </div>
                  {currentProject.guideRequests?.length > 0 ? (
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-[#111827]">
                        {currentProject.guideRequests[0].teacherName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {currentProject.guideRequests[0].designation}
                      </div>
                      <div className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0B2E26] text-white">
                        Status: {currentProject.guideRequests[0].status}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#FF5F38] font-bold">
                      No guide assigned yet
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EADBD0]">
                  <Link
                    href={`/student/projects/${currentProject.id}`}
                    className="w-full py-2.5 px-4 bg-[#0B2E26] hover:bg-[#07211C] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <span>View Project Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* NO PROJECT: CREATE TEAM CARD */
          <div className="p-8 sm:p-12 bg-white border-2 border-dashed border-[#EADBD0] rounded-3xl text-center relative overflow-hidden shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5F38]/10 text-[#FF5F38] flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2">
              Start Your Semester {studentSemester} Capstone Project
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6 font-medium leading-relaxed">
              You haven't registered a team or submitted a proposal for Semester {studentSemester} yet. Start by creating your team and selecting your guide.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/student/projects/new"
                className="px-7 py-3.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#FF5F38]/25 flex items-center gap-2 transition transform hover:scale-105"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Team &amp; Start Project</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ======================= 4. PROJECT LIFECYCLE MILESTONES ======================= */}
      <div className="p-6 sm:p-8 bg-white border border-[#EADBD0] rounded-3xl shadow-sm">
        <h3 className="text-base font-black text-[#111827] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF5F38]" />
          <span>Semester Project Lifecycle</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-[#FF5F38] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5F38]" />
              <span>1. Team Formation</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Discover peers and invite members</p>
          </div>

          <div className="p-4 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-[#0B2E26] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0B2E26]" />
              <span>2. Problem Proposal</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Draft statement & tech stack</p>
          </div>

          <div className="p-4 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-purple-700 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>3. Guide Allocation</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Request faculty mentor</p>
          </div>

          <div className="p-4 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>4. Final Review</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Phase audits & evaluation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
