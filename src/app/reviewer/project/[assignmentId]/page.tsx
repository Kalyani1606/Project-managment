"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, Clock, AlertTriangle, Star, Calendar, FileText, Activity, Users, Award, Briefcase, Mail, BookOpen } from "lucide-react";

// ─── Helper Components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, any> = {
    PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200/60" },
    IN_PROGRESS: { label: "In Progress", cls: "bg-blue-50 text-blue-700 border-blue-200/60" },
    SUBMITTED: { label: "Submitted", cls: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
  };
  const { label, cls } = config[status] || { label: status, cls: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${cls}`}>
      {status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
      {status === "IN_PROGRESS" && <AlertTriangle className="w-3.5 h-3.5" />}
      {status === "SUBMITTED" && <CheckCircle2 className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

const formatDate = (d: any) => d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";
const isSubmitted = (a: any) => a?.status === "SUBMITTED";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const res = await fetch(`/api/reviewer/assignments/${assignmentId}`);
        if (res.ok) {
          const data = await res.json();
          setAssignment(data.assignment);
        }
      } catch (err) {
        console.error("Failed to fetch assignment details", err);
      } finally {
        setLoading(false);
      }
    }
    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF2EC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FF5F38]/20 border-t-[#FF5F38] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF2EC] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm">The assignment you are looking for doesn't exist or you lack permission to view it.</p>
          <button onClick={() => router.push("/reviewer")} className="mt-6 w-full py-3 bg-[#FF5F38] hover:bg-[#e04f2c] transition-colors text-white rounded-xl font-bold shadow-sm">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const project = assignment.project;
  const team = project?.team;
  const members = team?.members || [];
  const mentor = project?.guideRequests?.[0]?.teacher?.user;
  const techs = (() => { try { return JSON.parse(project?.technologies || "[]"); } catch { return []; } })();

  const EVALUATION_RUBRIC = [
    { key: "projectQuality", label: "Project Quality & Innovation", maxMarks: 20 },
    { key: "technicalDepth", label: "Technical Depth & Implementation", maxMarks: 25 },
    { key: "documentation", label: "Documentation & Report Quality", maxMarks: 20 },
    { key: "presentation", label: "Presentation & Viva Voce", maxMarks: 20 },
    { key: "problemStatement", label: "Problem Definition & Objectives", maxMarks: 15 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF2EC] py-8">
      <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">

        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/reviewer")}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Portal
          </button>
        </div>

        {/* Header Banner */}
        <div className="relative bg-[#0A1628] px-8 pt-10 pb-12 overflow-hidden rounded-[2rem] shadow-sm border-b-4 border-[#FF5F38]">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -translate-y-20 translate-x-1/4 opacity-30 pointer-events-none">
            <div className="w-[600px] h-[600px] bg-gradient-to-br from-[#FF5F38] via-[#E04B24] to-[#7D210A] rounded-full blur-[90px]" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 opacity-20 pointer-events-none">
            <div className="w-80 h-80 bg-[#FF5F38] rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-white bg-[#FF5F38] px-2.5 py-1 rounded-md shadow-sm">
                  {project?.id?.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-orange-100 bg-[#FF5F38]/20 px-3 py-1 rounded-full border border-[#FF5F38]/30 backdrop-blur-sm">
                  8th Semester · Final Year Project
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {project?.projectTitle}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-orange-50 text-sm font-medium opacity-90">
                <Users className="w-4 h-4 opacity-70" />
                <span>Team: {team?.teamName}</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
              <StatusBadge status={assignment.status} />
            </div>
          </div>
        </div>

        <div className="pt-6 pb-8 space-y-8">
          
          {/* Replicated Mentor's View (Top Info Cards) */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#EADBD0] shadow-sm">
             <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-[#FF5F38]/10 rounded-xl text-[#FF5F38]">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-[#111827]">Project Details (Mentor View)</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                   <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Team & Mentor</h3>
                   <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Team ID:</span> {team?.id || "T-892"}</p>
                   <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Name:</span> {team?.teamName || "—"}</p>
                   <p className="text-sm font-semibold text-[#111827] mt-3 pt-3 border-t border-[#EADBD0]"><span className="text-slate-500 font-medium">Mentor:</span> {mentor?.name || "Pending Setup"}</p>
                </div>
                <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                   <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Domain & Topic</h3>
                   <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Domain:</span> {project?.domain || "Not Selected"}</p>
                   <p className="text-sm font-semibold text-[#111827] mt-2 leading-relaxed"><span className="text-slate-500 font-medium">Topic:</span> {project?.projectTitle || "Not Selected"}</p>
                </div>
             </div>

             <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0] mb-6">
                 <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Members ({members?.length || 0})</h3>
                 <div className="flex flex-wrap gap-2">
                    {members?.map((m: any, idx: number) => (
                       <span key={idx} className="text-xs font-bold bg-white border border-[#EADBD0] text-slate-700 px-3 py-1.5 rounded-lg">{m.user?.name}</span>
                    ))}
                 </div>
             </div>

             <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                 <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Literature Survey (3 Papers)</h3>
                 <div className="overflow-x-auto bg-white rounded-xl border border-[#EADBD0] p-1">
                   <table className="w-full text-left text-xs border-collapse">
                     <thead>
                       <tr className="border-b border-[#EADBD0] text-slate-500 bg-slate-50/50">
                         <th className="py-2 px-3 font-semibold">No.</th>
                         <th className="py-2 px-3 font-semibold">Paper Title</th>
                         <th className="py-2 px-3 font-semibold">Author(s)</th>
                         <th className="py-2 px-3 font-semibold">Publication / Journal</th>
                         <th className="py-2 px-3 font-semibold">Year</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="py-2.5 px-3 font-bold text-[#FF5F38]">1</td>
                         <td className="py-2.5 px-3 font-bold text-slate-800">Dynamic Traffic Flow Optimization</td>
                         <td className="py-2.5 px-3 text-slate-600">A. Smith, J. Doe</td>
                         <td className="py-2.5 px-3 text-slate-500">IEEE ITS</td>
                         <td className="py-2.5 px-3 font-mono font-medium text-slate-500">2023</td>
                       </tr>
                       <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="py-2.5 px-3 font-bold text-[#FF5F38]">2</td>
                         <td className="py-2.5 px-3 font-bold text-slate-800">ML approaches in Traffic Signal Control</td>
                         <td className="py-2.5 px-3 text-slate-600">R. Chen</td>
                         <td className="py-2.5 px-3 text-slate-500">Nature Transport</td>
                         <td className="py-2.5 px-3 font-mono font-medium text-slate-500">2022</td>
                       </tr>
                       <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="py-2.5 px-3 font-bold text-[#FF5F38]">3</td>
                         <td className="py-2.5 px-3 font-bold text-slate-800">Real-time Computer Vision for Intersections</td>
                         <td className="py-2.5 px-3 text-slate-600">S. Kumar, P. Lee</td>
                         <td className="py-2.5 px-3 text-slate-500">ACM Transactions</td>
                         <td className="py-2.5 px-3 font-mono font-medium text-slate-500">2024</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
             </div>
          </div>

          {/* Official Project Diary Table */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#EADBD0] shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#111827]">Official Project Diary</h2>
                    <p className="text-xs font-semibold text-slate-500">Topic: {project?.projectTitle}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FAF2EC] px-3 py-1.5 rounded-2xl border border-[#EADBD0] text-[#111827]">
                  2 Entries Recorded
                </span>
             </div>

             <div className="overflow-x-auto border border-[#EADBD0] rounded-2xl shadow-xs">
               <table className="w-full text-left text-sm border-collapse bg-white">
                 <thead>
                   <tr className="bg-[#FAF2EC] border-b border-[#EADBD0] text-[11px] font-black text-[#111827] uppercase tracking-wider">
                     <th className="py-3.5 px-4">Review #</th>
                     <th className="py-3.5 px-4">Date</th>
                     <th className="py-3.5 px-4">Stage</th>
                     <th className="py-3.5 px-4">Work Completed & Demo</th>
                     <th className="py-3.5 px-4">Attendance</th>
                     <th className="py-3.5 px-4">Mentor Feedback & Tasks</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#EADBD0]">
                   
                   {/* Row 1 */}
                   <tr className="hover:bg-[#FAF2EC]/30 transition-colors">
                     <td className="py-4 px-4 whitespace-nowrap">
                       <span className="bg-[#FF5F38] text-white text-xs font-extrabold px-3 py-1 rounded-full font-mono">Review 04</span>
                     </td>
                     <td className="py-4 px-4 whitespace-nowrap text-xs font-bold text-slate-600 font-mono">30 Sep 2026</td>
                     <td className="py-4 px-4 whitespace-nowrap">
                       <span className="text-xs font-bold text-slate-800 bg-[#FAF2EC] px-2.5 py-1 rounded-lg border border-[#EADBD0]">Development</span>
                     </td>
                     <td className="py-4 px-4 text-xs text-slate-700 min-w-[200px] max-w-xs">
                       <p className="font-semibold text-[#111827] line-clamp-2">Connected API endpoints for traffic flow optimization.</p>
                       <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">Demo: Basic route mapping works.</p>
                     </td>
                     <td className="py-4 px-4 whitespace-nowrap text-xs">
                       <div className="flex flex-wrap gap-1 max-w-[160px]">
                         {members?.map((m: any, idx: number) => (
                           <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800">
                             {m.user?.name?.split(' ')[0]} (P)
                           </span>
                         ))}
                       </div>
                     </td>
                     <td className="py-4 px-4 text-xs min-w-[180px] max-w-xs">
                       <div className="space-y-1">
                         <div className="bg-emerald-50/70 border border-emerald-200/60 p-2 rounded-xl text-slate-700 leading-snug">
                           <span className="font-bold text-[#0B2E26] text-[10px] block">Feedback:</span>
                           <span className="line-clamp-2 font-medium">Good progress on mapping. Improve the JSON error handling responses.</span>
                         </div>
                       </div>
                     </td>
                   </tr>

                   {/* Row 2 */}
                   <tr className="hover:bg-[#FAF2EC]/30 transition-colors">
                     <td className="py-4 px-4 whitespace-nowrap">
                       <span className="bg-[#FF5F38] text-white text-xs font-extrabold px-3 py-1 rounded-full font-mono">Review 03</span>
                     </td>
                     <td className="py-4 px-4 whitespace-nowrap text-xs font-bold text-slate-600 font-mono">15 Sep 2026</td>
                     <td className="py-4 px-4 whitespace-nowrap">
                       <span className="text-xs font-bold text-slate-800 bg-[#FAF2EC] px-2.5 py-1 rounded-lg border border-[#EADBD0]">Design & Prototype</span>
                     </td>
                     <td className="py-4 px-4 text-xs text-slate-700 min-w-[200px] max-w-xs">
                       <p className="font-semibold text-[#111827] line-clamp-2">Completed high-fidelity UI designs and database schema.</p>
                     </td>
                     <td className="py-4 px-4 whitespace-nowrap text-xs">
                       <div className="flex flex-wrap gap-1 max-w-[160px]">
                         {members?.map((m: any, idx: number) => (
                           <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${idx === 1 ? 'bg-red-100 text-red-700 opacity-60' : 'bg-emerald-100 text-emerald-800'}`}>
                             {m.user?.name?.split(' ')[0]} ({idx === 1 ? 'A' : 'P'})
                           </span>
                         ))}
                       </div>
                     </td>
                     <td className="py-4 px-4 text-xs min-w-[180px] max-w-xs">
                       <div className="space-y-1">
                         <div className="bg-emerald-50/70 border border-emerald-200/60 p-2 rounded-xl text-slate-700 leading-snug">
                           <span className="font-bold text-[#0B2E26] text-[10px] block">Feedback:</span>
                           <span className="line-clamp-2 font-medium">Design approved. Begin backend integration immediately.</span>
                         </div>
                       </div>
                     </td>
                   </tr>

                 </tbody>
               </table>
             </div>
          </div>

          {/* Submitted Marks */}
          {assignment.evaluation && !assignment.evaluation.isDraft && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem] p-6 md:p-8 border border-emerald-100/80 shadow-sm relative overflow-hidden">
              <CheckCircle2 className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500 opacity-5 pointer-events-none" />
              <h3 className="text-lg font-black text-emerald-800 mb-6 flex items-center gap-2 relative z-10">
                <CheckCircle2 className="w-5 h-5" /> Submitted Marks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {(() => {
                  const cm = (() => { try { return JSON.parse(assignment.evaluation.criteriaMarks || "{}"); } catch { return {}; } })();
                  return EVALUATION_RUBRIC.map(c => (
                    <div key={c.key} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl shadow-sm border border-emerald-100/50">
                      <span className="text-emerald-700/80 font-medium truncate pr-2">{c.label}</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50 shrink-0">
                        {cm[c.key] || 0}/{c.maxMarks}
                      </span>
                    </div>
                  ));
                })()}
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-200/60 flex justify-between items-center relative z-10">
                <span className="text-sm font-black text-emerald-800 tracking-wider">TOTAL SCORE</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-600">{assignment.evaluation.totalMarks}</span>
                  <span className="text-lg font-bold text-emerald-400">/{assignment.evaluation.maxTotalMarks}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {!isSubmitted(assignment) && (
          <div className="mt-8 p-6 md:p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Ready to evaluate?</p>
              <p className="text-xs text-slate-500 mt-0.5">You can save your progress as a draft.</p>
            </div>
            <button
              onClick={() => router.push(`/reviewer?tab=evaluate&assignmentId=${assignment.id}`)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF5F38] text-white text-sm font-bold rounded-2xl hover:bg-[#E54D26] transition-all cursor-pointer shadow-lg shadow-[#FF5F38]/20 hover:shadow-[#FF5F38]/30 hover:-translate-y-0.5"
            >
              <Star className="w-4 h-4 fill-white/20" /> Proceed to Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
