import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import Roadmap3D from '../Roadmap3D';
import EReportView from '../common/EReportView';

export default function StudentPortal() {
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
  const userTeam = data.teams.find(t => t.id === profile.teamId) || data.teams[0];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSemester, setSelectedSemester] = useState('6th Semester');
  const [showEReportModal, setShowEReportModal] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...profile });

  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [domain, setDomain] = useState(userTeam?.domain || 'Artificial Intelligence');
  const [domainReason, setDomainReason] = useState(userTeam?.domainReason || '');
  const [projectTitle, setProjectTitle] = useState(userTeam?.projectTitle || '');
  const [problemStatement, setProblemStatement] = useState(userTeam?.problemStatement || '');
  const [shortDescription, setShortDescription] = useState(userTeam?.shortDescription || '');

  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('');
  const [paperPublication, setPaperPublication] = useState('');
  const [paperYear, setPaperYear] = useState('2024');

  const steps = [
    { id: 1, title: 'Create Team', isDone: !!userTeam },
    { id: 2, title: 'Add Members', isDone: userTeam && userTeam.members.length >= 2 },
    { id: 3, title: 'Select Mentor', isDone: userTeam && userTeam.mentorStatus === 'Accepted' },
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
    e.preventDefault();
    if (!userTeam) return;
    setDomainAndTopic(userTeam.id, domain, domainReason, projectTitle, problemStatement, shortDescription);
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
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🏠 Student Dashboard
          </button>
          <button
            onClick={() => setActiveTab('semester')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'semester'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📅 Semester & Events Journey
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            👤 Student Profile
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="text-blue-700 font-bold">● {profile.registerNo}</span>
          <span>•</span>
          <span>{profile.course}</span>
        </div>
      </div>

      {/* ==================== A. STUDENT PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 max-w-4xl mx-auto space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
                <p className="text-xs text-blue-700 font-mono font-bold">Reg. No: {profile.registerNo}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="btn-secondary py-1.5 text-xs"
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
                <button type="submit" className="btn-primary py-2 text-xs">
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== B. STUDENT HOME DASHBOARD TAB ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Interactive 3D Roadmap */}
          <Roadmap3D
            activeSemester={selectedSemester}
            onSelectSemester={(sem) => {
              setSelectedSemester(sem);
              setActiveTab('semester');
            }}
            teamProgress={progressPercentage}
          />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Assigned Team</div>
                <div className="text-sm font-bold text-slate-900">{userTeam ? userTeam.name : 'No Team'}</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Project Mentor</div>
                <div className="text-sm font-bold text-slate-900">{userTeam?.mentorName || 'Not Selected'}</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Upcoming Review</div>
                <div className="text-sm font-bold text-slate-900">Oct 20, 2025</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">CIA Marks Status</div>
                <div className="text-sm font-bold text-emerald-700 font-mono">
                  {userTeam?.marks?.cia?.total || 25} / 25 Marks
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Board & Module Jump Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Notices */}
            <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  📢 Important Coordinator Notices
                </h3>
                <span className="text-xs text-blue-700 font-semibold">Updated today</span>
              </div>

              <div className="space-y-3">
                {data.notices.slice(0, 2).map((notice) => (
                  <div key={notice.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{notice.title}</span>
                      <span className="text-[10px] text-slate-500">{notice.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold mb-2">
                  Active Semester
                </div>
                <h3 className="text-lg font-bold text-slate-900">6th Semester Module</h3>
                <p className="text-xs text-slate-600 mt-1">Complete your team creation, mentor selection, and 5 research paper citations.</p>
              </div>

              <button
                onClick={() => {
                  setSelectedSemester('6th Semester');
                  setActiveTab('semester');
                }}
                className="btn-primary w-full justify-center py-2 text-xs mt-4"
              >
                Go to 6th Sem Module <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ==================== C. EVENTS / SEMESTER PAGE ==================== */}
      {activeTab === 'semester' && (
        <div className="space-y-6">
          
          {/* Semester Selector Tabs */}
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-sm">
            {['6th Semester', '7th Semester', '8th Semester'].map((sem) => {
              const isActive = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

          {/* 6th Semester Detailed Module */}
          {selectedSemester === '6th Semester' ? (
            <div className="space-y-6">
              
              {/* Progress Tracker Card */}
              <div className="glass-panel p-6 rounded-3xl border border-blue-200 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      📊 6th Semester Progress Tracker
                    </h2>
                    <p className="text-xs text-slate-500">Track real-time completion of your 6-step project setup</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-blue-700 font-mono">{progressPercentage}%</span>
                    <button
                      onClick={() => setShowEReportModal(true)}
                      className="btn-success py-1.5 text-xs"
                    >
                      <FileText className="w-4 h-4" /> View Structured E-Report
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 mb-4">
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
                          ? 'bg-blue-50 border-blue-200 text-blue-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">Step {s.id}</div>
                      <div className="text-[11px] truncate mt-0.5">{s.title}</div>
                      <div className="text-xs mt-1">{s.isDone ? '✓ Done' : '⏳ Pending'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Module */}
              <div className="space-y-4">
                
                {/* STEP 1 & 2 */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        1 & 2
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Step 1 & 2: Create Team & Add Team Members 🤝</h3>
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
                      <button type="submit" className="btn-primary py-2 text-xs">
                        Create Team
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-blue-700 font-mono font-bold">Team ID: {userTeam.id}</div>
                          <div className="text-base font-bold text-slate-900">{userTeam.name}</div>
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
                          <button type="submit" className="btn-secondary py-1.5 text-xs whitespace-nowrap">
                            <Send className="w-3.5 h-3.5" /> Send Invite
                          </button>
                        </form>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
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
                                <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                                <td className="py-2.5 px-3 text-slate-600">{m.email}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{m.regNo}</td>
                                <td className="py-2.5 px-3 font-semibold text-blue-700">{m.role}</td>
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

                {/* STEP 3 */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Step 3: Select Faculty Mentor 👨‍🏫</h3>
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
                              ? 'bg-blue-50/70 border-blue-300 shadow-sm'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{m.department}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-3">{m.designation}</p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
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
                                className="btn-secondary py-1 text-xs"
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

                {/* STEP 4 & 5 */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        4 & 5
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Step 4 & 5: Domain Selection & Problem Statement 💡</h3>
                        <p className="text-xs text-slate-500">Define domain, topic, and problem statement</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleDomainTopicSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Broad Project Domain</label>
                        <select
                          className="form-select w-full"
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
                        <label className="form-label">Proposed Project Title</label>
                        <input
                          type="text"
                          className="form-input w-full"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Domain Interest Rationale</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={domainReason}
                        onChange={(e) => setDomainReason(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Problem Statement</label>
                      <textarea
                        rows="2"
                        className="form-textarea w-full"
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="form-label">Technical Scope & Short Description</label>
                      <textarea
                        rows="2"
                        className="form-textarea w-full"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary py-2 text-xs">
                        Save Domain & Topic Details
                      </button>
                    </div>
                  </form>
                </div>

                {/* STEP 6 */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        6
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Step 6: Research Paper Literature Survey 📚</h3>
                        <p className="text-xs text-slate-500">Enter details of at least 5 research papers</p>
                      </div>
                    </div>

                    <span className="badge badge-primary font-mono">
                      {userTeam?.researchPapers?.length || 0} / 5 Papers Added
                    </span>
                  </div>

                  <form onSubmit={handleAddPaperSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-blue-700 uppercase">➕ Add Research Paper Citation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Paper Title</label>
                        <input
                          type="text"
                          className="form-input w-full text-xs"
                          value={paperTitle}
                          onChange={(e) => setPaperTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">Author(s)</label>
                        <input
                          type="text"
                          className="form-input w-full text-xs"
                          value={paperAuthors}
                          onChange={(e) => setPaperAuthors(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">Publication / Journal Name</label>
                        <input
                          type="text"
                          className="form-input w-full text-xs"
                          value={paperPublication}
                          onChange={(e) => setPaperPublication(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">Publication Year</label>
                        <input
                          type="text"
                          className="form-input w-full text-xs font-mono"
                          value={paperYear}
                          onChange={(e) => setPaperYear(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn-secondary py-1.5 text-xs">
                        Add Paper
                      </button>
                    </div>
                  </form>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
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
                            <td className="py-2 px-2 font-mono font-bold text-blue-600">{idx + 1}</td>
                            <td className="py-2 px-3 font-semibold text-slate-900">{p.title}</td>
                            <td className="py-2 px-3 text-slate-700">{p.authors}</td>
                            <td className="py-2 px-3 text-slate-500">{p.publication}</td>
                            <td className="py-2 px-2 font-mono text-slate-600">{p.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* MARKS DISPLAY */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        📝 6th Semester Official Evaluation Marks (2-Credit Subject / 50 Marks Total)
                      </h3>
                      <p className="text-xs text-slate-500">Read-only view of CIA and End Semester marks</p>
                    </div>
                    <span className="badge badge-success font-mono text-sm">
                      Total: {userTeam?.marks?.totalMarks || 0} / 50
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 uppercase">CIA Evaluation</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{userTeam?.marks?.cia?.total || 25} / 25 Marks</span>
                      </div>
                      <p className="text-xs text-slate-500">Generated from structured online e-report tasks.</p>
                      <button onClick={() => setShowEReportModal(true)} className="btn-secondary w-full justify-center py-1 text-xs">
                        <Eye className="w-3.5 h-3.5 text-blue-600" /> View Structured E-Report
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 uppercase">End Semester Viva & Presentation</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{userTeam?.marks?.endSem?.total || 23} / 25 Marks</span>
                      </div>
                      <div className="text-xs text-slate-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Presentation:</span>
                          <span className="font-mono text-slate-500">{userTeam?.marks?.endSem?.presentation || 9} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Report & Viva:</span>
                          <span className="font-mono text-slate-500">{userTeam?.marks?.endSem?.finalReport || 14} / 15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 bg-white text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-blue-600 opacity-50" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedSemester} Upcoming</h3>
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
