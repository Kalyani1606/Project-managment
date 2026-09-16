import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, Check, Trash2 } from 'lucide-react';

export default function NotificationDrawer({ onClose }) {
  const { data, markNotificationRead, clearAllNotifications } = useApp();
  const role = data.activeRole;
  const roleNotifications = data.notifications.filter(n => n.role === role || n.role === 'all');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#FAF2EC]/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border-l border-[#EADBD0] h-full p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EADBD0] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF5F38]" />
              <h2 className="text-lg font-bold text-[#111827]">Notifications</h2>
              <span className="text-xs bg-blue-100 text-[#FF5F38] px-2 py-0.5 rounded-full font-mono font-bold">
                {roleNotifications.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {roleNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
                No notifications right now.
              </div>
            ) : (
              roleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-[#FAF2EC] border-[#EADBD0] opacity-75'
                      : 'bg-[#FF5F38]/10/70 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">{notif.text}</p>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F38] shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EADBD0]/60 text-[10px] text-slate-500">
                    <span>{notif.time}</span>
                    <span className="flex items-center gap-1 text-[#FF5F38] font-semibold">
                      <Check className="w-3 h-3" /> {notif.read ? 'Read' : 'Mark Read'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {roleNotifications.length > 0 && (
          <div className="pt-4 border-t border-[#EADBD0]">
            <button
              onClick={clearAllNotifications}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
