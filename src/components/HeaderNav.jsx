import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  UserCheck,
  ClipboardList,
  ShieldCheck,
  Bell,
  Megaphone,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import NoticeBoard from './NoticeBoard';

export default function HeaderNav() {
  const { data, setRole, logout } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);

  const activeRole = data.activeRole;
  const currentUser = data.currentUser;
  const unreadCount = data.notifications.filter(n => !n.read && n.role === activeRole).length;

  const rolesList = [
    { id: 'student', label: 'Student Portal', icon: GraduationCap, color: 'text-[#FF5F38]' },
    { id: 'mentor', label: 'Mentor Portal', icon: UserCheck, color: 'text-teal-600' },
    { id: 'reviewer', label: 'Reviewer Portal', icon: ClipboardList, color: 'text-indigo-600' },
    { id: 'coordinator', label: 'Coordinator Portal', icon: ShieldCheck, color: 'text-slate-800' }
  ];

  const getProfileName = () => {
    if (currentUser?.fullName) return currentUser.fullName;
    switch (activeRole) {
      case 'student': return data.studentProfile.fullName;
      case 'mentor': return data.mentorProfile.fullName;
      case 'reviewer': return data.reviewerProfile.fullName;
      case 'coordinator': return data.coordinatorProfile.fullName;
      default: return 'User';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 border-b border-[#EADBD0] shadow-sm px-4 py-3 mb-6 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
              Academic Project Hub
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FF5F38]/10 text-[#FF5F38] border border-blue-200">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-500">Final Year Project Tracking System</p>
          </div>
        </div>

        {/* Middle Portal Role Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-[#EADBD0] overflow-x-auto max-w-full">
          {rolesList.map(r => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF5F38] text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-[#111827] hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : r.color}`} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Icons & Logged-In Profile Info */}
        <div className="flex items-center gap-3">
          
          {/* Notice Board Button */}
          <button
            onClick={() => setShowNoticeBoard(true)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-[#EADBD0] text-slate-700 transition-colors"
            title="Important Announcements"
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </button>

          {/* Notifications Drawer Toggle */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-[#EADBD0] text-slate-700 transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4 text-[#FF5F38]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF5F38] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#EADBD0]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[#FF5F38] font-bold text-xs">
                {getProfileName().charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#111827] leading-tight">{getProfileName()}</div>
                <div className="text-[10px] text-[#FF5F38] font-semibold capitalize">{activeRole}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Modals / Drawers */}
      {showNotifications && <NotificationDrawer onClose={() => setShowNotifications(false)} />}
      {showNoticeBoard && <NoticeBoard onClose={() => setShowNoticeBoard(false)} />}
    </header>
  );
}
