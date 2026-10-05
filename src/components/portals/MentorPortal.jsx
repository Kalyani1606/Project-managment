import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import {
  User,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Lock,
  Calendar,
  Clock,
  ChevronRight,
  ChevronDown,
  Target,
  FileText,
  AlertCircle,
  TrendingUp,
  Check,
  CheckCheck,
  Send,
  Award,
  Upload,
  Layers,
  Sparkles,
  Search,
  Filter,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  GraduationCap,
  Menu,
  X,
  Home,
  LogOut,
  Bell,
  ChevronLeft
} from 'lucide-react';

const PROJECT_STAGES = [
  'Project Selection',
  'Problem Identification',
  'Research & SRS',
  'Planning & Architecture',
  'Design & Prototype',
  'Development',
  'Testing & QA',
  'Documentation',
  'Final Presentation',
  'Final Submission'
];

const SEMESTERS_CONFIG = [
  {
    id: '6th Semester',
    badgeNum: '01',
    badgeBg: 'bg-[#FF5F38]/10 text-[#FF5F38]',
    glowBg: 'bg-yellow-400/20',
    emoji: '📚',
    title: '6th Semester',
    subtitle: 'Approvals & Feasibility',
    description: 'Review incoming team requests, approve project domains, and validate problem statements and literature surveys.'
  },
  {
    id: '7th Semester',
    badgeNum: '02',
    badgeBg: 'bg-slate-100 text-slate-600',
    glowBg: 'bg-blue-400/15',
    emoji: '💻',
    title: '7th Semester',
    subtitle: 'Tracking & Guidance',
    description: 'Monitor development progress, evaluate system architecture, and conduct mid-term technical reviews.'
  },
  {
    id: '8th Semester',
    badgeNum: '03',
    badgeBg: 'bg-slate-100 text-slate-600',
    glowBg: 'bg-[#FF5F38]/15',
    emoji: '🚀',
    title: '8th Semester',
    subtitle: 'Evaluation & Sign-off',
    description: 'Assess final performance metrics, grade viva presentations, and formally approve the project thesis.'
  }
];

