import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ObservationSeverity, ObservationStatus } from '../../types';
import {
  FileBarChart,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Search,
  Plus,
  Filter,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const ObservationsView: React.FC = () => {
  const {
    observations,
    setSelectedObservation,
    setIsNewObservationModalOpen,
    summaryMetrics,
  } = useDashboard();

  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredObservations = observations.filter(obs => {
    if (severityFilter !== 'All' && obs.severity !== severityFilter) return false;
    if (statusFilter !== 'All' && obs.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        obs.observationNo.toLowerCase().includes(q) ||
        obs.substation.toLowerCase().includes(q) ||
        obs.equipment.toLowerCase().includes(q) ||
        obs.description.toLowerCase().includes(q) ||
        obs.circle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3 select-none">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Observations</span>
            <ClipboardList size={18} className="text-blue-600" />
          </div>
          <strong className="text-xl text-slate-900 font-extrabold block mt-1">
            {summaryMetrics.totalObservations.toLocaleString()}
          </strong>
          <span className="text-[9.5px] text-slate-500">M&amp;P Audit Register</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-700 font-bold uppercase">Critical Pending</span>
            <AlertTriangle size={18} className="text-rose-600" />
          </div>
          <strong className="text-xl text-rose-700 font-extrabold block mt-1">
            {summaryMetrics.criticalPendingCount}
          </strong>
          <span className="text-[9.5px] text-rose-600 font-semibold">Priority 1 High Risk</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 font-bold uppercase">Total Pending</span>
            <Timer size={18} className="text-amber-600" />
          </div>
          <strong className="text-xl text-amber-700 font-extrabold block mt-1">
            {summaryMetrics.observationsPending.toLocaleString()}
          </strong>
          <span className="text-[9.5px] text-amber-600 font-semibold">{summaryMetrics.observationsOverdue} Overdue</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-700 font-bold uppercase">Compliance %</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <strong className="text-xl text-emerald-700 font-extrabold block mt-1">
            {summaryMetrics.mpCompliancePct}%
          </strong>
          <span className="text-[9.5px] text-emerald-600 font-semibold">{summaryMetrics.observationsClosed.toLocaleString()} Rectified</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search observation / equipment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 text-xs bg-transparent outline-hidden"
            />
          </div>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Critical Pending">Critical Pending</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
            <option value="Under Rectification">Under Rectification</option>
          </select>
        </div>

        <button
          onClick={() => setIsNewObservationModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-xs transition"
        >
          <Plus size={14} /> Log New Observation
        </button>
      </div>

      {/* Observations Register Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2.5">Obs No.</th>
                <th className="p-2.5">Substation &amp; Circle</th>
                <th className="p-2.5">Voltage</th>
                <th className="p-2.5">Equipment</th>
                <th className="p-2.5">Defect Description</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Reported</th>
                <th className="p-2.5">Days Pending</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredObservations.map(obs => (
                <tr
                  key={obs.id}
                  onClick={() => setSelectedObservation(obs)}
                  className="hover:bg-blue-50/40 cursor-pointer transition"
                >
                  <td className="p-2.5 font-bold font-mono text-blue-900">{obs.observationNo}</td>
                  <td className="p-2.5 font-bold text-slate-900">
                    {obs.substation}
                    <span className="block text-[9px] text-slate-500 font-normal">{obs.circle}</span>
                  </td>
                  <td className="p-2.5 font-bold text-blue-700">{obs.voltage}</td>
                  <td className="p-2.5 font-medium text-slate-800">
                    {obs.equipment}
                    <span className="block text-[8.5px] text-slate-400 font-normal">{obs.equipmentType}</span>
                  </td>
                  <td className="p-2.5 text-slate-600 max-w-[240px] truncate" title={obs.description}>
                    {obs.description}
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold text-white uppercase ${
                        obs.severity === 'Critical'
                          ? 'bg-rose-600'
                          : obs.severity === 'Moderate'
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                    >
                      {obs.severity}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        obs.status === 'Closed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : obs.status === 'Critical Pending'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {obs.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500">{obs.reportedDate}</td>
                  <td className="p-2.5">
                    {obs.status === 'Closed' ? (
                      <span className="text-emerald-600 font-bold text-[10px]">Closed</span>
                    ) : (
                      <span className={`font-bold ${obs.daysPending > 30 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {obs.daysPending} days
                      </span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedObservation(obs);
                      }}
                      className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1"
                    >
                      <Eye size={12} /> Inspect
                    </button>
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
