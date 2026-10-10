"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  Home, ClipboardList, Star, History, Bell, User,
  CheckCircle2, Clock, AlertTriangle, Calendar, Search,
  Filter, Eye, FileText, Download, ChevronRight, X,
  TrendingUp, Award, Clipboard, AlertCircle, Save,
  Send, RotateCcw, ChevronDown, BookOpen, Users,
  Briefcase, Mail, Phone, Building, BadgeCheck,
  ClipboardCheck, FileCheck, Info, Activity
} from "lucide-react";

// ─── 8th Semester Evaluation Rubric ─────────────────────────────────────────
const EVALUATION_RUBRIC = [
  { key: "projectQuality",    label: "Project Quality & Innovation",       maxMarks: 20, description: "Originality, innovation and overall project quality" },
  { key: "technicalDepth",    label: "Technical Depth & Implementation",   maxMarks: 25, description: "Implementation quality, algorithm complexity, technical rigor" },
  { key: "documentation",     label: "Documentation & Report Quality",     maxMarks: 20, description: "Completeness, clarity, and professional quality of project report" },
  { key: "presentation",      label: "Presentation & Viva Voce",           maxMarks: 20, description: "Clarity of presentation, ability to defend methodology" },
  { key: "problemStatement",  label: "Problem Definition & Objectives",    maxMarks: 15, description: "Clear problem definition, well-stated objectives and scope" },
];
const MAX_TOTAL = EVALUATION_RUBRIC.reduce((s, r) => s + r.maxMarks, 0); // 100