export default function MentorPortal() {
  const {
    data,
    respondToMentorRequest,
    addComprehensiveReviewDiaryEntry,
    updateProjectProgress,
    addMentorTaskToTeam,
    updateMentorTaskStatus,
    uploadTeamProjectDocument,
    updateMentorProfile,
    markNotificationRead,
    clearAllNotifications,
    approveStudentReviewLog,
    approveProjectProgressUpdate,
    rejectProjectProgressUpdate
  } = useApp();

  const { user, logout } = useAuth();

  // Safely hook into NotificationContext if available
  let notificationCtx = null;
  try {
    notificationCtx = useNotification();
  } catch (e) {
    // fallback if outside NotificationProvider
  }

  // Exact details entered while registering (Full Name, Email, Dept, Designation, Role - nothing extra)
  const profile = {
    fullName: user?.name || data.mentorProfile?.fullName || 'Faculty Mentor',
    email: user?.email || data.mentorProfile?.email || 'faculty.mentor@college.edu',
    department: user?.teacherProfile?.department || data.mentorProfile?.department || 'Computer Science & Engineering',
    designation: user?.teacherProfile?.designation || data.mentorProfile?.designation || 'Assistant Professor',
    role: user?.role === 'TEACHER' ? 'Faculty Mentor' : (user?.role || 'Faculty Mentor'),
    employeeId: user?.teacherProfile?.designation || data.mentorProfile?.employeeId || 'EMP-FACULTY',
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(data.teams[0]?.id || '');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showTeamDiaryModal, setShowTeamDiaryModal] = useState(false);
  const [showTeamDocsModal, setShowTeamDocsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressRemarks, setProgressRemarks] = useState('');
  const [evaluatingEntry, setEvaluatingEntry] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Top Corner Small Window Dropdowns
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifTab, setNotifTab] = useState('requests'); // 'requests' | 'alerts'
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setShowProfileDropdown(false);
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Search & Filter
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('ALL');

  // Selected Team Object & Pending Student Requests
  const assignedTeams = data.teams.filter(t => t.mentorStatus === 'Accepted' || t.mentorId === 'MENTOR-01');
  const pendingRequests = data.teams.filter(t => t.mentorStatus === 'Pending' || t.status === 'Pending Approval');

  // Combine notifications from API and local AppContext
  const apiNotifications = notificationCtx?.notifications || [];
  const localNotifications = (data.notifications || []).map(n => ({
    id: n.id,
    title: n.text?.split(':')[0] || 'Portal Update',
    message: n.text || '',
    time: n.time || 'Recently',
    read: n.read || false,
    isApi: false
  }));

  const allAlerts = [
    ...apiNotifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: n.read,
      isApi: true
    })),
    ...localNotifications
  ];

  const unreadAlertsCount = allAlerts.filter(a => !a.read).length;
  const totalNotificationBadge = pendingRequests.length + unreadAlertsCount;

  const handleMarkSingleRead = (id, isApi) => {
    if (isApi && notificationCtx?.markAsRead) {
      notificationCtx.markAsRead(id);
    } else if (markNotificationRead) {
      markNotificationRead(id);
    }
  };

  const handleMarkAllRead = () => {
    if (notificationCtx?.markAllAsRead) {
      notificationCtx.markAllAsRead();
    }
    if (clearAllNotifications) {
      clearAllNotifications();
    }
  };
  
  // Filtered Teams based on selected semester, search query, and stage
  const filteredTeams = assignedTeams.filter(t => {
    const matchesSemester = !selectedSemester || selectedSemester === 'All' || t.currentSemester === selectedSemester;
    const matchesSearch =
      t.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      (t.projectTitle || '').toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      t.members.some(m => m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) || (m.regNo || '').toLowerCase().includes(teamSearchQuery.toLowerCase()));
    const matchesStage = stageFilter === 'All' || t.currentStage === stageFilter;
    return matchesSemester && matchesSearch && matchesStage;
  });

  const currentTeam = filteredTeams.find(t => t.id === selectedTeamId) || filteredTeams[0] || assignedTeams[0] || data.teams[0];

  // Real-time 5-Step 6th Semester Progress Calculation
  const getTeamSetupSteps = (team) => {
    if (!team) return [];
    return [
      { id: 1, title: 'Create Team', isDone: !!team.name, detail: team.name ? `${team.name} (${team.id})` : 'Not created' },
      { id: 2, title: 'Add Members', isDone: (team.members || []).length >= 2, detail: `${(team.members || []).length} Member(s)` },
      { id: 3, title: 'Select Mentor', isDone: !!team.mentorId || team.mentorStatus === 'Accepted', detail: team.mentorName || 'Pending Selection' },
      { id: 4, title: 'Domain & Topic', isDone: !!team.domain && !!team.projectTitle, detail: team.domain ? `${team.domain}` : 'Not Defined' },
      { id: 5, title: '5 Research Papers', isDone: (team.researchPapers || []).length >= 5, detail: `${(team.researchPapers || []).length}/5 Uploaded` }
    ];
  };

  const getTeamProgressPercentage = (team) => {
    const steps = getTeamSetupSteps(team);
    if (!steps.length) return 0;
    const completed = steps.filter(s => s.isDone).length;
    return Math.round((completed / steps.length) * 100);
  };

  // Approval Form State (Teacher evaluates & approves student submissions)
  const [approvalForm, setApprovalForm] = useState({
    mentorObservations: 'Verified by mentor. Project logs match the work demonstrated.',
    mentorFeedback: 'Student review submitted log is accepted and recorded in the official project diary.',
    improvementsSuggested: '',
    nextReviewDate: '',
    tasks: [{ task: '', student: '', deadline: '' }]
  });

  const openEvaluationModal = (entry) => {
    setEvaluatingEntry(entry);
    setApprovalForm({
      mentorObservations: entry.mentorObservations || 'Verified by mentor. Project logs match the work demonstrated.',
      mentorFeedback: entry.mentorFeedback || 'Student review submitted log is accepted and recorded in the official project diary.',
      improvementsSuggested: entry.improvementsSuggested || '',
      nextReviewDate: entry.nextReviewDate || '',
      tasks: (entry.tasksGivenList && entry.tasksGivenList.length > 0)
        ? entry.tasksGivenList
        : [{ task: '', student: '', deadline: '' }]
    });
  };

  const handleApproveWithFeedback = (e) => {
    e.preventDefault();
    if (!evaluatingEntry) return;

    approveStudentReviewLog(evaluatingEntry.id, {
      mentorObservations: approvalForm.mentorObservations,
      mentorFeedback: approvalForm.mentorFeedback,
      improvementsSuggested: approvalForm.improvementsSuggested,
      nextReviewDate: approvalForm.nextReviewDate,
      tasksGivenList: approvalForm.tasks.filter(t => t.task && t.task.trim() !== ''),
      mentorName: profile.fullName
    });

    setEvaluatingEntry(null);
  };

  // Document Form State
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    type: 'Progress Report',
    reviewId: 'General',
    size: '2.5 MB'
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ ...profile });

  const handleDocSubmit = (e) => {
    e.preventDefault();
    if (!currentTeam || !newDocForm.title) return;
    uploadTeamProjectDocument(currentTeam.id, {
      title: newDocForm.title,
      type: newDocForm.type,
      reviewId: newDocForm.reviewId,
      size: newDocForm.size
    });
    setNewDocForm({ title: '', type: 'Progress Report', reviewId: 'General', size: '2.5 MB' });
    setShowDocModal(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateMentorProfile(profileForm);
    setEditingProfile(false);
  };

  const sidebarNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'teams', name: 'My Teams', count: assignedTeams.length, icon: Users },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-sans selection:bg-[#FF5F38] selection:text-white flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR PANEL                                                        */}
      {/* ========================================================================= */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#FAF2EC] border-r border-[#EADBD0] flex flex-col transition-transform duration-300 transform md:translate-x-0 md:static ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Brand & Mobile Close */}
        <div className="p-6 flex items-center justify-between border-b border-[#EADBD0]">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black tracking-tight text-[#111827] leading-none">
              PROJECT<br />HUB<span className="text-[#FF5F38]">.</span>
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-wider bg-[#FF5F38]/15 text-[#FF5F38] px-3 py-1 rounded-full mt-3 self-start">
              Mentor Portal
            </span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-2 text-slate-500 hover:text-black rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mentor Mini Badge */}
        <div 
          onClick={() => {
            setShowProfileDropdown(prev => !prev);
            setShowNotificationDropdown(false);
          }}
          className="p-4 mx-4 my-4 rounded-2xl bg-white border border-[#EADBD0] flex items-center gap-3 shadow-xs cursor-pointer hover:border-[#FF5F38]/50 transition group"
          title="Click to view registration details"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform">
            {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#111827] truncate">{profile.fullName}</div>
            <div className="text-[10px] text-slate-500 font-mono truncate">{profile.designation}</div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {sidebarNavItems.map(item => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    setShowProfileDropdown(true);
                    setShowNotificationDropdown(false);
                    setMobileSidebarOpen(false);
                    return;
                  }
                  if (item.id === 'teams') {
                    setSelectedSemester(null);
                  }
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20'
                    : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.count !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FF5F38]/15 text-[#FF5F38]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EADBD0] flex flex-col gap-2">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Logout</span>
          </button>
          <div className="text-[10px] text-slate-400 font-mono text-center">
            Project Supervision System v2.4
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header Bar for Mobile & Search */}
        <header className="sticky top-0 z-30 bg-[#FAF2EC]/95 backdrop-blur-md py-4 px-4 sm:px-8 border-b border-[#EADBD0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-700 bg-white border border-[#EADBD0] rounded-xl shadow-xs"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#111827]">
                {sidebarNavItems.find(i => i.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Academic Project Supervision & Diary System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">


            {/* Top Corner Notification Icon & Dropdown Window */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotificationDropdown(prev => !prev);
                  setShowProfileDropdown(false);
                }}
                className={`relative p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                  showNotificationDropdown
                    ? 'bg-[#FF5F38] text-white border-[#FF5F38] shadow-md shadow-[#FF5F38]/25'
                    : 'bg-white hover:bg-white/90 border-[#EADBD0] text-slate-700 hover:text-[#FF5F38] shadow-xs'
                }`}
                title="Notifications & Student Requests"
                aria-label="Notifications"
              >
                <Bell className={`w-4 h-4 ${showNotificationDropdown ? 'text-white' : 'text-[#111827]'}`} />
                {totalNotificationBadge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#FF5F38] text-white text-[10px] font-black flex items-center justify-center shadow-xs border-2 border-[#FAF2EC] animate-pulse">
                    {totalNotificationBadge > 9 ? '9+' : totalNotificationBadge}
                  </span>
                )}
              </button>

              {/* Notification Small Window */}
              {showNotificationDropdown && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#EADBD0] rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="p-4 bg-[#FAF2EC] border-b border-[#EADBD0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#111827]">Notifications & Requests</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Student supervision & alerts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadAlertsCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-[#FF5F38] hover:underline px-2 py-1 cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotificationDropdown(false)}
                        className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex p-1.5 bg-[#FAF2EC]/60 border-b border-[#EADBD0] gap-1">
                    <button
                      type="button"
                      onClick={() => setNotifTab('requests')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        notifTab === 'requests'
                          ? 'bg-white text-[#111827] shadow-xs border border-[#EADBD0]'
                          : 'text-slate-500 hover:text-[#111827]'
                      }`}
                    >
                      <span>Student Requests</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        pendingRequests.length > 0 ? 'bg-[#FF5F38] text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {pendingRequests.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifTab('alerts')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        notifTab === 'alerts'
                          ? 'bg-white text-[#111827] shadow-xs border border-[#EADBD0]'
                          : 'text-slate-500 hover:text-[#111827]'
                      }`}
                    >
                      <span>All Alerts</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        unreadAlertsCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {allAlerts.length}
                      </span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="max-h-[360px] overflow-y-auto p-3 space-y-2.5">
                    {notifTab === 'requests' ? (
                      pendingRequests.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                          <p className="text-xs font-semibold text-slate-600">No pending student requests</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">When students send supervision requests, they will appear here.</p>
                        </div>
                      ) : (
                        pendingRequests.map(team => (
                          <div
                            key={team.id}
                            className="p-3.5 rounded-2xl bg-[#FAF2EC]/70 border border-amber-200 hover:border-amber-300 transition space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                  {team.id}
                                </span>
                                <h5 className="text-xs font-black text-[#111827] mt-1">{team.name}</h5>
                                <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                                  {team.projectTitle || team.domain || 'Academic Project Supervision'}
                                </p>
                              </div>
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                                Pending
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-500">
                              <span className="font-semibold text-slate-600">Students: </span>
                              {team.members?.map(m => m.name).join(', ') || 'Team Members'}
                            </div>

                            <div className="pt-2 border-t border-[#EADBD0]/60 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => respondToMentorRequest(team.id, true)}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-[#0B2E26] hover:bg-[#071f1a] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer transition"
                              >
                                <Check className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => respondToMentorRequest(team.id, false)}
                                className="py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                              >
                                <X className="w-3.5 h-3.5" /> Decline
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      allAlerts.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                          <p className="text-xs font-semibold text-slate-600">No alerts right now</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Diary submissions, document uploads, and updates will show up here.</p>
                        </div>
                      ) : (
                        allAlerts.map(alert => (
                          <div
                            key={alert.id}
                            onClick={() => handleMarkSingleRead(alert.id, alert.isApi)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                              alert.read
                                ? 'bg-white border-[#EADBD0]/60 opacity-70 hover:opacity-100'
                                : 'bg-[#FF5F38]/5 border-[#FF5F38]/20 shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 min-w-0">
                                <div
                                  className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#FF5F38]"
                                  style={{ opacity: alert.read ? 0 : 1 }}
                                />
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-[#111827] leading-snug">{alert.title}</h5>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{alert.message}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 shrink-0">{alert.time}</span>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-[#FAF2EC]/50 border-t border-[#EADBD0] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F38] animate-pulse"></span>
                      <span>{pendingRequests.length} pending request{pendingRequests.length === 1 ? '' : 's'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Live updates</span>
                  </div>
                </div>
              )}
            </div>

            {/* Top Corner Profile Option & Small Window */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(prev => !prev);
                  setShowNotificationDropdown(false);
                }}
                className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl border transition-all cursor-pointer ${
                  showProfileDropdown
                    ? 'bg-white border-[#FF5F38] shadow-md ring-2 ring-[#FF5F38]/10'
                    : 'bg-white hover:bg-white/90 border-[#EADBD0] shadow-xs'
                }`}
                title="Faculty Profile & Registration Details"
                aria-label="Faculty Profile"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  {profile.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#111827] leading-tight max-w-[120px] truncate">
                    {profile.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium leading-tight max-w-[120px] truncate">
                    {profile.designation}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Small Window (Details entered while registering, nothing extra) */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-12 w-80 sm:w-88 bg-white border border-[#EADBD0] rounded-3xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-150">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#EADBD0]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-black text-base shadow-xs">
                        {profile.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M'}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#111827] leading-tight">{profile.fullName}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Faculty Mentor
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileDropdown(false)}
                      className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#FAF2EC] transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Registered Details (Name, Email, Dept, Designation, Role) */}
                  <div className="py-3.5 space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF2EC]/70 border border-[#EADBD0]/60">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#FF5F38] shadow-xs shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</div>
                        <div className="text-xs font-extrabold text-[#111827] truncate">{profile.fullName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF2EC]/70 border border-[#EADBD0]/60">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#FF5F38] shadow-xs shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Faculty Email</div>
                        <div className="text-xs font-bold text-[#111827] truncate font-mono">{profile.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF2EC]/70 border border-[#EADBD0]/60">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#FF5F38] shadow-xs shrink-0">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Department</div>
                        <div className="text-xs font-bold text-[#111827] truncate">{profile.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF2EC]/70 border border-[#EADBD0]/60">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#FF5F38] shadow-xs shrink-0">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Designation</div>
                        <div className="text-xs font-bold text-[#111827] truncate">{profile.designation}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF2EC]/70 border border-[#EADBD0]/60">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#FF5F38] shadow-xs shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role</div>
                        <div className="text-xs font-bold text-[#111827]">{profile.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Sign Out */}
                  <div className="pt-3 border-t border-[#EADBD0] flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Registration Details</span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6">
          
          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-[#EADBD0] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Assigned Student Teams</div>
                    <div className="text-2xl font-black text-[#111827] font-mono">{assignedTeams.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2E26]/10 text-[#0B2E26] flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#EADBD0] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Total Mentees</div>
                    <div className="text-2xl font-black text-[#111827] font-mono">
                      {assignedTeams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5F38]/10 text-[#FF5F38] flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#EADBD0] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Official Diary Reviews</div>
                    <div className="text-2xl font-black text-[#111827] font-mono">{data.projectDiary.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Recent Activity & Quick Reminders Section */}
              <div className="bg-white p-6 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#FF5F38]" /> Recent Activity & Reminders
                    </h2>
                    <p className="text-xs text-slate-500">
                      Stay updated with the latest submissions and upcoming mentor duties.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Activity Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Latest Project Updates
                    </h3>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#EADBD0] before:to-transparent">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#FAF2EC] text-[#FF5F38] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-2xl bg-[#FAF2EC]/50 border border-[#EADBD0] hover:border-[#FF5F38]/30 transition-colors shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-[#FF5F38]">Team #0{idx + 1}</span>
                              <span className="text-[9px] text-slate-400 font-mono">2 hrs ago</span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium">Uploaded Draft SRS Document for review.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Quick Reminders / Upcoming */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Upcoming Deadlines
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 items-start shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-amber-900">Mid-Term Presentation Evaluation</h4>
                          <p className="text-[10px] text-amber-700 mt-1">Due in 3 days. Ensure all teams have submitted their presentation decks.</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex gap-3 items-start shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-blue-900">Review Synopsis (Team 04)</h4>
                          <p className="text-[10px] text-blue-700 mt-1">Pending review. Student is waiting for mentor feedback.</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3 items-start shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-emerald-900">Finalize Problem Statements</h4>
                          <p className="text-[10px] text-emerald-700 mt-1">Due next week for 6th Semester batches.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2A. MY TEAMS TAB - OVERVIEW (ONLY THE 3 SEMESTER CARDS) */}
          {activeTab === 'teams' && !selectedSemester && (
            <div className="space-y-6">
              
              {/* Header Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h2 className="text-2xl font-black text-[#111827]">Academic Project Semesters</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select a semester below to view assigned project teams, mentees, and supervisory records.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white border border-[#EADBD0] text-slate-700 shadow-xs flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#FF5F38]" />
                    <span>Total {assignedTeams.length} Assigned Teams</span>
                  </span>
                </div>
              </div>

              {/* Semester Cards Grid (ONLY the 3 cards here) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {SEMESTERS_CONFIG.map(sem => {
                  const semTeams = assignedTeams.filter(t => t.currentSemester === sem.id);
                  const totalStudents = semTeams.reduce((acc, t) => acc + (t.members?.length || 0), 0);

                  return (
                    <div
                      key={sem.id}
                      onClick={() => {
                        setSelectedSemester(sem.id);
                        setSelectedTeamId(null);
                      }}
                      className="bg-white rounded-3xl p-7 flex flex-col relative overflow-hidden transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-xl hover:-translate-y-1.5 group"
                    >
                      {/* Number Badge Top Left */}
                      <div className={`absolute top-6 left-6 px-3 py-1 font-black text-sm rounded-lg ${sem.badgeBg}`}>
                        {sem.badgeNum}
                      </div>

                      {/* Assigned Count Badge Top Right */}
                      <div className="absolute top-6 right-6 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAF2EC] text-slate-700 border border-[#EADBD0]">
                        <Users className="w-3.5 h-3.5 text-[#FF5F38]" />
                        <span>{semTeams.length} {semTeams.length === 1 ? 'Team' : 'Teams'} ({totalStudents} Students)</span>
                      </div>

                      {/* Center Graphic with Glow */}
                      <div className="flex justify-center mt-10 mb-6 relative">
                        <div className={`absolute inset-0 blur-2xl rounded-full ${sem.glowBg} transform scale-125`} />
                        <span className="text-[85px] filter drop-shadow-lg relative z-10 duration-300 group-hover:scale-110 select-none transition-transform">
                          {sem.emoji}
                        </span>
                      </div>

                      {/* Title, Subtitle, Description */}
                      <div className="flex-1 space-y-2 text-left">
                        <h3 className="text-xl font-black text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                          {sem.title}
                        </h3>
                        <p className="text-sm font-bold text-slate-500">{sem.subtitle}</p>
                        <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                          {sem.description}
                        </p>
                      </div>

                      {/* Bottom Button / Indicator */}
                      <div className="mt-6 pt-4 border-t border-[#EADBD0]/60 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-[#FF5F38] transition-colors">
                        <span>Click to view {sem.title} teams</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF5F38]/10 text-[#FF5F38] group-hover:bg-[#FF5F38] group-hover:text-white transition-all shadow-xs">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2B. DETAILED TEAMS & STUDENTS VIEW FOR THE SELECTED SEMESTER */}
          {activeTab === 'teams' && selectedSemester && (
            <div className="space-y-6">
              
              {/* Header Navigation Bar with "← Back to Semesters" */}
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#EADBD0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedSemester(null)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FAF2EC] hover:bg-[#FF5F38] hover:text-white text-[#111827] text-xs font-extrabold transition-all cursor-pointer group shadow-xs border border-[#EADBD0]"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FF5F38] group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                    <span>Back to Semesters</span>
                  </button>

                  <div className="h-6 w-[1px] bg-[#EADBD0] hidden sm:block" />

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-bold text-xs shadow-xs">
                      {selectedSemester.replace(' Semester', '')}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#111827]">
                        {selectedSemester} Assigned Teams & Students
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'} assigned • {filteredTeams.reduce((sum, t) => sum + (t.members?.length || 0), 0)} student mentees
                      </p>
                    </div>
                  </div>
                </div>


              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-3xl border border-[#EADBD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search teams by name, topic or student USN..."
                    value={teamSearchQuery}
                    onChange={e => setTeamSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl text-xs focus:outline-none focus:border-[#FF5F38]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search teams or USN..."
                      value={teamSearchQuery}
                      onChange={e => setTeamSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl text-xs focus:outline-none focus:border-[#FF5F38]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={stageFilter}
                      onChange={e => setStageFilter(e.target.value)}
                      className="px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-2xl text-xs text-slate-700 font-medium focus:outline-none"
                    >
                      <option value="All">All Stages</option>
                      {PROJECT_STAGES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Teams List / Detail View */}
              <div className="w-full">
                {selectedTeamId && currentTeam ? (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-2">
                      <button 
                        onClick={() => setSelectedTeamId(null)}
                        className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#FF5F38] transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back to Teams
                      </button>
                    </div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#FF5F38] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                            {currentTeam.id}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs px-2.5 py-0.5 rounded-full">
                            {currentTeam.currentSemester || selectedSemester}
                          </span>
                          <span className="text-xs font-bold text-slate-500">Team Leader: {currentTeam.members.find(m=>m.role==='Team Leader')?.name || currentTeam.members[0]?.name}</span>
                        </div>
                        <h2 className="text-2xl font-black text-[#111827]">{currentTeam.name}</h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowProgressModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1628] hover:bg-[#152338] text-white text-xs font-extrabold rounded-2xl shadow-md transition-all cursor-pointer"
                        >
                          <TrendingUp className="w-4 h-4 text-[#FF5F38]" />
                          <span>View Progress</span>
                          <span className="bg-[#FF5F38] text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                            {getTeamProgressPercentage(currentTeam)}%
                          </span>
                          {getTeamProgressPercentage(currentTeam) === 100 && (
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              ✓ 100%
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowTeamDocsModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B2E26] hover:bg-[#071f1a] text-white text-xs font-extrabold rounded-2xl shadow-md shadow-[#0B2E26]/20 transition-all cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Documents</span>
                          {(currentTeam.documents || []).length > 0 && (
                            <span className="bg-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                              {(currentTeam.documents || []).length}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowTeamDiaryModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-extrabold rounded-2xl shadow-md shadow-[#FF5F38]/20 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>View Project Diary</span>
                          {data.projectDiary.filter(d => d.teamId === currentTeam.id).length > 0 && (
                            <span className="bg-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                              {data.projectDiary.filter(d => d.teamId === currentTeam.id).length}
                            </span>
                          )}
                          {data.projectDiary.some(d => d.teamId === currentTeam.id && d.status === 'Pending') && (
                            <span className="bg-amber-300 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                              Pending Evaluation
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Replicated Student Final View */}
                    <div className="space-y-4 pt-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                             <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Team & Mentor</h3>
                             <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Team ID:</span> {currentTeam.id}</p>
                             <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Name:</span> {currentTeam.name}</p>
                             <p className="text-sm font-semibold text-[#111827] mt-3 pt-3 border-t border-[#EADBD0]"><span className="text-slate-500 font-medium">Mentor:</span> {currentTeam.mentorName || "Pending Setup"}</p>
                          </div>
                          <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                             <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Domain & Topic</h3>
                             <p className="text-sm font-semibold text-[#111827] mb-1"><span className="text-slate-500 font-medium">Domain:</span> {currentTeam.domain || "Not Selected"}</p>
                             <p className="text-sm font-semibold text-[#111827] mt-2 leading-relaxed"><span className="text-slate-500 font-medium">Topic:</span> {currentTeam.projectTitle || "Not Selected"}</p>
                          </div>
                       </div>
                       <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                           <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Members ({currentTeam.members?.length || 0})</h3>
                           <div className="flex flex-wrap gap-2">
                              {currentTeam.members?.map((m, idx) => (
                                 <span key={idx} className="text-xs font-bold bg-white border border-[#EADBD0] text-slate-700 px-3 py-1.5 rounded-lg">{m.name}</span>
                              ))}
                           </div>
                       </div>
                       <div className="bg-[#FAF2EC] p-5 rounded-2xl border border-[#EADBD0]">
                           <h3 className="text-xs font-bold text-[#FF5F38] mb-3 uppercase tracking-wider">Literature Survey ({(currentTeam.researchPapers || []).length} Papers)</h3>
                           {(currentTeam.researchPapers && currentTeam.researchPapers.length > 0) ? (
                             <div className="overflow-x-auto bg-white rounded-xl border border-[#EADBD0] p-1">
                               <table className="w-full text-left text-xs border-collapse">
                                 <thead>
                                   <tr className="border-b border-[#EADBD0] text-slate-500 bg-slate-50/50">
                                     <th className="py-2 px-3">No.</th>
                                     <th className="py-2 px-3">Paper Title</th>
                                     <th className="py-2 px-3">Author(s)</th>
                                     <th className="py-2 px-3">Publication / Journal</th>
                                     <th className="py-2 px-3">Year</th>
                                   </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                   {currentTeam.researchPapers.map((paper, idx) => (
                                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                       <td className="py-2.5 px-3 font-bold text-[#FF5F38]">{idx + 1}</td>
                                       <td className="py-2.5 px-3 font-bold text-slate-800">{paper.title}</td>
                                       <td className="py-2.5 px-3 text-slate-600">{paper.authors}</td>
                                       <td className="py-2.5 px-3 text-slate-500">{paper.publication}</td>
                                       <td className="py-2.5 px-3 font-mono font-medium text-slate-500">{paper.year}</td>
                                     </tr>
                                   ))}
                                 </tbody>
                               </table>
                             </div>
                           ) : (
                             <div className="text-center py-4 bg-white rounded-xl border border-[#EADBD0] text-slate-400 text-xs font-medium">
                               No papers uploaded yet
                             </div>
                           )}
                       </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
                      {selectedSemester} Teams ({filteredTeams.length})
                    </h3>
                    
                    {filteredTeams.length === 0 ? (
                      <div className="bg-white p-8 rounded-3xl border border-[#EADBD0] text-center space-y-2">
                        <Users className="w-8 h-8 mx-auto text-slate-300" />
                        <div className="text-xs font-bold text-slate-600">No teams assigned for {selectedSemester}</div>
                        <p className="text-[10px] text-slate-400">Clear search query or select another semester</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTeams.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTeamId(t.id)}
                            className="text-left p-5 rounded-3xl bg-white border border-[#EADBD0] hover:border-[#FF5F38] hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                          >
                            <div className="font-extrabold text-[#111827] mb-auto group-hover:text-[#FF5F38] transition-colors">{t.name}</div>
                            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-3 border-t border-[#EADBD0] pt-3">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">Leader: {t.members.find(m=>m.role==='Team Leader')?.name || t.members[0]?.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}










          {/* 8. MENTOR PROFILE TAB (Registration Details) */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-black text-lg shadow-xs">
                    {profile.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M'}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#111827]">{profile.fullName}</h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Faculty Mentor
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Full Name</span>
                  <span className="font-extrabold text-[#111827]">{profile.fullName}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Faculty Email</span>
                  <span className="font-bold text-[#111827] font-mono">{profile.email}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Department</span>
                  <span className="font-bold text-[#111827]">{profile.department}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Designation</span>
                  <span className="font-bold text-[#111827]">{profile.designation}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Role</span>
                  <span className="font-bold text-[#111827]">{profile.role}</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD COMPREHENSIVE PROJECT DIARY REVIEW ENTRY                        */}
      {/* ========================================================================= */}
      {showReviewModal && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#111827]">
                  New Official Project Review Entry — {currentTeam.name}
                </h3>
                <p className="text-xs text-slate-500">Record attendance, demonstrated progress, mentor feedback & assigned tasks</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Number</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.reviewNumber}
                    onChange={e => setReviewForm({ ...reviewForm, reviewNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Date</label>
                  <input
                    type="date"
                    required
                    value={reviewForm.date}
                    onChange={e => setReviewForm({ ...reviewForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Next Review Date</label>
                  <input
                    type="date"
                    value={reviewForm.nextReviewDate}
                    onChange={e => setReviewForm({ ...reviewForm, nextReviewDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* Student Attendance Section */}
              <div className="space-y-2 pt-2 border-t border-[#EADBD0]">
                <label className="block font-extrabold text-slate-800">Record Student Attendance</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTeam.members.map(m => {
                    const status = reviewForm.attendanceMap[m.name] || 'Present';
                    return (
                      <div key={m.regNo} className="p-3 bg-[#FAF2EC] rounded-2xl border border-[#EADBD0] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{m.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">USN: {m.regNo}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setReviewForm({
                              ...reviewForm,
                              attendanceMap: { ...reviewForm.attendanceMap, [m.name]: 'Present' }
                            })}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer ${
                              status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewForm({
                              ...reviewForm,
                              attendanceMap: { ...reviewForm.attendanceMap, [m.name]: 'Absent' }
                            })}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer ${
                              status === 'Absent' ? 'bg-red-600 text-white' : 'bg-white border text-slate-600'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Work Completed & Demonstrated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Completed Since Last Review</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Students completed database setup and authentication modules."
                    value={reviewForm.workCompleted}
                    onChange={e => setReviewForm({ ...reviewForm, workCompleted: e.target.value })}
                    className="w-full p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Demonstrated by Students</label>
                  <textarea
                    rows="3"
                    placeholder="Demonstrated user login, dashboard rendering and API calls."
                    value={reviewForm.workDemonstrated}
                    onChange={e => setReviewForm({ ...reviewForm, workDemonstrated: e.target.value })}
                    className="w-full p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Progress & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={reviewForm.progressPercent}
                    onChange={e => setReviewForm({ ...reviewForm, progressPercent: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Project Stage</label>
                  <select
                    value={reviewForm.stage}
                    onChange={e => setReviewForm({ ...reviewForm, stage: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-bold"
                  >
                    {PROJECT_STAGES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mentor Observations & Feedback */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Problems & Challenges Faced by Students</label>
                <input
                  type="text"
                  placeholder="Students are facing issues with API exception handling."
                  value={reviewForm.problemsFaced}
                  onChange={e => setReviewForm({ ...reviewForm, problemsFaced: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Observations</label>
                <input
                  type="text"
                  placeholder="Authentication module is working, but error handling needs improvement."
                  value={reviewForm.mentorObservations}
                  onChange={e => setReviewForm({ ...reviewForm, mentorObservations: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-extrabold text-[#0B2E26] mb-1">Official Mentor Feedback & Instructions</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Complete the dashboard and improve API error handling before the next review."
                  value={reviewForm.mentorFeedback}
                  onChange={e => setReviewForm({ ...reviewForm, mentorFeedback: e.target.value })}
                  className="w-full p-3 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                />
              </div>

              {/* Tasks Given Table */}
              <div className="space-y-2 pt-2 border-t border-[#EADBD0]">
                <div className="flex items-center justify-between">
                  <label className="block font-extrabold text-slate-800">Tasks Given to Students</label>
                  <button
                    type="button"
                    onClick={() => setReviewForm({
                      ...reviewForm,
                      tasks: [...reviewForm.tasks, { task: '', student: currentTeam.members[0]?.name || '', deadline: '' }]
                    })}
                    className="text-xs font-bold text-[#FF5F38] hover:underline cursor-pointer"
                  >
                    + Add Task Row
                  </button>
                </div>

                {reviewForm.tasks.map((tk, tIdx) => (
                  <div key={tIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Task description (e.g. Complete dashboard UI)"
                      value={tk.task}
                      onChange={e => {
                        const copy = [...reviewForm.tasks];
                        copy[tIdx].task = e.target.value;
                        setReviewForm({ ...reviewForm, tasks: copy });
                      }}
                      className="px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs"
                    />
                    <select
                      value={tk.student}
                      onChange={e => {
                        const copy = [...reviewForm.tasks];
                        copy[tIdx].student = e.target.value;
                        setReviewForm({ ...reviewForm, tasks: copy });
                      }}
                      className="px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs font-semibold"
                    >
                      {currentTeam.members.map(m => (
                        <option key={m.regNo} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={tk.deadline}
                      onChange={e => {
                        const copy = [...reviewForm.tasks];
                        copy[tIdx].deadline = e.target.value;
                        setReviewForm({ ...reviewForm, tasks: copy });
                      }}
                      className="px-3 py-2 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl text-xs font-mono"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#EADBD0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#EADBD0] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5F38] hover:bg-[#E54D26] text-white font-extrabold shadow-md cursor-pointer"
                >
                  Save Permanent Diary Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* MODAL: UPLOAD DOCUMENT */}
      {showDocModal && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#111827]">Upload Project Document</h3>
            <form onSubmit={handleDocSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Progress Report & Model Benchmarks"
                  value={newDocForm.title}
                  onChange={e => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Document Type</label>
                <select
                  value={newDocForm.type}
                  onChange={e => setNewDocForm({ ...newDocForm, type: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-bold"
                >
                  <option value="Proposal">Project Proposal</option>
                  <option value="Synopsis">Synopsis</option>
                  <option value="SRS">Software Requirement Specification (SRS)</option>
                  <option value="Progress Report">Progress Report</option>
                  <option value="Presentation">PPT Presentation Deck</option>
                  <option value="Final Report">Final Report</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0B2E26] text-white rounded-xl font-bold">Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TEAM PROJECT DIARY MODAL ==================== */}
      {showTeamDiaryModal && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden border border-[#EADBD0] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#FAF2EC] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#EADBD0]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5F38] text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-[#111827] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {currentTeam.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {currentTeam.currentSemester || selectedSemester || 'Project Supervision'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">
                    Official Project Diary — {currentTeam.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Topic: {currentTeam.projectTitle || currentTeam.domain || 'Topic Pending'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-2xl border border-[#EADBD0] text-slate-700 hidden sm:inline-block">
                  {data.projectDiary.filter(d => d.teamId === currentTeam.id).length} Entries Recorded
                </span>
                <button
                  type="button"
                  onClick={() => setShowTeamDiaryModal(false)}
                  className="bg-white hover:bg-slate-100 p-2 rounded-2xl border border-[#EADBD0] text-slate-500 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Table */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {data.projectDiary.filter(d => d.teamId === currentTeam.id).length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-400 opacity-80 py-12 bg-[#FAF2EC]/50 rounded-2xl border-2 border-dashed border-[#EADBD0] p-8">
                  <Clock className="w-12 h-12 mb-3 text-slate-300" />
                  <h3 className="text-base font-black text-slate-600 mb-1">No Reviews Recorded Yet</h3>
                  <p className="text-xs font-medium text-slate-400 text-center max-w-xs">
                    Student review submissions for this team will appear here in the official project diary table for mentor evaluation and sign-off.
                  </p>
                </div>
              ) : (
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
                        <th className="py-3.5 px-4 text-center">Status / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADBD0]">
                      {data.projectDiary
                        .filter(d => d.teamId === currentTeam.id)
                        .map((entry, idx) => (
                          <tr key={entry.id} className="hover:bg-[#FAF2EC]/30 transition-colors">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="bg-[#FF5F38] text-white text-xs font-extrabold px-3 py-1 rounded-full font-mono">
                                {entry.reviewNumber || `Review ${String(idx + 1).padStart(2, '0')}`}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-xs font-bold text-slate-600 font-mono">
                              {entry.date}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="text-xs font-bold text-slate-800 bg-[#FAF2EC] px-2.5 py-1 rounded-lg border border-[#EADBD0]">
                                {entry.stage || 'Development'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-700 min-w-[200px] max-w-xs">
                              <p className="font-semibold text-[#111827] line-clamp-2">{entry.workCompleted}</p>
                              {entry.workDemonstrated && (
                                <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">Demo: {entry.workDemonstrated}</p>
                              )}
                              {entry.problemsFaced && (
                                <p className="text-[10px] text-amber-700 mt-1 font-medium line-clamp-1">⚠️ Challenges: {entry.problemsFaced}</p>
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-xs">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {currentTeam.members.map(m => {
                                  const isPresent = (entry.studentsPresent || []).includes(m.name) || (entry.attendanceMap && entry.attendanceMap[m.name] === 'Present');
                                  return (
                                    <span key={m.regNo} className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 opacity-60'}`}>
                                      {m.name.split(' ')[0]} ({isPresent ? 'P' : 'A'})
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs min-w-[180px] max-w-xs">
                              {entry.status === 'Pending' ? (
                                <span className="text-amber-700 font-bold text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                                  Pending Evaluation
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <div className="bg-emerald-50/70 border border-emerald-200/60 p-2 rounded-xl text-slate-700 leading-snug">
                                    <span className="font-bold text-[#0B2E26] text-[10px] block">Feedback:</span>
                                    <span className="line-clamp-2 font-medium">{entry.mentorFeedback}</span>
                                  </div>
                                  {entry.tasksGivenList && entry.tasksGivenList.length > 0 && (
                                    <div className="text-[10px] text-slate-600 font-medium">
                                      <strong>{entry.tasksGivenList.length} Task(s) Assigned</strong>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              {entry.status === 'Pending' ? (
                                <button 
                                  type="button"
                                  onClick={() => openEvaluationModal(entry)}
                                  className="px-3.5 py-1.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Evaluate & Approve</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> Approved
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF2EC] border-t border-[#EADBD0] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTeamDiaryModal(false)}
                className="px-6 py-2.5 rounded-xl border border-[#EADBD0] text-slate-600 font-bold hover:bg-slate-100 cursor-pointer text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW PROJECT DOCUMENTS MODAL                                              */}
      {/* ========================================================================= */}
      {showTeamDocsModal && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-[#EADBD0] flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-[#FAF2EC] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#EADBD0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B2E26] text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#111827]">
                      Uploaded Project Documents
                    </h3>
                    <span className="bg-[#FF5F38] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {currentTeam.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentTeam.name} — SRS, Proposals, Reports, and Review Submissions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(true)}
                  className="bg-[#0B2E26] hover:bg-[#071f1a] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTeamDocsModal(false)}
                  className="bg-white hover:bg-slate-100 p-2 rounded-2xl border border-[#EADBD0] text-slate-500 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {(currentTeam.documents || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-400 opacity-80 py-16 bg-[#FAF2EC]/50 rounded-2xl border-2 border-dashed border-[#EADBD0] p-8">
                  <FileText className="w-12 h-12 mb-3 text-slate-300" />
                  <h3 className="text-base font-black text-slate-600 mb-1">No Documents Uploaded Yet</h3>
                  <p className="text-xs font-medium text-slate-400 text-center max-w-sm">
                    Project documents submitted by students or uploaded by mentors will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#EADBD0] rounded-2xl shadow-xs">
                  <table className="w-full text-left text-sm border-collapse bg-white">
                    <thead>
                      <tr className="bg-[#FAF2EC] border-b border-[#EADBD0] text-[11px] font-black text-[#111827] uppercase tracking-wider">
                        <th className="py-3.5 px-5">Document Title & Details</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Stage / Linked</th>
                        <th className="py-3.5 px-4">Uploaded Date</th>
                        <th className="py-3.5 px-4">File Size</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADBD0]">
                      {(currentTeam.documents || []).map((doc, idx) => (
                        <tr key={doc.id || idx} className="hover:bg-[#FAF2EC]/40 transition-colors">
                          <td className="py-4.5 px-5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-center text-[#FF5F38] shrink-0 font-bold">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-sm text-[#111827] leading-tight">{doc.title}</p>
                                <p className="text-[11px] text-slate-400 font-mono mt-1">ID: {doc.id || `DOC-0${idx + 1}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 px-4 whitespace-nowrap">
                            <span className="text-[11px] font-bold bg-[#0B2E26] text-white px-2.5 py-1 rounded-lg">
                              {doc.type}
                            </span>
                          </td>
                          <td className="py-4.5 px-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                            <span className="bg-[#FAF2EC] border border-[#EADBD0] px-2.5 py-1 rounded-lg">
                              {doc.reviewId || 'General Submission'}
                            </span>
                          </td>
                          <td className="py-4.5 px-4 whitespace-nowrap text-xs font-mono font-bold text-slate-600">
                            {doc.date}
                          </td>
                          <td className="py-4.5 px-4 whitespace-nowrap text-xs font-mono text-slate-500">
                            {doc.size || '2.4 MB'}
                          </td>
                          <td className="py-4.5 px-5 whitespace-nowrap text-right">
                            <a
                              href={doc.url || '#'}
                              onClick={(e) => {
                                if (!doc.url || doc.url === '#') {
                                  e.preventDefault();
                                  alert(`Opening preview for ${doc.title}`);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm shadow-[#FF5F38]/20"
                            >
                              <span>View / Download</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF2EC] border-t border-[#EADBD0] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600 font-semibold">
                {(currentTeam.documents || []).length} Document{(currentTeam.documents || []).length === 1 ? '' : 's'} Total
              </span>
              <button
                type="button"
                onClick={() => setShowTeamDocsModal(false)}
                className="px-6 py-2.5 rounded-xl border border-[#EADBD0] bg-white text-slate-700 font-bold hover:bg-slate-100 cursor-pointer text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW & APPROVE PROJECT PROGRESS MODAL                                     */}
      {/* ========================================================================= */}
      {showProgressModal && currentTeam && (() => {
        const teamSteps = getTeamSetupSteps(currentTeam);
        const progressPct = getTeamProgressPercentage(currentTeam);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-150">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-[#EADBD0] flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="bg-[#FAF2EC] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#EADBD0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#FF5F38]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-[#111827]">
                        Project Setup & Progress Tracker
                      </h3>
                      <span className="bg-[#FF5F38] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                        {currentTeam.id}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {currentTeam.currentSemester || '6th Semester'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {currentTeam.name} — Real-time 5-Step Project Setup Completion & Verification
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="bg-white hover:bg-slate-100 p-2 rounded-2xl border border-[#EADBD0] text-slate-500 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* 6th Semester Progress Tracker Card (Matches Student View) */}
                <div className="bg-white border border-[#EADBD0] shadow-sm p-6 sm:p-8 rounded-3xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#111827] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#FF5F38]" />
                        📊 6th Semester Progress Tracker
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Track real-time completion of your 5-step project setup for {currentTeam.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-[#FF5F38] font-mono">{progressPct}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-[#EADBD0]">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-[#FF5F38] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* 5 Step Boxes (Matching the exact student view) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2 text-center text-xs">
                    {teamSteps.map(s => (
                      <div
                        key={s.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          s.isDone
                            ? 'bg-[#FAF2EC] border-[#FF5F38]/30 text-[#111827] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Step {s.id}</div>
                        <div className="text-xs font-black truncate mt-1 text-[#111827]">{s.title}</div>
                        <div className={`text-xs mt-1.5 font-bold ${s.isDone ? 'text-blue-700 font-extrabold' : 'text-slate-400'}`}>
                          {s.isDone ? '✓ Done' : '⏳ Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#FAF2EC] border-t border-[#EADBD0] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-600 font-semibold">
                  {teamSteps.filter(s => s.isDone).length}/5 Setup Steps Verified • {progressPct}% Complete
                </span>
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#EADBD0] bg-white text-slate-700 font-bold hover:bg-slate-100 cursor-pointer text-xs transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* EVALUATE & APPROVE STUDENT REVIEW MODAL                                   */}
      {/* ========================================================================= */}
      {evaluatingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-[#EADBD0] flex flex-col max-h-[92vh]">
            <div className="bg-[#FAF2EC] px-6 py-4 flex items-center justify-between border-b border-[#EADBD0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">
                    Evaluate & Approve {evaluatingEntry.reviewNumber}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Team {evaluatingEntry.teamId} — {evaluatingEntry.teamName || currentTeam?.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingEntry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveWithFeedback} className="p-6 overflow-y-auto space-y-4">
              {/* Student Submission Summary Preview */}
              <div className="bg-[#FAF2EC] p-4 rounded-2xl border border-[#EADBD0] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Student Submission Details:</span>
                  <span className="font-mono text-[#FF5F38]">{evaluatingEntry.date}</span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-[#111827]">Work Completed:</span> {evaluatingEntry.workCompleted}
                </div>
                {evaluatingEntry.workDemonstrated && (
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-[#111827]">Demonstration:</span> {evaluatingEntry.workDemonstrated}
                  </div>
                )}
                {evaluatingEntry.problemsFaced && (
                  <div className="text-xs text-amber-800">
                    <span className="font-bold">Challenges:</span> {evaluatingEntry.problemsFaced}
                  </div>
                )}
              </div>

              {/* Mentor Observations */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mentor Observations</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Observations on progress and code quality..."
                  value={approvalForm.mentorObservations}
                  onChange={e => setApprovalForm({ ...approvalForm, mentorObservations: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#EADBD0] rounded-xl focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              {/* Mentor Feedback */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mentor Feedback & Guidance *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Feedback and next steps for the team..."
                  value={approvalForm.mentorFeedback}
                  onChange={e => setApprovalForm({ ...approvalForm, mentorFeedback: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#EADBD0] rounded-xl focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              {/* Next Review Target Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Next Review Target Date</label>
                <input
                  type="date"
                  value={approvalForm.nextReviewDate}
                  onChange={e => setApprovalForm({ ...approvalForm, nextReviewDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#EADBD0] rounded-xl focus:outline-none focus:border-[#FF5F38]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEvaluatingEntry(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Sign Off Diary Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
