import React from 'react';
import { X, Printer, FileText, Building, BookOpen, User, Award } from 'lucide-react';

export default function EReportView({ team, onClose }) {
  if (!team) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Action Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Auto-Generated Structured E-Report (6th Semester CIA)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn-primary py-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-Report Document Body */}
        <div className="p-8 bg-white text-slate-900 overflow-y-auto space-y-6 print:p-4">
          
          {/* Cover Header */}
          <div className="text-center border-b border-slate-200 pb-6">
            <div className="text-xs uppercase font-bold tracking-widest text-blue-600 mb-1">
              Department of Computer Applications • Academic Year 2025-2026
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
              PROJECT PROGRESS E-REPORT — 6TH SEMESTER
            </h1>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-mono text-xs border border-blue-200">
              CIA Evaluation Subject Code: BCA-601P (50 Marks Total / 2 Credits)
            </div>
          </div>

          {/* Section 1: Project Details */}
          <div className="glass-panel p-5 rounded-2xl border-slate-200 bg-slate-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" /> 1. Project Overview & Metadata
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Team Name:</span>
                <p className="text-slate-900 font-bold text-sm">{team.name} ({team.id})</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Assigned Mentor:</span>
                <p className="text-slate-900 font-bold text-sm">{team.mentorName || 'Unassigned'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Selected Domain:</span>
                <p className="text-blue-700 font-bold">{team.domain || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Project Title:</span>
                <p className="text-amber-800 font-bold">{team.projectTitle || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Team Members */}
          <div className="glass-panel p-5 rounded-2xl border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> 2. Team Member Roster
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3">Register No</th>
                    <th className="py-2 px-3">Email Address</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {team.members.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-blue-700">{m.role}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{m.regNo}</td>
                      <td className="py-2.5 px-3 text-slate-500">{m.email}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Problem Statement */}
          <div className="glass-panel p-5 rounded-2xl border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> 3. Problem Statement & Scope Rationale
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-600">Domain Interest Rationale:</span>
                <p className="text-slate-800 mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {team.domainReason || 'No details specified yet.'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Problem Statement:</span>
                <p className="text-slate-800 mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {team.problemStatement || 'No details specified yet.'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Technical Scope & Description:</span>
                <p className="text-slate-800 mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {team.shortDescription || 'No details specified yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Literature Review (5 Papers) */}
          <div className="glass-panel p-5 rounded-2xl border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 4. Literature Review (5 Research Papers Summary)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-3">Paper Title</th>
                    <th className="py-2 px-3">Author(s)</th>
                    <th className="py-2 px-3">Publication / Journal</th>
                    <th className="py-2 px-2">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {team.researchPapers.map((paper, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-2 font-mono font-bold text-blue-600">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{paper.title}</td>
                      <td className="py-2.5 px-3 text-slate-700">{paper.authors}</td>
                      <td className="py-2.5 px-3 text-slate-500">{paper.publication}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-600">{paper.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: CIA Marks Summary (25 Marks) */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> 5. Continuous Internal Assessment (CIA) Summary
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                CIA Score: {team.marks?.cia?.total || 25} / 25 Marks
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] pt-2">
              <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                <div className="text-slate-500">Team Form.</div>
                <div className="font-bold text-slate-900 font-mono mt-1">{team.marks?.cia?.teamFormation || 5} / 5</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                <div className="text-slate-500">Mentor Select</div>
                <div className="font-bold text-slate-900 font-mono mt-1">{team.marks?.cia?.mentorSelection || 5} / 5</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                <div className="text-slate-500">Domain ID</div>
                <div className="font-bold text-slate-900 font-mono mt-1">{team.marks?.cia?.domainSelection || 5} / 5</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                <div className="text-slate-500">Problem ID</div>
                <div className="font-bold text-slate-900 font-mono mt-1">{team.marks?.cia?.problemIdentification || 5} / 5</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                <div className="text-slate-500">Literature Rev</div>
                <div className="font-bold text-slate-900 font-mono mt-1">{team.marks?.cia?.researchReview || 5} / 5</div>
              </div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-10 grid grid-cols-3 gap-4 text-center text-xs border-t border-slate-200">
            <div>
              <div className="h-8 border-b border-dashed border-slate-300 mb-1"></div>
              <p className="font-bold text-slate-900">Team Leader Signature</p>
              <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-300 mb-1"></div>
              <p className="font-bold text-slate-900">Project Mentor Signature</p>
              <p className="text-[10px] text-slate-500">{team.mentorName || 'Faculty Supervisor'}</p>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-300 mb-1"></div>
              <p className="font-bold text-slate-900">Project Coordinator Signature</p>
              <p className="text-[10px] text-slate-500">HOD / Department Coordinator</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
