import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { TriangleAlert, X, CheckCheck, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const AlertsDrawer: React.FC = () => {
  const { alerts, isAlertsDrawerOpen, setIsAlertsDrawerOpen, acknowledgeAlert, acknowledgeAllAlerts } = useDashboard();

  if (!isAlertsDrawerOpen) return null;

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 to-rose-800 text-white flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <TriangleAlert size={20} className="text-amber-300" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">Active Grid Alarms & Alerts</h2>
              <p className="text-[10px] text-red-100">
                {unacknowledgedCount} unacknowledged emergency events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unacknowledgedCount > 0 && (
              <button
                onClick={acknowledgeAllAlerts}
                className="text-[10px] bg-red-900/60 hover:bg-red-900 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                title="Acknowledge All"
              >
                <CheckCheck size={12} /> Acknowledge All
              </button>
            )}
            <button
              onClick={() => setIsAlertsDrawerOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <ShieldAlert size={36} className="mx-auto mb-2 text-emerald-500" />
              All systems normal. No active alarms.
            </div>
          ) : (
            alerts.map(alert => {
              const isCritical = alert.severity === 'critical';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : isCritical
                      ? 'bg-red-50/80 border-red-200 shadow-xs'
                      : isWarning
                      ? 'bg-amber-50/80 border-amber-200 shadow-xs'
                      : 'bg-blue-50/80 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {isCritical ? (
                        <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                      ) : isWarning ? (
                        <TriangleAlert size={16} className="text-amber-600 mt-0.5 shrink-0" />
                      ) : (
                        <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {alert.title}
                          </h4>
                          <span
                            className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              isCritical
                                ? 'bg-red-600 text-white'
                                : isWarning
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 mt-2">
                          <span>📍 {alert.substation}</span>
                          <span>🕒 {alert.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-[9px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded shrink-0 shadow-xs transition"
                      >
                        Ack
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-[10px] text-slate-500">
          <span>Source: HVPNL SCADA Telemetry & Alarm Service</span>
          <button
            onClick={() => setIsAlertsDrawerOpen(false)}
            className="bg-slate-800 text-white px-3 py-1 rounded font-medium hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
