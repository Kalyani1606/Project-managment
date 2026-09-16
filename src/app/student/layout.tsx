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
  PlusCircle,
  Menu,
  X,
  Users,
  Award,
  ShieldCheck,
  BookOpen,
  FolderGit2
} from "lucide-react";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
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
      name: "Student Portal",
      href: "/student",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "Mentor Portal",
      href: "/mentor",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Reviewer Portal",
      href: "/reviewer",
      icon: <Award className="w-4 h-4" />,
    },
    {
      name: "Coordinator Portal",
      href: "/coordinator",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-sans selection:bg-[#FF5F38] selection:text-white flex flex-col">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF2EC]/95 backdrop-blur-md border-b border-[#EADBD0] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-[#111827] flex items-center">
              PROJECT HUB<span className="text-[#FF5F38] text-3xl font-black leading-none">.</span>
            </span>
            <span className="ml-1 text-[10px] font-extrabold tracking-wider bg-[#FF5F38]/15 text-[#FF5F38] px-2.5 py-0.5 rounded-full uppercase">
              ACADEMIC PORTALS
            </span>
          </Link>

          {/* Navigation Links for 4 Portals */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/80 border border-[#EADBD0] rounded-full shadow-sm">
            {portalItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition duration-200 ${
                    isActive
                      ? "bg-[#0B2E26] text-white shadow-md"
                      : "text-slate-700 hover:text-[#FF5F38] hover:bg-[#FAF2EC]"
                  }`}
                >
                  <span className={isActive ? "text-[#FF5F38]" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dev Mailbox Button */}
            <button
              onClick={() => setIsMailboxOpen(true)}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-[#EADBD0] text-slate-700 transition shadow-sm"
              title="Dev Mailbox"
            >
              <Mail className="w-4 h-4 text-[#0B2E26]" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
                className="relative p-2.5 rounded-full bg-white hover:bg-slate-100 border border-[#EADBD0] text-slate-700 transition shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#FF5F38]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
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

            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EADBD0] text-xs font-bold text-slate-800">
              <User className="w-3.5 h-3.5 text-[#FF5F38]" />
              <span>{user.name.split(" ")[0]}</span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-200/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-[#EADBD0] space-y-2 animate-fadeIn">
            {portalItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isActive ? "bg-[#0B2E26] text-white" : "text-slate-700 hover:bg-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>

      <DevMailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
    </div>
  );
}
