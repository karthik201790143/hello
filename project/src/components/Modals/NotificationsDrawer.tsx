import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Bell, X, CheckCheck, Wrench, FileSpreadsheet, CloudSun, Server } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const { notifications, isNotificationsDrawerOpen, setIsNotificationsDrawerOpen, markNotificationRead, markAllNotificationsRead } = useDashboard();

  if (!isNotificationsDrawerOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench size={16} className="text-blue-500 mt-0.5 shrink-0" />;
      case 'audit':
        return <FileSpreadsheet size={16} className="text-purple-500 mt-0.5 shrink-0" />;
      case 'weather':
        return <CloudSun size={16} className="text-amber-500 mt-0.5 shrink-0" />;
      default:
        return <Server size={16} className="text-emerald-500 mt-0.5 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-white" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">System & Operational Notifications</h2>
              <p className="text-[10px] text-amber-100">{unreadCount} unread updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[10px] bg-amber-900/60 hover:bg-amber-900 text-white px-2 py-1 rounded flex items-center gap-1 transition"
              >
                <CheckCheck size={12} /> Mark Read
              </button>
            )}
            <button
              onClick={() => setIsNotificationsDrawerOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.map(item => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                item.read ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-blue-200 shadow-xs hover:border-blue-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {getTypeIcon(item.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="text-[9px] text-slate-400 mt-1.5">
                    🕒 {item.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-[10px] text-slate-500">
          <span>HVPNL Operations & M&P Noticeboard</span>
          <button
            onClick={() => setIsNotificationsDrawerOpen(false)}
            className="bg-slate-800 text-white px-3 py-1 rounded font-medium hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
