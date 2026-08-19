import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ActiveView } from '../types';
import {
  CIRCLES,
  FINANCIAL_YEARS,
  MAINTENANCE_CYCLES,
  VOLTAGES,
} from '../data/mockData';
import {
  LayoutDashboard,
  ClipboardList,
  Grid2X2,
  Wrench,
  FileBarChart,
  CalendarDays,
  LineChart,
  Search,
  ChevronDown,
  Menu,
  RefreshCw,
  Filter,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    assetSubTab,
    setAssetSubTab,
    filters,
    setFilter,
    resetFilters,
    applyFilters,
  } = useDashboard();

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
  };

  return (
    <aside className="w-[160px] bg-gradient-to-b from-[#06225b] to-[#063789] text-[#e9f3ff] p-3 flex flex-col justify-between shrink-0 select-none overflow-y-auto min-h-screen">
      <div>
        {/* Menu label */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-blue-200 uppercase mb-2 px-1">
          <Menu size={13} /> NAVIGATION MENU
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <button
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} className="shrink-0" />
            <span className="truncate">Executive Overview</span>
          </button>

          <button
            onClick={() => handleNavClick('operations')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'operations'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ClipboardList size={14} className="shrink-0" />
            <span className="truncate">Operations Dashboard</span>
          </button>

          {/* Asset Dashboard with Subnav */}
          <div>
            <button
              onClick={() => handleNavClick('assets')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
                activeView === 'assets'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Grid2X2 size={14} className="shrink-0" />
                <span className="truncate">Asset Dashboard</span>
              </div>
              <ChevronDown size={12} />
            </button>

            {/* Subnav items */}
            <div className="ml-4 pl-2 my-1 border-l border-blue-400/40 space-y-1">
              <button
                onClick={() => {
                  setActiveView('assets');
                  setAssetSubTab('substations');
                }}
                className={`w-full text-left text-[9.5px] py-0.5 px-1.5 rounded transition ${
                  activeView === 'assets' && assetSubTab === 'substations'
                    ? 'text-cyan-300 font-bold bg-white/10'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                • Substations
              </button>
              <button
                onClick={() => {
                  setActiveView('assets');
                  setAssetSubTab('lines');
                }}
                className={`w-full text-left text-[9.5px] py-0.5 px-1.5 rounded transition ${
                  activeView === 'assets' && assetSubTab === 'lines'
                    ? 'text-cyan-300 font-bold bg-white/10'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                • Transmission Lines
              </button>
              <button
                onClick={() => {
                  setActiveView('assets');
                  setAssetSubTab('transformers');
                }}
                className={`w-full text-left text-[9.5px] py-0.5 px-1.5 rounded transition ${
                  activeView === 'assets' && assetSubTab === 'transformers'
                    ? 'text-cyan-300 font-bold bg-white/10'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                • Transformers
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNavClick('maintenance')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'maintenance'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Wrench size={14} className="shrink-0" />
            <span className="truncate">Maintenance</span>
          </button>

          <button
            onClick={() => handleNavClick('mp-observations')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'mp-observations'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileBarChart size={14} className="shrink-0" />
            <span className="truncate">M&amp;P Observations</span>
          </button>

          <button
            onClick={() => handleNavClick('outage-log')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'outage-log'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <CalendarDays size={14} className="shrink-0" />
            <span className="truncate">Event &amp; Outage Log</span>
          </button>

          <button
            onClick={() => handleNavClick('reports')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'reports'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileBarChart size={14} className="shrink-0" />
            <span className="truncate">Reports &amp; Export</span>
          </button>

          <button
            onClick={() => handleNavClick('analytics')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'analytics'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LineChart size={14} className="shrink-0" />
            <span className="truncate">Analytics &amp; Trends</span>
          </button>

          <button
            onClick={() => handleNavClick('data-explorer')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-medium transition text-left ${
              activeView === 'data-explorer'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Search size={14} className="shrink-0" />
            <span className="truncate">Data Explorer</span>
          </button>
        </nav>

        {/* Quick Filters Section */}
        <div className="mt-4 pt-3 border-t border-blue-500/30">
          <div className="text-[10px] font-bold tracking-wider text-blue-200 uppercase mb-2 px-1 flex items-center gap-1">
            <Filter size={12} /> QUICK FILTERS
          </div>

          <div className="space-y-2 px-1 text-[9.5px]">
            {/* Financial Year */}
            <div>
              <label className="text-blue-200/80 block mb-0.5">Financial Year</label>
              <select
                value={filters.financialYear}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('financialYear', e.target.value)}
                className="w-full bg-[#071f54] border border-blue-400/50 rounded px-1.5 py-1 text-white text-[9.5px] focus:outline-hidden focus:border-cyan-400"
              >
                {FINANCIAL_YEARS.map((fy: string) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
            </div>

            {/* Circle */}
            <div>
              <label className="text-blue-200/80 block mb-0.5">Circle</label>
              <select
                value={filters.circle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('circle', e.target.value)}
                className="w-full bg-[#071f54] border border-blue-400/50 rounded px-1.5 py-1 text-white text-[9.5px] focus:outline-hidden focus:border-cyan-400"
              >
                {CIRCLES.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Voltage */}
            <div>
              <label className="text-blue-200/80 block mb-0.5">Voltage Level</label>
              <select
                value={filters.voltageLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('voltageLevel', e.target.value)}
                className="w-full bg-[#071f54] border border-blue-400/50 rounded px-1.5 py-1 text-white text-[9.5px] focus:outline-hidden focus:border-cyan-400"
              >
                {VOLTAGES.map((v: string) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Maintenance Cycle */}
            <div>
              <label className="text-blue-200/80 block mb-0.5">Maint. Cycle</label>
              <select
                value={filters.maintenanceCycle}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('maintenanceCycle', e.target.value)}
                className="w-full bg-[#071f54] border border-blue-400/50 rounded px-1.5 py-1 text-white text-[9.5px] focus:outline-hidden focus:border-cyan-400"
              >
                {MAINTENANCE_CYCLES.map((cy: string) => (
                  <option key={cy} value={cy}>{cy}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3 space-y-1.5 px-1">
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#553a9d] hover:bg-[#6848bd] text-white rounded text-[10px] font-bold transition shadow-xs"
            >
              <RefreshCw size={12} /> Reset Filters
            </button>
            <button
              onClick={applyFilters}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#0876dc] hover:bg-[#1a85eb] text-white rounded text-[10px] font-bold transition shadow-xs"
            >
              <Filter size={12} /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-2 border-t border-blue-400/20 text-[8px] text-blue-300/70 text-center">
        HVPNL SCADA v4.2 | Online
      </div>
    </aside>
  );
};
