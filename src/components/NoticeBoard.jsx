import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, X, Calendar, User, PlusCircle, AlertCircle } from 'lucide-react';

export default function NoticeBoard({ onClose }) {
  const { data, publishNotice } = useApp();
  const isCoordinator = data.activeRole === 'coordinator';

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    publishNotice({ title, priority, content });
    setTitle('');
    setContent('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">📢 Official Notice Board</h2>
              <p className="text-xs text-slate-500">Broadcast announcements from Project Coordinator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCoordinator && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary py-1.5 text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Publish Notice
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Coordinator Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3 mb-6">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Publish New Announcement</h3>
              <div>
                <label className="form-label">Notice Title</label>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="e.g. 6th Semester PPT Submission Guidelines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Priority Level</label>
                  <select
                    className="form-select w-full"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority (Urgent)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Notice Description</label>
                <textarea
                  rows="3"
                  className="form-textarea w-full"
                  placeholder="Write details about deadlines, venue, requirements..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary py-1 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-1 text-xs">
                  Publish Notice
                </button>
              </div>
            </form>
          )}

          {/* Notices List */}
          {data.notices.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No notices posted yet.</div>
          ) : (
            data.notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-2xl border transition-all ${
                  notice.priority === 'high'
                    ? 'bg-amber-50/80 border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {notice.priority === 'high' && (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    {notice.title}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    notice.priority === 'high' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {notice.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">{notice.content}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <User className="w-3 h-3 text-blue-600" /> {notice.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3 h-3 text-emerald-600" /> {notice.date}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
