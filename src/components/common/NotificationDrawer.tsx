"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import { Bell, CheckCheck, Users, Compass, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRespondInvite?: (inviteId: string, action: "ACCEPT" | "REJECT") => void;
}

export function NotificationDrawer({ isOpen, onClose, onRespondInvite }: NotificationDrawerProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "TEAM_INVITE":
      case "INVITE_ACCEPTED":
      case "INVITE_REJECTED":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "GUIDE_REQUEST":
        return <Compass className="w-4 h-4 text-purple-600" />;
      case "PROJECT_CREATED":
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF5F38]" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#EADBD0] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-[#FAF2EC] border-b border-[#EADBD0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white border border-[#EADBD0] text-[#FF5F38]">
            <Bell className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#111827]">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FF5F38] text-white rounded-full font-mono">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[11px] text-[#FF5F38] hover:text-[#E54D26] font-extrabold flex items-center gap-1 cursor-pointer transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#EADBD0]/50 p-2 space-y-1.5">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 font-medium">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-3.5 rounded-xl transition cursor-pointer ${
                n.read
                  ? "bg-white hover:bg-[#FAF2EC]/50 border border-transparent"
                  : "bg-[#FAF2EC] border-l-4 border-[#FF5F38] hover:bg-[#F5E6DC] shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-[#EADBD0] shrink-0 mt-0.5 shadow-xs">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h5 className={`text-xs font-extrabold truncate ${n.read ? "text-slate-700" : "text-[#111827]"}`}>
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2 font-medium">
                    {n.message}
                  </p>

                  {/* If team invitation, show fast action buttons if callback provided */}
                  {n.type === "TEAM_INVITE" && n.metadata?.invitationId && onRespondInvite && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#EADBD0]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRespondInvite(n.metadata.invitationId, "ACCEPT");
                          markAsRead(n.id);
                        }}
                        className="px-3 py-1 text-[11px] font-extrabold bg-[#FF5F38] hover:bg-[#E54D26] text-white rounded-lg transition shadow-xs cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRespondInvite(n.metadata.invitationId, "REJECT");
                          markAsRead(n.id);
                        }}
                        className="px-3 py-1 text-[11px] font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-200 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] text-[#FF5F38] hover:text-[#E54D26] font-extrabold mt-1 hover:underline"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