// ─── Helper Components ────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    PENDING:     { label: "Pending",     cls: "bg-amber-50 text-amber-700 border-amber-200/60" },
    IN_PROGRESS: { label: "In Progress", cls: "bg-blue-50 text-blue-700 border-blue-200/60" },
    SUBMITTED:   { label: "Submitted",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
  };
  const { label, cls } = config[status] || { label: status, cls: "bg-slate-50 text-slate-600 border-slate-200/60" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${cls}`}>
      {status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
      {status === "IN_PROGRESS" && <AlertTriangle className="w-3.5 h-3.5" />}
      {status === "SUBMITTED" && <CheckCircle2 className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color, bg }) {
  // Generate a smooth sparkline for the screenshot feel
  const sparklineColor = color.replace("text-", "stroke-");
  return (
    <div className={`bg-white shadow-sm p-6 rounded-[2rem] flex items-center justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[13px] text-[#0A1628] font-bold mb-0.5">{label}</div>
          <div className={`text-3xl font-black tracking-tight ${color}`}>{value}</div>
          <div className="text-[11px] text-slate-600 font-medium mt-0.5">{subtext}</div>
        </div>
      </div>
      {/* Decorative Sparkline */}
      <div className="w-16 h-8 hidden xl:block opacity-60">
        <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 5" className={`${sparklineColor} opacity-50`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ─── MAIN PORTAL COMPONENT ──────────────────────────────────────────────────
export default function ReviewerPortalContent() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => { setActiveTab(tabParam); }, [tabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/reviewer?tab=${tab}`);
  };

  // ─── API Data ─────────────────────────────────────────────────────────────
  const [dashData, setDashData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      setDashData({
        stats: { totalAssigned: 4, submitted: 1, inProgress: 1, pending: 2 },
        upcomingDeadlines: [
          { id: "a1", status: "PENDING", reviewDeadline: new Date(Date.now() + 2 * 86400000), project: { projectTitle: "AI Traffic Optimization System" } },
          { id: "a2", status: "IN_PROGRESS", reviewDeadline: new Date(Date.now() + 5 * 86400000), project: { projectTitle: "Blockchain Credential Verification" } }
        ],
        recentEvaluations: [
          { id: "e1", totalMarks: 85, maxTotalMarks: 100, submittedAt: new Date(Date.now() - 2 * 86400000), assignment: { project: { projectTitle: "Predictive Maintenance Dashboard", team: { teamName: "Data Miners" } } } }
        ],
        recentAssignments: [
          { id: "a1", status: "PENDING", assignedAt: new Date(Date.now() - 86400000), project: { projectTitle: "AI Traffic Optimization System", team: { teamName: "TrafficAI" } } },
          { id: "a3", status: "PENDING", assignedAt: new Date(Date.now() - 172800000), project: { projectTitle: "Smart Greenhouse Monitor", team: { teamName: "AgriTech Innovators" } } }
        ],
        notifications: [
          { id: "n1", read: false, content: "New project 'AI Traffic Optimization System' assigned for review." }
        ]
      });
    } finally { setLoading(false); }
  }, []);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      setAssignments([
        {
          id: "a1", status: "PENDING", reviewDeadline: new Date(Date.now() + 2 * 86400000), assignedAt: new Date(Date.now() - 86400000),
          project: {
            id: "proj_12345", projectTitle: "AI Traffic Optimization System", domain: "Artificial Intelligence", description: "A system to optimize city traffic using deep learning and real-time camera feeds.", technologies: '["Python", "TensorFlow", "React"]',
            team: { teamName: "TrafficAI", members: [{ user: { name: "Alice", studentProfile: { department: "Computer Science" } } }, { user: { name: "Bob" } }] },
            guideRequests: [{ teacher: { user: { name: "Dr. Smith" } } }]
          },
        },
        {
          id: "a2", status: "IN_PROGRESS", reviewDeadline: new Date(Date.now() + 5 * 86400000), assignedAt: new Date(Date.now() - 2 * 86400000),
          project: {
            id: "proj_67890", projectTitle: "Blockchain Credential Verification", domain: "Cybersecurity", description: "Decentralized verification of academic credentials to prevent fraud.", technologies: '["Solidity", "Next.js", "Ethereum"]',
            team: { teamName: "CryptoSec", members: [{ user: { name: "Charlie", studentProfile: { department: "Information Tech" } } }] },
            guideRequests: [{ teacher: { user: { name: "Prof. Johnson" } } }]
          },
          evaluation: { criteriaMarks: '{"projectQuality":15,"technicalDepth":20}', totalMarks: 35, maxTotalMarks: 100, isDraft: true }
        },
        {
          id: "a3", status: "PENDING", reviewDeadline: new Date(Date.now() + 10 * 86400000), assignedAt: new Date(Date.now() - 3 * 86400000),
          project: {
            id: "proj_34567", projectTitle: "Smart Greenhouse Monitor", domain: "IoT", description: "IoT based climate control for automated greenhouse management.", technologies: '["Arduino", "Raspberry Pi", "Node.js"]',
            team: { teamName: "AgriTech Innovators", members: [{ user: { name: "Dave", studentProfile: { department: "Electronics" } } }] },
            guideRequests: [{ teacher: { user: { name: "Dr. Green" } } }]
          }
        },
        {
          id: "a4", status: "SUBMITTED", reviewDeadline: new Date(Date.now() - 86400000), assignedAt: new Date(Date.now() - 15 * 86400000),
          project: {
            id: "proj_99999", projectTitle: "Predictive Maintenance Dashboard", domain: "Data Science", description: "Predicting machine failure using historical sensor data.", technologies: '["Python", "Pandas", "Scikit-learn"]',
            team: { teamName: "Data Miners", members: [{ user: { name: "Eve", studentProfile: { department: "Mechanical" } } }] },
            guideRequests: [{ teacher: { user: { name: "Dr. Brown" } } }]
          },
          evaluation: { criteriaMarks: '{"projectQuality":18,"technicalDepth":22,"documentation":15,"presentation":18,"problemStatement":12}', totalMarks: 85, maxTotalMarks: 100, isDraft: false }
        }
      ]);
    } finally { setLoading(false); }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      setHistory([
        {
          id: "e1", isDraft: false, totalMarks: 85, maxTotalMarks: 100, criteriaMarks: '{"projectQuality":18,"technicalDepth":22,"documentation":15,"presentation":18,"problemStatement":12}',
          assignment: {
            project: { id: "proj_99999", projectTitle: "Predictive Maintenance Dashboard", description: "Predicting machine failure using historical sensor data.", team: { teamName: "Data Miners", members: [{ user: { name: "Eve" } }] } }
          }
        }
      ]);
    } finally { setLoading(false); }
  }, []);

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/reviewer/profile");
    if (res.ok) setProfile(await res.json());
  }, []);

  useEffect(() => {
    if (activeTab === "dashboard") fetchDashboard();
    else if (activeTab === "projects" || activeTab === "evaluate") fetchAssignments();
    else if (activeTab === "history") fetchHistory();
    else if (activeTab === "profile") fetchProfile();
  }, [activeTab]);

  // ─── PROJECT DETAIL & EVALUATION STATE ────────────────────────────────────
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedAssignment?.evaluation?.criteriaMarks) {
      try { setMarks(JSON.parse(selectedAssignment.evaluation.criteriaMarks)); } catch { setMarks({}); }
    } else {
      setMarks({});
    }
  }, [selectedAssignment]);

  const totalMarks = EVALUATION_RUBRIC.reduce((s, r) => s + (marks[r.key] || 0), 0);

  const handleMarkChange = (key, value, max) => {
    const clamped = Math.min(max, Math.max(0, isNaN(value) ? 0 : value));
    setMarks(prev => ({ ...prev, [key]: clamped }));
  };

  const handleSaveEvaluation = async (isDraft) => {
    if (!selectedAssignment) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/reviewer/assignments/${selectedAssignment.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteriaMarks: marks, totalMarks, maxTotalMarks: MAX_TOTAL, isDraft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save evaluation");

      showToast(isDraft ? "Draft saved successfully!" : "Evaluation submitted to coordinator!", "success");
      setShowConfirmDialog(false);
      setShowEvalForm(false);
      setSelectedAssignment(null);
      fetchAssignments();
      if (activeTab === "evaluate") fetchAssignments();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── SEARCH & FILTER ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notifFilter, setNotifFilter] = useState("ALL");

  const filteredAssignments = assignments.filter(a => {
    const title = a.project?.projectTitle?.toLowerCase() || "";
    const team = a.project?.team?.teamName?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || title.includes(q) || team.includes(q);
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── NOTIFICATIONS (from dashboard data) ──────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (dashData?.notifications) setNotifications(dashData.notifications);
  }, [dashData]);

  const markAllRead = async () => {
    await fetch("/api/notifications/mark-read", { method: "POST" });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read", "success");
  };

  // ─── HELPER ───────────────────────────────────────────────────────────────
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const isSubmitted = (a) => a?.status === "SUBMITTED";
  const isDeadlineNear = (a) => {
    if (!a?.reviewDeadline) return false;
    const diff = new Date(a.reviewDeadline).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── DASHBOARD ──────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ClipboardList} label="Total Assigned" value={dashData?.stats?.totalAssigned ?? 4} subtext="Projects assigned to you" color="text-[#FF5F38]" bg="bg-[#FF5F38]/10" />
        <StatCard icon={Clock} label="Pending" value={dashData?.stats?.pending ?? 1} subtext="Awaiting evaluation" color="text-amber-500" bg="bg-amber-50" />
        <StatCard icon={AlertTriangle} label="In Progress" value={dashData?.stats?.inProgress ?? 1} subtext="Currently evaluating" color="text-blue-500" bg="bg-blue-50" />
        <StatCard icon={CheckCircle2} label="Submitted" value={dashData?.stats?.submitted ?? 2} subtext="Evaluations completed" color="text-emerald-500" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm transition-shadow hover:shadow-md flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FF5F38]/10 rounded-2xl">
                <Calendar className="w-6 h-6 text-[#FF5F38]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-[#0A1628] tracking-tight">Upcoming Deadlines</h2>
                <p className="text-xs text-slate-600 mt-0.5">Projects that need your attention soon</p>
              </div>
            </div>
            <button onClick={() => handleTabChange("projects")} className="text-xs font-bold text-[#FF5F38] bg-[#FF5F38]/5 hover:bg-[#FF5F38]/10 px-4 py-2 rounded-xl transition flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            {loading ? <div className="text-sm text-slate-400 text-center py-8">Loading...</div> :
             (dashData?.upcomingDeadlines?.length === 0 || !dashData?.upcomingDeadlines) ? (
              <div className="text-center py-8 text-slate-400 m-auto">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                <p className="text-sm font-bold">No upcoming deadlines</p>
              </div>
            ) : dashData?.upcomingDeadlines?.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition px-2 rounded-xl cursor-pointer" onClick={() => router.push(`/reviewer/project/${a.id}`)}>
                <div>
                  <p className="text-sm font-black text-[#0A1628] mb-1.5">{a.project?.projectTitle || "Project"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(a.reviewDeadline)}
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-4 shrink-0">
                  <StatusBadge status={a.status} />
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Assigned */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm transition-shadow hover:shadow-md flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FF5F38]/10 rounded-2xl">
                <ClipboardList className="w-6 h-6 text-[#FF5F38]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-[#0A1628] tracking-tight">Recently Assigned</h2>
                <p className="text-xs text-slate-600 mt-0.5">Your latest project assignments</p>
              </div>
            </div>
            <button onClick={() => handleTabChange("projects")} className="text-xs font-bold text-[#FF5F38] bg-[#FF5F38]/5 hover:bg-[#FF5F38]/10 px-4 py-2 rounded-xl transition flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            {loading ? <div className="text-sm text-slate-400 text-center py-8">Loading...</div> :
             (!dashData?.recentAssignments?.length) ? (
              <div className="text-center py-8 text-slate-400 m-auto">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-bold">No projects assigned yet</p>
              </div>
            ) : dashData?.recentAssignments?.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition px-2 rounded-xl cursor-pointer" onClick={() => router.push(`/reviewer/project/${a.id}`)}>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-black text-[#0A1628] truncate mb-1.5">{a.project?.projectTitle || "Unnamed Project"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {a.project?.team?.teamName} <span className="mx-1 text-slate-300">•</span> {formatDate(a.assignedAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <StatusBadge status={a.status} />
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Submitted Marks */}
      {dashData?.recentEvaluations?.length > 0 && (
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-emerald-600" /> Recently Submitted Marks
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left pb-4 font-bold uppercase tracking-wider text-xs">Project</th>
                  <th className="text-left pb-4 font-bold uppercase tracking-wider text-xs">Team</th>
                  <th className="text-center pb-4 font-bold uppercase tracking-wider text-xs">Total Marks</th>
                  <th className="text-right pb-4 font-bold uppercase tracking-wider text-xs">Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {dashData.recentEvaluations.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-slate-800">{e.assignment?.project?.projectTitle || "—"}</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">{e.assignment?.project?.team?.teamName || "—"}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg border border-emerald-100/50">
                        {e.totalMarks}/{e.maxTotalMarks}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right text-slate-400 font-medium">{formatDate(e.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick notification banner */}
      {notifications.some(n => !n.read) && (
        <div className="bg-gradient-to-r from-[#FF5F38]/10 to-orange-50 border border-[#FF5F38]/20 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-full shadow-sm">
              <Bell className="w-5 h-5 text-[#FF5F38] shrink-0" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              You have {notifications.filter(n => !n.read).length} unread notification{notifications.filter(n => !n.read).length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => handleTabChange("notifications")}
            className="text-sm font-bold text-[#FF5F38] hover:text-[#E04B24] transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md"
          >
            View All →
          </button>
        </div>
      )}
    </div>
  );

  // ─── ASSIGNED PROJECTS LIST ──────────────────────────────────────────────
  const renderProjects = () => (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by project title or team name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-sm focus:outline-none focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38]/20 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5F38] cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
        </select>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Showing {filteredAssignments.length} of {assignments.length} assigned project{assignments.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#FF5F38]/30 border-t-[#FF5F38] rounded-full animate-spin" />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-white border border-[#EADBD0] rounded-2xl p-12 text-center">
          <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="font-bold text-slate-600 mb-1">No projects assigned</h3>
          <p className="text-xs text-slate-400">Projects will appear here when assigned by coordinators or mentors.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAssignments.map(a => {
            const project = a.project;
            const team = project?.team;
            const mentor = project?.guideRequests?.[0]?.teacher?.user;
            const members = team?.members || [];
            const deadlineNear = isDeadlineNear(a);

            return (
              <div key={a.id} className={`bg-white border rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow ${deadlineNear && a.status !== "SUBMITTED" ? "border-amber-300" : "border-[#EADBD0]"}`}>
                {deadlineNear && a.status !== "SUBMITTED" && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3 h-3" /> Deadline approaching: {formatDate(a.reviewDeadline)}
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#FF5F38] bg-[#FF5F38]/10 border border-[#FF5F38]/20 px-1.5 py-0.5 rounded font-bold">{project?.id?.slice(0,8).toUpperCase() || "—"}</span>
                      <span className="text-[10px] text-slate-400">8th Sem</span>
                    </div>
                    <h3 className="text-sm font-black text-[#111827] leading-snug">{project?.projectTitle || "Unnamed"}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{project?.domain || "—"}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium">Team:</span>
                    <span className="ml-1 font-bold text-[#111827]">{team?.teamName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Dept:</span>
                    <span className="ml-1 font-semibold text-slate-600">{members?.[0]?.user?.studentProfile?.department?.split(" ")?.[0] || "CS"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Mentor:</span>
                    <span className="ml-1 font-semibold text-slate-600">{mentor?.name || "Not assigned"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Deadline:</span>
                    <span className="ml-1 font-semibold text-slate-600">{formatDate(a.reviewDeadline)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {members.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {m.user?.name?.split(" ")?.[0] || "Student"}
                    </span>
                  ))}
                  {members.length > 3 && <span className="text-[10px] text-slate-400">+{members.length - 3} more</span>}
                </div>

                <div className="pt-2 border-t border-[#EADBD0] flex gap-2">
                  <button
                    onClick={() => router.push(`/reviewer/project/${a.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#EADBD0] transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FF5F38]" /> View Details
                  </button>
                  {!isSubmitted(a) ? (
                    <button
                      onClick={() => { setSelectedAssignment(a); setShowEvalForm(true); handleTabChange("evaluate"); }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5" /> Evaluate
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/reviewer/project/${a.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Marks Submitted
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ─── EVALUATE PROJECTS ──────────────────────────────────────────────────
  const renderEvaluate = () => (
    <div className="space-y-5">
      {!selectedAssignment || !showEvalForm ? (
        <>
          <div className="bg-gradient-to-r from-[#FF5F38]/5 to-transparent border border-[#FF5F38]/10 rounded-3xl p-5 flex items-start gap-4 mb-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#FF5F38]/10 shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-[#FF5F38]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-black text-[#0A1628] mb-1">Select a project to evaluate</p>
              <p className="text-xs text-slate-600 leading-relaxed">Choose from your assigned 8th-semester final-year projects below. You can save your progress as a draft and return to it later, or submit the final evaluation when ready.</p>
            </div>
          </div>

          {/* Pending/In-Progress assignments only */}
          <div className="flex flex-col gap-4">
            {assignments.filter(a => a.status !== "SUBMITTED").map(a => {
              const project = a.project;
              const team = project?.team;
              return (
                <div key={a.id} className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col md:flex-row md:items-center justify-between gap-5 group">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-2.5">
                      <h3 className="text-base font-black text-[#0A1628] truncate">{project?.projectTitle}</h3>
                      <div className="shrink-0"><StatusBadge status={a.status} /></div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{project?.description || project?.problemStatement || "No description available."}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#FF5F38]" /> {team?.teamName}</p>
                      <p className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">8th Semester</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-stretch md:items-end gap-3 shrink-0">
                    {a.evaluation && (
                      <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-3 py-1.5 text-[11px] text-amber-700 font-bold flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Draft Saved: {a.evaluation.totalMarks}/{a.evaluation.maxTotalMarks}
                      </div>
                    )}
                    <button
                      onClick={() => { setSelectedAssignment(a); setShowEvalForm(true); }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-black rounded-2xl transition-all shadow-[0_4px_12px_-4px_rgba(255,95,56,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(255,95,56,0.6)] cursor-pointer"
                    >
                      <Star className="w-4 h-4" strokeWidth={2.5} /> {a.status === "IN_PROGRESS" ? "Continue Evaluation" : "Start Evaluation"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {assignments.filter(a => a.status !== "SUBMITTED").length === 0 && (
            <div className="bg-white border border-[#EADBD0] rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-600 mb-1">All evaluations submitted!</h3>
              <p className="text-xs text-slate-400">You have no pending projects to evaluate.</p>
            </div>
          )}
        </>
      ) : (
        /* ─── MARKS ENTRY FORM ─────────────────────────────────────────── */
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Header */}
          <div className="bg-white border border-[#EADBD0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#FF5F38] bg-[#FF5F38]/10 border border-[#FF5F38]/20 px-1.5 py-0.5 rounded font-bold">
                    {selectedAssignment.project?.id?.slice(0,8).toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">8th Semester · Final Year Project</span>
                </div>
                <h2 className="text-lg font-black text-[#111827]">{selectedAssignment.project?.projectTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Team: {selectedAssignment.project?.team?.teamName} •
                  Deadline: {formatDate(selectedAssignment.reviewDeadline)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Total Score</div>
                <div className={`text-2xl font-black font-mono ${totalMarks >= MAX_TOTAL * 0.7 ? "text-emerald-600" : totalMarks >= MAX_TOTAL * 0.4 ? "text-amber-600" : "text-[#FF5F38]"}`}>
                  {totalMarks} / {MAX_TOTAL}
                </div>
                <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 ml-auto">
                  <div
                    className={`h-2 rounded-full transition-all ${totalMarks >= MAX_TOTAL * 0.7 ? "bg-emerald-500" : totalMarks >= MAX_TOTAL * 0.4 ? "bg-amber-500" : "bg-[#FF5F38]"}`}
                    style={{ width: `${(totalMarks / MAX_TOTAL) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Info Summary */}
          <div className="bg-white border border-[#EADBD0] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#FF5F38] border-l-2 border-[#FF5F38] pl-2">Project Summary</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{selectedAssignment.project?.description || selectedAssignment.project?.problemStatement || "No description available."}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400 font-medium">Domain:</span> <span className="font-semibold ml-1">{selectedAssignment.project?.domain || "—"}</span></div>
              <div><span className="text-slate-400 font-medium">Semester:</span> <span className="font-semibold ml-1">8th Semester</span></div>
              <div><span className="text-slate-400 font-medium">Technologies:</span> <span className="font-semibold ml-1">{JSON.parse(selectedAssignment.project?.technologies || "[]").slice(0,3).join(", ") || "—"}</span></div>
              <div><span className="text-slate-400 font-medium">Students:</span> <span className="font-semibold ml-1">{selectedAssignment.project?.team?.members?.length || 0}</span></div>
            </div>
          </div>

          {/* Marks Form */}
          <div className="bg-white border border-[#EADBD0] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#FF5F38] border-l-2 border-[#FF5F38] pl-2">
              Evaluation Rubric — 8th Semester Final Year Project
            </h3>

            {EVALUATION_RUBRIC.map(criterion => (
              <div key={criterion.key} className="p-4 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#111827]">{criterion.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{criterion.description}</div>
                    <div className="text-[11px] text-[#FF5F38] font-bold mt-1">Max: {criterion.maxMarks} marks</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="range"
                      min={0}
                      max={criterion.maxMarks}
                      step={0.5}
                      value={marks[criterion.key] ?? 0}
                      onChange={e => handleMarkChange(criterion.key, parseFloat(e.target.value), criterion.maxMarks)}
                      className="w-28 accent-[#FF5F38] cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={criterion.maxMarks}
                      step={0.5}
                      value={marks[criterion.key] ?? 0}
                      onChange={e => handleMarkChange(criterion.key, parseFloat(e.target.value), criterion.maxMarks)}
                      className="w-16 text-center font-mono font-black text-[#FF5F38] text-sm border border-[#EADBD0] bg-white rounded-lg py-1.5 focus:outline-none focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38]/20"
                    />
                  </div>
                </div>
                {/* Progress bar for criterion */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-[#FF5F38] transition-all"
                    style={{ width: `${((marks[criterion.key] || 0) / criterion.maxMarks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setShowEvalForm(false); setSelectedAssignment(null); }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#EADBD0] text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={() => handleSaveEvaluation(true)}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-sm font-bold rounded-xl shadow-md shadow-[#FF5F38]/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Evaluation
            </button>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5F38]/10 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-[#FF5F38]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#111827]">Confirm Submission</h3>
                    <p className="text-xs text-slate-500">This action cannot be undone without coordinator authorization.</p>
                  </div>
                </div>
                <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Marks Summary:</p>
                  {EVALUATION_RUBRIC.map(c => (
                    <div key={c.key} className="flex justify-between text-xs">
                      <span className="text-slate-600">{c.label}</span>
                      <span className="font-mono font-bold text-[#FF5F38]">{marks[c.key] || 0}/{c.maxMarks}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#EADBD0] flex justify-between text-sm font-black">
                    <span>TOTAL</span>
                    <span className="text-[#FF5F38]">{totalMarks}/{MAX_TOTAL}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Once submitted, your marks will be automatically sent to the Coordinator Portal. Marks are final unless the coordinator authorizes a correction.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => handleSaveEvaluation(false)}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:opacity-50 shadow-md shadow-[#FF5F38]/20"
                  >
                    {saving ? "Submitting..." : "Confirm Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─── EVALUATION HISTORY ──────────────────────────────────────────────────
  const renderHistory = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#111827]">Evaluation History</h2>
        <span className="text-xs text-slate-500">{history.length} evaluation{history.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border border-[#EADBD0] rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="font-bold text-slate-600 mb-1">No evaluations yet</h3>
          <p className="text-xs text-slate-400">Your submitted evaluations will appear here.</p>
        </div>
      ) : history.map((ev) => {
        const project = ev.assignment?.project;
        const team = project?.team;
        const members = team?.members || [];
        const criteriaMarks = (() => { try { return JSON.parse(ev.criteriaMarks || "{}"); } catch { return {}; } })();

        return (
          <div key={ev.id} className="bg-white border border-[#EADBD0] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={ev.isDraft ? "IN_PROGRESS" : "SUBMITTED"} />
                  <span className="text-[10px] text-slate-400 font-mono">{ev.assignment?.project?.id?.slice(0,8).toUpperCase()}</span>
                </div>
                <h3 className="text-sm font-black text-[#111827] mb-1.5">{project?.projectTitle || "Unknown Project"}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{project?.description || project?.problemStatement || "No description provided."}</p>
                <p className="text-[11px] font-bold text-slate-500">{team?.teamName} • 8th Semester</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold">Total Marks</div>
                <div className="text-xl font-black font-mono text-[#FF5F38]">{ev.totalMarks}<span className="text-slate-400 text-sm">/{ev.maxTotalMarks}</span></div>
                {!ev.isDraft && <div className="text-[11px] text-slate-400 mt-0.5">Submitted {formatDate(ev.submittedAt)}</div>}
              </div>
            </div>

            {/* Criterion Breakdown */}
            <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-4 space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Criterion-wise Marks (Read-Only)</p>
              {EVALUATION_RUBRIC.map(c => (
                <div key={c.key} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 flex-1">{c.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full">
                      <div className="h-1.5 rounded-full bg-[#FF5F38]" style={{ width: `${((criteriaMarks[c.key] || 0) / c.maxMarks) * 100}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF5F38] w-12 text-right">{criteriaMarks[c.key] || 0}/{c.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Student Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {members.slice(0,4).map((m, i) => (
                <div key={i} className="text-[11px] bg-slate-50 border border-[#EADBD0] rounded-lg px-2.5 py-1.5">
                  <p className="font-bold text-[#111827]">{m.user?.name}</p>
                  <p className="text-slate-400">{m.user?.studentProfile?.rollNumber || "—"}</p>
                </div>
              ))}
            </div>

            {/* Audit Trail */}
            {ev.auditLogs?.length > 0 && (
              <details className="border border-amber-200 bg-amber-50 rounded-xl p-3">
                <summary className="text-xs font-bold text-amber-700 cursor-pointer">
                  ⚠ Authorized Corrections ({ev.auditLogs.length})
                </summary>
                <div className="mt-2 space-y-2">
                  {ev.auditLogs.map((log) => (
                    <div key={log.id} className="text-[11px] text-amber-700 border-t border-amber-200 pt-2">
                      <p className="font-bold">{formatDate(log.changedAt)} — {log.changeReason || "Correction"}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  const renderNotifications = () => {
    const filtered = notifFilter === "ALL" ? notifications :
      notifFilter === "UNREAD" ? notifications.filter(n => !n.read) :
      notifications.filter(n => n.read);

    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {["ALL", "UNREAD", "READ"].map(f => (
              <button key={f} onClick={() => setNotifFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${notifFilter === f ? "bg-[#FF5F38] text-white" : "bg-white border border-[#EADBD0] text-slate-600 hover:bg-[#FF5F38]/10"}`}>
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllRead} className="text-xs font-bold text-[#FF5F38] hover:underline cursor-pointer">
              Mark all read
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#EADBD0] rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-600 mb-1">No notifications</h3>
            <p className="text-xs text-slate-400">You're all caught up!</p>
          </div>
        ) : filtered.map((n) => (
          <div key={n.id} className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${!n.read ? "border-[#FF5F38]/30 bg-[#FF5F38]/5" : "border-[#EADBD0]"}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                n.type === "REVIEW_ASSIGNED" ? "bg-[#FF5F38]/10" :
                n.type === "REVIEW_SUBMITTED" ? "bg-emerald-100" :
                n.type === "REVIEW_DEADLINE" ? "bg-amber-100" : "bg-slate-100"
              }`}>
                {n.type === "REVIEW_ASSIGNED" ? <ClipboardList className="w-4 h-4 text-[#FF5F38]" /> :
                 n.type === "REVIEW_SUBMITTED" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                 n.type === "REVIEW_DEADLINE" ? <AlertTriangle className="w-4 h-4 text-amber-600" /> :
                 <Bell className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-bold ${!n.read ? "text-[#FF5F38]" : "text-[#111827]"}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-[#FF5F38] rounded-full shrink-0" />}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── PROFILE ─────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="max-w-2xl space-y-5">
      {/* Profile Card */}
      <div className="bg-white border border-[#EADBD0] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#0B2E26] text-white flex items-center justify-center text-2xl font-black shadow-md">
            {user?.name?.charAt(0).toUpperCase() || "R"}
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111827]">{user?.name || "Reviewer"}</h2>
            <p className="text-sm text-[#FF5F38] font-bold">{profile?.user?.reviewerProfile?.designation || "External Reviewer"}</p>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.user?.reviewerProfile?.department || "—"}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2.5 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-medium break-all">{user?.email}</span>
          </div>
          {profile?.user?.reviewerProfile?.staffId && (
            <div className="flex items-center gap-2.5 text-slate-600">
              <BadgeCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-medium">Staff ID: {profile.user.reviewerProfile.staffId}</span>
            </div>
          )}
          {profile?.user?.reviewerProfile?.contactNumber && (
            <div className="flex items-center gap-2.5 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-medium">{profile.user.reviewerProfile.contactNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-slate-600">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-medium">{profile?.user?.reviewerProfile?.department || "Department"}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#EADBD0] rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl font-black text-[#FF5F38] font-mono">{profile?.totalAssigned || 0}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Projects Assigned</div>
        </div>
        <div className="bg-white border border-[#EADBD0] rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl font-black text-emerald-700 font-mono">{profile?.submitted || 0}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Evaluations Submitted</div>
        </div>
      </div>

      {/* Role Info */}
      <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl p-4 flex items-start gap-3">
        <ClipboardCheck className="w-5 h-5 text-[#FF5F38] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#111827]">Reviewer Role</p>
          <p className="text-xs text-slate-600 mt-0.5">
            You are authorized to evaluate 8th-semester final-year projects assigned to you by mentors or coordinators. Your submitted marks are automatically synchronized with the Coordinator Portal.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700">Access Restrictions</p>
          <p className="text-xs text-amber-600 mt-0.5">
            You can only access projects assigned to you. You cannot modify student records, mentor data, or coordinator settings. Role changes require administrator intervention.
          </p>
        </div>
      </div>
    </div>
  );

  // ─── PROJECT DETAIL MODAL ─────────────────────────────────────────────────
  const renderDetailModal = () => {
    if (!selectedAssignment || !showDetailModal) return null;
    const project = selectedAssignment.project;
    const team = project?.team;
    const members = team?.members || [];
    const mentor = project?.guideRequests?.[0]?.teacher?.user;
    const techs = (() => { try { return JSON.parse(project?.technologies || "[]"); } catch { return []; } })();

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-6 overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#0B2E26] to-[#165547] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#FF5F38] bg-white/10 px-1.5 py-0.5 rounded font-bold">
                    {project?.id?.slice(0,8).toUpperCase()}
                  </span>
                  <span className="text-[10px] text-teal-200">8th Semester · Final Year Project</span>
                </div>
                <h2 className="text-lg font-black text-white">{project?.projectTitle}</h2>
                <p className="text-sm text-teal-100 mt-0.5">{team?.teamName}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedAssignment.status} />
                <button onClick={() => { setShowDetailModal(false); setSelectedAssignment(null); }}
                  className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Project Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FF5F38]">Project Information</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div><span className="font-bold text-slate-500">Problem Statement:</span> <p className="mt-1 text-xs leading-relaxed">{project?.problemStatement || "—"}</p></div>
                <div><span className="font-bold text-slate-500">Description / Methodology:</span> <p className="mt-1 text-xs leading-relaxed">{project?.description || "—"}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3">
                  <p className="text-slate-400 font-medium">Domain</p>
                  <p className="font-bold text-[#111827] mt-0.5">{project?.domain || "—"}</p>
                </div>
                <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3">
                  <p className="text-slate-400 font-medium">Review Deadline</p>
                  <p className="font-bold text-[#111827] mt-0.5">{formatDate(selectedAssignment.reviewDeadline)}</p>
                </div>
                <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3">
                  <p className="text-slate-400 font-medium">Submission Date</p>
                  <p className="font-bold text-[#111827] mt-0.5">{formatDate(project?.createdAt)}</p>
                </div>
                <div className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3">
                  <p className="text-slate-400 font-medium">Project Status</p>
                  <p className="font-bold text-[#111827] mt-0.5">{project?.status?.replace(/_/g, " ") || "—"}</p>
                </div>
              </div>
              {techs.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techs.map((t, i) => <span key={i} className="text-[11px] bg-[#FF5F38]/10 text-[#FF5F38] border border-[#FF5F38]/20 px-2 py-0.5 rounded-lg font-medium">{t}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Team & Students */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FF5F38] mb-3">Team & Students</h3>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs">
                    <div>
                      <p className="font-bold text-[#111827]">{m.user?.name}</p>
                      <p className="text-slate-500">{m.user?.studentProfile?.rollNumber || "—"} • {m.user?.studentProfile?.department?.split(" ")?.[0] || "CS"}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${m.role === "Team Creator" ? "bg-[#FF5F38]/10 text-[#FF5F38] border border-[#FF5F38]/20" : "bg-slate-100 text-slate-600"}`}>{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Info */}
            {mentor && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FF5F38] mb-3">Assigned Mentor</h3>
                <div className="flex items-center gap-3 p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
                    {mentor.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#111827]">{mentor.name}</p>
                    <p className="text-slate-500">{mentor.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submitted Marks (read-only) */}
            {selectedAssignment.evaluation && !selectedAssignment.evaluation.isDraft && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-3">Submitted Marks</h3>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  {(() => {
                    const cm = (() => { try { return JSON.parse(selectedAssignment.evaluation.criteriaMarks || "{}"); } catch { return {}; } })();
                    return EVALUATION_RUBRIC.map(c => (
                      <div key={c.key} className="flex justify-between text-xs">
                        <span className="text-slate-600">{c.label}</span>
                        <span className="font-mono font-bold text-emerald-700">{cm[c.key] || 0}/{c.maxMarks}</span>
                      </div>
                    ));
                  })()}
                  <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-black">
                    <span>TOTAL</span>
                    <span className="text-emerald-700">{selectedAssignment.evaluation.totalMarks}/{selectedAssignment.evaluation.maxTotalMarks}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isSubmitted(selectedAssignment) && (
            <div className="p-4 border-t border-[#EADBD0] bg-[#FAF2EC] flex gap-3">
              <button
                onClick={() => { setShowDetailModal(false); setShowEvalForm(true); handleTabChange("evaluate"); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF5F38] text-white text-sm font-bold rounded-xl hover:bg-[#E54D26] transition cursor-pointer shadow-sm"
              >
                <Star className="w-4 h-4" /> Go to Evaluate
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div>
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "projects" && renderProjects()}
      {activeTab === "evaluate" && renderEvaluate()}
      {activeTab === "history" && renderHistory()}
      {activeTab === "notifications" && renderNotifications()}
      {activeTab === "profile" && renderProfile()}
      {renderDetailModal()}
    </div>
  );
}
