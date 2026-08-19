import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  RadioTower,
  Activity,
  Zap,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AssetView: React.FC = () => {
  const {
    assetSubTab,
    setAssetSubTab,
    substations,
    transmissionLines,
    transformers,
    setSelectedSubstation,
    setSelectedTransformer,
  } = useDashboard();

  const [localSearch, setLocalSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('All');

  const filteredSubstations = substations.filter(s => {
    if (healthFilter !== 'All' && s.health !== healthFilter) return false;
    if (localSearch) {
      const q = localSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.circle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredLines = transmissionLines.filter(l => {
    if (localSearch) {
      const q = localSearch.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.fromSubstation.toLowerCase().includes(q) || l.circle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredTransformers = transformers.filter(t => {
    if (healthFilter !== 'All' && t.healthStatus !== healthFilter) return false;
    if (localSearch) {
      const q = localSearch.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.substationName.toLowerCase().includes(q) || t.circle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-3 select-none">
      {/* Sub-tabs for Asset Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAssetSubTab('substations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
              assetSubTab === 'substations'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RadioTower size={14} /> Substations ({filteredSubstations.length})
          </button>

          <button
            onClick={() => setAssetSubTab('lines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
              assetSubTab === 'lines'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity size={14} /> Transmission Lines ({filteredLines.length})
          </button>

          <button
            onClick={() => setAssetSubTab('transformers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
              assetSubTab === 'transformers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap size={14} /> Power Transformers ({filteredTransformers.length})
          </button>
        </div>

        {/* Local Search & Health Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-36 text-xs bg-transparent outline-hidden"
            />
          </div>

          <select
            value={healthFilter}
            onChange={e => setHealthFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Health States</option>
            <option value="Healthy">Healthy</option>
            <option value="Moderate">Moderate</option>
            <option value="Critical">Critical</option>
            <option value="Outage">Outage</option>
          </select>
        </div>
      </div>

      {/* Content based on subtab */}
      {assetSubTab === 'substations' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Substation Name</th>
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Voltage</th>
                  <th className="p-2.5">Circle / Zone</th>
                  <th className="p-2.5">Capacity</th>
                  <th className="p-2.5">Peak Load</th>
                  <th className="p-2.5">Transformers</th>
                  <th className="p-2.5">Health State</th>
                  <th className="p-2.5">Commissioned</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredSubstations.map(ss => (
                  <tr key={ss.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2.5 font-bold text-slate-900">{ss.name}</td>
                    <td className="p-2.5 font-mono text-slate-500">{ss.code}</td>
                    <td className="p-2.5 font-bold text-blue-700">{ss.voltage}</td>
                    <td className="p-2.5 text-slate-600">
                      {ss.circle}
                      <span className="block text-[9px] text-slate-400">{ss.zone}</span>
                    </td>
                    <td className="p-2.5 font-bold">{ss.capacityMVA} MVA</td>
                    <td className="p-2.5 font-bold text-cyan-700">{ss.peakLoadMW} MW</td>
                    <td className="p-2.5">{ss.transformersCount} Units</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase ${
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
                    <td className="p-2.5 text-slate-500">{ss.commissioningYear}</td>
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
      )}

      {assetSubTab === 'lines' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Line Section</th>
                  <th className="p-2.5">Voltage</th>
                  <th className="p-2.5">From - To</th>
                  <th className="p-2.5">Length</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Flow / Cap (MW)</th>
                  <th className="p-2.5">Loading %</th>
                  <th className="p-2.5">Trippings (FY)</th>
                  <th className="p-2.5">Last Patrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredLines.map(line => (
                  <tr key={line.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2.5 font-bold text-slate-900">{line.name}</td>
                    <td className="p-2.5 font-bold text-indigo-700">{line.voltage}</td>
                    <td className="p-2.5 text-slate-600">
                      {line.fromSubstation} → {line.toSubstation}
                    </td>
                    <td className="p-2.5 font-medium">{line.lengthKm} km</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          line.status === 'In Service'
                            ? 'bg-emerald-100 text-emerald-800'
                            : line.status === 'Tripped'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {line.status}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium">
                      {line.currentFlowMW} / {line.capacityMW} MW
                    </td>
                    <td className="p-2.5 font-bold">{line.loadingPct}%</td>
                    <td className="p-2.5 font-bold text-rose-600">{line.trippingCount}</td>
                    <td className="p-2.5 text-slate-500">{line.lastPatrolled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {assetSubTab === 'transformers' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Transformer Tag</th>
                  <th className="p-2.5">Substation Location</th>
                  <th className="p-2.5">Voltage Ratio</th>
                  <th className="p-2.5">Capacity</th>
                  <th className="p-2.5">Loading %</th>
                  <th className="p-2.5">Oil / Winding Temp</th>
                  <th className="p-2.5">DGA Status</th>
                  <th className="p-2.5">Health State</th>
                  <th className="p-2.5">Make</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredTransformers.map(tr => (
                  <tr key={tr.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-2.5 font-bold text-slate-900">{tr.name}</td>
                    <td className="p-2.5 text-slate-700 font-medium">{tr.substationName}</td>
                    <td className="p-2.5 font-bold text-blue-700">{tr.voltage}</td>
                    <td className="p-2.5 font-bold">{tr.capacityMVA} MVA</td>
                    <td className="p-2.5 font-bold text-slate-900">{tr.loadingPct}%</td>
                    <td className="p-2.5">
                      <span className="text-slate-600">{tr.oilTemperatureC}°C</span> /{' '}
                      <b className={tr.windingTemperatureC > 80 ? 'text-rose-600' : 'text-slate-800'}>
                        {tr.windingTemperatureC}°C
                      </b>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold text-white uppercase ${
                          tr.dgaStatus === 'Normal'
                            ? 'bg-emerald-600'
                            : tr.dgaStatus === 'Caution'
                            ? 'bg-amber-500'
                            : tr.dgaStatus === 'Warning'
                            ? 'bg-orange-600'
                            : 'bg-rose-700'
                        }`}
                      >
                        {tr.dgaStatus}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold text-white uppercase ${
                          tr.healthStatus === 'Healthy'
                            ? 'bg-emerald-600'
                            : tr.healthStatus === 'Moderate'
                            ? 'bg-amber-500'
                            : tr.healthStatus === 'Critical'
                            ? 'bg-rose-600'
                            : 'bg-red-700'
                        }`}
                      >
                        {tr.healthStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500">{tr.make} ({tr.yearOfMfg})</td>
                    <td className="p-2.5">
                      <button
                        onClick={() => setSelectedTransformer(tr)}
                        className="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1"
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
      )}
    </div>
  );
};
