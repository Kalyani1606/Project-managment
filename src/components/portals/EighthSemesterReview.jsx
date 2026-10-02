import React from 'react';
import { Target, CheckCircle, BarChart, FileText, MonitorPlay, Presentation, GitBranch, Award } from 'lucide-react';

const evaluationData = {
  summary: {
    ca: 125,
    ese: 125,
    total: 250
  },
  reviews: [
    {
      id: 1,
      title: "Review 1",
      items: [
        { id: '1-1', title: "Project Implementation Paper", icon: FileText },
        { id: '1-2', title: "Prototype / Working Model", icon: MonitorPlay },
        { id: '1-3', title: "Report & PPT", icon: Presentation },
        { id: '1-4', title: "Integration to Git", icon: GitBranch }
      ]
    },
    {
      id: 2,
      title: "Review 2",
      items: [
        { id: '2-1', title: "Project Implementation Paper", icon: FileText },
        { id: '2-2', title: "Prototype / Working Model", icon: MonitorPlay },
        { id: '2-3', title: "Report & PPT", icon: Presentation },
        { id: '2-4', title: "Integration to Git", icon: GitBranch }
      ]
    }
  ],
  requirements: [
    {
      id: 1,
      title: "Project Implementation Paper",
      desc: "Submit the final implementation/research paper.",
      icon: FileText
    },
    {
      id: 2,
      title: "Prototype / Working Model",
      desc: "Demonstrate the working prototype or completed project.",
      icon: MonitorPlay
    },
    {
      id: 3,
      title: "Report & PPT",
      desc: "Submit the final project report and presentation.",
      icon: Presentation
    },
    {
      id: 4,
      title: "Git Integration",
      desc: "Maintain the project source code and development history using Git.",
      icon: GitBranch
    }
  ]
};

export default function EighthSemesterReview() {
  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="bg-[#FADCC7]/70 p-8 rounded-[24px] text-[#0B2E26] shadow-sm relative overflow-hidden border border-[#FADCC7] flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Decorative dots */}
          <div className="absolute top-6 right-12 w-3 h-3 rounded-full bg-[#FF5F38]"></div>
          <div className="absolute -bottom-3 left-16 w-8 h-8 rounded-full bg-[#FF5F38]/40"></div>

          <div className="relative z-10">
            <h1 className="text-xl font-black text-[#111827] flex items-center gap-2 mb-1">8th Semester</h1>
            <p className="text-xs font-bold text-[#0B2E26]/70 max-w-xl">Final Project Evaluation</p>
          </div>
          
          <div className="relative z-10 bg-white/60 px-5 py-3 rounded-xl border border-white flex flex-col items-end">
            <p className="text-xs font-bold text-[#FF5F38] uppercase tracking-wider mb-1">Total Weight</p>
            <p className="text-xl font-black text-[#0B2E26]">{evaluationData.summary.total} <span className="text-sm">Marks</span></p>
          </div>
        </div>
      </div>

      {/* Marks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[24px] border border-[#EADBD0] shadow-sm flex items-center justify-between hover:border-[#FF5F38] hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#FFF8F4] text-[#FF5F38] flex items-center justify-center border border-[#FADCC7]">
               <Target className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">CA</p>
               <p className="text-xl font-black text-[#111827]">{evaluationData.summary.ca} <span className="text-sm font-medium text-slate-500">Marks</span></p>
             </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-[#EADBD0] shadow-sm flex items-center justify-between hover:border-[#FF5F38] hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#FFF8F4] text-[#FF5F38] flex items-center justify-center border border-[#FADCC7]">
               <Target className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase">ESE</p>
               <p className="text-xl font-black text-[#111827]">{evaluationData.summary.ese} <span className="text-sm font-medium text-slate-500">Marks</span></p>
             </div>
          </div>
        </div>
        <div className="bg-[#FF5F38] p-5 rounded-[24px] shadow-md flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <Award className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center">
               <Award className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-white/90 uppercase">Total Evaluation</p>
               <p className="text-2xl font-black text-white">{evaluationData.summary.total} <span className="text-sm font-medium text-white/80">Marks</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Project Reviews Section */}
      <div className="pt-4">
        <div className="flex items-end justify-between mb-6 px-2">
          <h2 className="text-2xl font-black text-[#111827]">Project Evaluation</h2>
          <span className="bg-[#FFF8F4] text-[#D94625] border border-[#FADCC7] px-3 py-1 rounded-full font-bold text-xs">2 Reviews</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evaluationData.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[24px] border border-[#EADBD0] shadow-sm overflow-hidden hover:shadow-lg hover:border-[#FF5F38] transition-all duration-300 flex flex-col group">
              <div className="p-6 border-b border-[#FADCC7] bg-[#FFF8F4] flex items-center justify-between">
                <h3 className="text-xl font-black text-[#0B2E26]">{review.title}</h3>
                <CheckCircle className="w-5 h-5 text-[#FF5F38]/50 group-hover:text-[#FF5F38] transition-colors" />
              </div>
              <div className="p-6 space-y-3 flex-1">
                {review.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FFF8F4] transition-colors border border-transparent hover:border-[#FADCC7]">
                      <div className="w-10 h-10 rounded-xl bg-[#0B2E26]/5 flex items-center justify-center text-[#FF5F38] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-[#111827] text-sm">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Requirements */}
      <div className="pt-4">
        <h2 className="text-2xl font-black text-[#111827] mb-6 px-2">Final Project Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {evaluationData.requirements.map((req) => {
            const Icon = req.icon;
            return (
              <div key={req.id} className="bg-white p-5 rounded-[24px] border border-[#EADBD0] shadow-sm hover:shadow-md hover:border-[#FF5F38] transition-all duration-300 flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8F4] border border-[#FADCC7] flex items-center justify-center text-[#FF5F38] shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#111827] mb-1">{req.title}</h4>
                  <p className="text-sm font-medium text-slate-500 leading-snug">{req.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Evaluation Summary Box */}
      <div className="pt-4 pb-8">
        <div className="bg-[#0B2E26] rounded-[32px] p-8 md:p-10 shadow-xl overflow-hidden relative border border-[#0B2E26]">
          {/* subtle background graphic */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
            <BarChart className="w-96 h-96 text-white" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2 relative z-10">8th Semester Evaluation</h2>
          <p className="text-emerald-100/70 text-sm mb-8 relative z-10">Cumulative final scoring breakdown.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            {/* Breakdown List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="font-bold text-white/80 uppercase tracking-widest text-sm">CA</span>
                <span className="text-xl font-black text-white">{evaluationData.summary.ca} Marks</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="font-bold text-white/80 uppercase tracking-widest text-sm">ESE</span>
                <span className="text-xl font-black text-white">{evaluationData.summary.ese} Marks</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-black text-[#FF5F38] uppercase tracking-widest text-lg">Total</span>
                <span className="text-3xl font-black text-[#FFDAC5]">{evaluationData.summary.total} Marks</span>
              </div>
            </div>

            {/* Circular Progress Representation */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
                  {/* Progress arc (Full circle for 250/250 visually) */}
                  <circle cx="96" cy="96" r="88" stroke="#FF5F38" strokeWidth="12" fill="transparent" strokeDasharray="553" strokeDashoffset="0" className="drop-shadow-lg" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-4xl font-black text-white">250</p>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
