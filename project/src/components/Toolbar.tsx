import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { TimePeriod } from '../types';
import {
  CIRCLES,
  FINANCIAL_YEARS,
  VOLTAGES,
  ZONES,
} from '../constants/gridConstants';
import { Map, Search, CheckCircle2, X } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const {
    filters,
    setFilter,
    setTimePeriod,
    filterAppliedNotification,
    setActiveView,
  } = useDashboard();

  const [showSearchInput, setShowSearchInput] = useState(false);

  const periods: TimePeriod[] = ['Today', 'Yesterday', '7 Days', '30 Days', 'FYTD'];

  return (
    <div className="space-y-1.5 shrink-0 select-none">
      {/* Toast Notification for filters */}
      {filterAppliedNotification && (
        <div className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-cyan-300" />
            <span className="font-medium text-[11px]">{filterAppliedNotification}</span>
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      <div className="min-h-[43px] flex flex-wrap items-center justify-between gap-2 bg-white border border-[#dbe1e8] rounded-md px-2.5 py-1.5 shadow-2xs">
        {/* Time Periods */}
        <div className="flex items-center gap-1">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold border transition duration-150 ${
                filters.timePeriod === period
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Global Filter Dropdowns */}
        <div className="flex items-center flex-wrap gap-2">
          {/* FY */}
          <div className="flex flex-col">
            <span className="text-[7.5px] font-semibold text-slate-500 uppercase">FY</span>
            <select
              value={filters.financialYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('financialYear', e.target.value)}
              className="border border-[#dbe1e8] rounded px-1.5 py-1 text-[9.5px] font-bold text-slate-800 bg-white hover:border-slate-400 focus:outline-hidden"
            >
              {FINANCIAL_YEARS.map((fy: string) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {/* Zone */}
          <div className="flex flex-col">
            <span className="text-[7.5px] font-semibold text-slate-500 uppercase">Zone</span>
            <select
              value={filters.zone}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('zone', e.target.value)}
              className="border border-[#dbe1e8] rounded px-1.5 py-1 text-[9.5px] font-medium text-slate-800 bg-white hover:border-slate-400 focus:outline-hidden"
            >
              {ZONES.map((z: string) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Circle */}
          <div className="flex flex-col">
            <span className="text-[7.5px] font-semibold text-slate-500 uppercase">Circle</span>
            <select
              value={filters.circle}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('circle', e.target.value)}
              className="border border-[#dbe1e8] rounded px-1.5 py-1 text-[9.5px] font-bold text-blue-900 bg-blue-50/50 hover:border-blue-300 focus:outline-hidden"
            >
              {CIRCLES.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Voltage */}
          <div className="flex flex-col">
            <span className="text-[7.5px] font-semibold text-slate-500 uppercase">Voltage</span>
            <select
              value={filters.voltageLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('voltageLevel', e.target.value)}
              className="border border-[#dbe1e8] rounded px-1.5 py-1 text-[9.5px] font-medium text-slate-800 bg-white hover:border-slate-400 focus:outline-hidden"
            >
              {VOLTAGES.map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Search box toggle */}
          {showSearchInput ? (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 animate-in fade-in">
              <Search size={12} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search assets / substations..."
                value={filters.searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter('searchQuery', e.target.value)}
                className="w-36 text-[10px] bg-transparent outline-hidden text-slate-800"
                autoFocus
              />
              <button onClick={() => { setFilter('searchQuery', ''); setShowSearchInput(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-[10px] font-semibold transition"
              title="Search substation, equipment or observation"
            >
              <Search size={12} /> Search
            </button>
          )}

          {/* View on Map Shortcut */}
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shadow-xs transition"
          >
            <Map size={13} /> View on Map
          </button>
        </div>
      </div>
    </div>
  );
};
