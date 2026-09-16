import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, BookOpen, Code, Rocket } from 'lucide-react';

export default function Roadmap3D({ activeSemester, onSelectSemester, teamProgress = 100 }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const semesters = [
    {
      id: '6th Semester',
      num: '6th',
      title: 'Planning & Research',
      icon: BookOpen,
      color: '#FF5F38',
      badge: '?? 6th Sem',
      description: 'Team formation, Mentor selection, Domain & Problem statement, 5 Research papers.',
      status: 'In Progress'
    },
    {
      id: '7th Semester',
      num: '7th',
      title: 'Development & Implementation',
      icon: Code,
      color: '#0B2E26',
      badge: '?? 7th Sem',
      description: 'Architecture design, Model training/API dev, System integration & Mid-term demo.',
      status: 'Upcoming'
    },
    {
      id: '8th Semester',
      num: '8th',
      title: 'Final Project & Completion',
      icon: Rocket,
      color: '#2563eb',
      badge: '?? 8th Sem',
      description: 'Performance benchmarking, Final viva presentation, Thesis submission & Publication.',
      status: 'Upcoming'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 220);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 220;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.35 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(255, 95, 56, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const nodeXPositions = [width * 0.2, width * 0.5, width * 0.8];
      const lineY = height * 0.5;

      ctx.beginPath();
      ctx.moveTo(nodeXPositions[0], lineY);
      ctx.lineTo(nodeXPositions[2], lineY);
      ctx.strokeStyle = 'rgba(11, 46, 38, 0.15)';
      ctx.lineWidth = 4;
      ctx.stroke();

      const activeProgressX = nodeXPositions[0] + (nodeXPositions[2] - nodeXPositions[0]) * (teamProgress / 100);
      ctx.beginPath();
      ctx.moveTo(nodeXPositions[0], lineY);
      ctx.lineTo(activeProgressX, lineY);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [teamProgress]);

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl border border-[#EADBD0] mb-8 bg-gradient-to-br from-white via-[#FAF2EC]/60 to-orange-50/40 shadow-xl overflow-hidden">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#FF5F38]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5F38] font-mono">
              3D Interactive Milestone Roadmap
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#111827] flex items-center gap-3">
            Academic Project Journey
            <span className="text-xs px-3 py-1 rounded-full bg-[#FF5F38]/10 text-[#FF5F38] font-bold border border-[#FF5F38]/20">
              Interactive Roadmap View
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">6th Sem Completion</span>
            <div className="text-sm font-black text-emerald-700 font-mono">{teamProgress}% Completed</div>
          </div>
          <div className="w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-[#EADBD0]">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${teamProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-white/90 border border-[#EADBD0] shadow-inner flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Interactive Milestone Nodes */}
        <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {semesters.map((sem) => {
            const Icon = sem.icon;
            const isSelected = activeSemester === sem.id;
            const isHovered = hoveredNode === sem.id;

            return (
              <div
                key={sem.id}
                onClick={() => onSelectSemester(sem.id)}
                onMouseEnter={() => setHoveredNode(sem.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative group cursor-pointer p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                  isSelected
                    ? 'bg-white border-[#FF5F38] ring-2 ring-[#FF5F38]/20 shadow-xl scale-[1.03] -translate-y-1'
                    : isHovered
                    ? 'bg-white border-[#EADBD0] scale-[1.01] -translate-y-0.5 shadow-md'
                    : 'bg-white/90 border-[#EADBD0]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF2EC] text-slate-700 font-mono border border-[#EADBD0]">
                    {sem.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active View
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                    style={{
                      backgroundColor: `${sem.color}15`,
                      color: sem.color,
                      border: `1px solid ${sem.color}30`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#FF5F38] transition-colors">
                      ?? {sem.num} Semester
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">{sem.title}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {sem.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-semibold group-hover:text-[#111827] transition-colors">
                    Click to view tasks
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5F38] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
