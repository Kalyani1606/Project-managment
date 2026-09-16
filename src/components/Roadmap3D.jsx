import React, { useState, useEffect, useRef } from 'react';
import { Target, Code, Rocket, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function Roadmap3D({ activeSemester, onSelectSemester, teamProgress = 100 }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const semesters = [
    {
      id: '6th Semester',
      num: '6th',
      title: 'Planning & Research',
      icon: Target,
      color: '#059669',
      badge: '🟢 6th Sem',
      description: 'Team formation, Mentor selection, Domain & Problem statement, 5 Research papers.',
      status: 'Active'
    },
    {
      id: '7th Semester',
      num: '7th',
      title: 'Development & Implementation',
      icon: Code,
      color: '#d97706',
      badge: '🟡 7th Sem',
      description: 'Architecture design, Model training/API dev, System integration & Mid-term demo.',
      status: 'Upcoming'
    },
    {
      id: '8th Semester',
      num: '8th',
      title: 'Final Project & Completion',
      icon: Rocket,
      color: '#2563eb',
      badge: '🔵 8th Sem',
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
    let height = (canvas.height = 240);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 240;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle constellation
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting line
      const nodeXPositions = [width * 0.2, width * 0.5, width * 0.8];
      const lineY = height * 0.5;

      ctx.beginPath();
      ctx.moveTo(nodeXPositions[0], lineY);
      ctx.lineTo(nodeXPositions[2], lineY);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Active progress stroke line
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
    <div className="relative glass-panel glass-panel-glow p-6 overflow-hidden rounded-3xl border border-blue-200 mb-8 bg-gradient-to-br from-white via-slate-50 to-blue-50/50">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              3D Interactive Milestone Roadmap
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Academic Project Journey
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-medium">
              Interactive Roadmap View
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">6th Sem Completion</span>
            <div className="text-sm font-bold text-emerald-600 font-mono">{teamProgress}% Completed</div>
          </div>
          <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${teamProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Canvas Background */}
      <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-white/80 border border-slate-200 flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Interactive 3D Nodes */}
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
                className={`relative group cursor-pointer p-4 rounded-2xl border transition-all duration-300 transform backdrop-blur-md ${
                  isSelected
                    ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10 scale-[1.03] -translate-y-1'
                    : isHovered
                    ? 'bg-white border-slate-300 scale-[1.01] -translate-y-0.5'
                    : 'bg-white/90 border-slate-200'
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    {sem.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Active View
                    </span>
                  )}
                </div>

                {/* Main Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${sem.color}15`,
                      color: sem.color,
                      border: `1px solid ${sem.color}30`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      🎯 {sem.num} Semester
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">{sem.title}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {sem.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">
                    Click to view tasks
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
