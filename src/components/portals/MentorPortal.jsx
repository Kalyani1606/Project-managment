import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Target,
  FileText,
  AlertCircle,
  TrendingUp,
  Check,
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
  GraduationCap
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

export default function MentorPortal() {
  const {
    data,
    respondToMentorRequest,
    addComprehensiveReviewDiaryEntry,
    updateProjectProgress,
    addMentorTaskToTeam,
    updateMentorTaskStatus,
    uploadTeamProjectDocument,
    updateMentorProfile
  } = useApp();

  const profile = data.mentorProfile;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTeamId, setSelectedTeamId] = useState(data.teams[0]?.id || '');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Search & Filter
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  // Selected Team Object
  const assignedTeams = data.teams.filter(t => t.mentorStatus === 'Accepted' || t.mentorId === 'MENTOR-01');
  const pendingRequests = data.teams.filter(t => t.mentorStatus === 'Pending' || t.status === 'Pending Approval');
  
  const currentTeam = data.teams.find(t => t.id === selectedTeamId) || assignedTeams[0] || data.teams[0];

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

  // Filtered Teams List
  const filteredTeams = assignedTeams.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      (t.projectTitle || '').toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      t.members.some(m => m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()));
    const matchesStage = stageFilter === 'All' || t.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-[#FAF2EC] min-h-screen text-[#111827] space-y-6 pb-12 font-sans">
      
      {/* ========================================================================= */}
      {/* PORTAL TOP NAVIGATION HEADER                                              */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#EADBD0] rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2E26] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#0B2E26]/20">
            <GraduationCap className="w-6 h-6 text-[#FF5F38]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">Faculty Mentor Portal</h1>
              <span className="text-[10px] bg-[#FF5F38] text-white font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Diary System
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Academic Project Supervision, Attendance, Progress Tracking & Permanent Reviews
            </p>
          </div>
        </div>

        {/* Mentor Info Pill */}
        <div className="flex items-center gap-3 bg-[#FAF2EC] px-4 py-2 rounded-2xl border border-[#EADBD0]">
          <div className="text-right">
            <div className="text-xs font-bold text-[#111827]">{profile.fullName}</div>
            <div className="text-[10px] text-slate-500 font-mono">{profile.employeeId} • {profile.department}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#0A1628] text-[#FF5F38] flex items-center justify-center font-black text-sm">
            {profile.fullName.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-NAVIGATION TABS                                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EADBD0] scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>🏠 Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'teams'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>👥 My Teams ({assignedTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diary')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'diary'
              ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/25'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>📖 Official Project Diary</span>
          <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            {data.projectDiary.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>📈 Progress & Stages</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>🎯 Mentor Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>📁 Project Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>🔔 Requests</span>
          {pendingRequests.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#0B2E26] text-white shadow-md shadow-[#0B2E26]/20'
              : 'bg-white text-slate-700 border border-[#EADBD0] hover:bg-[#FAF2EC]'
          }`}
        >
          <span>👨‍🏫 Profile</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD TAB                                                          */}
      {/* ========================================================================= */}
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

          {/* Active Teams Overview Section */}
          <div className="bg-white p-6 rounded-3xl border border-[#EADBD0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBD0] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF5F38]" /> Managed Project Teams Overview
                </h2>
                <p className="text-xs text-slate-500">
                  Select a team to open its official Project Diary, update stage progress, or issue tasks
                </p>
              </div>
              <button
                onClick={openNewReviewModal}
                className="bg-[#FF5F38] hover:bg-[#E54D26] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#FF5F38]/20 transition cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Record New Review Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedTeams.map(team => {
                const teamDiaryCount = data.projectDiary.filter(d => d.teamId === team.id).length;
                const pendingTasksCount = (team.tasks || []).filter(tk => tk.status !== 'Completed').length;

                return (
                  <div
                    key={team.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      selectedTeamId === team.id
                        ? 'bg-[#FAF2EC] border-[#FF5F38] shadow-md'
                        : 'bg-white border-[#EADBD0] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#FF5F38] bg-[#FF5F38]/10 px-2 py-0.5 rounded-md">
                            {team.id}
                          </span>
                          <span className="text-xs font-bold text-slate-500">Team #{team.teamNumber || '01'}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-[#111827] mt-1">{team.name}</h3>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#0B2E26]/10 text-[#0B2E26]">
                        {team.currentStage || 'Development'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 font-medium mb-3">
                      <strong className="text-slate-800">Project:</strong> {team.projectTitle || 'Topic Pending'}
                    </p>

                    {/* Members Pill List */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {team.members.map(m => (
                        <span key={m.regNo} className="text-[11px] bg-white border border-[#EADBD0] px-2.5 py-1 rounded-xl font-medium text-slate-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#FF5F38]" />
                          <span>{m.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">({m.regNo})</span>
                        </span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Overall Progress</span>
                        <span className="text-[#FF5F38] font-mono">{team.progress || 50}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF5F38] to-[#0B2E26] rounded-full transition-all duration-500"
                          style={{ width: `${team.progress || 50}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="pt-3 border-t border-[#EADBD0] flex items-center justify-between text-xs">
                      <div className="text-slate-500 text-[11px]">
                        <span>Reviews: <strong>{teamDiaryCount}</strong></span> • <span>Pending Tasks: <strong>{pendingTasksCount}</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTeamId(team.id);
                          setActiveTab('diary');
                        }}
                        className="text-[#FF5F38] hover:text-[#E54D26] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Project Diary</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MY TEAMS TAB                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
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

          {/* Teams Detailed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Team Selection List */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
                Assigned Teams ({filteredTeams.length})
              </h3>
              {filteredTeams.map(t => {
                const isSel = currentTeam?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTeamId(t.id)}
                    className={`w-full text-left p-4 rounded-3xl border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#0B2E26] text-white border-[#0B2E26] shadow-lg'
                        : 'bg-white text-slate-800 border-[#EADBD0] hover:bg-[#FAF2EC]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-mono font-bold ${isSel ? 'text-[#FF5F38]' : 'text-slate-500'}`}>
                        {t.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSel ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {t.currentStage || 'Development'}
                      </span>
                    </div>
                    <div className="font-extrabold text-sm mb-1">{t.name}</div>
                    <div className={`text-xs line-clamp-1 opacity-80 ${isSel ? 'text-slate-200' : 'text-slate-600'}`}>
                      {t.projectTitle || 'No Title Set'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Complete Team Information Card */}
            {currentTeam && (
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBD0] pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#FF5F38] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                        {currentTeam.id}
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
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Team Members & Registration Numbers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTeam.members.map(m => (
                      <div key={m.regNo} className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#111827] flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.role === 'Team Leader' && (
                              <span className="text-[10px] bg-[#0B2E26] text-white px-2 py-0.5 rounded-full font-bold">
                                Leader
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">USN: {m.regNo}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-semibold block">Attendance</span>
                          <span className="text-xs font-bold text-emerald-600 font-mono">{m.attendanceRate || '100%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. OFFICIAL PROJECT DIARY TAB (MAIN FEATURE)                             */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 4. PROJECT PROGRESS & STAGES TAB                                          */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 5. MENTOR TASKS TAB                                                       */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 6. PROJECT DOCUMENTS TAB                                                  */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 7. PENDING REQUESTS TAB                                                   */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 8. MENTOR PROFILE TAB                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBD0] shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
            <h2 className="text-xl font-black text-[#111827]">Faculty Mentor Profile Information</h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-xs font-bold text-[#FF5F38] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> {editingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {!editingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Faculty Mentor Name</span>
                <p className="font-extrabold text-base text-[#111827]">{profile.fullName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Faculty Employee ID</span>
                <p className="font-mono font-bold text-[#FF5F38] text-sm">{profile.employeeId}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Department</span>
                <p className="font-bold text-slate-800">{profile.department}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Designation</span>
                <p className="font-bold text-slate-800">{profile.designation}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Email Address</span>
                <p className="font-semibold text-slate-700">{profile.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Contact Information</span>
                <p className="font-semibold text-slate-700">{profile.phone || '+91 98450 12345'}</p>
              </div>

              <div className="col-span-2 space-y-1">
                <span className="text-slate-400 font-semibold">Areas of Specialization & Research</span>
                <p className="bg-[#FAF2EC] p-3 rounded-2xl border border-[#EADBD0] text-slate-700 font-medium">
                  {profile.areaOfExpertise}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF2EC] border border-[#EADBD0] rounded-xl font-semibold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#0B2E26] text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          )}
        </div>
      )}

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
