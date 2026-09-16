import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Check
} from 'lucide-react';
import ReportGenerator from '../common/ReportGenerator';

export default function CoordinatorPortal() {
  const {
    data,
    toggleRegisterLock,
    approveTeamStatus,
    scheduleReview,
    updateMarksStatus
  } = useApp();

  const profile = data.coordinatorProfile;

  const [activeTab, setActiveTab] = useState('dashboard');

  const [revSemester, setRevSemester] = useState('6th Semester');
  const [revName, setRevName] = useState('');
  const [revDate, setRevDate] = useState('');
  const [revTime, setRevTime] = useState('10:00 AM - 01:00 PM');
  const [revVenue, setRevVenue] = useState('Seminar Hall 2');
  const [revReviewer, setRevReviewer] = useState(data.reviewers[0]?.name || '');

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!revName || !revDate) return;
    scheduleReview({
      semester: revSemester,
      reviewName: revName,
      date: revDate,
      time: revTime,
      venue: revVenue,
      assignedReviewer: revReviewer,
      teamsAssigned: ['TEAM-01', 'TEAM-02']
    });
    setRevName('');
    setRevDate('');
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🏠 Master Dashboard
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'teams'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            👥 Teams ({data.teams.length})
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'mentors'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            👨‍🏫 Mentors ({data.mentors.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📅 Review Scheduling
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'marks'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📊 Marks Management
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'diary'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📖 Diary Monitor
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📈 Reports & Export
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="text-blue-700 font-bold">● {profile.fullName}</span>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Students</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">240</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Teams</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{data.teams.length}</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Faculty Mentors</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{data.mentors.length}</div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Pending Teams</div>
                <div className="text-xl font-extrabold text-amber-700 font-mono">
                  {data.teams.filter(t => t.status === 'Pending Approval').length}
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Scheduled Reviews</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{data.reviews.length}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700" /> Student Profile Register Number Security Lock
              </h3>
              <p className="text-xs text-slate-500">Locking prevents students from editing their official Register Number</p>
            </div>

            <button
              onClick={toggleRegisterLock}
              className={`btn-${data.studentProfile.registerNoLocked ? 'danger' : 'success'} py-1.5 text-xs`}
            >
              {data.studentProfile.registerNoLocked ? (
                <> <Lock className="w-3.5 h-3.5" /> Register No LOCKED </>
              ) : (
                <> <Unlock className="w-3.5 h-3.5" /> Register No UNLOCKED </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TEAM MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Master Team Management Panel
            </h2>
            <span className="text-xs text-slate-500 font-mono">{data.teams.length} Teams Registered</span>
          </div>

          <div className="space-y-4">
            {data.teams.map(team => (
              <div key={team.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-700 font-bold">{team.id}</span>
                    <h3 className="text-sm font-bold text-slate-900">{team.name}</h3>
                    <span className={`badge ${team.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                      {team.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Domain: {team.domain || 'Not set'}</p>
                  <p className="text-xs text-slate-500">Mentor: {team.mentorName || 'Unassigned'}</p>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Members: {team.members.map(m => `${m.name} (${m.regNo})`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {team.status === 'Pending Approval' ? (
                    <button
                      onClick={() => approveTeamStatus(team.id, 'Approved')}
                      className="btn-success py-1.5 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Team
                    </button>
                  ) : (
                    <button
                      onClick={() => approveTeamStatus(team.id, 'Pending Approval')}
                      className="btn-secondary py-1.5 text-xs"
                    >
                      Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENTORS & WORKLOAD */}
      {activeTab === 'mentors' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Faculty Mentor Workload Balancing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.mentors.map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                    <p className="text-xs text-slate-500">{m.department}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {m.assignedTeamsCount} / {m.maxTeams} Teams
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all"
                    style={{ width: `${(m.assignedTeamsCount / m.maxTeams) * 100}%` }}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Expertise: {m.expertise?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEW SCHEDULING */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white max-w-3xl mx-auto space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Schedule New Semester Review
            </h2>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Semester</label>
                  <select className="form-select w-full" value={revSemester} onChange={(e) => setRevSemester(e.target.value)}>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Review Event Name</label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input w-full font-mono"
                    value={revDate}
                    onChange={(e) => setRevDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Time Window</label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={revTime}
                    onChange={(e) => setRevTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Venue / Room</label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={revVenue}
                    onChange={(e) => setRevVenue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Assigned Reviewer</label>
                  <select className="form-select w-full" value={revReviewer} onChange={(e) => setRevReviewer(e.target.value)}>
                    {data.reviewers.map(r => (
                      <option key={r.id} value={r.name}>{r.name} ({r.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary py-2 text-xs">
                  Publish Review Schedule
                </button>
              </div>
            </form>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Scheduled Review Events</h3>
            <div className="space-y-3">
              {data.reviews.map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="badge badge-primary">{r.semester}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{r.reviewName}</h4>
                    <p className="text-slate-500">Date: {r.date} • Time: {r.time} • Venue: {r.venue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Reviewer:</span>
                    <p className="font-bold text-blue-700">{r.assignedReviewer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MARKS MANAGEMENT */}
      {activeTab === 'marks' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Master Marks Verification & Final Lock
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 px-3">Team</th>
                  <th className="py-2 px-3">Mentor</th>
                  <th className="py-2 px-3 text-center">CIA (25)</th>
                  <th className="py-2 px-3 text-center">End Sem (25)</th>
                  <th className="py-2 px-3 text-center">Total (50)</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-right">Lock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.teams.map(team => (
                  <tr key={team.id}>
                    <td className="py-3 px-3 font-bold text-slate-900">{team.name} ({team.id})</td>
                    <td className="py-3 px-3 text-slate-700">{team.mentorName || 'Unassigned'}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-700 font-bold">{team.marks?.cia?.total || 25}</td>
                    <td className="py-3 px-3 text-center font-mono text-indigo-700 font-bold">{team.marks?.endSem?.total || 23}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-900 font-extrabold text-sm">{team.marks?.totalMarks || 48}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`badge ${
                        team.marks?.status === 'Finalized' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {team.marks?.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right flex justify-end gap-1">
                      <button
                        onClick={() => updateMarksStatus(team.id, 'Verified')}
                        className="btn-secondary py-1 text-[11px]"
                      >
                        Verify 🟢
                      </button>
                      <button
                        onClick={() => updateMarksStatus(team.id, 'Finalized')}
                        className="btn-primary py-1 text-[11px]"
                      >
                        Final Lock 🔒
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIARY MONITOR */}
      {activeTab === 'diary' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            📖 Project Diary Guidance Frequency Audit
          </h2>

          <div className="space-y-3">
            {data.teams.map(team => {
              const entries = data.projectDiary.filter(d => d.teamId === team.id);
              const lastEntry = entries[0];
              return (
                <div key={team.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900">{team.name}</h3>
                    <p className="text-slate-500">Mentor: {team.mentorName || 'Unassigned'}</p>
                    <p className="text-blue-700 mt-1 font-semibold">Total Guidance Meetings: {entries.length}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Last Meeting Date:</span>
                    <p className="font-mono text-emerald-700 font-bold">{lastEntry ? lastEntry.date : 'No Meetings'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORTS */}
      {activeTab === 'reports' && (
        <ReportGenerator />
      )}

    </div>
  );
}
