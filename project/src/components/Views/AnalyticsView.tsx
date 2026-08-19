import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { InteractiveMiniBars } from '../Charts/InteractiveMiniBars';
import { mockHistoricalTrends } from '../../data/mockData';
import {
  LineChart,
  TrendingUp,
  Activity,
  Zap,
  Gauge,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { summaryMetrics, filters } = useDashboard();

  const circleTransmissionData = [
    { circle: 'Gurugram', energyMU: 6840, peakMW: 1240, lossPct: 1.28 },
    { circle: 'Panipat', energyMU: 5120, peakMW: 920, lossPct: 1.34 },
    { circle: 'Hisar', energyMU: 4420, peakMW: 780, lossPct: 1.42 },
    { circle: 'Rohtak', energyMU: 4180, peakMW: 710, lossPct: 1.39 },
    { circle: 'Faridabad', energyMU: 4950, peakMW: 880, lossPct: 1.45 },
    { circle: 'Ambala', energyMU: 3820, peakMW: 620, lossPct: 1.25 },
    { circle: 'Karnal', energyMU: 3680, peakMW: 590, lossPct: 1.31 },
    { circle: 'Rewari', energyMU: 3450, peakMW: 540, lossPct: 1.36 },
  ];

  return (
    <div className="space-y-3 select-none">
      {/* Top Strategic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Grid Transmission Losses</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <strong className="text-xl text-emerald-700 font-extrabold block mt-1">1.38%</strong>
          <span className="text-[9.5px] text-emerald-600">Well within CERC target (1.50%)</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">System Reliability Index</span>
            <ShieldCheck size={18} className="text-blue-600" />
          </div>
          <strong className="text-xl text-blue-900 font-extrabold block mt-1">99.92%</strong>
          <span className="text-[9.5px] text-blue-600">SAIDI: 4.2 hrs/year</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Energy Wheeled Growth</span>
            <Activity size={18} className="text-indigo-600" />
          </div>
          <strong className="text-xl text-indigo-900 font-extrabold block mt-1">+4.2% YoY</strong>
          <span className="text-[9.5px] text-slate-500">34,256 MU projected</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Transformer Utilization</span>
            <Gauge size={18} className="text-amber-600" />
          </div>
          <strong className="text-xl text-amber-700 font-extrabold block mt-1">68.2% Avg</strong>
          <span className="text-[9.5px] text-amber-600">Optimal thermal headroom</span>
        </div>
      </div>

      {/* Historical Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden p-3">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <b className="text-xs text-slate-900 font-bold">5-Year Energy Wheeling Trajectory (MU)</b>
            <span className="text-[9px] text-slate-500">HVPNL Grid Wheeling</span>
          </div>
          <InteractiveMiniBars data={mockHistoricalTrends.energyWheeledMU} color="#0891b2" unit="MU" />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden p-3">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <b className="text-xs text-slate-900 font-bold">5-Year Peak Demand Growth (MW)</b>
            <span className="text-[9px] text-slate-500">State Peak Recorded</span>
          </div>
          <InteractiveMiniBars data={mockHistoricalTrends.peakDemandMW} color="#4f46e5" unit="MW" />
        </div>
      </div>

      {/* Circle Efficiency Benchmarking Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Circle-Wise Energy Accounting &amp; Loss Benchmark</h3>
          <span className="text-[9.5px] text-slate-500">FY 2026-27 YTD Performance</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2.5">Circle Name</th>
                <th className="p-2.5">Energy Wheeled (MU)</th>
                <th className="p-2.5">Peak Recorded (MW)</th>
                <th className="p-2.5">Transmission Loss %</th>
                <th className="p-2.5">Efficiency Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {circleTransmissionData.map(c => (
                <tr key={c.circle} className="hover:bg-blue-50/40">
                  <td className="p-2.5 font-bold text-slate-900">{c.circle} Circle</td>
                  <td className="p-2.5 font-semibold text-blue-900">{c.energyMU.toLocaleString()} MU</td>
                  <td className="p-2.5 font-medium">{c.peakMW.toLocaleString()} MW</td>
                  <td className="p-2.5">
                    <span className="font-bold text-emerald-700">{c.lossPct}%</span>
                  </td>
                  <td className="p-2.5">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Tier 1 Superb
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
