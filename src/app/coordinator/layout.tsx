"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  UserCheck,
  Megaphone,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  BellRing,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AppProvider } from "@/context/AppContext";

function CoordinatorLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { notifications, refreshNotifications, showToast } = useNotification();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?tab=login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF2EC] flex flex-col items-center justify-center text-[#111827]">
        <div className="w-10 h-10 border-3 border-[#FF5F38]/30 border-t-[#FF5F38] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Coordinator Portal...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-sans selection:bg-[#FF5F38] selection:text-white flex">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-64 bg-[#FAF2EC] border-r border-[#EADBD0] hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0 z-30">
        <div className="p-6">
          <Link href="/coordinator" className="flex flex-col gap-1">
            <span className="text-3xl font-black tracking-tight text-[#111827] leading-none">
              PROJECT<br />HUB<span className="text-[#FF5F38]">.</span>
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-wider bg-[#FF5F38]/15 text-[#FF5F38] px-3 py-1 rounded-full mt-3 self-start flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5F38]" /> Coordinator Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-1">
          <Link
            href="/coordinator?tab=dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              pathname === "/coordinator" && (!searchParams.get("tab") || searchParams.get("tab") === "dashboard")
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <Home className={`w-4 h-4 ${pathname === "/coordinator" && (!searchParams.get("tab") || searchParams.get("tab") === "dashboard") ? "text-white" : "text-slate-400"}`} />
            Dashboard
          </Link>

          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#FF5F38] border-l-2 border-[#FF5F38] pl-2">
              Semester Teams
            </span>
          </div>

          <Link
            href="/coordinator?tab=sem6"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              searchParams.get("tab") === "sem6"
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" /> 6th Sem Teams
          </Link>

          <Link
            href="/coordinator?tab=sem7"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              searchParams.get("tab") === "sem7"
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" /> 7th Sem Teams
          </Link>

          <Link
            href="/coordinator?tab=sem8"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              searchParams.get("tab") === "sem8"
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" /> 8th Sem Teams
          </Link>

          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#FF5F38] border-l-2 border-[#FF5F38] pl-2">
              Communication &amp; Marks
            </span>
          </div>

          <Link
            href="/coordinator?tab=announcements"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              searchParams.get("tab") === "announcements"
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <Megaphone className="w-4 h-4 text-slate-400" /> Announcements
          </Link>

          <Link
            href="/coordinator?tab=marks"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              searchParams.get("tab") === "marks" || searchParams.get("tab") === "reviews"
                ? "bg-[#FF5F38] text-white shadow-md shadow-[#FF5F38]/20"
                : "text-slate-600 hover:bg-[#FF5F38]/10 hover:text-[#FF5F38]"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-400" /> Final Review & Marks
          </Link>
        </nav>

        <div className="p-6 mt-auto">
          <div className="h-px bg-[#EADBD0] mb-4 w-full" />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden min-w-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 bg-[#FAF2EC]/95 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between border-b border-[#EADBD0]/60">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 rounded-lg hover:bg-[#EADBD0]/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
                className="relative p-2 rounded-full hover:bg-slate-200/50 text-[#FF5F38] transition cursor-pointer"
              >
                <Bell className="w-5 h-5 text-[#FF5F38]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF5F38] text-white text-[10px] font-mono font-bold leading-none shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDrawer
                isOpen={notificationDrawerOpen}
                onClose={() => setNotificationDrawerOpen(false)}
              />
            </div>

            <div className="h-6 w-px bg-[#EADBD0] mx-1" />

            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name ? user.name.charAt(0) : "K"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-extrabold text-[#111827] leading-tight">{user.name || "Kalyani"}</span>
                <span className="text-[10px] font-bold text-[#FF5F38] leading-tight">Academic Coordinator</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </div>
          </div>
        </header>

        {/* MOBILE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#FAF2EC] pt-20 px-6 overflow-y-auto w-full h-screen">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-700 rounded-lg bg-white shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-2">
              <Link
                href="/coordinator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-[#FF5F38] text-white"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Link>
            </nav>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 w-full p-4 sm:p-8 relative">{children}</main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#FAF2EC] flex items-center justify-center text-xs text-slate-500 font-semibold">Loading Coordinator Portal...</div>}>
        <CoordinatorLayoutContent>{children}</CoordinatorLayoutContent>
      </Suspense>
    </AppProvider>
  );
}
