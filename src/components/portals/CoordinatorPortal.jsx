import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Calendar,
  Lock,
  Unlock,
  BarChart3,
  BookOpen,
  Clock,
  Check,
  Megaphone,
  Mail,
  Send,
  Eye,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  BellRing,
  Sparkles,
  ArrowRight,
  UserPlus,
  Edit3,
  ChevronRight,
  PieChart
} from 'lucide-react';
import ReportGenerator from '../common/ReportGenerator';

export default function CoordinatorPortal() {
  const {
    data,
    toggleRegisterLock,
    approveTeamStatus,
    assignMentorToTeam,
    scheduleReview,
    updateMarksStatus,
    publishNotice
  } = useApp();

  const { showToast } = useNotification();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');

  useEffect(() => {
    setActiveTab(tabParam || 'dashboard');
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'dashboard') {
      router.push('/coordinator?tab=dashboard');
    } else {
      router.push(`/coordinator?tab=${tabKey}`);
    }
  };

  // State for Coordinator Stats from API
  const [apiStats, setApiStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/coordinator/stats');
        if (res.ok) {
          const json = await res.json();
          setApiStats(json);
        }
      } catch (err) {
        console.error('Failed to fetch coordinator stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Section 2: Student & Team Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedSemFilter, setSelectedSemFilter] = useState('ALL');
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);

  // Section 3: Mentor Management
  const [mentorSearch, setMentorSearch] = useState('');
  const [assignMentorModalTeam, setAssignMentorModalTeam] = useState(null);
  const [selectedMentorIdToAssign, setSelectedMentorIdToAssign] = useState('');

  // Section 4: Announcements State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annRecipients, setAnnRecipients] = useState('ALL');
  const [annSendEmail, setAnnSendEmail] = useState(true);
  const [annSendInApp, setAnnSendInApp] = useState(true);
  const [annScheduledAt, setAnnScheduledAt] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSendingAnn, setIsSendingAnn] = useState(false);
  const [announcementHistory, setAnnouncementHistory] = useState([
    {
      id: 'ANN-101',
      title: '📢 6th Semester Research Paper & Topic Finalization Deadline',
      message: 'All 6th Semester teams must complete domain selection, problem statement, and 5 research paper entries by September 25th.',
      recipients: '6th Semester Students',
      sentAt: '2026-09-08 10:30 AM',
      emailCount: 45,
      inAppCount: 45,
      status: 'Delivered'
    },
    {
      id: 'ANN-102',
      title: '📅 CIA Presentation & Evaluation Schedule Released',
      message: 'The 6th Semester CIA Review will be held on October 20th in Seminar Hall 2. Check your review schedule tab for venue details.',
      recipients: 'All Students & Mentors',
      sentAt: '2026-09-05 02:15 PM',
      emailCount: 60,
      inAppCount: 60,
      status: 'Delivered'
    }
  ]);

  const handleSendAnnouncement = async () => {
    if (!annTitle || !annMessage) {
      showToast('Please fill out the title and message.', 'error');
      return;
    }

    setIsSendingAnn(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          message: annMessage,
          recipients: annRecipients,
          sendEmail: annSendEmail,
          sendInApp: annSendInApp,
          scheduledAt: annScheduledAt || undefined
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to send announcement');

      showToast(resData.message || 'Announcement broadcast successfully!', 'success');

      // Publish notice to app context
      publishNotice({
        title: annTitle,
        content: annMessage,
        priority: 'high'
      });

      // Add to history state
      const newHistoryItem = {
        id: `ANN-${Date.now()}`,
        title: `📢 ${annTitle}`,
        message: annMessage,
        recipients: annRecipients === 'ALL' ? 'All Users' : annRecipients,
        sentAt: new Date().toLocaleString(),
        emailCount: resData.stats?.emailCount || 0,
        inAppCount: resData.stats?.notificationCount || 0,
        status: annScheduledAt ? 'Scheduled' : 'Delivered'
      };
      setAnnouncementHistory([newHistoryItem, ...announcementHistory]);

      // Reset form
      setAnnTitle('');
      setAnnMessage('');
      setAnnScheduledAt('');
      setShowPreviewModal(false);
    } catch (err) {
      showToast(err.message || 'Network error sending announcement', 'error');
    } finally {
      setIsSendingAnn(false);
    }
  };

  // Section 5: Reviewer Marks State & Filtering (live from API)
  const [marksSemFilter, setMarksSemFilter] = useState('ALL');
  const [marksStatusFilter, setMarksStatusFilter] = useState('ALL');
  const [selectedEvaluationModal, setSelectedEvaluationModal] = useState(null);
  const [liveEvaluations, setLiveEvaluations] = useState([]);
  const [evalSummary, setEvalSummary] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  useEffect(() => {
    async function fetchEvaluations() {
      setEvalLoading(true);
      try {
        const res = await fetch('/api/coordinator/evaluations');
        if (res.ok) {
          const json = await res.json();
          setLiveEvaluations(json.evaluations || []);
          setEvalSummary(json.summary || null);
        }
      } catch (err) {
        console.error('Failed to fetch evaluations:', err);
      } finally {
        setEvalLoading(false);
      }
    }
    if (activeTab === 'marks' || activeTab === 'reviews') fetchEvaluations();
  }, [activeTab]);

  const mockEvaluationsList = [
    {
      id: 'EVAL-801',
      teamId: 'TEAM-01',
      teamName: 'Neural Vision Squad',
      semester: '6th Semester',
      projectTitle: 'Autonomous Drone Defect Detection',
      reviewerName: 'Prof. Robert Langford',
      reviewerDept: 'Information Technology',
      evaluationDate: '2026-09-30',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 9,
        technicalKnowledge: 8,
        progress: 8,
        presentation: 9,
      },
      ciaMarks: 24,
      endSemMarks: 43,
      totalMarks: 67,
      status: 'Finalized',
      comments: 'Excellent autonomous drone telemetry setup and real-time YOLO inference. Highly commendable research approach.',
      recommendation: 'Approved for final thesis & publication.'
    },
    {
      id: 'EVAL-802',
      teamId: 'TEAM-02',
      teamName: 'InnovateX Team',
      semester: '6th Semester',
      projectTitle: 'Smart Academic & Project Management Hub',
      reviewerName: 'Dr. Emily Watson',
      reviewerDept: 'Software Engineering',
      evaluationDate: '2026-09-28',
      rubric: {
        problemUnderstanding: 10,
        literatureReview: 9,
        technicalKnowledge: 9,
        progress: 9,
        presentation: 10,
      },
      ciaMarks: 25,
      endSemMarks: 47,
      totalMarks: 72,
      status: 'Verified',
      comments: 'Outstanding full-stack architecture, clean Next.js state management and role access control.',
      recommendation: 'Recommended for Best Departmental Project Award.'
    },
    {
      id: 'EVAL-803',
      teamId: 'TEAM-03',
      teamName: 'CodeCrafters Alpha',
      semester: '7th Semester',
      projectTitle: 'MedScan AI: Automated Radiology Triage System',
      reviewerName: 'Dr. Rajesh Iyer',
      reviewerDept: 'Computer Science',
      evaluationDate: '2026-09-25',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 10,
        technicalKnowledge: 9,
        progress: 10,
        presentation: 9,
      },
      ciaMarks: 25,
      endSemMarks: 47,
      totalMarks: 72,
      status: 'Finalized',
      comments: 'Sub-2 second DICOM scan inference demonstrated successfully. Clinical UI is intuitive.',
      recommendation: 'Proceed to IEEE paper publication submission.'
    },
    {
      id: 'EVAL-804',
      teamId: 'TEAM-04',
      teamName: 'EdgeRobotics Lab',
      semester: '7th Semester',
      projectTitle: 'Smart Agriculture Edge Sensor Network',
      reviewerName: 'Prof. Devika Nair',
      reviewerDept: 'Cybersecurity & Systems',
      evaluationDate: '2026-09-22',
      rubric: {
        problemUnderstanding: 8,
        literatureReview: 7,
        technicalKnowledge: 8,
        progress: 7,
        presentation: 8,
      },
      ciaMarks: 22,
      endSemMarks: 38,
      totalMarks: 60,
      status: 'Pending Verification',
      comments: 'LoRaWAN hardware mesh verified. Battery efficiency calculations need minor correction before final lock.',
      recommendation: 'Resubmit revised energy model calculations.'
    },
    {
      id: 'EVAL-805',
      teamId: 'TEAM-05',
      teamName: 'CyberVanguard',
      semester: '8th Semester',
      projectTitle: 'Zero-Trust IoT Device Authentication Protocol',
      reviewerName: 'Dr. Aris Thorne',
      reviewerDept: 'AI & Security Lab',
      evaluationDate: '2026-09-20',
      rubric: {
        problemUnderstanding: 9,
        literatureReview: 8,
        technicalKnowledge: 9,
        progress: 8,
        presentation: 9,
      },
      ciaMarks: 23,
      endSemMarks: 43,
      totalMarks: 66,
      status: 'Finalized',
      comments: 'Cryptographic handshake latency benchmarked under 15ms. Excellent hardware token integration.',
      recommendation: 'Approved for 8th Semester Thesis Defense.'
    }
  ];

  // Section 7: CSV Export functionality
  const handleExportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'teams') {
      csvContent += 'Team ID,Team Name,Semester,Domain,Mentor,Leader Email,Status,Progress\n';
      data.teams.forEach(t => {
        csvContent += `"${t.id}","${t.name}","${t.currentSemester || '6th Semester'}","${t.domain || 'N/A'}","${t.mentorName || 'Unassigned'}","${t.leaderEmail}","${t.status}","${t.progress}%"\n`;
      });
    } else if (type === 'marks') {
      csvContent += 'Team ID,Team Name,Mentor,CIA Total (25),EndSem Total (40),Final Total (65),Status\n';
      data.teams.forEach(t => {
        csvContent += `"${t.id}","${t.name}","${t.mentorName || 'Unassigned'}","${t.marks?.cia?.total || 25}","${t.marks?.endSem?.total || 40}","${t.marks?.totalMarks || 65}","${t.marks?.status || 'Draft'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coordinator_${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${type.toUpperCase()} CSV Report downloaded!`, 'success');
  };

  // Section 3: Handle Mentor Assignment
  const handleConfirmAssignMentor = () => {
    if (!assignMentorModalTeam || !selectedMentorIdToAssign) {
      showToast('Please select a mentor to assign.', 'error');
      return;
    }

    assignMentorToTeam(assignMentorModalTeam.id, selectedMentorIdToAssign);
    const m = data.mentors.find(x => x.id === selectedMentorIdToAssign);
    showToast(`Assigned ${m?.name || 'Mentor'} to ${assignMentorModalTeam.name}!`, 'success');
    setAssignMentorModalTeam(null);
    setSelectedMentorIdToAssign('');
  };

  // Filtered Students/Teams list according to active semester tab or search
  const filteredTeams = data.teams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (t.domain && t.domain.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (t.mentorName && t.mentorName.toLowerCase().includes(studentSearch.toLowerCase())) ||
      t.members.some(m => m.name.toLowerCase().includes(studentSearch.toLowerCase()) || m.regNo.toLowerCase().includes(studentSearch.toLowerCase()));

    let targetSem = selectedSemFilter;
    if (activeTab === 'sem6') targetSem = '6th Semester';
    else if (activeTab === 'sem7') targetSem = '7th Semester';
    else if (activeTab === 'sem8') targetSem = '8th Semester';

    const matchesSem = targetSem === 'ALL' || t.currentSemester === targetSem;
    return matchesSearch && matchesSem;
  });

  // Filtered Mentors list
  const filteredMentors = data.mentors.filter(m => {
    return (
      m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.department.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      (m.expertise && m.expertise.some(e => e.toLowerCase().includes(mentorSearch.toLowerCase())))
    );
  });

  const profile = data.coordinatorProfile;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Top Banner Greeting (Matching Student Page Aesthetics) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDAC5] via-[#FFE8D4] to-[#FFF4EC] border border-[#FF5F38]/30 rounded-3xl p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5F38] animate-pulse"></span>
              <span className="text-[#FF5F38] text-[11px] font-black uppercase tracking-widest">Coordinator Portal</span>
              <span className="text-slate-400 font-mono text-[11px] ml-1">· Academic Year 2025–2026</span>
            </div>

            <div>
              <p className="text-sm font-bold text-[#FF5F38]/70 uppercase tracking-widest mb-1">Welcome back,</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-[#111827] via-[#2d1a0e] to-[#111827] bg-clip-text text-transparent">
                  {profile.fullName}
                </span>
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF5F38]/10 border border-[#FF5F38]/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5F38]" />
                <span className="text-xs font-extrabold text-[#FF5F38]">
                  {profile.designation || 'Head of Department & Project Coordinator'}
                </span>
              </div>
            </div>

            <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-lg">
              {profile.department || 'Department of Computer Applications'} · Manage student project progress, mentor allocations, announcements, and evaluation marks across all semesters.
            </p>

          </div>

          <div className="hidden md:flex flex-shrink-0 relative mr-40">
            <div className="absolute inset-0 bg-[#FF5F38]/15 blur-3xl rounded-full scale-150" />
            <span className="text-[120px] filter drop-shadow-2xl relative z-10 animate-[bounce_3s_ease-in-out_infinite]">👨‍🏫</span>
          </div>
        </div>

        {/* Decorative background watermarks */}
        <div className="absolute top-1/2 -translate-y-1/2 right-36 text-[220px] text-[#FF5F38]/8 transform -rotate-6 pointer-events-none select-none">🏛️</div>
        <div className="absolute bottom-6 left-1/2 w-4 h-4 rounded-full bg-[#FF5F38]/20" />
        <div className="absolute top-6 right-1/3 w-2 h-2 rounded-full bg-[#FF5F38]/40" />
        <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-[#FF5F38]/5 blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER DASHBOARD                                               */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">


          {/* 3 Semester Management Cards (6th Sem, 7th Sem, 8th Sem) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 6th Semester Card */}
            <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-extrabold tracking-wider font-mono">
                    6th Semester
                  </span>
                  <span className="text-xs font-bold text-slate-400">Phase 1</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">6th Semester Projects</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Topic Selection, Domain & Proposal Review</p>
                </div>

                <div className="p-3.5 bg-[#FAF2EC] rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">108 Students (27 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Mentor Allocation:</span>
                    <span className="font-extrabold text-emerald-600">26 / 27 Assigned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">CIA Reviews Done:</span>
                    <span className="font-extrabold text-indigo-600">24 Teams Evaluated</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-emerald-600 font-mono">75% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSemFilter('6th Semester');
                  handleTabChange('students');
                }}
                className="w-full py-2.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] font-bold text-xs rounded-2xl border border-[#EADBD0] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View 6th Sem Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF5F38]" />
              </button>
            </div>

            {/* 7th Semester Card */}
            <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-extrabold tracking-wider font-mono">
                    7th Semester
                  </span>
                  <span className="text-xs font-bold text-slate-400">Phase 2</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">7th Semester Projects</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Architecture, System Design & Prototype</p>
                </div>

                <div className="p-3.5 bg-[#FAF2EC] rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">84 Students (21 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Mentor Allocation:</span>
                    <span className="font-extrabold text-emerald-600">21 / 21 Assigned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Progress Reviews:</span>
                    <span className="font-extrabold text-indigo-600">18 Demos Completed</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-emerald-600 font-mono">60% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSemFilter('7th Semester');
                  handleTabChange('students');
                }}
                className="w-full py-2.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] font-bold text-xs rounded-2xl border border-[#EADBD0] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View 7th Sem Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>

            {/* 8th Semester Card */}
            <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-extrabold tracking-wider font-mono">
                    8th Semester
                  </span>
                  <span className="text-xs font-bold text-slate-400">Final Phase</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">8th Semester Thesis</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Final Thesis, Marks Verification & Viva</p>
                </div>

                <div className="p-3.5 bg-[#FAF2EC] rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Students Enrolled:</span>
                    <span className="font-extrabold text-[#111827] font-mono">48 Students (12 Teams)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Thesis Submissions:</span>
                    <span className="font-extrabold text-emerald-600">8 / 12 Submitted</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Final Evaluation:</span>
                    <span className="font-extrabold text-emerald-600">Reviewer Marks Pending</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Milestone Progress</span>
                    <span className="text-emerald-600 font-mono">40% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSemFilter('8th Semester');
                  handleTabChange('students');
                }}
                className="w-full py-2.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] font-bold text-xs rounded-2xl border border-[#EADBD0] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View 8th Sem Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: STUDENT & TEAM MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {(activeTab === 'sem6' || activeTab === 'sem7' || activeTab === 'sem8' || activeTab === 'students') && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5F38]" />{' '}
                {activeTab === 'sem6'
                  ? '6th Semester Teams & Projects'
                  : activeTab === 'sem7'
                    ? '7th Semester Teams & Projects'
                    : activeTab === 'sem8'
                      ? '8th Semester Teams & Thesis'
                      : 'Student & Team Directory'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor student profiles, team compositions, assigned mentors, and project progress.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-bold text-slate-700">
                {filteredTeams.length} Teams Found
              </span>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, USN/Roll No, team name, domain, or mentor..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
              />
            </div>


          </div>

          {/* Teams / Students Cards Table */}
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="p-5 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] hover:bg-[#FAF2EC] transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-[#FF5F38]/15 text-[#FF5F38] rounded-full text-xs font-extrabold font-mono">
                      {team.id}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#111827]">{team.name}</h3>
                    <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[11px] font-semibold">
                      {team.currentSemester || '6th Semester'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${team.status === 'Approved' || team.status === 'In Development' || team.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#111827]">{team.projectTitle}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{team.shortDescription}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="font-semibold text-slate-400">Domain:</span> {team.domain || 'Not set'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Assigned Mentor:</span>{' '}
                      <span className="font-bold text-emerald-700">{team.mentorName || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Team Members:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.members.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-[#EADBD0] rounded-lg text-[11px] font-medium">
                          {m.name} ({m.regNo || m.email})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#111827]">Progress: {team.progress || 60}%</div>
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-[#FF5F38] h-full rounded-full" style={{ width: `${team.progress || 60}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTeamModal(team)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#111827] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FF5F38]" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: MENTOR & STAFF MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" /> Mentor & Faculty Staff Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor faculty mentor workloads, assign mentors to unassigned teams, and inspect expertise.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mentor by name or expertise..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl pl-9 pr-4 py-2 text-xs text-[#111827] focus:outline-none"
                />
              </div>
            </div>

            {/* Mentors Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMentors.map((m) => {
                const assignedTeams = data.teams.filter(t => t.mentorId === m.id || t.mentorName === m.name);
                const workloadPercent = Math.round((assignedTeams.length / m.maxTeams) * 100);

                return (
                  <div key={m.id} className="p-5 rounded-3xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0A1628] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#111827]">{m.name}</h3>
                          <p className="text-xs text-slate-500">{m.designation} • {m.department}</p>
                          <p className="text-[11px] font-mono text-slate-400">{m.email}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-mono font-bold">
                        {assignedTeams.length} / {m.maxTeams} Teams
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">Mentorship Capacity</span>
                        <span className="text-emerald-700 font-mono">{workloadPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${workloadPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Areas of Expertise:</span>{' '}
                      {m.expertise ? m.expertise.join(', ') : 'General Computer Science'}
                    </div>

                    <div className="pt-2 border-t border-[#EADBD0] text-xs space-y-1">
                      <span className="font-bold text-slate-700">Assigned Teams:</span>
                      {assignedTeams.length === 0 ? (
                        <p className="text-slate-400 italic">No teams assigned yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assignedTeams.map(t => (
                            <span key={t.id} className="px-2 py-0.5 bg-white border border-[#EADBD0] rounded-lg text-[11px] font-mono font-bold">
                              {t.name} ({t.id})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unassigned Teams & Quick Assign Modal Trigger */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#FF5F38]" /> Assign Mentor to Unassigned Teams
            </h3>

            <div className="space-y-3">
              {data.teams.filter(t => !t.mentorName || t.mentorName === 'Unassigned').length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All project teams currently have an assigned faculty mentor!</span>
                </div>
              ) : (
                data.teams.filter(t => !t.mentorName || t.mentorName === 'Unassigned').map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">{t.name} ({t.id})</h4>
                      <p className="text-[11px] text-amber-700">{t.projectTitle || 'Domain: ' + t.domain}</p>
                    </div>

                    <button
                      onClick={() => {
                        setAssignMentorModalTeam(t);
                        setSelectedMentorIdToAssign(data.mentors[0]?.id || '');
                      }}
                      className="px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Assign Mentor
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ANNOUNCEMENTS & NOTIFICATIONS SYSTEM                          */}
      {/* ========================================================================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Announcement Form */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#FF5F38]" /> Compose & Broadcast Notice
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Institutional Notice</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowPreviewModal(true); }} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6th Semester Project Progress Review Date Announced"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Target Recipients</label>
                <select
                  value={annRecipients}
                  onChange={(e) => setAnnRecipients(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="ALL">All Students & Faculty Mentors</option>
                  <option value="STUDENTS">All Students Only</option>
                  <option value="MENTORS">All Faculty Mentors Only</option>
                  <option value="SEM_6">6th Semester Students</option>
                  <option value="SEM_7">7th Semester Students</option>
                  <option value="SEM_8">8th Semester Students</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear project instructions, milestone deadlines, or submission guidelines..."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl p-3 text-xs text-[#111827] focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annSendEmail}
                    onChange={(e) => setAnnSendEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5F38]"
                  />
                  <span className="font-semibold text-slate-700">Send Email Log</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annSendInApp}
                    onChange={(e) => setAnnSendInApp(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5F38]"
                  />
                  <span className="font-semibold text-slate-700">In-App Notification</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADBD0]">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Preview Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Announcement Broadcast History */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> Announcement Broadcast Log
            </h3>

            <div className="space-y-3">
              {announcementHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#111827]">{item.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Recipients: {item.recipients}</span>
                    <span>Sent: {item.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: REVIEWS & MARKS MANAGEMENT                                    */}
      {/* ========================================================================= */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          {/* Live Reviewer Evaluations from API */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Reviewer Evaluation Marks — Live
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically synchronized from the Reviewer Portal. All submitted marks appear here in real time.
                </p>
              </div>
              {evalSummary && (
                <div className="flex gap-3">
                  {[
                    { label: 'Reviewers', val: evalSummary.totalReviewers, color: 'text-indigo-700', bg: 'bg-indigo-50' },
                    { label: 'Submitted', val: evalSummary.totalSubmitted, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Pending', val: evalSummary.totalPending, color: 'text-amber-700', bg: 'bg-amber-50' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} border border-[#EADBD0] rounded-xl px-3 py-2 text-center`}>
                      <div className={`text-lg font-black font-mono ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {evalLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : liveEvaluations.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                <p className="text-sm font-semibold">No reviewer evaluations submitted yet.</p>
                <p className="text-xs mt-1">Marks will automatically appear here once reviewers submit evaluations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveEvaluations.map(ev => {
                  const project = ev.assignment?.project;
                  const team = project?.team;
                  const members = team?.members || [];
                  const reviewer = ev.reviewer;
                  const criteriaMarks = (() => { try { return JSON.parse(ev.criteriaMarks || '{}'); } catch { return {}; } })();
                  const rubric = [
                    { key: 'projectQuality', label: 'Project Quality & Innovation', max: 20 },
                    { key: 'technicalDepth', label: 'Technical Depth & Implementation', max: 25 },
                    { key: 'documentation', label: 'Documentation & Report Quality', max: 20 },
                    { key: 'presentation', label: 'Presentation & Viva Voce', max: 20 },
                    { key: 'problemStatement', label: 'Problem Definition & Objectives', max: 15 },
                  ];

                  return (
                    <div key={ev.id} className="border border-[#EADBD0] rounded-2xl overflow-hidden">
                      {/* Header */}
                      <div className="bg-[#FAF2EC] px-5 py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-bold">
                              {project?.id?.slice(0,8).toUpperCase() || ev.projectId.slice(0,8).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">8th Sem · Final Year</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ev.isDraft ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                              {ev.isDraft ? '● Draft' : '✓ Submitted'}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-[#111827] mt-0.5">{project?.projectTitle || 'Project'}</h3>
                          <p className="text-[11px] text-slate-500">{team?.teamName} • Reviewer: {reviewer?.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-500 uppercase font-bold">Total</div>
                          <div className="text-xl font-black font-mono text-indigo-700">{ev.totalMarks}<span className="text-slate-400 text-sm">/{ev.maxTotalMarks}</span></div>
                          {ev.submittedAt && <div className="text-[11px] text-slate-400">{new Date(ev.submittedAt).toLocaleDateString('en-IN')}</div>}
                        </div>
                      </div>

                      {/* Criterion Breakdown */}
                      <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rubric.map(c => (
                          <div key={c.key} className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-slate-600 truncate flex-1">{c.label}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                                <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${((criteriaMarks[c.key] || 0) / c.max) * 100}%` }} />
                              </div>
                              <span className="font-mono font-bold text-indigo-700 text-[11px] w-10 text-right">{criteriaMarks[c.key] || 0}/{c.max}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Student Details */}
                      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                        {members.map((m, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {m.user?.name} ({m.user?.studentProfile?.rollNumber || '—'})
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Existing Mock Evaluations Table */}
          <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADBD0] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" /> Master Final Review & Evaluation Marks
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify reviewer marks, rubrics, CIA & End-Sem composite scores, and lock final evaluation grades.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={marksStatusFilter}
                  onChange={(e) => setMarksStatusFilter(e.target.value)}
                  className="bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Finalized">Finalized</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>

                <button
                  onClick={() => handleExportCSV('marks')}
                  className="px-4 py-2 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5F38]" /> Export Marks CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EADBD0] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Eval ID & Team</th>
                    <th className="py-3 px-3">Assigned Reviewer</th>
                    <th className="py-3 px-3 text-center">CIA (25)</th>
                    <th className="py-3 px-3 text-center">End-Sem (45-50)</th>
                    <th className="py-3 px-3 text-center">Total Marks</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mockEvaluationsList
                    .filter(ev => marksSemFilter === 'ALL' || ev.semester === marksSemFilter)
                    .filter(ev => marksStatusFilter === 'ALL' || ev.status === marksStatusFilter)
                    .map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#FAF2EC]/50 transition">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#FF5F38]/10 text-[#FF5F38] font-mono font-bold text-[10px] rounded">
                              {ev.id}
                            </span>
                            <span className="font-extrabold text-[#111827]">{ev.teamName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ev.projectTitle}</div>
                          <div className="text-[10px] font-bold text-slate-400 font-mono">{ev.semester}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-800">{ev.reviewerName}</div>
                          <div className="text-[11px] text-slate-400">{ev.reviewerDept}</div>
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">
                          {ev.ciaMarks} / 25
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono font-bold text-indigo-700">
                          {ev.endSemMarks}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="font-mono font-extrabold text-sm text-[#111827] bg-[#FAF2EC] px-2.5 py-1 rounded-xl border border-[#EADBD0]">
                            {ev.totalMarks}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${ev.status === 'Finalized'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.status === 'Verified'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {ev.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedEvaluationModal(ev)}
                              className="px-2.5 py-1.5 bg-[#FAF2EC] hover:bg-[#EADBD0] text-[#111827] font-bold text-[11px] rounded-xl border border-[#EADBD0] cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-[#FF5F38]" /> View Rubric
                            </button>
                            <button
                              onClick={() => updateMarksStatus(ev.teamId, 'Verified')}
                              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-[#111827] font-bold text-[11px] rounded-xl border border-[#EADBD0] shadow-xs cursor-pointer"
                            >
                              Verify 🟢
                            </button>
                            <button
                              onClick={() => updateMarksStatus(ev.teamId, 'Finalized')}
                              className="px-2.5 py-1.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-[11px] rounded-xl shadow-xs cursor-pointer"
                            >
                              Lock 🔒
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* SECTION 6: PROJECT PROGRESS TRACKING                                      */}
      {/* ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#EADBD0] pb-4">
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF5F38]" /> Centralized Project Progress Monitoring
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track project milestones, diary records, and completion percentages across all semesters.
            </p>
          </div>

          <div className="space-y-4">
            {data.teams.map((team) => (
              <div key={team.id} className="p-5 rounded-3xl bg-[#FAF2EC]/60 border border-[#EADBD0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111827]">{team.name} — {team.projectTitle}</h3>
                    <p className="text-xs text-slate-500">Mentor: {team.mentorName || 'Unassigned'} • Semester: {team.currentSemester || '6th Semester'}</p>
                  </div>

                  <span className="px-3 py-1 bg-white border border-[#EADBD0] rounded-full text-xs font-mono font-bold text-[#FF5F38]">
                    {team.progress || 65}% Completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF5F38] to-[#E54D26] h-full rounded-full transition-all" style={{ width: `${team.progress || 65}%` }} />
                </div>

                {/* Milestone Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2 text-[11px] font-bold">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">1. Proposal Accepted ✓</div>
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">2. SRS Document ✓</div>
                  <div className={`p-2 rounded-xl ${team.progress >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    3. Prototype Demo {team.progress >= 60 ? '✓' : '⏳'}
                  </div>
                  <div className={`p-2 rounded-xl ${team.progress === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    4. Final Viva & Thesis
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: REPORTS & ANALYTICS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white border border-[#EADBD0] p-4 rounded-3xl shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-[#111827]">Institutional Reports & Export Center</h3>
              <p className="text-xs text-slate-500">Generate formatted academic PDF reports or download Excel/CSV data files.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('teams')}
                className="px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Teams CSV
              </button>
            </div>
          </div>

          <ReportGenerator />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: NOTIFICATIONS & ACTIVITY CENTRE                               */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-[#EADBD0] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#EADBD0] pb-4">
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#FF5F38]" /> Real-time Institutional Activity Feed
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates on student registrations, team formations, mentor assignments, and reviewer evaluations.
            </p>
          </div>

          <div className="space-y-3">
            {data.notices.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-[#FAF2EC]/60 border border-[#EADBD0] flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#FF5F38]/15 text-[#FF5F38] shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{n.content}</p>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-3">
                    <span>Author: {n.author}</span>
                    <span>Date: {n.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PREVIEW ANNOUNCEMENT BEFORE SENDING                             */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5F38]" /> Announcement Preview
              </h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-2 text-xs">
              <div className="font-extrabold text-[#111827] text-sm">📢 {annTitle}</div>
              <div className="text-slate-700 whitespace-pre-wrap">{annMessage}</div>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-[#EADBD0] flex justify-between font-mono">
                <span>Target: {annRecipients}</span>
                <span>Channels: {annSendEmail ? 'Email' : ''} {annSendInApp ? 'In-App' : ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleSendAnnouncement}
                disabled={isSendingAnn}
                className="px-5 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingAnn ? 'Broadcasting...' : 'Confirm & Broadcast'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETAIL VIEW FOR STUDENT/TEAM PROFILE                            */}
      {/* ========================================================================= */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF5F38]">{selectedTeamModal.id}</span>
                <h3 className="text-base font-extrabold text-[#111827]">{selectedTeamModal.name} Details</h3>
              </div>
              <button onClick={() => setSelectedTeamModal(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF2EC] space-y-2">
                <div className="font-extrabold text-[#111827]">{selectedTeamModal.projectTitle || 'Project Title Not Set'}</div>
                <p className="text-slate-600 leading-relaxed">{selectedTeamModal.problemStatement || selectedTeamModal.shortDescription}</p>
                <div className="flex flex-wrap gap-4 text-slate-500 pt-1 font-semibold">
                  <span>Semester: {selectedTeamModal.currentSemester || '6th Semester'}</span>
                  <span>Domain: {selectedTeamModal.domain || 'N/A'}</span>
                  <span>Mentor: <strong className="text-emerald-700">{selectedTeamModal.mentorName || 'Unassigned'}</strong></span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#111827] mb-2">Team Roster & Members</h4>
                <div className="space-y-2">
                  {selectedTeamModal.members.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl border border-[#EADBD0] flex items-center justify-between bg-white">
                      <div>
                        <div className="font-bold text-[#111827]">{m.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{m.email} • USN: {m.regNo || '21BCA042'}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#111827] mb-2">Marks & Evaluation Overview</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.cia?.total || 25} / 25</div>
                    <div className="text-[10px] font-bold">CIA Marks</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.endSem?.total || 40} / 40</div>
                    <div className="text-[10px] font-bold">End-Sem Marks</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-800 border border-purple-100">
                    <div className="text-base font-extrabold font-mono">{selectedTeamModal.marks?.totalMarks || 65} / 65</div>
                    <div className="text-[10px] font-bold">Total Composite</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN MENTOR MODAL                                              */}
      {/* ========================================================================= */}
      {assignMentorModalTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FF5F38]" /> Assign Mentor
              </h3>
              <button onClick={() => setAssignMentorModalTeam(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Select a faculty mentor for <strong>{assignMentorModalTeam.name}</strong> ({assignMentorModalTeam.id}).
              </p>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Available Faculty Mentors</label>
                <select
                  value={selectedMentorIdToAssign}
                  onChange={(e) => setSelectedMentorIdToAssign(e.target.value)}
                  className="w-full bg-[#FAF2EC] border border-[#EADBD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  {data.mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EADBD0]">
              <button
                onClick={() => setAssignMentorModalTeam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignMentor}
                className="px-5 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EVALUATION RUBRIC BREAKDOWN MODAL                                */}
      {/* ========================================================================= */}
      {selectedEvaluationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF5F38]">{selectedEvaluationModal.id}</span>
                <h3 className="text-base font-extrabold text-[#111827]">Final Review Rubric & Score Breakdown</h3>
              </div>
              <button onClick={() => setSelectedEvaluationModal(null)} className="text-slate-400 hover:text-[#111827] font-bold text-xs cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF2EC] space-y-2 border border-[#EADBD0]">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[#111827] text-sm">{selectedEvaluationModal.teamName}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {selectedEvaluationModal.status}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{selectedEvaluationModal.projectTitle}</p>
                <div className="flex flex-wrap justify-between pt-1 text-[11px] text-slate-500 font-mono">
                  <span>Semester: <strong>{selectedEvaluationModal.semester}</strong></span>
                  <span>Reviewer: <strong>{selectedEvaluationModal.reviewerName}</strong> ({selectedEvaluationModal.reviewerDept})</span>
                </div>
              </div>

              {/* Rubric Table */}
              <div>
                <h4 className="font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#FF5F38]" /> Criterion Breakdown (Max 10 per criterion)
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-[#EADBD0] p-3 space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Problem Understanding & Need</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.problemUnderstanding} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Literature & Competitive Analysis</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.literatureReview} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Technical Depth & Code Quality</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.technicalKnowledge} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Execution & Progress Completion</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.progress} / 10</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-700 font-medium">Viva Presentation & Defense</span>
                    <span className="font-mono font-extrabold text-[#111827]">{selectedEvaluationModal.rubric.presentation} / 10</span>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <div className="text-base font-extrabold font-mono">{selectedEvaluationModal.ciaMarks} / 25</div>
                  <div className="text-[10px] font-bold">CIA Score</div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                  <div className="text-base font-extrabold font-mono">{selectedEvaluationModal.endSemMarks}</div>
                  <div className="text-[10px] font-bold">End-Sem Marks</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF2EC] text-[#111827] border border-[#EADBD0]">
                  <div className="text-base font-extrabold font-mono text-[#FF5F38]">{selectedEvaluationModal.totalMarks}</div>
                  <div className="text-[10px] font-bold">Composite Total</div>
                </div>
              </div>

              {/* Reviewer Feedback & Recommendation */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-extrabold block">Reviewer Feedback Remarks:</span>
                  <p className="italic font-medium">"{selectedEvaluationModal.comments}"</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-extrabold block">Official Recommendation:</span>
                  <p className="font-semibold">{selectedEvaluationModal.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EADBD0]">
              <button
                onClick={() => setSelectedEvaluationModal(null)}
                className="px-5 py-2 bg-[#0A1628] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Close Rubric
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
