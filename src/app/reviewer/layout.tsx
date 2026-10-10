"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ClipboardList,
  Star,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AppProvider } from "@/context/AppContext";

function ReviewerLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { notifications, showToast } = useNotification();
  const router = useRouter();

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?tab=login");
    } else if (!loading && user && user.role !== "REVIEWER") {
      router.push("/");
    }
  }, [user, loading, router]);

  // Detect active tab from URL for highlighting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab") || "dashboard");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF2EC] flex flex-col items-center justify-center text-[#111827]">
        <div className="w-10 h-10 border-3 border-[#FF5F38]/30 border-t-[#FF5F38] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Reviewer Portal...</p>
      </div>
    );
  }

  if (!user || user.role !== "REVIEWER") return null;

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home, href: "/reviewer?tab=dashboard" },
    { key: "projects", label: "Assigned Projects", icon: ClipboardList, href: "/reviewer?tab=projects" },
    { key: "evaluate", label: "Evaluate Projects", icon: Star, href: "/reviewer?tab=evaluate" },
    { key: "history", label: "Evaluation History", icon: History, href: "/reviewer?tab=history" },
    { key: "notifications", label: "Notifications", icon: Bell, href: "/reviewer?tab=notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-serif selection:bg-[#FF5F38] selection:text-white flex">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200/60 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0 z-30 shadow-sm relative">
        {/* Decorative subtle wave at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-50 z-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-[#FF5F38]/10 fill-current transform scale-150 translate-y-10 -translate-x-10">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18.1,97.7,-2.8C97.4,12.5,90.2,27.7,80.1,40.1C70,52.5,57,62.1,42.8,70C28.6,77.9,13.2,84.1,-2.3,88C-17.8,91.9,-33.4,93.5,-46.6,87.6C-59.8,81.7,-70.6,68.3,-78.9,53.8C-87.2,39.3,-93,23.7,-93.6,8.1C-94.2,-7.5,-89.6,-23.1,-80.6,-36.1C-71.6,-49.1,-58.2,-59.5,-44,-66.6C-29.8,-73.7,-14.9,-77.5,1,-79.2C16.9,-80.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="p-8 relative z-10">
          <Link href="/reviewer" className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Layers className="w-8 h-8 text-[#FF5F38]" strokeWidth={2.5} />
              <span className="text-3xl font-black tracking-tight text-[#0A1628] leading-none">
                PROJECT<br />HUB<span className="text-[#FF5F38]">.</span>
              </span>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider bg-[#FF5F38]/10 text-[#FF5F38] border border-[#FF5F38]/20 px-3 py-1 rounded-full mt-5 self-start flex items-center gap-1 shadow-sm">
              <ClipboardCheck className="w-3.5 h-3.5" /> Reviewer Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-1 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#FF5F38] text-white border-2 border-[#0A1628] shadow-md -translate-y-0.5"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#0A1628]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.label}
                {item.key === "notifications" && unreadCount > 0 && (
                  <span className={`ml-auto text-[10px] font-black rounded-full px-2 py-0.5 min-w-[20px] text-center ${isActive ? "bg-white text-[#FF5F38]" : "bg-[#FF5F38] text-white"}`}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="h-px bg-slate-100 mb-4 w-full" />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden min-w-0 z-0 bg-[#FAF2EC]">
        
        {/* MAIN BODY CONTENT */}
        <main className="flex-1 w-full p-4 sm:p-8 relative z-10">
          
          {/* EXACT SCREENSHOT HEADER */}
          <header className="relative w-full bg-gradient-to-r from-[#FFF6EF] via-[#FFE4D6] to-[#FFCCB8] rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between border border-slate-300 shadow-md overflow-hidden mb-8">
            
            {/* Abstract Background Elements (Waves and Clipboard) */}
            <div className="absolute inset-0 pointer-events-none opacity-90 z-0">
              {/* Soft glow behind the clipboard */}
              <div className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[350px] h-[350px] bg-[#FF5F38] rounded-full blur-[100px] opacity-15" />
              
              {/* Decorative blobs behind clipboard */}
              <div className="absolute top-[20%] right-[25%] w-[200px] h-[150px] bg-[#FFB394] rounded-full rotate-45 opacity-40 blur-[4px]" />
              <div className="absolute bottom-[-10%] right-[5%] w-[250px] h-[180px] bg-[#FF8C66] rounded-[100px] -rotate-12 opacity-30 blur-[4px]" />

              {/* Vector Clipboard Illustration (Approximation of screenshot) */}
              <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[200px] h-[220px] rotate-[15deg] translate-y-2">
                
                {/* Dots */}
                <div className="absolute -left-6 top-8 w-3.5 h-3.5 bg-[#FF8C66] rounded-full shadow-sm" />
                <div className="absolute right-4 -top-4 w-5 h-5 bg-[#FF8C66] rounded-full shadow-sm opacity-80" />
                
                {/* Clipboard Base */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[10px_20px_40px_-10px_rgba(255,95,56,0.2)] border border-white flex flex-col items-center pt-10" />
                
                {/* Clip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-[#FFC3A6] rounded-lg shadow-sm" />
                
                {/* Lines on Clipboard */}
                <div className="absolute top-14 left-10 w-24 h-4 bg-[#FFE4D6] rounded-full" />
                <div className="absolute top-22 left-8 w-32 h-4 bg-[#FFE4D6] rounded-full" />
                <div className="absolute top-30 left-8 w-32 h-4 bg-[#FFE4D6] rounded-full" />
              </div>
            </div>

            <div className="relative z-10 flex items-start gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-200/50 mt-1"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="hidden lg:block">
                <h1 className="text-[11px] font-black text-[#FF5F38] uppercase tracking-[0.2em] mb-2">
                  {activeTab === "dashboard" ? "Reviewer Dashboard" :
                   activeTab === "projects" ? "Assigned Projects" :
                   activeTab === "evaluate" ? "Evaluate Projects" :
                   activeTab === "history" ? "Evaluation History" :
                   activeTab === "notifications" ? "Notifications" :
                   "My Profile"}
                </h1>
                <p className="text-[26px] text-[#0A1628] font-black tracking-tight leading-none mb-2">
                  8th Semester Final Year Project Evaluation
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {activeTab === "dashboard" ? "Welcome back! Here's an overview of your assigned projects and their status." : "Manage your evaluation tasks and monitor project progress."}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-5 mt-4 md:mt-0">
              <div className="relative">
                <button
                  onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
                  className="relative p-2 rounded-full hover:bg-white/50 text-[#0A1628] transition cursor-pointer"
                >
                  <Bell className="w-6 h-6 text-[#0A1628] fill-[#0A1628]/10" strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF5F38] text-white text-[10px] font-black leading-none shadow-xs border-2 border-[#FFEBE0]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDrawer
                  isOpen={notificationDrawerOpen}
                  onClose={() => setNotificationDrawerOpen(false)}
                />
              </div>

              <div className="h-10 w-px bg-slate-200/80 mx-1" />

              <div className="flex items-center gap-3 cursor-pointer group hover:bg-white/40 p-1.5 pr-3 rounded-full transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {user.name ? user.name.charAt(0).toUpperCase() : "R"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-black text-[#0A1628] leading-tight">{user.name || "Reviewer"}</span>
                  <span className="text-xs font-bold text-[#FF5F38] leading-tight mt-0.5">External Reviewer</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#0A1628] ml-2 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#FAF2EC] flex items-center justify-center text-xs text-slate-500 font-semibold">Loading Reviewer Portal...</div>}>
        <ReviewerLayoutContent>{children}</ReviewerLayoutContent>
      </Suspense>
    </AppProvider>
  );
}
