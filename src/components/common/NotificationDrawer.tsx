"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import { NotificationItem } from "@/types";
import { Bell, CheckCheck, Users, Compass, BookOpen, AlertCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRespondInvite?: (inviteId: string, action: "ACCEPT" | "REJECT") => void;
}

export function NotificationDrawer({ isOpen, onClose, onRespondInvite }: NotificationDrawerProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotification();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "TEAM_INVITE":
      case "INVITE_ACCEPTED":
      case "INVITE_REJECTED":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "GUIDE_REQUEST":
        return <Compass className="w-4 h-4 text-purple-400" />;
      case "PROJECT_CREATED":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-bold text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 p-1">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-3.5 rounded-xl transition ${
                n.read
                  ? "bg-transparent opacity-80 hover:bg-slate-800/40"
                  : "bg-blue-950/30 border-l-2 border-blue-500 hover:bg-blue-950/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h5 className={`text-xs font-semibold truncate ${n.read ? "text-slate-300" : "text-white"}`}>
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {n.message}
                  </p>

                  {/* If team invitation, show fast action buttons if callback provided */}
                  {n.type === "TEAM_INVITE" && n.metadata?.invitationId && onRespondInvite && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRespondInvite(n.metadata.invitationId, "ACCEPT");
                          markAsRead(n.id);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRespondInvite(n.metadata.invitationId, "REJECT");
                          markAsRead(n.id);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium mt-1"
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
