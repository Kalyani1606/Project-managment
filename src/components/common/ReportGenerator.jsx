import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Printer, BarChart3 } from 'lucide-react';

export default function ReportGenerator() {
  const { data } = useApp();

  const [reportType, setReportType] = useState('student');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [programmeFilter, setProgrammeFilter] = useState('B.C.A');
  const [mentorFilter, setMentorFilter] = useState('All');

  const filteredTeams = data.teams.filter(team => {
    if (semesterFilter !== 'All' && team.currentSemester !== semesterFilter) return false;
    if (mentorFilter !== 'All' && team.mentorId !== mentorFilter) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'student') {
      csvContent += 'Register No,Student Name,Team Name,Mentor,Domain,Project Title,Semester,Total Marks\n';
      filteredTeams.forEach(team => {
        team.members.forEach(m => {
          csvContent += `"${m.regNo}","${m.name}","${team.name}","${team.mentorName || 'Unassigned'}","${team.domain || 'N/A'}","${team.projectTitle || 'N/A'}","${team.currentSemester}",${team.marks?.totalMarks || 0}\n`;
        });
      });
    } else if (reportType === 'batch') {
      csvContent += 'Register No,Student Name,Team Name,CIA Marks (25),End Sem Marks (25),Total Marks (50),Status\n';
      filteredTeams.forEach(team => {
        team.members.forEach(m => {
          csvContent += `"${m.regNo}","${m.name}","${team.name}",${team.marks?.cia?.total || 0},${team.marks?.endSem?.total || 0},${team.marks?.totalMarks || 0},"${team.marks?.status || 'Draft'}"\n`;
        });
      });
    } else {
      csvContent += 'Programme,Total Students,Total Teams,Approved Teams,Average Marks\n';
      csvContent += `"B.C.A",240,60,55,43.5\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Project_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Panel Card */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-200 bg-white no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Academic Report Generator & Export Engine
            </h2>
            <p className="text-xs text-slate-500">Generate filterable official project reports, marks sheets, and programme analytics</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="btn-secondary py-2 text-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV Data
            </button>
            <button onClick={handlePrint} className="btn-primary py-2 text-xs">
              <Printer className="w-4 h-4" /> Print PDF Report
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-slate-200">
          <div>
            <label className="form-label">Report Type</label>
            <select
              className="form-select w-full text-xs"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="student">1. Student Project Report</option>
              <option value="batch">2. Batch-wise Marks Sheet</option>
              <option value="programme">3. Programme Summary Report</option>
            </select>
          </div>

          <div>
            <label className="form-label">Academic Year</label>
            <select
              className="form-select w-full text-xs"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="2025 - 2026">2025 - 2026</option>
              <option value="2024 - 2025">2024 - 2025</option>
            </select>
          </div>

          <div>
            <label className="form-label">Semester</label>
            <select
              className="form-select w-full text-xs"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="All">All Semesters</option>
              <option value="6th Semester">6th Semester</option>
              <option value="7th Semester">7th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
          </div>

          <div>
            <label className="form-label">Programme</label>
            <select
              className="form-select w-full text-xs"
              value={programmeFilter}
              onChange={(e) => setProgrammeFilter(e.target.value)}
            >
              <option value="B.C.A">B.C.A (Computer Applications)</option>
              <option value="B.Sc CS">B.Sc Computer Science</option>
              <option value="B.Tech CSE">B.Tech CSE</option>
            </select>
          </div>

          <div>
            <label className="form-label">Faculty Mentor</label>
            <select
              className="form-select w-full text-xs"
              value={mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value)}
            >
              <option value="All">All Mentors</option>
              {data.mentors.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generated Report Display */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white print:p-0 print:border-none">
        
        {/* Header */}
        <div className="text-center pb-6 mb-6 border-b border-slate-200">
          <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
            UNIVERSITY DEPARTMENT OF COMPUTER APPLICATIONS
          </h1>
          <p className="text-xs text-blue-600 font-semibold mt-0.5">
            Academic Project Assessment & Tracking Official Record
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-2 font-mono">
            <span>Academic Year: {academicYear}</span>
            <span>•</span>
            <span>Programme: {programmeFilter}</span>
            <span>•</span>
            <span>Generated Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* REPORT TYPE 1: Student Project Report */}
        {reportType === 'student' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              📊 Detailed Student Project Report ({filteredTeams.length} Teams Loaded)
            </h3>

            {filteredTeams.map((team, idx) => (
              <div key={team.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-xs font-mono text-blue-600 font-bold mr-2">#{idx + 1}</span>
                    <span className="text-sm font-bold text-slate-900">{team.name} ({team.id})</span>
                    <span className="ml-2 text-xs text-slate-500">Mentor: {team.mentorName || 'Unassigned'}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Total Marks: {team.marks?.totalMarks || 0} / 50
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Domain:</span>
                    <p className="text-slate-900 font-semibold">{team.domain || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Project Title:</span>
                    <p className="text-slate-900 font-semibold">{team.projectTitle || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 mb-1 uppercase">Registered Members</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {team.members.map((m, mIdx) => (
                      <div key={mIdx} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-900">{m.name} ({m.role})</span>
                        <span className="font-mono text-slate-500 text-[11px]">{m.regNo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REPORT TYPE 2: Batch-wise Marks Sheet */}
        {reportType === 'batch' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
              📝 Batch-wise Official Evaluation Marks Sheet
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-3">Reg. No</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3">Team Name</th>
                    <th className="py-2 px-3 text-center">CIA (25)</th>
                    <th className="py-2 px-3 text-center">End Sem (25)</th>
                    <th className="py-2 px-3 text-center">Total (50)</th>
                    <th className="py-2 px-3 text-right">Lock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeams.flatMap(team =>
                    team.members.map(m => (
                      <tr key={m.regNo}>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{m.regNo}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                        <td className="py-2.5 px-3 text-slate-700">{team.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-emerald-700 font-bold">{team.marks?.cia?.total || 0}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-indigo-700 font-bold">{team.marks?.endSem?.total || 0}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-900 font-extrabold text-sm">{team.marks?.totalMarks || 0}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            team.marks?.status === 'Finalized' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {team.marks?.status || 'Draft'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT TYPE 3: Programme Summary Report */}
        {reportType === 'programme' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
              📈 Programme Analytics & Department Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Total Registered Students</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">240</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Total Project Teams</div>
                <div className="text-2xl font-extrabold text-blue-600 mt-1 font-mono">60</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Assigned Mentors</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">20</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Programme Average Score</div>
                <div className="text-2xl font-extrabold text-amber-700 mt-1 font-mono">43.5 / 50</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Domain Distribution Breakdown</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Artificial Intelligence & Machine Learning</span>
                    <span className="font-mono text-blue-700 font-bold">24 Teams (40%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Cybersecurity & IoT</span>
                    <span className="font-mono text-emerald-700 font-bold">15 Teams (25%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[25%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Cloud Computing & DevOps</span>
                    <span className="font-mono text-amber-700 font-bold">12 Teams (20%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full w-[20%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Web & Full Stack Development</span>
                    <span className="font-mono text-indigo-700 font-bold">9 Teams (15%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
