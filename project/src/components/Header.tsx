import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Activity,
  CalendarDays,
  RefreshCw,
  TriangleAlert,
  Bell,
  CloudDownload,
  ChevronDown,
  Pause,
  Play,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    liveFrequency,
    alerts,
    notifications,
    lastDataRefresh,
    triggerDataRefresh,
    isRefreshing,
    isLiveStreaming,
    setIsLiveStreaming,
    setIsAlertsDrawerOpen,
    setIsNotificationsDrawerOpen,
    setIsExportModalOpen,
  } = useDashboard();

  const unacknowledgedAlerts = alerts.filter((a: any) => !a.acknowledged).length;
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  return (
    <header className="h-[58px] flex items-center justify-between px-4 bg-gradient-to-r from-[#071c4e] to-[#0b2e79] text-white shadow-md select-none shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-blue-400/40 bg-blue-900/50 flex items-center justify-center text-cyan-300 shadow-inner">
          <Activity size={24} strokeWidth={2.2} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-extrabold tracking-wide text-white leading-tight flex items-center gap-2">
            HVPNL TRANSMISSION DASHBOARD
            <span className="hidden lg:inline-block text-[9px] font-bold px-1.5 py-0.5 bg-blue-500/30 border border-blue-400/40 rounded text-cyan-200">
              HARYANA GRID
            </span>
          </h1>
          <p className="text-[10px] text-blue-200 font-medium">
            Operations | Assets | Maintenance | M&amp;P Observations | SCADA Telemetry
          </p>
        </div>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Status Pill with stream pause toggle */}
        <div className="hidden sm:flex items-center gap-2 bg-white/95 text-slate-800 px-2.5 py-1 rounded-md text-[11px] shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isLiveStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <b className="text-slate-900 font-bold text-[10px]">Live   Telemetry</b>
              <span className="text-[9px] font-semibold text-blue-700">({liveFrequency.toFixed(2)} Hz)</span>
            </div>
            <small className="text-[8.5px] text-slate-500 block">
              {isLiveStreaming ? 'All Systems Normal' : 'Simulation Paused'}
            </small>
          </div>
          <button
            onClick={() => setIsLiveStreaming((prev: boolean) => !prev)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition ml-0.5"
            title={isLiveStreaming ? 'Pause live telemetry' : 'Resume live telemetry'}
          >
            {isLiveStreaming ? <Pause size={11} /> : <Play size={11} className="text-emerald-600" />}
          </button>
        </div>

        {/* Refresh pill */}
        <button
          onClick={triggerDataRefresh}
          className="hidden md:flex items-center gap-2 bg-white/95 text-slate-800 px-2.5 py-1 rounded-md text-[10px] hover:bg-white shadow-xs transition active:scale-95"
          title="Click to refresh telemetry from HVPNL SCADA"
        >
          <CalendarDays size={13} className="text-blue-600" />
          <div className="text-left leading-tight">
            <span className="text-[8px] text-slate-500 block ">Last Data Refresh</span>
            <b className="text-[9.5px] text-slate-800 font-bold">{lastDataRefresh}</b>
          </div>
          <RefreshCw size={13} className={`text-slate-600 ml-1 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Alerts button */}
        <button
          onClick={() => setIsAlertsDrawerOpen(true)}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-md text-[11px] font-bold shadow-xs transition"
        >
          <TriangleAlert size={15} className="text-rose-600" />
          <span className="hidden sm:inline">Alerts</span>
          {unacknowledgedAlerts > 0 && (
            <i className="bg-rose-600 text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold not-italic">
              {unacknowledgedAlerts}
            </i>
          )}
        </button>

        {/* Notifications button */}
        <button
          onClick={() => setIsNotificationsDrawerOpen(true)}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-md text-[11px] font-bold shadow-xs transition"
        >
          <Bell size={15} className="text-amber-600" />
          <span className="hidden sm:inline">Notifications</span>
          {unreadNotifications > 0 && (
            <i className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold not-italic">
              {unreadNotifications}
            </i>
          )}
        </button>

        {/* Export button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold shadow-xs transition"
        >
          <CloudDownload size={15} />
          <span className="hidden sm:inline">Export</span>
          <ChevronDown size={13} />
        </button>
      </div>
    </header>
  );
};
