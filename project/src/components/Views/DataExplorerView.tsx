import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  CIRCLES,
  VOLTAGES,
  ZONES,
} from '../../data/mockData';
import {
  Search,
  SlidersHorizontal,
  CloudDownload,
  Filter,
  Eye,
  Database,
  Check,
} from 'lucide-react';

export const DataExplorerView: React.FC = () => {
  const { substations, setSelectedSubstation } = useDashboard();

  const [search, setSearch] = useState('');
  const [selectedVoltage, setSelectedVoltage] = useState('All');
  const [selectedCircle, setSelectedCircle] = useState('All');
  const [selectedHealth, setSelectedHealth] = useState('All');
  const [minCapacity, setMinCapacity] = useState(0);

  const results = useMemo(() => {
    return substations.filter(s => {
      if (selectedVoltage !== 'All' && s.voltage !== selectedVoltage) return false;
      if (selectedCircle !== 'All' && s.circle !== selectedCircle) return false;
      if (selectedHealth !== 'All' && s.health !== selectedHealth) return false;
      if (s.capacityMVA < minCapacity) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.circle.toLowerCase().includes(q);
      }
      return true;
    });
  }, [substations, selectedVoltage, selectedCircle, selectedHealth, minCapacity, search]);

  const handleExportResultsCSV = () => {
    let csv = 'Substation Name,Code,Circle,Zone,Voltage,Capacity MVA,Current Load MW,Peak Load MW,Health State,Commissioned\n';
    results.forEach(s => {
      csv += `"${s.name}","${s.code}","${s.circle}","${s.zone}","${s.voltage}","${s.capacityMVA}","${s.currentLoadMW}","${s.peakLoadMW}","${s.health}","${s.commissioningYear}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HVPNL_DataExplorer_Export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Query Filter Builder Panel */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-3 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">Multi-Attribute Data Query Explorer</h3>
          </div>
          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
            {results.length} Records Matching
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
          <div>
            <label className="text-slate-600 font-medium block mb-1">Keywords Search</label>
            <input
              type="text"
              placeholder="Search by name / code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-1.5 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Voltage Rating</label>
            <select
              value={selectedVoltage}
              onChange={e => setSelectedVoltage(e.target.value)}
              className="w-full p-1.5 border border-slate-300 rounded text-xs outline-hidden bg-white"
            >
              <option value="All">All Voltages</option>
              <option value="400kV">400 kV</option>
              <option value="220kV">220 kV</option>
              <option value="132kV">132 kV</option>
              <option value="66kV">66 kV</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Operating Circle</label>
            <select
              value={selectedCircle}
              onChange={e => setSelectedCircle(e.target.value)}
              className="w-full p-1.5 border border-slate-300 rounded text-xs outline-hidden bg-white"
            >
              <option value="All">All Circles</option>
              {CIRCLES.filter(c => c !== 'All Circles').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Health Status</label>
            <select
              value={selectedHealth}
              onChange={e => setSelectedHealth(e.target.value)}
              className="w-full p-1.5 border border-slate-300 rounded text-xs outline-hidden bg-white"
            >
              <option value="All">All Health States</option>
              <option value="Healthy">Healthy</option>
              <option value="Moderate">Moderate</option>
              <option value="Critical">Critical</option>
              <option value="Outage">Outage</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Min Capacity (MVA)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={minCapacity}
              onChange={e => setMinCapacity(Number(e.target.value))}
              className="w-full p-1.5 border border-slate-300 rounded text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              setSearch('');
              setSelectedVoltage('All');
              setSelectedCircle('All');
              setSelectedHealth('All');
              setMinCapacity(0);
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded"
          >
            Reset Query
          </button>
          <button
            onClick={handleExportResultsCSV}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs transition"
          >
            <CloudDownload size={13} /> Export Queried Records (.csv)
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2.5">Substation Node</th>
                <th className="p-2.5">Code</th>
                <th className="p-2.5">Voltage</th>
                <th className="p-2.5">Circle</th>
                <th className="p-2.5">Zone</th>
                <th className="p-2.5">Capacity</th>
                <th className="p-2.5">Current Flow</th>
                <th className="p-2.5">Peak Recorded</th>
                <th className="p-2.5">Health State</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {results.map(ss => (
                <tr key={ss.id} className="hover:bg-blue-50/40">
                  <td className="p-2.5 font-bold text-slate-900">{ss.name}</td>
                  <td className="p-2.5 font-mono text-slate-500">{ss.code}</td>
                  <td className="p-2.5 font-bold text-blue-700">{ss.voltage}</td>
                  <td className="p-2.5 text-slate-700">{ss.circle}</td>
                  <td className="p-2.5 text-slate-500">{ss.zone}</td>
                  <td className="p-2.5 font-bold">{ss.capacityMVA} MVA</td>
                  <td className="p-2.5 font-bold text-blue-900">{ss.currentLoadMW} MW</td>
                  <td className="p-2.5 text-slate-700">{ss.peakLoadMW} MW</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[8.5px] font-bold text-white uppercase ${
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
                  <td className="p-2.5">
                    <button
                      onClick={() => setSelectedSubstation(ss)}
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
