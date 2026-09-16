import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  UserCheck,
  ClipboardList,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useApp();
  
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      icon: GraduationCap,
      description: 'Profile, 3D Roadmap, 6th Sem 6-step journey, team invites, 5 research papers & E-Report.',
      demoUser: 'Alex Vance (21BCA042)',
      bg: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'mentor',
      title: 'Mentor Portal',
      icon: UserCheck,
      description: 'Supervision dashboard, pending team requests, and private project guidance diary.',
      demoUser: 'Dr. Sarah Jenkins (Assoc. Prof)',
      bg: 'from-teal-600 to-blue-600',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'reviewer',
      title: 'Reviewer Portal',
      icon: ClipboardList,
      description: 'Target review teams, read-only mentor diary inspector & 5-parameter rubric evaluation.',
      demoUser: 'Prof. Robert Langford (Senior Reviewer)',
      bg: 'from-indigo-600 to-blue-700',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'coordinator',
      title: 'Coordinator Portal',
      icon: ShieldCheck,
      description: 'System dashboard, team management, mentor workload, review scheduler & export engine.',
      demoUser: 'Dr. Marcus Sterling (HOD & Coordinator)',
      bg: 'from-blue-700 to-slate-900',
      badgeColor: 'bg-blue-100 text-blue-900'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, email, password);
  };

  return (
    <div className="min-h-screen bg-[#FAF2EC] flex flex-col justify-between p-4 md:p-8">
      
      {/* Top University Branding Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#EADBD0]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
              University Academic Project Hub
              <span className="text-xs bg-blue-100 text-[#FF5F38] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                Official Portal v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-500">Final Year Project Tracking & Multi-Portal Management System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Academic Year 2025 - 2026 Live
        </div>
      </div>

      {/* Main Authentication Grid */}
      <div className="max-w-6xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Select Portal & Features */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F38]/10 border border-blue-200 text-[#FF5F38] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5F38]" /> Multi-Portal Authentication
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Select Your Academic Portal Role
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Choose your role below to log in or use the quick one-click demo login to experience any portal.
            </p>
          </div>

          {/* Portal Selector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10 scale-[1.02]'
                      : 'bg-white/80 border-[#EADBD0] hover:border-[#EADBD0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${r.bg} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold text-[#FF5F38] flex items-center gap-1 bg-[#FF5F38]/10 px-2 py-0.5 rounded-full border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#111827]">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {r.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Default Demo:</span>
                    <span className="font-semibold text-slate-700 font-mono">{r.demoUser.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo Login Quick Access Buttons */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5F38] flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> 🚀 Instant One-Click Demo Logins
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => demoLogin('student')}
                className="px-3 py-2 rounded-xl bg-[#FF5F38]/10 hover:bg-blue-100 text-[#FF5F38] text-xs font-bold border border-blue-200 text-center transition-colors"
              >
                👨‍🎓 Student Portal
              </button>
              <button
                type="button"
                onClick={() => demoLogin('mentor')}
                className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 text-center transition-colors"
              >
                👨‍🏫 Mentor Portal
              </button>
              <button
                type="button"
                onClick={() => demoLogin('reviewer')}
                className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 text-center transition-colors"
              >
                📝 Reviewer Portal
              </button>
              <button
                type="button"
                onClick={() => demoLogin('coordinator')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-bold border border-[#EADBD0] text-center transition-colors"
              >
                👨‍💼 Coordinator
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#EADBD0] shadow-xl shadow-blue-500/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#111827]">Sign In to Account</h3>
                <p className="text-xs text-slate-500 mt-1">Enter your credentials for the selected portal</p>
              </div>
              <span className="badge badge-primary font-mono capitalize">
                {selectedRole} Mode
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Email or Register / Employee No</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    className="form-input w-full pl-10 text-sm"
                    placeholder={
                      selectedRole === 'student'
                        ? 'alex.vance@university.edu or 21BCA042'
                        : `${selectedRole}@university.edu`
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label flex items-center justify-between">
                  Password
                  <a href="#" className="text-[11px] text-[#FF5F38] hover:underline">Forgot?</a>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    className="form-input w-full pl-10 text-sm"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#FF5F38] focus:ring-blue-500" defaultChecked />
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer w-full justify-center py-3 text-sm font-bold shadow-lg shadow-blue-500/25 mt-4"
              >
                Log In to {roles.find(r => r.id === selectedRole)?.title} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            🔒 Secured with University SSO Single Sign-On Architecture
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-4 border-t border-[#EADBD0] max-w-6xl mx-auto w-full">
        © 2025-2026 Department of Computer Applications • Final Year Project Portal System
      </div>

    </div>
  );
}
