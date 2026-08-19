import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { InteractiveDonut } from '../Charts/InteractiveDonut';
import { InteractiveMiniBars } from '../Charts/InteractiveMiniBars';
import { InteractiveStackedBars } from '../Charts/InteractiveStackedBars';
import { NetworkMap } from '../Charts/NetworkMap';
import { mockHistoricalTrends } from '../../data/mockData';
import {
  RadioTower,
  Activity,
  Zap,
  Gauge,
  CalendarDays,
  CheckCircle2,
  Timer,
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  CloudDownload,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const ExecutiveOverview: React.FC = () => {
  const {
    summaryMetrics,
    liveFrequency,
    liveTotalLoadMW,
    liveGridAvailability,
    liveTrippingsCount,
    observations,
    setSelectedObservation,
    setSelectedSubstation,
    substations,
    setActiveView,
    setAssetSubTab,
    setIsNewObservationModalOpen,
    setIsExportModalOpen,
  } = useDashboard();

  const [healthTab, setHealthTab] = useState<'substations' | 'transformers' | 'lines'>('substations');

  // Dynamic health segments according to selected tab
  const activeHealthBreakdown =
    healthTab === 'substations'
      ? summaryMetrics.substationHealthBreakdown
      : healthTab === 'transformers'
      ? summaryMetrics.transformerHealthBreakdown
      : summaryMetrics.lineHealthBreakdown;

  const totalHealthCount =
    healthTab === 'substations'
      ? summaryMetrics.totalSubstations
      : healthTab === 'transformers'
      ? summaryMetrics.totalTransformers
      : summaryMetrics.totalLines;

  const healthSegments = [
    { label: 'Healthy', value: activeHealthBreakdown.healthy, color: '#22c55e' },
    { label: 'Moderate', value: activeHealthBreakdown.moderate, color: '#eab308' },
    { label: 'Critical', value: activeHealthBreakdown.critical, color: '#f97316' },
    { label: 'Outage', value: activeHealthBreakdown.outage, color: '#ef4444' },
  ];

  const loadingSegments = [
    { label: '< 60%', value: summaryMetrics.transformerLoadingBreakdown.under60, color: '#22c55e' },
    { label: '60 – 80%', value: summaryMetrics.transformerLoadingBreakdown.between60_80, color: '#eab308' },
    { label: '80 – 100%', value: summaryMetrics.transformerLoadingBreakdown.between80_100, color: '#f97316' },
    { label: '> 100%', value: summaryMetrics.transformerLoadingBreakdown.over100, color: '#ef4444' },
  ];

  const mpSegments = [
    { label: 'Closed', value: summaryMetrics.observationsClosed, color: '#22c55e' },
    { label: 'Pending', value: summaryMetrics.observationsPending - summaryMetrics.criticalPendingCount, color: '#eab308' },
    { label: 'Critical Pending', value: summaryMetrics.criticalPendingCount, color: '#ef4444' },
  ];

  const criticalObservationsList = observations.filter(o => o.severity === 'Critical').slice(0, 5);

  return (
    <div className="space-y-2 select-none">
      {/* 3 Overview Top Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* ASSET OVERVIEW (STATISTICAL) */}
        <div className="lg:col-span-5 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-blue-600 text-blue-900 text-[10.5px] font-extrabold flex items-center justify-between">
            <span>ASSET OVERVIEW (STATISTICAL)</span>
            <button
              onClick={() => setActiveView('assets')}
              className="text-[9px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
            >
              View Assets <ChevronRight size={11} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2">
            <div
              onClick={() => { setActiveView('assets'); setAssetSubTab('substations'); }}
              className="p-2 border border-slate-200 rounded-lg bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:shadow-xs transition"
            >
              <RadioTower size={22} className="text-blue-600 mb-1" />
              <span className="text-[8px] font-bold text-slate-600 uppercase">Substations</span>
              <strong className="text-base font-extrabold text-slate-900 mt-0.5">
                {summaryMetrics.totalSubstations.toLocaleString()}
              </strong>
            </div>

            <div
              onClick={() => { setActiveView('assets'); setAssetSubTab('lines'); }}
              className="p-2 border border-slate-200 rounded-lg bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:shadow-xs transition"
            >
              <Activity size={22} className="text-indigo-600 mb-1" />
              <span className="text-[8px] font-bold text-slate-600 uppercase">Lines (ckt-km)</span>
              <strong className="text-base font-extrabold text-slate-900 mt-0.5">
                {summaryMetrics.totalLines.toLocaleString()}
              </strong>
            </div>

            <div
              onClick={() => { setActiveView('assets'); setAssetSubTab('transformers'); }}
              className="p-2 border border-slate-200 rounded-lg bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 hover:shadow-xs transition"
            >
              <Zap size={22} className="text-emerald-600 mb-1" />
              <span className="text-[8px] font-bold text-slate-600 uppercase">Transformers</span>
              <strong className="text-base font-extrabold text-slate-900 mt-0.5">
                {summaryMetrics.totalTransformers.toLocaleString()}
              </strong>
            </div>

            <div className="p-2 border border-slate-200 rounded-lg bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center text-center">
              <Gauge size={22} className="text-amber-600 mb-1" />
              <span className="text-[8px] font-bold text-slate-600 uppercase">Capacity (MVA)</span>
              <strong className="text-base font-extrabold text-slate-900 mt-0.5">
                {summaryMetrics.totalCapacityMVA.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* MAINTENANCE OVERVIEW */}
        <div className="lg:col-span-3 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-emerald-600 text-emerald-900 text-[10.5px] font-extrabold flex items-center justify-between">
            <span>MAINTENANCE OVERVIEW</span>
            <button
              onClick={() => setActiveView('maintenance')}
              className="text-[9px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5"
            >
              Planner <ChevronRight size={11} />
            </button>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="p-1.5 border border-slate-200 rounded bg-slate-50/50">
                <span className="text-[7.5px] text-slate-500 font-bold block uppercase">Due</span>
                <strong className="text-xs font-bold text-slate-800">{summaryMetrics.maintenanceDue.toLocaleString()}</strong>
              </div>
              <div className="p-1.5 border border-emerald-200 rounded bg-emerald-50/50">
                <span className="text-[7.5px] text-emerald-700 font-bold block uppercase">Done</span>
                <strong className="text-xs font-bold text-emerald-700">{summaryMetrics.maintenanceDone.toLocaleString()}</strong>
              </div>
              <div className="p-1.5 border border-amber-200 rounded bg-amber-50/50">
                <span className="text-[7.5px] text-amber-700 font-bold block uppercase">Pending</span>
                <strong className="text-xs font-bold text-amber-700">{summaryMetrics.maintenancePending.toLocaleString()}</strong>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-center">
              <div className="p-1 border border-blue-200 rounded bg-blue-50/50 flex items-center justify-between px-2">
                <span className="text-[8px] font-bold text-blue-900">Completion %</span>
                <b className="text-xs font-extrabold text-blue-700">{summaryMetrics.maintenanceCompletionPct}%</b>
              </div>
              <div className="p-1 border border-rose-200 rounded bg-rose-50/50 flex items-center justify-between px-2">
                <span className="text-[8px] font-bold text-rose-900">Overdue</span>
                <b className="text-xs font-extrabold text-rose-700">{summaryMetrics.maintenanceOverdue}</b>
              </div>
            </div>
          </div>
        </div>

        {/* M&P OBSERVATIONS OVERVIEW */}
        <div className="lg:col-span-4 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-amber-500 text-amber-900 text-[10.5px] font-extrabold flex items-center justify-between">
            <span>M&amp;P OBSERVATIONS OVERVIEW</span>
            <button
              onClick={() => setActiveView('mp-observations')}
              className="text-[9px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-0.5"
            >
              All Logs <ChevronRight size={11} />
            </button>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="p-1.5 border border-slate-200 rounded bg-slate-50/50">
                <span className="text-[7.5px] text-slate-500 font-bold block uppercase">Total</span>
                <strong className="text-xs font-bold text-slate-800">{summaryMetrics.totalObservations.toLocaleString()}</strong>
              </div>
              <div className="p-1.5 border border-amber-200 rounded bg-amber-50/50">
                <span className="text-[7.5px] text-amber-700 font-bold block uppercase">Pending</span>
                <strong className="text-xs font-bold text-amber-700">{summaryMetrics.observationsPending.toLocaleString()}</strong>
              </div>
              <div className="p-1.5 border border-rose-200 rounded bg-rose-50/50">
                <span className="text-[7.5px] text-rose-700 font-bold block uppercase">Critical</span>
                <strong className="text-xs font-bold text-rose-700">{summaryMetrics.criticalPendingCount}</strong>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="p-1 border border-emerald-200 rounded bg-emerald-50/50 flex flex-col items-center justify-center">
                <span className="text-[7px] text-emerald-800 font-bold">Closed</span>
                <b className="text-[11px] font-bold text-emerald-700">{summaryMetrics.observationsClosed.toLocaleString()}</b>
              </div>
              <div className="p-1 border border-rose-200 rounded bg-rose-50/50 flex flex-col items-center justify-center">
                <span className="text-[7px] text-rose-800 font-bold">Overdue</span>
                <b className="text-[11px] font-bold text-rose-700">{summaryMetrics.observationsOverdue}</b>
              </div>
              <div className="p-1 border border-blue-200 rounded bg-blue-50/50 flex flex-col items-center justify-center">
                <span className="text-[7px] text-blue-800 font-bold">Compliance</span>
                <b className="text-[11px] font-bold text-blue-700">{summaryMetrics.mpCompliancePct}%</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left Column (4 cols): Operations Snapshot, Energy Wheeled, Peak Demand, Maintenance Stacked Bars */}
        <div className="lg:col-span-4 space-y-2">
          {/* OPERATIONS SNAPSHOT (LIVE) */}
          <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-teal-600 text-teal-900 text-[10.5px] font-extrabold flex items-center justify-between">
              <span>OPERATIONS SNAPSHOT (LIVE)</span>
              <span className="text-[8px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-bold">
                SCADA Active
              </span>
            </div>
            <div className="grid grid-cols-4 p-2 divide-x divide-slate-200 text-center">
              <div className="px-1">
                <Activity size={15} className="text-teal-600 mx-auto" />
                <span className="text-[7.5px] text-slate-500 block font-semibold mt-0.5">Frequency</span>
                <b className="text-xs text-slate-900 font-bold mt-1 block">{liveFrequency.toFixed(2)} Hz</b>
                <div className="text-[12px] font-mono text-emerald-500 leading-none mt-0.5">⌁⌁⌁</div>
              </div>

              <div className="px-1">
                <Zap size={15} className="text-blue-600 mx-auto" />
                <span className="text-[7.5px] text-slate-500 block font-semibold mt-0.5">Total Load</span>
                <b className="text-xs text-blue-900 font-bold mt-1 block">{liveTotalLoadMW.toLocaleString()} MW</b>
                <div className="text-[12px] font-mono text-blue-500 leading-none mt-0.5">⌁⌁⌁</div>
              </div>

              <div className="px-1">
                <CheckCircle2 size={15} className="text-emerald-600 mx-auto" />
                <span className="text-[7.5px] text-slate-500 block font-semibold mt-0.5">Availability</span>
                <b className="text-xs text-emerald-700 font-bold mt-1 block">{liveGridAvailability}%</b>
                <div className="text-[12px] font-mono text-emerald-500 leading-none mt-0.5">⌁⌁⌁</div>
              </div>

              <div className="px-1">
                <XCircle size={15} className="text-rose-600 mx-auto" />
                <span className="text-[7.5px] text-slate-500 block font-semibold mt-0.5">Trippings</span>
                <b className="text-xs text-rose-700 font-bold mt-1 block">{liveTrippingsCount}</b>
                <div className="text-[12px] font-mono text-rose-500 leading-none mt-0.5">⌁⌁⌁</div>
              </div>
            </div>
          </div>

          {/* Two FY-wise charts */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
              <div className="px-2.5 py-1 bg-slate-50 border-t-3 border-teal-500 text-teal-900 text-[9.5px] font-bold">
                ENERGY WHEELED (MU)
              </div>
              <InteractiveMiniBars data={mockHistoricalTrends.energyWheeledMU} color="#14b8a6" unit="MU" />
            </div>

            <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
              <div className="px-2.5 py-1 bg-slate-50 border-t-3 border-blue-600 text-blue-900 text-[9.5px] font-bold">
                PEAK DEMAND (MW)
              </div>
              <InteractiveMiniBars data={mockHistoricalTrends.peakDemandMW} color="#2563eb" unit="MW" />
            </div>
          </div>

          {/* MAINTENANCE PERFORMANCE BY CYCLE */}
          <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-blue-600 text-blue-900 text-[10px] font-extrabold flex items-center justify-between">
              <span>MAINTENANCE PERFORMANCE – CYCLE WISE</span>
              <span className="text-[8px] text-slate-500">FY 2026-27</span>
            </div>
            <InteractiveStackedBars data={summaryMetrics.cycleWiseMaintenance} />
          </div>
        </div>

        {/* Center Column (4.5 cols): LIVE NETWORK MAP */}
        <div className="lg:col-span-4.5 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden flex flex-col">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-cyan-600 text-cyan-950 text-[10.5px] font-extrabold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RadioTower size={14} className="text-cyan-700" />
              <span>LIVE HARYANA TRANSMISSION NETWORK MAP</span>
            </div>
            <span className="text-[8px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-bold">
              GIS Interactive
            </span>
          </div>
          <div className="p-2 flex-1 flex flex-col justify-center">
            <NetworkMap />
          </div>
        </div>

        {/* Right Column (3.5 cols): Asset Health, Transformer Loading, Maintenance Pending */}
        <div className="lg:col-span-3.5 space-y-2">
          {/* ASSET HEALTH SUMMARY with Tabs */}
          <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-purple-600 text-purple-900 text-[10px] font-extrabold flex items-center justify-between">
              <span>ASSET HEALTH SUMMARY</span>
              <span className="text-[8px] text-purple-700 font-bold">{totalHealthCount} Total</span>
            </div>

            {/* Health tabs */}
            <div className="grid grid-cols-3 gap-1 p-1.5 border-b border-slate-100 bg-slate-50/50 text-[9px] font-bold text-center">
              <button
                onClick={() => setHealthTab('substations')}
                className={`py-1 rounded transition ${
                  healthTab === 'substations' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Substations
              </button>
              <button
                onClick={() => setHealthTab('transformers')}
                className={`py-1 rounded transition ${
                  healthTab === 'transformers' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Transformers
              </button>
              <button
                onClick={() => setHealthTab('lines')}
                className={`py-1 rounded transition ${
                  healthTab === 'lines' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lines
              </button>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <InteractiveDonut centerValue={totalHealthCount} centerLabel="Total" segments={healthSegments} size={90} />
              <ul className="flex-1 space-y-1 text-[9px] text-slate-700">
                {healthSegments.map(seg => (
                  <li key={seg.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: seg.color }} />
                      {seg.label}
                    </span>
                    <b>{seg.value} ({((seg.value / (totalHealthCount || 1)) * 100).toFixed(1)}%)</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LOADING SUMMARY (TRANSFORMERS) */}
          <div className="bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-1 bg-slate-50 border-t-3 border-amber-600 text-amber-900 text-[10px] font-extrabold flex items-center justify-between">
              <span>LOADING SUMMARY (TRANSFORMERS)</span>
              <span className="text-[8px] text-amber-800 font-bold">Avg 68%</span>
            </div>
            <div className="flex items-center gap-3 p-2">
              <InteractiveDonut centerValue="68%" centerLabel="Avg Load" segments={loadingSegments} size={88} />
              <ul className="flex-1 space-y-1 text-[8.5px] text-slate-700">
                {loadingSegments.map(seg => (
                  <li key={seg.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="w-2 h-2 rounded-xs inline-block" style={{ backgroundColor: seg.color }} />
                      {seg.label}
                    </span>
                    <b>{seg.value} ({((seg.value / (summaryMetrics.totalTransformers || 1)) * 100).toFixed(1)}%)</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: M&P Status Donut, Top 5 Critical Pending Table, Circle Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* M&P Observations Status Donut */}
        <div className="lg:col-span-3 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-amber-600 text-amber-900 text-[10px] font-extrabold">
            M&amp;P OBSERVATIONS – STATUS SUMMARY
          </div>
          <div className="flex items-center gap-2 p-2.5">
            <InteractiveDonut
              centerValue={summaryMetrics.totalObservations.toLocaleString()}
              centerLabel="Observations"
              segments={mpSegments}
              size={92}
            />
            <ul className="flex-1 space-y-1.5 text-[9px] text-slate-700">
              {mpSegments.map(seg => (
                <li key={seg.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <i className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: seg.color }} />
                    {seg.label}
                  </span>
                  <b>{seg.value.toLocaleString()}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TOP CRITICAL PENDING OBSERVATIONS TABLE */}
        <div className="lg:col-span-6 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-rose-600 text-rose-900 text-[10px] font-extrabold flex items-center justify-between">
            <span>TOP CRITICAL PENDING OBSERVATIONS</span>
            <button
              onClick={() => setIsNewObservationModalOpen(true)}
              className="text-[9px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded font-semibold transition"
            >
              + Add Observation
            </button>
          </div>
          <div className="overflow-x-auto p-1">
            <table className="w-full text-left text-[9px] border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-extrabold">
                  <th className="p-1.5">S.No</th>
                  <th className="p-1.5">Substation / Circle</th>
                  <th className="p-1.5">Equipment</th>
                  <th className="p-1.5">Defect Observation</th>
                  <th className="p-1.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalObservationsList.map((obs, idx) => (
                  <tr
                    key={obs.id}
                    onClick={() => setSelectedObservation(obs)}
                    className="hover:bg-rose-50/50 cursor-pointer transition"
                  >
                    <td className="p-1.5 font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-1.5 font-semibold text-slate-900 whitespace-nowrap">
                      {obs.substation}
                      <span className="block text-[7.5px] text-slate-500 font-normal">{obs.circle}</span>
                    </td>
                    <td className="p-1.5 font-medium text-slate-800 whitespace-nowrap">{obs.equipment}</td>
                    <td className="p-1.5 text-slate-600 max-w-[180px] truncate" title={obs.description}>
                      {obs.description}
                    </td>
                    <td className="p-1.5 whitespace-nowrap">
                      <span className="bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                        Critical Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CRITICAL PENDING BY CIRCLE */}
        <div className="lg:col-span-3 bg-white border border-[#d8dee7] rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-t-3 border-indigo-600 text-indigo-900 text-[10px] font-extrabold">
            CRITICAL PENDING BY CIRCLE
          </div>
          <div className="p-2 space-y-1.5 text-[8.5px]">
            {summaryMetrics.circleCriticalObservations.map(item => (
              <div key={item.circle} className="flex items-center gap-2">
                <span className="w-24 text-slate-700 font-medium truncate text-right">{item.circle}</span>
                <div className="flex-1 bg-slate-100 h-3.5 rounded overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded transition-all duration-300"
                    style={{ width: `${(item.count / 45) * 100}%` }}
                  />
                </div>
                <b className="w-6 text-slate-800 font-bold">{item.count}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Shortcut Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        <button
          onClick={() => setActiveView('mp-observations')}
          className="p-2 bg-white border border-slate-200 hover:border-rose-300 rounded-lg text-left shadow-2xs hover:shadow-xs transition flex items-center gap-2"
        >
          <AlertTriangle size={20} className="text-rose-600 shrink-0" />
          <div className="truncate">
            <b className="text-[10px] text-slate-900 block font-bold leading-tight">Critical Pending List</b>
            <small className="text-[8px] text-slate-500">View all critical observations</small>
          </div>
        </button>

        <button
          onClick={() => setActiveView('maintenance')}
          className="p-2 bg-white border border-slate-200 hover:border-amber-300 rounded-lg text-left shadow-2xs hover:shadow-xs transition flex items-center gap-2"
        >
          <CalendarDays size={20} className="text-amber-600 shrink-0" />
          <div className="truncate">
            <b className="text-[10px] text-slate-900 block font-bold leading-tight">Overdue Maintenance</b>
            <small className="text-[8px] text-slate-500">View overdue maintenance tasks</small>
          </div>
        </button>

        <button
          onClick={() => setActiveView('outage-log')}
          className="p-2 bg-white border border-slate-200 hover:border-purple-300 rounded-lg text-left shadow-2xs hover:shadow-xs transition flex items-center gap-2"
        >
          <Bell size={20} className="text-purple-600 shrink-0" />
          <div className="truncate">
            <b className="text-[10px] text-slate-900 block font-bold leading-tight">Outage / Tripping Log</b>
            <small className="text-[8px] text-slate-500">Real-time fault & tripping log</small>
          </div>
        </button>

        <button
          onClick={() => setActiveView('reports')}
          className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-left shadow-2xs hover:shadow-xs transition flex items-center gap-2"
        >
          <Search size={20} className="text-blue-600 shrink-0" />
          <div className="truncate">
            <b className="text-[10px] text-slate-900 block font-bold leading-tight">Aging Audit Report</b>
            <small className="text-[8px] text-slate-500">Observation & compliance aging</small>
          </div>
        </button>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="p-2 bg-white border border-slate-200 hover:border-emerald-300 rounded-lg text-left shadow-2xs hover:shadow-xs transition flex items-center gap-2 col-span-2 sm:col-span-1"
        >
          <CloudDownload size={20} className="text-emerald-600 shrink-0" />
          <div className="truncate">
            <b className="text-[10px] text-slate-900 block font-bold leading-tight">Download Reports</b>
            <small className="text-[8px] text-slate-500">Export in Excel / PDF</small>
          </div>
        </button>
      </div>

      <footer className="text-center text-[9px] text-slate-500 pt-2 pb-1 flex items-center justify-between border-t border-slate-200">
        <span>Click on any chart, city node, or table row to filter &amp; inspect assets</span>
        <span>Source: HVPNL Enterprise SCADA Systems &amp; Technical Audit Cell</span>
      </footer>
    </div>
  );
};
