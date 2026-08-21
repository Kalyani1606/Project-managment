"use client";

import React, { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { EmailLogItem } from "@/types";
import { X, Mail, RefreshCw, Key, ShieldCheck, Clock, Send } from "lucide-react";

export function DevMailboxModal() {
  const { isDevMailboxOpen, closeDevMailbox } = useNotification();
  const [emails, setEmails] = useState<EmailLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailLogItem | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emails/recent");
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.emails?.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load email logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDevMailboxOpen) {
      fetchEmails();
    }
  }, [isDevMailboxOpen]);

  if (!isDevMailboxOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeDevMailbox}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/80 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Institutional Email Dispatcher</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  Dev Mailbox Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect simulated automated university emails and generated student credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmails}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Refresh Mailbox"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={closeDevMailbox}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - 2 column layout: Email List & Email Viewer */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[450px]">
          {/* Left Email List */}
          <div className="md:col-span-5 border-r border-slate-800 bg-slate-950/50 overflow-y-auto p-3 space-y-2">
            {emails.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No dispatched emails in system yet.
              </div>
            ) : (
              emails.map((e) => {
                const isSelected = selectedEmail?.id === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEmail(e)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      isSelected
                        ? "bg-blue-950/60 border-blue-500 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-cyan-400 truncate max-w-[160px]">
                        To: {e.toEmail}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(e.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="font-medium text-xs text-white truncate mb-1">{e.subject}</div>
                    <div className="text-[11px] text-slate-400 truncate opacity-80">{e.textBody}</div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Email Preview */}
          <div className="md:col-span-7 bg-slate-900 overflow-y-auto p-5">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white mb-2">{selectedEmail.subject}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Recipient:</span>{" "}
                      <span className="text-cyan-300 font-mono font-medium">{selectedEmail.toEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Timestamp:</span>{" "}
                      <span className="text-slate-300">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Render HTML or text */}
                <div
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody || selectedEmail.textBody }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select an email from the left to inspect its contents.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure TLS Email Delivery Simulator</span>
          </div>
          <button
            onClick={closeDevMailbox}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
