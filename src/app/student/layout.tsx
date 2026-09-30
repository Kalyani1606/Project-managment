"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  User,
  LogOut,
  Bell,
  Mail,
  Menu,
  X,
  Users,
  Award,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Calendar,
  Lightbulb,
  FileText,
  Search
} from "lucide-react";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";
import StudentProfilePage from "./profile/page";

export default function AppPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { notifications, refreshNotifications, showToast } = useNotification();
  const pathname = usePathname();
  const router = useRouter();

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    
    if (user?.role === "TEACHER" || user?.role === "HOD") {
      setProfileComplete(true);
    } else if (user && user.studentProfile && !loading) {
      if (
        !user.studentProfile.github ||
        !user.studentProfile.linkedin
      ) {
        setProfileComplete(false);
      } else {
        setProfileComplete(true);
      }
    }
  }, [user, loading, router]);

  const handleRespondInvite = async (inviteId: string, action: "ACCEPT" | "REJECT") => {
    try {
      const res = await fetch(`/api/teams/invitations/${inviteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, action === "ACCEPT" ? "success" : "info");
        refreshNotifications();
        router.refresh();
      } else {
        showToast(data.error || "Failed to respond to invite", "error");
      }
    } catch (err) {
      showToast("Network error responding to invitation", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF2EC] flex flex-col items-center justify-center text-[#111827]">
        <div className="w-10 h-10 border-3 border-[#0B2E26]/30 border-t-[#0B2E26] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Academic Portal...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const portalItems = [
    {
      name: "Student Dashboard",
      href: "/student",
      icon: "🏡",
    },
    {
      name: "Semester & Events Journey",
      href: "/student/events",
      icon: "🗓️",
    },
    {
      name: "Student Profile",
      href: "/student/profile",
      icon: "👤",
    },
  ];

  const isMentor = user?.role === "TEACHER" || pathname.startsWith("/mentor");

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-sans selection:bg-[#FF5F38] selection:text-white flex">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-64 bg-[#FAF2EC] border-r border-[#EADBD0] hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="flex flex-col gap-1">
            <span className="text-3xl font-black tracking-tight text-[#111827] leading-none">
              PROJECT<br />HUB<span className="text-[#FF5F38]">.</span>
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-wider bg-[#FF5F38]/15 text-[#FF5F38] px-3 py-1 rounded-full mt-3 self-start">
              {isMentor ? "Faculty Mentor Portal" : "Student Portal"}
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {isMentor ? (
            <>
              <Link href="/mentor" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/mentor' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Home className={`w-5 h-5 ${pathname === '/mentor' ? 'text-white' : 'text-slate-400'}`} /> Mentor Dashboard
              </Link>
              <Link href="/student" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Users className={`w-5 h-5 ${pathname === '/student' ? 'text-white' : 'text-slate-400'}`} /> Student Directory
              </Link>
            </>
          ) : (
            <>
              {/* Dashboard */}
              <Link href="/student" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Home className={`w-5 h-5 ${pathname === '/student' ? 'text-white' : 'text-slate-400'}`} /> Dashboard
              </Link>
              
              <Link href="/student/profile" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/profile' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <User className={`w-5 h-5 ${pathname === '/student/profile' ? 'text-white' : 'text-slate-400'}`} /> My Profile
              </Link>
              
              <Link href="/student/events" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/events' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Calendar className={`w-5 h-5 ${pathname === '/student/events' ? 'text-white' : 'text-slate-400'}`} /> Events & Tasks
              </Link>
              
              <Link href="/student/team" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/team' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Users className={`w-5 h-5 ${pathname === '/student/team' ? 'text-white' : 'text-slate-400'}`} /> My Team
              </Link>

              <Link href="/student/domain" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/domain' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <Lightbulb className={`w-5 h-5 ${pathname === '/student/domain' ? 'text-white' : 'text-slate-400'}`} /> Domain & Topic
              </Link>

              <Link href="/student/papers" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/papers' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <BookOpen className={`w-5 h-5 ${pathname === '/student/papers' ? 'text-white' : 'text-slate-400'}`} /> Research Papers
              </Link>

              <Link href="/student/reports" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${pathname === '/student/reports' ? 'bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20' : 'text-slate-500 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]'}`}>
                <FileText className={`w-5 h-5 ${pathname === '/student/reports' ? 'text-white' : 'text-slate-400'}`} /> Report & Marks
              </Link>
            </>
          )}
        </nav>

        <div className="p-6 mt-auto">
          <div className="h-px bg-slate-200 mb-4 w-full"></div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut className="w-5 h-5 text-slate-400" /> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* NEW TOP HEADER */}
        <header className="sticky top-0 z-40 bg-[#FAF2EC]/95 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
             {/* Mobile Menu Toggle */}
             <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

             {/* Search Bar */}
             <div className="hidden md:flex relative max-w-lg w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search teams, mentors, notices..." 
                 className="w-full bg-slate-100/80 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5F38]/30 transition-all"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
             <div className="relative">
                <button
                  onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
                  className="relative p-2.5 rounded-full hover:bg-slate-200/50 text-slate-600 transition"
                >
                  <Bell className="w-5 h-5 text-amber-700 fill-amber-700/20" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5F38] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5F38]" />
                    </span>
                  )}
                </button>
                <NotificationDrawer
                  isOpen={notificationDrawerOpen}
                  onClose={() => setNotificationDrawerOpen(false)}
                  onRespondInvite={handleRespondInvite}
                />
             </div>

             <div className="flex items-center gap-3">
               <img src={user?.studentProfile?.profilePicture || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
               <div className="hidden sm:block text-right">
                 <div className="text-sm font-bold text-[#111827]">{user.name}</div>
                 <div className="text-xs font-semibold text-slate-500">
                    {isMentor ? (user?.teacherProfile?.designation || "Faculty Mentor") : `${user?.studentProfile?.semester || 6}th Semester`}
                  </div>
                 {!profileComplete && pathname !== "/student/profile" && (
                   <Link href="/student/profile" className="text-[10px] bg-[#FF5F38] text-white px-2 py-0.5 rounded-full font-bold mt-1 inline-block hover:bg-[#E54D26] transition-colors shadow-sm">
                     Complete Profile
                   </Link>
                 )}
               </div>
             </div>
          </div>
        </header>

        {/* Mobile Nav overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#FAF2EC] pt-20 px-6 overflow-y-auto w-full h-screen">
            <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-700 rounded-lg bg-white shadow-sm"
              >
                <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-2">
              <Link href="/student" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-3xl text-base font-bold ${pathname === '/student' ? 'bg-[#FF5F38] text-white shadow-md' : 'text-slate-600 bg-white shadow-sm'}`}>
                <Home className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/student/profile" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-3xl text-base font-bold ${pathname === '/student/profile' ? 'bg-[#FF5F38] text-white shadow-md' : 'text-slate-600 bg-white shadow-sm'}`}>
                <User className="w-5 h-5" /> My Profile
              </Link>
              <Link href="/student/events" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-3xl text-base font-bold ${pathname === '/student/events' ? 'bg-[#FF5F38] text-white shadow-md' : 'text-slate-600 bg-white shadow-sm'}`}>
                <Calendar className="w-5 h-5" /> Events & Tasks
              </Link>
              <Link href="/student/team" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-3xl text-base font-bold ${pathname === '/student/team' ? 'bg-[#FF5F38] text-white shadow-md' : 'text-slate-600 bg-white shadow-sm'}`}>
                <Users className="w-5 h-5" /> My Team
              </Link>
            </nav>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 w-full p-4 sm:p-8 relative">
          {children}
        </main>
        
        <DevMailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
      </div>
    </div>
  );
}
