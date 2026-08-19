import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  CalendarDays,
  AlertTriangle,
  Zap,
  RadioTower,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Activity,
  Flame,
} from 'lucide-react';

export const OutageLogView: React.FC = () => {
  const { outageEvents, filters } = useDashboard();
  const [outageTypeFilter, setOutageTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = outageEvents.filter(ev => {
    if (outageTypeFilter !== 'All' && ev.outageType !== outageTypeFilter) return false;
    if (statusFilter !== 'All' && ev.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.assetName.toLowerCase().includes(q) ||
        ev.cause.toLowerCase().includes(q) ||
        ev.circle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalLoadLoss = outageEvents
    .filter(e => e.status !== 'Restored')
    .reduce((acc, e) => acc + e.loadLossMW, 0);

  return (
    <div className="space-y-3 select-none">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Trippings Logged</span>
            <Activity size={18} className="text-blue-600" />
          </div>
          <strong className="text-xl text-slate-900 font-extrabold block mt-1">
            {outageEvents.length} Events
          </strong>
          <span className="text-[9.5px] text-slate-500">FY 2026-27 YTD</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-700 font-bold uppercase">Active Tripped Outages</span>
            <Flame size={18} className="text-rose-600" />
          </div>
          <strong className="text-xl text-rose-700 font-extrabold block mt-1">
            {outageEvents.filter(e => e.status === 'Tripped').length} Active
          </strong>
          <span className="text-[9.5px] text-rose-600 font-semibold">Immediate restoration underway</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 font-bold uppercase">Under Restoration</span>
            <Clock size={18} className="text-amber-600" />
          </div>
          <strong className="text-xl text-amber-700 font-extrabold block mt-1">
            {outageEvents.filter(e => e.status === 'Under Restoration').length}
          </strong>
          <span className="text-[9.5px] text-amber-600 font-semibold">Field crew mobilized</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-red-200 shadow-2xs bg-red-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-red-700 font-bold uppercase">Load Impact</span>
            <Zap size={18} className="text-red-600" />
          </div>
          <strong className="text-xl text-red-700 font-extrabold block mt-1">
            {totalLoadLoss} MW
          </strong>
          <span className="text-[9.5px] text-red-600 font-semibold">Current Unserved Demand</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search event ID / line / cause..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-52 text-xs bg-transparent outline-hidden"
            />
          </div>

          <select
            value={outageTypeFilter}
            onChange={e => setOutageTypeFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Outage Types</option>
            <option value="Forced">Forced Tripping</option>
            <option value="Planned">Planned Shutdown</option>
            <option value="Emergency">Emergency Outage</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Tripped">Tripped</option>
            <option value="Under Restoration">Under Restoration</option>
            <option value="Restored">Restored</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredEvents.length} outage log records
        </div>
      </div>

      {/* Outage Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2.5">Event ID</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Affected Asset</th>
                <th className="p-2.5">Voltage</th>
                <th className="p-2.5">Circle</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Relay Protection Flags</th>
                <th className="p-2.5">Fault Cause / Root Event</th>
                <th className="p-2.5">Load Loss</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredEvents.map(ev => (
                <tr key={ev.id} className="hover:bg-blue-50/40 transition">
                  <td className="p-2.5 font-mono font-bold text-blue-900">{ev.id}</td>
                  <td className="p-2.5 font-medium whitespace-nowrap text-slate-600">{ev.timestamp}</td>
                  <td className="p-2.5 font-bold text-slate-900">{ev.assetName}</td>
                  <td className="p-2.5 font-semibold text-blue-700">{ev.voltage}</td>
                  <td className="p-2.5 text-slate-600">{ev.circle}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                        ev.outageType === 'Forced'
                          ? 'bg-rose-100 text-rose-800'
                          : ev.outageType === 'Emergency'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ev.outageType}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-700 bg-slate-50/70 rounded">
                    {ev.relayOperated}
                  </td>
                  <td className="p-2.5 text-slate-600 max-w-[220px] truncate" title={ev.cause}>
                    {ev.cause}
                  </td>
                  <td className="p-2.5 font-bold text-red-600">{ev.loadLossMW > 0 ? `${ev.loadLossMW} MW` : '0 MW'}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ev.status === 'Restored'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ev.status === 'Tripped'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {ev.status}
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
