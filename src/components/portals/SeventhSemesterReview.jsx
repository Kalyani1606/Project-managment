import React from 'react';
import { ChevronRight, Calendar, User, FileText, Presentation, CheckCircle, BarChart, Info, Target, Users } from 'lucide-react';

const evaluationData = {
  summary: {
    r1: 50,
    r2: 50,
    total: 100
  },
  review1: {
    title: "Review 1",
    totalMarks: 50,
    items: [
      { id: 1, title: "Project Planning & Proposal", marks: 20, icon: Target },
      { id: 2, title: "Literature Survey", marks: 10, icon: Book },
      { id: 3, title: "Presentation & Report", marks: 20, icon: Presentation }
    ]
  },
  review2: {
    title: "Review 2",
    totalMarks: 50,
    items: [
      { id: 1, title: "Literature Survey", type: "Paper", marks: 15, icon: FileText },
      { id: 2, title: "Review 2 Report", marks: 15, icon: FileText },
      { id: 3, title: "Progress Monitoring", marks: 10, icon: BarChart },
      { id: 4, title: "Presentation", marks: 10, icon: Presentation }
    ]
  },
  schedule: {
    dates: "To be announced",
    conductedOn: "To be announced",
    reviewedBy: "To be assigned"
  }
};
// Helper icon
function Book(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
}

export default function SeventhSemesterReview() {
  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600">7th Semester</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">Project Review</span>
        </div>
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <BarChart className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">7th Semester – Project Review</h1>
            <p className="text-indigo-200 font-medium text-sm sm:text-base max-w-xl">Project Review & Evaluation. Secure your grades by completing both review phases successfully.</p>
          </div>
        </div>
      </div>

      {/* Visual Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <Target className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">Review 1</p>
               <p className="text-lg font-black text-slate-800">{evaluationData.summary.r1} <span className="text-sm font-medium text-slate-500">Marks</span></p>
             </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <Target className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">Review 2</p>
               <p className="text-lg font-black text-slate-800">{evaluationData.summary.r2} <span className="text-sm font-medium text-slate-500">Marks</span></p>
             </div>
          </div>
        </div>
        <div className="bg-indigo-600 p-5 rounded-2xl shadow-md border border-indigo-500 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <CheckCircle className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
             <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
               <AwardIcon />
             </div>
             <div>
               <p className="text-xs font-bold text-indigo-200 uppercase">Total Evaluation</p>
               <p className="text-xl font-black text-white">{evaluationData.summary.total} <span className="text-sm font-medium text-indigo-200">Marks</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Review Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Review 1 Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xl font-black text-indigo-950">{evaluationData.review1.title}</h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">Total: {evaluationData.review1.totalMarks}</span>
          </div>
          <div className="p-6 space-y-4">
            {evaluationData.review1.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      {item.type && <p className="text-xs font-semibold text-slate-500">{item.type}</p>}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-indigo-600 shrink-0 shadow-inner">
                    {item.marks} M
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-5 bg-indigo-900 border-t border-indigo-800 text-white flex justify-between items-center">
            <span className="font-bold text-sm tracking-wide text-indigo-200 uppercase">Total Marks</span>
            <span className="text-2xl font-black">{evaluationData.review1.totalMarks}</span>
          </div>
        </div>

        {/* Review 2 Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xl font-black text-indigo-950">{evaluationData.review2.title}</h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">Total: {evaluationData.review2.totalMarks}</span>
          </div>
          <div className="p-6 space-y-4">
            {evaluationData.review2.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      {item.type && <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded-md">{item.type}</span>}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-indigo-600 shrink-0 shadow-inner">
                    {item.marks} M
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-5 bg-indigo-900 border-t border-indigo-800 text-white flex justify-between items-center">
            <span className="font-bold text-sm tracking-wide text-indigo-200 uppercase">Total Marks</span>
            <span className="text-2xl font-black">{evaluationData.review2.totalMarks}</span>
          </div>
        </div>

      </div>

      {/* Review Schedule / Additional Info */}
      <div className="mt-10">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Review Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Date */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
               <Calendar className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">Review Dates</p>
               <p className="font-bold text-slate-800 mt-0.5">{evaluationData.schedule.dates}</p>
             </div>
           </div>
           
           {/* Conducted On */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
               <CheckCircle className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">Review Conducted On</p>
               <p className="font-bold text-slate-800 mt-0.5">{evaluationData.schedule.conductedOn}</p>
             </div>
           </div>

           {/* Reviewed By */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
               <Users className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">Reviewed By</p>
               <p className="font-bold text-slate-800 mt-0.5">{evaluationData.schedule.reviewedBy}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Information Text */}
      <div className="mt-8 p-4 rounded-xl bg-slate-100 flex items-start gap-3 border border-slate-200">
         <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
         <p className="text-sm font-medium text-slate-600 leading-relaxed">
           <strong className="text-slate-800">Review Information:</strong> Review dates, review schedule and faculty/committee details will be updated by the department.
         </p>
      </div>

    </div>
  );
}

// Icon for Award
function AwardIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
}
