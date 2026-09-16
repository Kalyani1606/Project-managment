import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  BookOpen,
  CheckCircle2,
  Calendar,
  Users,
  Eye,
  Star,
  Save
} from 'lucide-react';

export default function ReviewerPortal() {
  const { data, submitReviewerMarks } = useApp();
  const profile = data.reviewerProfile;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTeamId, setSelectedTeamId] = useState(data.teams[0]?.id || '');
  const [reviewName, setReviewName] = useState('6th Semester CIA Review');

  const [scores, setScores] = useState({
    problemUnderstanding: 9,
    literatureReview: 9,
    technicalKnowledge: 8,
    progress: 9,
    presentation: 9
  });
  const [evalComments, setEvalComments] = useState('');

  const selectedTeamObj = data.teams.find(t => t.id === selectedTeamId) || data.teams[0];

  const handleScoreChange = (paramKey, value) => {
    setScores(prev => ({
      ...prev,
      [paramKey]: Math.min(10, Math.max(0, Number(value)))
    }));
  };

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeamObj) return;
    submitReviewerMarks(selectedTeamObj.id, reviewName, scores, evalComments);
    setEvalComments('');
  };

  const totalEvaluatedScore = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-header */}
      <div className="flex items-center justify-between border-b border-[#EADBD0] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            🏠 Reviewer Dashboard
          </button>
          <button
            onClick={() => setActiveTab('evaluate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'evaluate'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            ⭐ Marks Evaluation Panel
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'diary'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 border border-[#EADBD0] hover:bg-slate-100'
            }`}
          >
            📖 Mentor Diary Inspector (Read-Only)
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="text-indigo-700 font-bold">● {profile.fullName}</span>
          <span>•</span>
          <span>{profile.department}</span>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Assigned Teams</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">{data.teams.length}</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-[#FF5F38]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Upcoming Reviews</div>
                <div className="text-xl font-extrabold text-[#111827] font-mono">2</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Evaluated Teams</div>
                <div className="text-xl font-extrabold text-emerald-700 font-mono">{data.evaluations.length}</div>
              </div>
            </div>

            <div className="bg-white border border-[#EADBD0] shadow-sm p-4 rounded-2xl border border-[#EADBD0] bg-white flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Pending Marks Entry</div>
                <div className="text-xl font-extrabold text-amber-700 font-mono">
                  {data.teams.length - data.evaluations.length}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-4">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" /> Target Teams for Assessment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.teams.map(team => (
                <div key={team.id} className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-indigo-700 font-bold">{team.id}</span>
                      <h3 className="text-sm font-bold text-[#111827]">{team.name}</h3>
                    </div>
                    <span className="badge badge-info">{team.currentSemester}</span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-500">Project Title:</strong> {team.projectTitle || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-500">Mentor: {team.mentorName || 'Unassigned'}</p>

                  <div className="pt-2 border-t border-[#EADBD0] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedTeamId(team.id);
                        setActiveTab('diary');
                      }}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF5F38]" /> View Mentor Diary
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTeamId(team.id);
                        setActiveTab('evaluate');
                      }}
                      className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-1 text-xs"
                    >
                      Grade Team <Star className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MARKS EVALUATION PANEL */}
      {activeTab === 'evaluate' && (
        <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-600" /> Rubric Marks Evaluation Form
              </h2>
              <p className="text-xs text-slate-500">Grade team or individual students across 5 evaluation parameters</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block uppercase">Total Score</span>
              <span className="text-xl font-extrabold text-[#FF5F38] font-mono">{totalEvaluatedScore} / 50</span>
            </div>
          </div>

          <form onSubmit={handleEvaluationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Select Team for Evaluation</label>
                <select
                  className="form-select w-full"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  {data.teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Review Event Name</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#EADBD0] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Evaluation Parameters (Configurable Rubric)
              </h3>

              <div className="space-y-4">
                {data.rubricParameters.map(param => (
                  <div key={param.key} className="p-3 rounded-xl bg-white border border-[#EADBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-[#111827]">{param.label}</div>
                      <div className="text-[10px] text-slate-500">Maximum score: {param.maxMarks} Points</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={param.maxMarks}
                        value={scores[param.key] || 0}
                        onChange={(e) => handleScoreChange(param.key, e.target.value)}
                        className="w-32 accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max={param.maxMarks}
                        value={scores[param.key] || 0}
                        onChange={(e) => handleScoreChange(param.key, e.target.value)}
                        className="form-input w-16 text-center font-mono font-bold text-[#FF5F38] text-xs py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Reviewer Comments & Feedback</label>
              <textarea
                rows="3"
                className="form-textarea w-full"
                placeholder="Enter feedback regarding methodology, presentation quality, or literature depth..."
                value={evalComments}
                onChange={(e) => setEvalComments(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-2 text-xs">
                <Save className="w-4 h-4" /> Save Evaluation Marks
              </button>
            </div>
          </form>
        </div>
      )}

      {/* READ-ONLY MENTOR DIARY INSPECTOR */}
      {activeTab === 'diary' && (
        <div className="p-6 rounded-3xl border border-[#EADBD0] bg-white shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF5F38]" /> Mentor Project Diary Inspection (Read-Only)
              </h2>
              <p className="text-xs text-slate-500">Inspect mentor guidance frequency and meeting notes</p>
            </div>
            <select
              className="form-select text-xs py-1"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              {data.teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {data.projectDiary.filter(d => d.teamId === selectedTeamObj?.id).length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No mentor diary records logged for this team yet.</div>
            ) : (
              data.projectDiary
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
                    <div className="text-xs text-slate-500 text-[11px] pt-1">
                      Present Students: {entry.studentsPresent?.join(', ')}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
