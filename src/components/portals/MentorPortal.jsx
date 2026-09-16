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
  ChevronRight
} from 'lucide-react';

export default function MentorPortal() {
  const { data, respondToMentorRequest, addProjectDiaryEntry } = useApp();
  const profile = data.mentorProfile;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTeamId, setSelectedTeamId] = useState(data.teams[0]?.id || '');

  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentsPresentText, setStudentsPresentText] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [guidanceGiven, setGuidanceGiven] = useState('');
  const [workAssigned, setWorkAssigned] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState('');

  const pendingRequests = data.teams.filter(t => t.mentorStatus === 'Pending' || t.status === 'Pending Approval');
  const assignedTeams = data.teams.filter(t => t.mentorStatus === 'Accepted');
  const selectedTeamObj = data.teams.find(t => t.id === selectedTeamId) || assignedTeams[0] || data.teams[0];

  const handleAddDiarySubmit = (e) => {
    e.preventDefault();
    if (!selectedTeamObj || !discussion || !guidanceGiven) return;

    const presentList = studentsPresentText
      ? studentsPresentText.split(',').map(s => s.trim())
      : selectedTeamObj.members.map(m => m.name);

    addProjectDiaryEntry({
      teamId: selectedTeamObj.id,
      teamName: selectedTeamObj.name,
      date: meetingDate,
      studentsPresent: presentList,
      discussion,
      guidanceGiven,
      workAssigned,
      nextMeetingDate: nextMeetingDate || 'TBD'
    });

    setDiscussion('');
    setGuidanceGiven('');
    setWorkAssigned('');
    setStudentsPresentText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-header */}
      <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            🏠 Mentor Dashboard
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'diary'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            📖 Private Project Diary
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            👨‍🏫 Mentor Profile
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="text-teal-700 font-bold">● {profile.fullName}</span>
          <span>•</span>
          <span>{profile.employeeId}</span>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-teal-100 text-teal-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Assigned Teams</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">{assignedTeams.length}</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-[#FF5F38]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Students</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">
                  {assignedTeams.reduce((acc, t) => acc + t.members.length, 0)}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
                <div className="text-xl font-extrabold text-amber-700 font-mono">{pendingRequests.length}</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Upcoming Reviews</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">3</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Diary Entries</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">{data.projectDiary.length}</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" /> Assigned Project Teams
              </h2>
              <span className="text-xs text-slate-500 font-mono">{assignedTeams.length} Active Teams</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedTeams.map(team => (
                <div key={team.id} className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-700 font-mono font-bold">{team.id}</span>
                      <h3 className="text-sm font-bold text-[#111827]">{team.name}</h3>
                    </div>
                    <span className="badge badge-success">{team.domain || 'Domain Set'}</span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-1">
                    <strong className="text-slate-500">Topic:</strong> {team.projectTitle || 'Topic pending'}
                  </p>

                  <div className="pt-2 border-t border-[#EADBD0] flex items-center justify-between text-xs text-slate-500">
                    <span>{team.members.length} Members</span>
                    <button
                      onClick={() => {
                        setSelectedTeamId(team.id);
                        setActiveTab('diary');
                      }}
                      className="text-teal-700 hover:underline font-bold flex items-center gap-1"
                    >
                      Open Project Diary <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIVATE PROJECT DIARY TAB */}
      {activeTab === 'diary' && (
        <div className="space-y-6">
          
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
            <Lock className="w-5 h-5 shrink-0 text-amber-700" />
            <div>
              <span className="font-bold uppercase tracking-wider block">⚠️ Strict Privacy Protection Enforced</span>
              Project Diary entries are strictly hidden from students. They are accessible only to Mentors, Reviewers, and Coordinators to track guidance frequency.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-[#EADBD0] shadow-sm p-5 rounded-3xl border border-[#EADBD0] bg-white space-y-4">
              <h3 className="text-sm font-bold text-[#111827]">Select Team for Diary Record</h3>
              <div className="space-y-2">
                {assignedTeams.map(t => {
                  const isSelected = selectedTeamObj?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all text-xs ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-md shadow-teal-500/20'
                          : 'bg-[#FAF2EC] border-[#EADBD0] text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t.name}</span>
                        <span className="font-mono text-[10px] opacity-80">{t.id}</span>
                      </div>
                      <div className="text-[10px] opacity-90 truncate mt-1">{t.projectTitle || 'No Title'}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              
              <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-teal-600" /> Record Guidance Meeting
                    <span className="text-xs text-[#FF5F38] font-mono">({selectedTeamObj?.name})</span>
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 font-mono font-bold">
                    <Lock className="w-3 h-3" /> Private Diary
                  </span>
                </div>

                <form onSubmit={handleAddDiarySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Meeting Date</label>
                      <input
                        type="date"
                        className="form-input w-full font-mono"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Students Present</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        placeholder="Alex Vance, David Miller, Elena Rostova"
                        value={studentsPresentText}
                        onChange={(e) => setStudentsPresentText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Discussion Summary</label>
                    <textarea
                      rows="2"
                      className="form-textarea w-full"
                      value={discussion}
                      onChange={(e) => setDiscussion(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="form-label">Faculty Guidance Provided</label>
                    <textarea
                      rows="2"
                      className="form-textarea w-full"
                      value={guidanceGiven}
                      onChange={(e) => setGuidanceGiven(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Work Assigned for Next Meeting</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={workAssigned}
                        onChange={(e) => setWorkAssigned(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Next Meeting Date</label>
                      <input
                        type="date"
                        className="form-input w-full font-mono"
                        value={nextMeetingDate}
                        onChange={(e) => setNextMeetingDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-[#0B2E26] hover:bg-[#071f1a] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-2 text-xs">
                      Save Guidance Record
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
                <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                  📖 Guidance History Records for {selectedTeamObj?.name}
                </h3>

                <div className="space-y-3">
                  {data.projectDiary
                    .filter(d => d.teamId === selectedTeamObj?.id)
                    .map(entry => (
                      <div key={entry.id} className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-2">
                        <div className="flex items-center justify-between text-xs border-b border-[#EADBD0] pb-2">
                          <span className="font-bold text-teal-700 font-mono">Date: {entry.date}</span>
                          <span className="text-[10px] text-slate-500">Mentor: {entry.mentorName}</span>
                        </div>
                        <div className="text-xs text-slate-800">
                          <strong className="text-[#FF5F38]">Discussion:</strong> {entry.discussion}
                        </div>
                        <div className="text-xs text-slate-800">
                          <strong className="text-teal-700">Guidance Given:</strong> {entry.guidanceGiven}
                        </div>
                        <div className="text-xs text-slate-800">
                          <strong className="text-amber-800">Work Assigned:</strong> {entry.workAssigned}
                        </div>
                        <div className="pt-2 border-t border-[#EADBD0] flex items-center justify-between text-[11px] text-slate-500">
                          <span>Present: {entry.studentsPresent?.join(', ')}</span>
                          <span className="font-mono text-[#FF5F38]">Next Meeting: {entry.nextMeetingDate}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PENDING REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            🔔 Pending Mentor Supervision Requests ({pendingRequests.length})
          </h2>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No pending mentor requests right now.</div>
            ) : (
              pendingRequests.map(team => (
                <div key={team.id} className="p-4 rounded-2xl bg-[#FAF2EC] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-amber-800 font-bold">{team.id}</span>
                    <h3 className="text-sm font-bold text-[#111827]">{team.name}</h3>
                    <p className="text-xs text-slate-600 mt-1">Domain: {team.domain || 'Not Specified'}</p>
                    <p className="text-xs text-slate-500">Members: {team.members.map(m => m.name).join(', ')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => respondToMentorRequest(team.id, true)}
                      className="px-4 py-2 bg-[#0B2E26] hover:bg-[#071f1a] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-1.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Request
                    </button>
                    <button
                      onClick={() => respondToMentorRequest(team.id, false)}
                      className="btn-danger py-1.5 text-xs"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md max-w-2xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-[#111827] border-b border-[#EADBD0] pb-3">Mentor Profile Information</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Full Name</span>
              <p className="font-bold text-[#111827] text-sm mt-0.5">{profile.fullName}</p>
            </div>
            <div>
              <span className="text-slate-500">Employee ID</span>
              <p className="font-mono font-bold text-[#FF5F38] text-sm mt-0.5">{profile.employeeId}</p>
            </div>
            <div>
              <span className="text-slate-500">Email Address</span>
              <p className="font-semibold text-slate-700 text-sm mt-0.5">{profile.email}</p>
            </div>
            <div>
              <span className="text-slate-500">Department</span>
              <p className="font-semibold text-slate-700 text-sm mt-0.5">{profile.department}</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">Areas of Expertise</span>
              <p className="font-semibold text-teal-700 text-sm mt-0.5">{profile.areaOfExpertise}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
