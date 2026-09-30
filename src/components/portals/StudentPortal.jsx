import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Users,
  UserCheck,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Lock,
  Send,
  FileText,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  Check,
  X,
  BarChart3,
  Info,
  MonitorPlay,
  Save
} from 'lucide-react';
import Roadmap3D from '../Roadmap3D';
import EReportView from '../common/EReportView';

export default function StudentPortal({ defaultTab = 'dashboard', activeSection = 'all' }) {
  const {
    data,
    updateStudentProfile,
    createTeam,
    sendInvitation,
    respondToInvitation,
    selectMentor,
    setDomainAndTopic,
    addResearchPaper
  } = useApp();

  const profile = data.studentProfile;
  const userTeam = data.teams.find(t => t.id === profile.teamId) || null;

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedSemester, setSelectedSemester] = useState('6th Semester');
  const [showEReportModal, setShowEReportModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSemesterCompleted, setIsSemesterCompleted] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...profile });

  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [domain, setDomain] = useState(userTeam?.domain || 'Artificial Intelligence');
  const [domainReason, setDomainReason] = useState(userTeam?.domainReason || '');
  const [projectTitle, setProjectTitle] = useState(userTeam?.projectTitle || '');
  const [problemStatement, setProblemStatement] = useState(userTeam?.problemStatement || '');
  const [shortDescription, setShortDescription] = useState(userTeam?.shortDescription || '');

  useEffect(() => {
    if (userTeam) {
      if (userTeam.domain) setDomain(userTeam.domain);
      if (userTeam.domainReason) setDomainReason(userTeam.domainReason);
      if (userTeam.projectTitle) setProjectTitle(userTeam.projectTitle);
      if (userTeam.problemStatement) setProblemStatement(userTeam.problemStatement);
      if (userTeam.shortDescription) setShortDescription(userTeam.shortDescription);
    }
  }, [userTeam?.id, activeSection]);

  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('');
  const [paperPublication, setPaperPublication] = useState('');
  const [paperYear, setPaperYear] = useState('2024');

  const steps = [
    { id: 1, title: 'Create Team', isDone: !!userTeam },
    { id: 2, title: 'Add Members', isDone: userTeam && userTeam.members.length >= 2 },
    { id: 3, title: 'Select Mentor', isDone: userTeam && !!userTeam.mentorId },
    { id: 4, title: 'Domain Selection', isDone: userTeam && !!userTeam.domain },
    { id: 5, title: 'Project Topic', isDone: userTeam && !!userTeam.projectTitle },
    { id: 6, title: '5 Research Papers', isDone: userTeam && userTeam.researchPapers.length >= 5 }
  ];

  const completedStepsCount = steps.filter(s => s.isDone).length;
  const progressPercentage = Math.round((completedStepsCount / steps.length) * 100);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateStudentProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createTeam(newTeamName.trim());
    setNewTeamName('');
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !userTeam) return;
    sendInvitation(userTeam.id, inviteEmail.trim());
    setInviteEmail('');
  };

  const handleDomainTopicSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userTeam) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
      return;
    }
    setDomainAndTopic(userTeam.id, domain, domainReason, projectTitle, problemStatement, shortDescription);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const handleAddPaperSubmit = (e) => {
    e.preventDefault();
    if (!userTeam || !paperTitle || !paperAuthors) return;
    addResearchPaper(userTeam.id, {
      title: paperTitle,
      authors: paperAuthors,
      publication: paperPublication,
      year: paperYear
    });
    setPaperTitle('');
    setPaperAuthors('');
    setPaperPublication('');
    setPaperYear('');
  };

  return (
    <div className="space-y-6">
      {/* ==================== A. STUDENT PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#EADBD0] shadow-sm p-6 rounded-3xl border border-[#EADBD0] max-w-4xl mx-auto space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{profile.fullName}</h2>
                <p className="text-xs text-[#FF5F38] font-mono font-bold">Reg. No: {profile.registerNo}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1.5 text-xs"
            >
              {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label flex items-center justify-between">
                Register Number
                {profile.registerNoLocked && (
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked by Coordinator
                  </span>
                )}
              </label>
              <input
                type="text"
                disabled={profile.registerNoLocked || !isEditingProfile}
                className="form-input w-full font-mono"
                value={profileForm.registerNo}
                onChange={(e) => setProfileForm({ ...profileForm, registerNo: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Department / Programme</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Course Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.course}
                onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Current Semester</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.semester}
                onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                className="form-input w-full"
                value={profileForm.academicYear}
                onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
              />
            </div>

            {isEditingProfile && (
              <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
                <button type="submit" className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-2 text-xs">
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== B. STUDENT HOME DASHBOARD TAB ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDAC5] to-[#FFECD9] border border-[#FF5F38]/40 rounded-3xl p-8 shadow-md">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F38]"></span>
                  <span className="text-[#FF5F38] text-[10px] font-black uppercase tracking-wider">Student Portal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
                  Welcome back,<br />
                  <span className="text-[#FF5F38]">{profile.fullName?.split(' ')[0]}!</span>
                </h1>
                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-md">
                  "Big projects start with small steps. Keep going!"
                </p>
              </div>
              
              <div className="hidden md:flex flex-shrink-0 relative">
                <div className="absolute inset-0 bg-[#FF5F38]/10 blur-3xl rounded-full" />
                <span className="text-[120px] filter drop-shadow-xl relative z-10 animate-[bounce_3s_infinite]">🎓</span>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-[180px] text-[#FF5F38]/5 transform rotate-12 blur-sm pointer-events-none">🎓</div>
            <div className="absolute bottom-10 left-1/2 w-4 h-4 rounded-full bg-[#FF5F38]/40" />
            <div className="absolute top-10 right-1/3 w-2 h-2 rounded-full bg-[#FF5F38]/60" />
            <div className="absolute bottom-20 right-1/4 w-3 h-3 justify-center items-center flex">
               <span className="text-[#FF5F38]/40 font-bold rotate-45 text-xl">+</span>
            </div>
          </div>

          {/* Semester Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 6th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-[#FF5F38]/10 text-[#FF5F38] font-black text-sm rounded-lg">01</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">📚</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">6th Semester</h3>
                <p className="text-sm font-bold text-slate-500">Planning & Research</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Team formation, Mentor selection, Domain identification, Problem statement and 5 Research papers.
                </p>
              </div>
              <button 
                onClick={() => { setSelectedSemester('6th Semester'); setActiveTab('semester'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 7th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">02</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                 <div className="absolute inset-0 bg-slate-400/10 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">💻</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">7th Semester</h3>
                <p className="text-sm font-bold text-slate-500">Development & Implementation</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Architecture design, Model training/API development, System integration and Mid-term demo.
                </p>
              </div>
              <button 
                onClick={() => { setSelectedSemester('7th Semester'); setActiveTab('semester'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group opacity-80 hover:opacity-100"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 8th Semester Card */}
            <div className="bg-white border-2 border-transparent hover:border-[#FF5F38] shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-600 font-black text-sm rounded-lg">03</div>
              <div className="flex justify-center mt-8 mb-6 relative">
                 <div className="absolute inset-0 bg-[#FF5F38]/10 blur-xl rounded-full" />
                <span className="text-[80px] filter drop-shadow-lg relative z-10 duration-300 hover:scale-110">🚀</span>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#111827]">8th Semester</h3>
                <p className="text-sm font-bold text-slate-500">Final Project & Completion</p>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[60px]">
                  Performance benchmarking, Final viva presentation, Thesis submission and Publication.
                </p>
              </div>
              <button 
                onClick={() => { setSelectedSemester('8th Semester'); setActiveTab('semester'); }}
                className="mt-6 flex items-center justify-between text-[#FF5F38] font-bold text-sm hover:text-[#E54D26] group opacity-80 hover:opacity-100"
              >
                Click to view tasks
                <div className="w-8 h-8 rounded-full bg-[#FF5F38]/10 flex items-center justify-center group-hover:bg-[#FF5F38]/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== C. EVENTS / SEMESTER PAGE ==================== */}
      {activeTab === 'semester' && (
        <div className="space-y-6">
          
          {/* Semester Selector Tabs */}
          {(activeSection === 'all' || activeSection === 'progress') && (
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-2xl border border-[#EADBD0] max-w-xl mx-auto shadow-sm">
            {['6th Semester', '7th Semester', '8th Semester'].map((sem) => {
              const isActive = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF5F38] text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-[#111827] hover:bg-slate-100'
                  }`}
                >
                  {sem.startsWith('6') && '🟢 '}
                  {sem.startsWith('7') && '🟡 '}
                  {sem.startsWith('8') && '🔵 '}
                  {sem}
                </button>
              );
            })}
          </div>
          )}

          {/* 6th Semester Detailed Module */}
          {selectedSemester === '6th Semester' ? (
            <div className="space-y-6">
              
              {/* Progress Tracker Card */}
              {(activeSection === 'all' || activeSection === 'progress') && (
              <div className="bg-white border border-[#EADBD0] shadow-sm p-6 rounded-3xl border border-blue-200 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF5F38]" />
                      📊 6th Semester Progress Tracker
                    </h2>
                    <p className="text-xs text-slate-500">Track real-time completion of your 6-step project setup</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-[#FF5F38] font-mono">{progressPercentage}%</span>
                    <button
                      onClick={() => setShowEReportModal(true)}
                      className="px-4 py-2 bg-[#0B2E26] hover:bg-[#071f1a] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-1.5 text-xs"
                    >
                      <FileText className="w-4 h-4" /> View Structured E-Report
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-[#EADBD0] mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 text-center text-xs">
                  {steps.map(s => (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        s.isDone
                          ? 'bg-[#FF5F38]/10 border-blue-200 text-blue-800 font-bold'
                          : 'bg-[#FAF2EC] border-[#EADBD0] text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">Step {s.id}</div>
                      <div className="text-[11px] truncate mt-0.5">{s.title}</div>
                      <div className="text-xs mt-1">{s.isDone ? '✓ Done' : '⏳ Pending'}</div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Step-by-Step Module */}
              <div className="space-y-4">
                
                {/* STEP 1 & 2 */}
                {(activeSection === 'all' || activeSection === 'team') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#FF5F38] flex items-center justify-center font-bold text-xs">
                        1 & 2
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 1 & 2: Create Team & Add Team Members 🤝</h3>
                        <p className="text-xs text-slate-500">Team leader initiates team and sends email invitations</p>
                      </div>
                    </div>
                    {userTeam && (
                      <span className={`badge ${userTeam.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {userTeam.status}
                      </span>
                    )}
                  </div>

                  {!userTeam ? (
                    <form onSubmit={handleCreateTeamSubmit} className="flex gap-3 max-w-md">
                      <input
                        type="text"
                        placeholder="Enter Proposed Team Name (e.g. Team Alpha)"
                        className="form-input flex-1"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        required
                      />
                      <button type="submit" className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-2 text-xs">
                        Create Team
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-[#FF5F38] font-mono font-bold">Team ID: {userTeam.id}</div>
                          <div className="text-base font-bold text-[#111827]">{userTeam.name}</div>
                          <div className="text-xs text-slate-500">Leader: {userTeam.leaderEmail}</div>
                        </div>

                        <form onSubmit={handleInviteSubmit} className="flex items-center gap-2">
                          <input
                            type="email"
                            placeholder="teammate@university.edu"
                            className="form-input text-xs py-1.5"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                          <button type="submit" className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1.5 text-xs whitespace-nowrap">
                            <Send className="w-3.5 h-3.5" /> Send Invite
                          </button>
                        </form>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#EADBD0] text-slate-500">
                              <th className="py-2 px-3">Student Name</th>
                              <th className="py-2 px-3">Email Address</th>
                              <th className="py-2 px-3">Register No</th>
                              <th className="py-2 px-3">Role</th>
                              <th className="py-2 px-3">Invitation Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {userTeam.members.map((m, idx) => (
                              <tr key={idx}>
                                <td className="py-2.5 px-3 font-bold text-[#111827]">{m.name}</td>
                                <td className="py-2.5 px-3 text-slate-600">{m.email}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{m.regNo}</td>
                                <td className="py-2.5 px-3 font-semibold text-[#FF5F38]">{m.role}</td>
                                <td className="py-2.5 px-3">
                                  <span className="badge badge-success font-mono">Accepted ✅</span>
                                </td>
                              </tr>
                            ))}

                            {userTeam.invitations?.map((inv, idx) => (
                              <tr key={idx} className="bg-amber-50/50">
                                <td className="py-2.5 px-3 text-slate-500">Invited Member</td>
                                <td className="py-2.5 px-3 text-amber-800 font-mono">{inv.email}</td>
                                <td className="py-2.5 px-3 text-slate-400">Pending</td>
                                <td className="py-2.5 px-3 text-slate-500">Member</td>
                                <td className="py-2.5 px-3 flex items-center gap-2">
                                  <span className="badge badge-warning">Pending Invite ⏳</span>
                                  <button
                                    onClick={() => respondToInvitation(userTeam.id, inv.email, 'Accepted')}
                                    className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    title="Simulate Accept"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => respondToInvitation(userTeam.id, inv.email, 'Rejected')}
                                    className="p-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
                                    title="Simulate Reject"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}
                </div>
                )}

                {/* STEP 3 */}
                {(activeSection === 'all' || activeSection === 'mentor') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 3: Select Faculty Mentor 👨‍🏫</h3>
                        <p className="text-xs text-slate-500">Team selects a mentor from department directory</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.mentors.map((m) => {
                      const isSelectedMentor = userTeam?.mentorId === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isSelectedMentor
                              ? 'bg-[#FF5F38]/10/70 border-blue-300 shadow-sm'
                              : 'bg-[#FAF2EC] border-[#EADBD0]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-[#111827]">{m.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{m.department}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-3">{m.designation}</p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-[#EADBD0]">
                            <span className="text-[11px] text-slate-500">
                              Workload: {m.assignedTeamsCount}/{m.maxTeams} Teams
                            </span>

                            {isSelectedMentor ? (
                              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                              </span>
                            ) : (
                              <button
                                onClick={() => selectMentor(userTeam?.id, m.id)}
                                className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1 text-xs"
                              >
                                Send Request
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* STEP 4 & 5 */}
                {(activeSection === 'all' || activeSection === 'domain') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        4 & 5
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 4 & 5: Domain Selection & Problem Statement 💡</h3>
                        <p className="text-xs text-slate-500">Define domain, topic, and problem statement</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleDomainTopicSubmit} className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Broad Project Domain</label>
                        <select
                          className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all cursor-pointer"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        >
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="IoT">IoT (Internet of Things)</option>
                          <option value="Cloud Computing">Cloud Computing</option>
                          <option value="Data Science">Data Science</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Proposed Project Title</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          placeholder="e.g. Intelligent Auto-Scaler"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Domain Interest Rationale</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                        placeholder="Why did you choose this specific domain?"
                        value={domainReason}
                        onChange={(e) => setDomainReason(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Problem Statement</label>
                      <textarea
                        className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400 resize-none h-24 leading-relaxed"
                        placeholder="Describe the exact problem you are trying to solve..."
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Technical Scope & Short Description</label>
                      <textarea
                        className="w-full px-4 py-3 bg-[#FCFAF8] border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400 resize-none h-24 leading-relaxed"
                        placeholder="Summarize the technical approach and methodology..."
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-3">
                      {saveStatus === 'success' && <span className="text-[13px] font-bold text-emerald-600 animate-pulse">✓ Saved Successfully!</span>}
                      {saveStatus === 'error' && <span className="text-[13px] font-bold text-rose-500">Error: Create a Team first!</span>}
                      <button type="button" onClick={handleDomainTopicSubmit} className="px-6 py-3 bg-[#FF5F38] hover:bg-[#E54D26] hover:-translate-y-0.5 hover:shadow-lg text-white font-black text-[13px] tracking-wide rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
                        <Save className="w-4 h-4" />
                        Save Domain & Topic Details
                      </button>
                    </div>
                  </form>
                </div>
                )}

                {/* STEP 6 */}
                {(activeSection === 'all' || activeSection === 'papers') && (
                <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        6
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">Step 6: Research Paper Literature Survey 📚</h3>
                        <p className="text-xs text-slate-500">Enter details of at least 5 research papers</p>
                      </div>
                    </div>

                    <span className="badge badge-primary font-mono">
                      {userTeam?.researchPapers?.length || 0} / 5 Papers Added
                    </span>
                  </div>

                  {(userTeam?.researchPapers?.length || 0) < 5 ? (
                  <form onSubmit={handleAddPaperSubmit} className="p-6 rounded-[24px] bg-[#FFF8F4] border border-[#FADCC7]/60 space-y-5 shadow-sm mt-4">
                    <h4 className="text-[14px] font-black text-[#D94625] uppercase tracking-wide flex items-center gap-2">
                      <span>➕</span> Add Research Paper Citation
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Paper Title</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          value={paperTitle}
                          onChange={(e) => setPaperTitle(e.target.value)}
                          placeholder="Full title of the research paper"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Author(s)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          value={paperAuthors}
                          onChange={(e) => setPaperAuthors(e.target.value)}
                          placeholder="e.g. Smith, J., Doe, A."
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Publication / Journal Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-[#FADCC7] rounded-2xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          value={paperPublication}
                          onChange={(e) => setPaperPublication(e.target.value)}
                          placeholder="e.g. IEEE Access or ACM"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-[#111827] mb-2 block tracking-tight">Publication Year</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-[#FADCC7] rounded-2xl text-[14px] font-mono font-semibold text-[#111827] focus:outline-none focus:border-[#FF5F38] focus:ring-4 focus:ring-[#FF5F38]/10 shadow-sm hover:border-[#FADCC7] transition-all placeholder-slate-400"
                          value={paperYear}
                          onChange={(e) => setPaperYear(e.target.value)}
                          placeholder="e.g. 2024"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#D94625] font-black text-[13px] tracking-wide rounded-2xl border border-[#FADCC7] shadow-sm hover:shadow-md transition-all">
                        Add Paper
                      </button>
                    </div>
                  </form>
                  ) : (
                    <div className="p-8 rounded-[24px] bg-emerald-50 border border-emerald-200 shadow-sm mt-4 text-emerald-800 text-center flex flex-col items-center justify-center gap-2">
                       <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-1" />
                       <p className="font-black text-sm tracking-wide uppercase">Literature Survey Completed</p>
                       <p className="text-xs font-semibold text-emerald-700 opacity-90">All 5 required research papers have been uploaded successfully.</p>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#EADBD0] text-slate-500">
                          <th className="py-2 px-2">No.</th>
                          <th className="py-2 px-3">Paper Title</th>
                          <th className="py-2 px-3">Author(s)</th>
                          <th className="py-2 px-3">Publication / Journal</th>
                          <th className="py-2 px-2">Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {userTeam?.researchPapers?.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2 font-mono font-bold text-[#FF5F38]">{idx + 1}</td>
                            <td className="py-2 px-3 font-semibold text-[#111827]">{p.title}</td>
                            <td className="py-2 px-3 text-slate-700">{p.authors}</td>
                            <td className="py-2 px-3 text-slate-500">{p.publication}</td>
                            <td className="py-2 px-2 font-mono text-slate-600">{p.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
                )}

                {/* MARKS DISPLAY */}
                {(activeSection === 'all' || activeSection === 'reports') && (
                <div className="p-5 rounded-[24px] bg-white border border-[#FADCC7] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-4 relative z-10">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFDAC5] text-[#FF5F38] rounded-[10px] flex items-center justify-center shadow-sm">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-black text-[#111827] flex items-center gap-1.5">
                          6th Semester Evaluation <span className="text-[12px] font-medium text-slate-500 tracking-tight">(2-Credit Subject)</span>
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Total Marks: 50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEECE5] text-[#D94625] text-[11px] font-bold rounded-full">
                      <Info className="w-3.5 h-3.5" /> This is the official marks distribution.
                    </div>
                  </div>

                  {/* Middle Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CIA Column */}
                    <div className="p-4 rounded-[20px] bg-[#FFF8F4] border border-[#FADCC7]/60 flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-[#FFDAC5] text-[#D94625] rounded-full flex items-center justify-center">
                             <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-[12px] font-black text-[#D94625] uppercase tracking-wide">CIA EVALUATION</span>
                        </div>
                        <div className="px-3 py-1.5 bg-[#FEECE5] text-[#D94625] font-black rounded-full text-[12px]">
                          25 Marks
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-slate-500 leading-relaxed max-w-sm pl-2 pb-1">
                        Based on the report review-1<br/>and semester activities.
                      </p>
                    </div>

                    {/* End Sem Column */}
                    <div className="p-4 rounded-[20px] bg-[#F9F5FF] border border-[#EBE4FF]/80 flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-[#EBE4FF] text-[#5B42D9] rounded-full flex items-center justify-center">
                             <MonitorPlay className="w-4 h-4" /> 
                          </div>
                          <span className="text-[12px] font-black text-[#5B42D9] uppercase tracking-wide">END SEMESTER EVALUATION</span>
                        </div>
                         <div className="px-3 py-1.5 bg-[#EBE4FF] text-[#5B42D9] font-black rounded-full text-[12px]">
                          25 Marks
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-[14px] p-3 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EBE4FF]">
                           <div className="flex items-center gap-2.5">
                             <div className="w-6 h-6 bg-[#F9F5FF] text-[#8673E6] rounded-full flex items-center justify-center">
                               <User className="w-3 h-3" />
                             </div>
                             <span className="text-[12px] font-semibold text-slate-600">Presentation & Viva</span>
                           </div>
                           <span className="text-[12px] font-bold text-[#5B42D9]">10 Marks</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2.5">
                             <div className="w-6 h-6 bg-[#F9F5FF] text-[#8673E6] rounded-full flex items-center justify-center">
                               <FileText className="w-3 h-3" />
                             </div>
                             <span className="text-[12px] font-semibold text-slate-600">Final Report</span>
                           </div>
                           <span className="text-[12px] font-bold text-[#5B42D9]">15 Marks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Total Row */}
                  <div className="flex items-center justify-between p-3 bg-[#FFF8F4] border border-[#FADCC7]/60 rounded-full mt-1">
                     <div className="flex items-center gap-2.5 pl-2">
                        <Target className="w-5 h-5 text-[#D94625]" />
                        <span className="text-[13px] font-black text-[#D94625] uppercase tracking-wide">TOTAL EVALUATION</span>
                     </div>
                     <div className="flex-1 mx-4 opacity-60">
                        <div className="h-px w-full bg-[#FADCC7]"></div>
                     </div>
                     <div className="px-5 py-1.5 bg-[#FFDAC5] text-[#D94625] font-black rounded-full text-[14px]">
                       50 Marks
                     </div>
                  </div>
                </div>
                )}

                {/* SEMESTER COMPLETE BUTTON */}
                {activeSection === 'all' && progressPercentage === 100 && (
                  <div className="p-6 mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-800">Ready to Submit?</h3>
                      <p className="text-xs text-emerald-600">You have completed all requirements for the 6th Semester.</p>
                    </div>
                    {!isSemesterCompleted ? (
                      <button 
                        type="button"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        onClick={() => setIsSemesterCompleted(true)}
                      >
                        <CheckCircle2 className="w-5 h-5" /> Complete Semester Submission
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled
                        className="px-6 py-3 bg-emerald-700/80 text-white/90 font-black text-sm rounded-xl transition-all flex items-center gap-2 cursor-default shadow-inner"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Completed Successfully
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EADBD0] shadow-sm p-12 text-center rounded-3xl border border-[#EADBD0] bg-white text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-[#FF5F38] opacity-50" />
              <h3 className="text-lg font-bold text-[#111827] mb-1">{selectedSemester} Upcoming</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tasks for {selectedSemester} will unlock automatically upon completion of 6th Semester work.
              </p>
            </div>
          )}

        </div>
      )}

      {showEReportModal && (
        <EReportView team={userTeam} onClose={() => setShowEReportModal(false)} />
      )}
    </div>
  );
}
