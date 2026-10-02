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
    clearAllNotifications
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
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
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

  // Diary Review Form State
  const [reviewForm, setReviewForm] = useState({
    reviewNumber: `Review ${String((data.projectDiary.filter(d => d.teamId === (currentTeam?.id || '')).length + 1)).padStart(2, '0')}`,
    date: new Date().toISOString().split('T')[0],
    attendanceMap: {},
    workCompleted: '',
    workDemonstrated: '',
    progressPercent: currentTeam?.progress || 50,
    stage: currentTeam?.currentStage || 'Development',
    problemsFaced: '',
    mentorObservations: '',
    mentorFeedback: '',
    improvementsSuggested: '',
    nextReviewDate: '',
    remarks: '',
    tasks: [
      { task: '', student: '', deadline: '' }
    ]
  });

  // Task Form State
  const [newTaskForm, setNewTaskForm] = useState({
    description: '',
    assignedStudent: '',
    deadline: '',
    mentorRemarks: ''
  });

  // Document Form State
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    type: 'Progress Report',
    reviewId: 'General',
    size: '2.5 MB'
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ ...profile });

  // Update Review Form when currentTeam changes or Modal opens
  const openNewReviewModal = () => {
    if (!currentTeam) return;
    const existingCount = data.projectDiary.filter(d => d.teamId === currentTeam.id).length;
    const initialAttendance = {};
    (currentTeam.members || []).forEach(m => {
      initialAttendance[m.name] = 'Present';
    });

    setReviewForm({
      reviewNumber: `Review ${String(existingCount + 1).padStart(2, '0')}`,
      date: new Date().toISOString().split('T')[0],
      attendanceMap: initialAttendance,
      workCompleted: '',
      workDemonstrated: '',
      progressPercent: currentTeam.progress || 50,
      stage: currentTeam.currentStage || 'Development',
      problemsFaced: '',
      mentorObservations: '',
      mentorFeedback: '',
      improvementsSuggested: '',
      nextReviewDate: '',
      remarks: '',
      tasks: [{ task: '', student: currentTeam.members[0]?.name || '', deadline: '' }]
    });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentTeam || !reviewForm.workCompleted || !reviewForm.mentorFeedback) return;

    const studentsPresentList = Object.keys(reviewForm.attendanceMap).filter(
      name => reviewForm.attendanceMap[name] === 'Present'
    );

    addComprehensiveReviewDiaryEntry({
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      reviewNumber: reviewForm.reviewNumber,
      date: reviewForm.date,
      studentsPresent: studentsPresentList,
      attendanceMap: reviewForm.attendanceMap,
      workCompleted: reviewForm.workCompleted,
      workDemonstrated: reviewForm.workDemonstrated,
      progressPercent: reviewForm.progressPercent,
      stage: reviewForm.stage,
      problemsFaced: reviewForm.problemsFaced,
      mentorObservations: reviewForm.mentorObservations,
      mentorFeedback: reviewForm.mentorFeedback,
      improvementsSuggested: reviewForm.improvementsSuggested,
      tasksGivenList: reviewForm.tasks.filter(t => t.task.trim() !== ''),
      nextReviewDate: reviewForm.nextReviewDate || 'TBD',
      remarks: reviewForm.remarks
    });

    setShowReviewModal(false);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!currentTeam || !newTaskForm.description) return;
    addMentorTaskToTeam(currentTeam.id, {
      description: newTaskForm.description,
      assignedStudent: newTaskForm.assignedStudent || currentTeam.members[0]?.name || 'All Members',
      deadline: newTaskForm.deadline || currentTeam.nextReviewDate,
      mentorRemarks: newTaskForm.mentorRemarks
    });
    setNewTaskForm({ description: '', assignedStudent: '', deadline: '', mentorRemarks: '' });
    setShowTaskModal(false);
  };

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
    { id: 'diary', name: 'Official Project Diary', count: data.projectDiary.length, icon: BookOpen, badgeColor: 'bg-[#FF5F38]' },
    { id: 'progress', name: 'Progress & Stages', icon: TrendingUp },
    { id: 'tasks', name: 'Mentor Tasks', icon: Target },
    { id: 'documents', name: 'Project Documents', icon: FileText },
    { id: 'requests', name: 'Requests', count: pendingRequests.length, icon: Bell, badgeColor: 'bg-amber-500' },
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
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('requests');
                        setShowNotificationDropdown(false);
                      }}
                      className="text-[11px] font-bold text-[#FF5F38] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open full requests page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

                <div className="bg-white p-5 rounded-3xl border border-[#EADBD0] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Active Assigned Tasks</div>
                    <div className="text-2xl font-black text-[#111827] font-mono">
                      {assignedTeams.reduce((acc, t) => acc + (t.tasks?.filter(tk => tk.status !== 'Completed').length || 0), 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Target className="w-6 h-6" />
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
                  <button
                    onClick={openNewReviewModal}
                    className="bg-[#FF5F38] hover:bg-[#E54D26] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#FF5F38]/20 transition cursor-pointer self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" /> Record New Review Entry
                  </button>
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
                          onClick={openNewReviewModal}
                          className="bg-[#FF5F38] hover:bg-[#E54D26] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md shadow-[#FF5F38]/20 transition cursor-pointer"
                        >
                          + Add Review Entry
                        </button>
                      </div>
                    </div>

                    {/* Grid Info Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">Project Title</span>
                        <p className="font-bold text-slate-800 text-sm">{currentTeam.projectTitle || 'N/A'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">Domain & Technologies</span>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="bg-[#0B2E26] text-white px-2 py-0.5 rounded-md font-bold text-[11px]">
                            {currentTeam.domain || 'Domain Set'}
                          </span>
                          {(currentTeam.technologies || []).map(tech => (
                            <span key={tech} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <span className="text-slate-400 font-semibold">Problem Statement</span>
                        <p className="bg-[#FAF2EC] p-3 rounded-2xl border border-[#EADBD0] text-slate-700 leading-relaxed font-medium">
                          {currentTeam.problemStatement || 'Problem statement pending mentor confirmation.'}
                        </p>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <span className="text-slate-400 font-semibold">Project Objectives & Expected Outcome</span>
                        <p className="bg-[#FAF2EC] p-3 rounded-2xl border border-[#EADBD0] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                          {currentTeam.objectives || currentTeam.expectedOutcome || 'Objectives defined during initial review.'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">Project Start Date</span>
                        <p className="font-mono font-bold text-slate-800">{currentTeam.startDate || '2026-08-01'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-semibold">Expected Completion Date</span>
                        <p className="font-mono font-bold text-[#FF5F38]">{currentTeam.expectedCompletionDate || '2026-11-30'}</p>
                      </div>
                    </div>

                    {/* Team Members List with USN */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Assigned Student Mentees ({currentTeam.members.length})
                        </h4>
                        <span className="text-[11px] font-bold text-slate-400">
                          Enrolled in {currentTeam.currentSemester || selectedSemester}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentTeam.members.map(m => (
                          <div key={m.regNo} className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between hover:border-[#FF5F38]/40 transition">
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="font-bold text-xs text-[#111827] flex items-center gap-1.5 truncate">
                                <span className="truncate">{m.name}</span>
                                {m.role === 'Team Leader' && (
                                  <span className="text-[10px] bg-[#0B2E26] text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                                    Leader
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                                <span>USN: <strong>{m.regNo}</strong></span>
                                <span>•</span>
                                <span className="text-[10px] text-slate-400 truncate">{m.email}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 font-semibold block">Attendance</span>
                              <span className="text-xs font-bold text-emerald-600 font-mono">{m.attendanceRate || '100%'}</span>
                            </div>
                          </div>
                        ))}
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

          {/* 3. OFFICIAL PROJECT DIARY TAB */}
          {activeTab === 'diary' && (
            <div className="space-y-6">
              
              {/* Banner Notice */}
              <div className="p-5 rounded-3xl bg-[#0A1628] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF5F38] text-white flex items-center justify-center font-black">
                    📖
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Official Project Diary System</h3>
                    <p className="text-xs text-slate-300">
                      Permanent review history repository. Every review entry remains locked to maintain academic records.
                    </p>
                  </div>
                </div>

                <button
                  onClick={openNewReviewModal}
                  className="bg-[#FF5F38] hover:bg-[#E54D26] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-[#FF5F38]/30 transition cursor-pointer self-stretch sm:self-auto"
                >
                  + Create New Review Entry
                </button>
              </div>

              {/* Team Switcher for Diary */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {assignedTeams.map(t => {
                  const isSel = currentTeam?.id === t.id;
                  const reviewCount = data.projectDiary.filter(d => d.teamId === t.id).length;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                        isSel
                          ? 'bg-[#0B2E26] text-white shadow-md'
                          : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {reviewCount} Reviews
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Permanent Diary Entries Timeline */}
              {currentTeam && (
                <div className="space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
                      <div>
                        <h3 className="text-lg font-black text-[#111827]">
                          Project Diary History — {currentTeam.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Project Topic: {currentTeam.projectTitle || 'Topic Pending'}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#FAF2EC] px-3 py-1.5 rounded-2xl border border-[#EADBD0] text-slate-700">
                        {data.projectDiary.filter(d => d.teamId === currentTeam.id).length} Entries Recorded
                      </span>
                    </div>

                    {/* Diary Entries List */}
                    <div className="space-y-6">
                      {data.projectDiary
                        .filter(d => d.teamId === currentTeam.id)
                        .map((entry, idx) => (
                          <div
                            key={entry.id}
                            className="bg-[#FAF2EC] p-6 rounded-3xl border border-[#EADBD0] shadow-xs space-y-4 relative overflow-hidden"
                          >
                            {/* Entry Top Header Ribbon */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADBD0] pb-3">
                              <div className="flex items-center gap-3">
                                <span className="bg-[#FF5F38] text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-xs">
                                  {entry.reviewNumber || `Review ${0 + (idx + 1)}`}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-700">
                                  📅 Date: {entry.date}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                <span>Stage: <strong>{entry.stage || 'Development'}</strong></span> •
                                <span>Progress: <strong className="text-[#FF5F38]">{entry.progressPercent || 50}%</strong></span>
                              </div>
                            </div>

                            {/* Students Present Attendance */}
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                Student Review Attendance
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                {currentTeam.members.map(m => {
                                  const isPresent = (entry.studentsPresent || []).includes(m.name) || (entry.attendanceMap && entry.attendanceMap[m.name] === 'Present');
                                  return (
                                    <span
                                      key={m.regNo}
                                      className={`text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                                        isPresent
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : 'bg-red-100 text-red-700 border border-red-200 opacity-70'
                                      }`}
                                    >
                                      <span>{isPresent ? '✓' : '✗'}</span>
                                      <span>{m.name}</span>
                                      <span className="text-[10px] opacity-70 font-mono">({m.regNo})</span>
                                      <span className="text-[10px] font-bold">[{isPresent ? 'Present' : 'Absent'}]</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-white p-4 rounded-2xl border border-[#EADBD0] space-y-1">
                                <span className="font-extrabold text-[#0B2E26] block">✓ Work Completed</span>
                                <p className="text-slate-700 leading-relaxed font-medium">{entry.workCompleted}</p>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-[#EADBD0] space-y-1">
                                <span className="font-extrabold text-[#FF5F38] block">💻 Work Demonstrated</span>
                                <p className="text-slate-700 leading-relaxed font-medium">{entry.workDemonstrated || 'Module functionality demonstrated live.'}</p>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-[#EADBD0] space-y-1">
                                <span className="font-extrabold text-amber-700 block">⚠️ Problems & Challenges Faced</span>
                                <p className="text-slate-700 leading-relaxed font-medium">{entry.problemsFaced || 'None specified.'}</p>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-[#EADBD0] space-y-1">
                                <span className="font-extrabold text-[#0B2E26] block">🔍 Mentor Observations</span>
                                <p className="text-slate-700 leading-relaxed font-medium">{entry.mentorObservations || 'Satisfactory progress maintained.'}</p>
                              </div>
                            </div>

                            {/* Official Mentor Feedback Box */}
                            <div className="bg-[#0B2E26] text-white p-4.5 rounded-2xl space-y-1.5 shadow-md">
                              <span className="text-xs font-extrabold tracking-wider text-[#FF5F38] uppercase block">
                                💬 Official Mentor Feedback & Instructions
                              </span>
                              <p className="text-xs text-slate-200 leading-relaxed font-medium">{entry.mentorFeedback}</p>
                              {entry.improvementsSuggested && (
                                <div className="text-xs text-amber-300 pt-1 border-t border-white/10 font-medium">
                                  <strong>Improvements Suggested:</strong> {entry.improvementsSuggested}
                                </div>
                              )}
                            </div>

                            {/* Tasks Given Table/List */}
                            {entry.tasksGivenList && entry.tasksGivenList.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                  Tasks Assigned During This Review
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {entry.tasksGivenList.map((tk, tIdx) => (
                                    <div key={tIdx} className="bg-white p-3 rounded-2xl border border-[#EADBD0] text-xs flex items-center justify-between">
                                      <div>
                                        <div className="font-bold text-slate-800">{tk.task}</div>
                                        <div className="text-[11px] text-slate-500">Responsible: <strong className="text-[#FF5F38]">{tk.student || 'All'}</strong></div>
                                      </div>
                                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                        Due: {tk.deadline || 'Next Review'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Footer Info */}
                            <div className="pt-2 border-t border-[#EADBD0] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                              <span>Verified by: <strong>{entry.mentorName || profile.fullName}</strong></span>
                              <span className="font-mono text-[#FF5F38] font-bold">Next Review Date: {entry.nextReviewDate || 'TBD'}</span>
                            </div>
                          </div>
                        ))}
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* 4. PROJECT PROGRESS & STAGES TAB */}
          {activeTab === 'progress' && currentTeam && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#111827]">Project Lifecycle & Stage Tracker</h2>
                    <p className="text-xs text-slate-500">Track and update the exact stage and progress percentage for {currentTeam.name}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Current Progress:</span>
                    <span className="text-lg font-mono font-black text-[#FF5F38]">{currentTeam.progress || 50}%</span>
                  </div>
                </div>

                {/* Stage Timeline Flow visualizer */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    10-Stage Academic Project Lifecycle
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {PROJECT_STAGES.map((stg, i) => {
                      const currentStageIdx = PROJECT_STAGES.indexOf(currentTeam.currentStage || 'Development');
                      const isCompleted = i < currentStageIdx;
                      const isCurrent = i === currentStageIdx;

                      return (
                        <button
                          key={stg}
                          onClick={() => updateProjectProgress(currentTeam.id, stg, Math.min(100, (i + 1) * 10))}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            isCurrent
                              ? 'bg-[#FF5F38] text-white border-[#FF5F38] shadow-md font-bold'
                              : isCompleted
                              ? 'bg-[#0B2E26] text-white border-[#0B2E26]'
                              : 'bg-[#FAF2EC] text-slate-600 border-[#EADBD0] hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-[10px] opacity-80 font-mono mb-1">Stage 0{i + 1}</div>
                          <div className="text-xs font-extrabold line-clamp-1">{stg}</div>
                          <div className="mt-2 text-[10px] font-bold flex items-center gap-1">
                            {isCompleted && <span>✓ Completed</span>}
                            {isCurrent && <span>➔ Active Stage</span>}
                            {!isCompleted && !isCurrent && <span className="opacity-60">Upcoming</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Progress Slider Update */}
                <div className="bg-[#FAF2EC] p-6 rounded-3xl border border-[#EADBD0] space-y-4">
                  <h4 className="text-xs font-extrabold text-[#111827]">Quick Update Overall Completion Percentage</h4>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentTeam.progress || 50}
                      onChange={e => updateProjectProgress(currentTeam.id, currentTeam.currentStage || 'Development', e.target.value)}
                      className="w-full accent-[#FF5F38] cursor-pointer"
                    />
                    <span className="text-sm font-mono font-extrabold text-[#FF5F38] min-w-[50px]">
                      {currentTeam.progress || 50}%
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 5. MENTOR TASKS TAB */}
          {activeTab === 'tasks' && currentTeam && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#111827]">Tasks Assigned to Students</h2>
                    <p className="text-xs text-slate-500">Track and assign specific deliverables for members of {currentTeam.name}</p>
                  </div>
                  
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="bg-[#0B2E26] hover:bg-[#071f1a] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Assign New Task
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {(currentTeam.tasks || []).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">No tasks assigned to this team yet.</div>
                  ) : (
                    (currentTeam.tasks || []).map(tk => (
                      <div key={tk.id} className="p-4.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              tk.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              tk.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                            }`}>
                              {tk.status}
                            </span>
                            <span className="text-xs font-bold text-[#FF5F38]">Student: {tk.assignedStudent}</span>
                          </div>
                          <div className="font-extrabold text-sm text-[#111827]">{tk.description}</div>
                          {tk.mentorRemarks && (
                            <div className="text-xs text-slate-600 font-medium">Remarks: {tk.mentorRemarks}</div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-xs font-mono text-slate-500">Deadline: {tk.deadline}</span>
                          <select
                            value={tk.status}
                            onChange={e => updateMentorTaskStatus(currentTeam.id, tk.id, e.target.value)}
                            className="px-3 py-1.5 bg-white border border-[#EADBD0] rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 6. PROJECT DOCUMENTS TAB */}
          {activeTab === 'documents' && currentTeam && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#111827]">Project Documents & Submission Repository</h2>
                    <p className="text-xs text-slate-500">Access SRS, Proposals, Reports and Review Presentations for {currentTeam.name}</p>
                  </div>
                  
                  <button
                    onClick={() => setShowDocModal(true)}
                    className="bg-[#0B2E26] hover:bg-[#071f1a] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload Document
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(currentTeam.documents || []).map(doc => (
                    <div key={doc.id} className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-[#0B2E26] text-white px-2 py-0.5 rounded-md">
                          {doc.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{doc.date}</span>
                      </div>

                      <h4 className="font-extrabold text-sm text-[#111827] line-clamp-1">{doc.title}</h4>
                      <p className="text-xs text-slate-500">Linked to: {doc.reviewId || 'General'}</p>

                      <div className="pt-2 border-t border-[#EADBD0] flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400">{doc.size || '2.0 MB'}</span>
                        <a href={doc.url || '#'} className="text-[#FF5F38] font-bold flex items-center gap-1 hover:underline">
                          <span>Download</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* 7. PENDING REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-[#111827] border-b border-[#EADBD0] pb-4">
                🔔 Pending Mentor Supervision Requests ({pendingRequests.length})
              </h2>

              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No pending requests right now.</div>
                ) : (
                  pendingRequests.map(t => (
                    <div key={t.id} className="p-5 rounded-3xl bg-[#FAF2EC] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">{t.id}</span>
                        <h3 className="text-base font-extrabold text-[#111827] mt-1">{t.name}</h3>
                        <p className="text-xs text-slate-600 mt-1 font-medium">Domain: {t.domain || 'Unspecified'}</p>
                        <p className="text-xs text-slate-500">Members: {t.members.map(m => m.name).join(', ')}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => respondToMentorRequest(t.id, true)}
                          className="bg-[#0B2E26] hover:bg-[#071f1a] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          ✓ Accept Supervision Request
                        </button>
                        <button
                          onClick={() => respondToMentorRequest(t.id, false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer"
                        >
                          ✕ Decline
                        </button>
                      </div>
                    </div>
                  ))
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

      {/* MODAL: ASSIGN TASK */}
      {showTaskModal && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#EADBD0] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#111827]">Assign New Mentor Task</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add validation for DICOM image file uploads"
                  value={newTaskForm.description}
                  onChange={e => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Student Responsible</label>
                <select
                  value={newTaskForm.assignedStudent}
                  onChange={e => setNewTaskForm({ ...newTaskForm, assignedStudent: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-bold"
                >
                  {currentTeam.members.map(m => (
                    <option key={m.regNo} value={m.name}>{m.name} ({m.regNo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={newTaskForm.deadline}
                  onChange={e => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0B2E26] text-white rounded-xl font-bold">Assign Task</button>
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

    </div>
  );
}
