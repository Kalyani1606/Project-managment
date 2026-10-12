import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, X, Calendar, User, PlusCircle, AlertCircle, Paperclip, UploadCloud, FileText, Download } from 'lucide-react';

export default function NoticeBoard({ onClose }) {
  const { data, publishNotice } = useApp();
  const isCoordinator = data.activeRole === 'coordinator';

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            id: `FILE-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            sizeFormatted: formatFileSize(file.size),
            dataUrl: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const downloadFile = (file) => {
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    publishNotice({ title, priority, content, files });
    setTitle('');
    setContent('');
    setFiles([]);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF2EC]/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#EADBD0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EADBD0] bg-[#FAF2EC]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827]">📢 Official Notice Board</h2>
              <p className="text-xs text-slate-500">Broadcast announcements from Project Coordinator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCoordinator && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-1.5 text-xs"
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

              {/* Attach File Option */}
              <div>
                <label className="form-label flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <Paperclip className="w-3.5 h-3.5 text-[#FF5F38]" /> Attach Document / Circular (Optional)
                </label>
                <label className="flex items-center justify-center p-3 border border-dashed border-[#EADBD0] hover:border-[#FF5F38] rounded-xl bg-[#FAF2EC]/50 hover:bg-[#FAF2EC] transition-all cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <UploadCloud className="w-4 h-4 text-[#FF5F38]" />
                    <span className="font-semibold text-[#111827]">Upload attachments</span> (PDF, DOCX, XLSX, etc.)
                  </div>
                </label>
                {files.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#EADBD0] text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#FF5F38] shrink-0" />
                          <span className="font-bold text-[#111827] truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({f.sizeFormatted})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((item) => item.id !== f.id))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0B2E26] font-bold text-xs rounded-xl border border-[#EADBD0] shadow-sm transition-all cursor-pointer py-1 text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer py-1 text-xs">
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
                    : 'bg-[#FAF2EC] border-[#EADBD0]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
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
                {notice.files && notice.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {notice.files.map((file, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#FAF2EC] border border-[#EADBD0] text-slate-700 hover:text-[#FF5F38] rounded-lg text-[11px] font-semibold transition cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3 text-[#FF5F38]" />
                        <span className="truncate max-w-[180px]">{file.name}</span>
                        {file.sizeFormatted && (
                          <span className="text-[10px] text-slate-400 font-mono">({file.sizeFormatted})</span>
                        )}
                        <Download className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#EADBD0]/60">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <User className="w-3 h-3 text-[#FF5F38]" /> {notice.author}
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
