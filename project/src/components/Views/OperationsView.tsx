import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { InteractiveLoadCurve } from '../Charts/InteractiveLoadCurve';
import { mockHistoricalTrends } from '../../constants/gridConstants';
import {
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RadioTower,
  Gauge,
  Timer,
  RefreshCw,
  Power,
  ShieldCheck,
} from 'lucide-react';

export const OperationsView: React.FC = () => {
  const {
    liveFrequency,
    liveTotalLoadMW,
    liveGridAvailability,
    liveTrippingsCount,
    isLiveStreaming,
    setIsLiveStreaming,
    substations,
    setSelectedSubstation,
  } = useDashboard();

  return (
    <div className="space-y-3 select-none">
      {/* Live SCADA Telemetry Bar */}
      <div className="bg-slate-900 text-white rounded-lg p-3 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 animate-pulse">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              REAL-TIME SCADA TELEMETRY DESK
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                SLDC Sewah Synced
              </span>
            </h2>
            <p className="text-[10.5px] text-slate-400">
              High-speed telemetry refreshed every 3 seconds across 178 transmission nodes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="text-slate-400 block text-[9px]">Grid Frequency</span>
            <b className={`text-base font-mono font-bold ${liveFrequency < 49.95 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {liveFrequency.toFixed(2)} Hz
            </b>
          </div>

          <div className="bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="text-slate-400 block text-[9px]">Active Demand</span>
            <b className="text-base font-mono font-bold text-cyan-400">
              {liveTotalLoadMW.toLocaleString()} MW
            </b>
          </div>

          <div className="bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="text-slate-400 block text-[9px]">Grid Availability</span>
            <b className="text-base font-mono font-bold text-emerald-400">
              {liveGridAvailability}%
            </b>
          </div>

          <button
            onClick={() => setIsLiveStreaming((prev: boolean) => !prev)}
            className={`px-3 py-2 rounded-md font-semibold text-xs transition flex items-center gap-1.5 ${
              isLiveStreaming
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power size={13} />
            {isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}
          </button>
        </div>
      </div>

      {/* 24h Interactive Load Profile */}
      <InteractiveLoadCurve
        data={mockHistoricalTrends.hourlyLoadCurve}
        liveLoadMW={liveTotalLoadMW}
        liveFreq={liveFrequency}
      />

      {/* Bus Voltage Levels & Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-blue-900">400 kV Grid Bus</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              398.4 kV (Normal)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Major interconnects: Bawal, Daultabad, Kirori</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full w-[99.6%]" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-blue-900">220 kV Grid Bus</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              219.1 kV (Normal)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Panipat, Rohtak, Karnal, Ambala ring</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-teal-600 h-full w-[99.1%]" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-blue-900">132 kV Grid Bus</span>
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
              130.2 kV (Sub-optimal)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Faridabad, Jind, Kaithal sub-grids</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full w-[98.6%]" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-blue-900">66 kV Distribution Bus</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              65.8 kV (Normal)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Panchkula, Narwana, Urban distribution feeders</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full w-[99.7%]" />
          </div>
        </div>
      </div>

      {/* Real-time Substation Loading Status Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RadioTower size={16} className="text-blue-700" />
            <h3 className="text-xs font-bold text-slate-900">Active Node SCADA Feeder Monitor</h3>
          </div>
          <span className="text-[10px] text-slate-500">Showing top monitored transmission substations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2">Substation Node</th>
                <th className="p-2">Voltage</th>
                <th className="p-2">Circle</th>
                <th className="p-2">Capacity</th>
                <th className="p-2">Active Load</th>
                <th className="p-2">Utilization</th>
                <th className="p-2">Health State</th>
                <th className="p-2">Alarms</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[10.5px]">
              {substations.map(ss => {
                const utilPct = Math.round((ss.currentLoadMW / (ss.capacityMVA * 0.8)) * 100);
                return (
                  <tr key={ss.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2 font-bold text-slate-900">{ss.name}</td>
                    <td className="p-2 font-semibold text-blue-700">{ss.voltage}</td>
                    <td className="p-2 text-slate-600">{ss.circle}</td>
                    <td className="p-2 font-medium">{ss.capacityMVA} MVA</td>
                    <td className="p-2 font-bold text-slate-800">{ss.currentLoadMW} MW</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              utilPct > 85 ? 'bg-red-500' : utilPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, utilPct)}%` }}
                          />
                        </div>
                        <span className="text-[9.5px] font-bold text-slate-700">{utilPct}%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold text-white uppercase ${
                          ss.health === 'Healthy'
                            ? 'bg-emerald-600'
                            : ss.health === 'Moderate'
                            ? 'bg-amber-500'
                            : ss.health === 'Critical'
                            ? 'bg-rose-600'
                            : 'bg-red-700'
                        }`}
                      >
                        {ss.health}
                      </span>
                    </td>
                    <td className="p-2 font-bold text-rose-600">{ss.activeAlarms > 0 ? `${ss.activeAlarms} Active` : '0'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedSubstation(ss)}
                        className="text-[9.5px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-semibold transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
