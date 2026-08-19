import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { RadioTower, Zap, X, ShieldAlert, CheckCircle, Activity, Calendar, MapPin, Gauge } from 'lucide-react';

export const AssetDetailModal: React.FC = () => {
  const { selectedSubstation, setSelectedSubstation, selectedTransformer, setSelectedTransformer } = useDashboard();

  const isSubstation = !!selectedSubstation;
  const isTransformer = !!selectedTransformer;

  if (!isSubstation && !isTransformer) return null;

  const close = () => {
    setSelectedSubstation(null);
    setSelectedTransformer(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isSubstation ? (
              <RadioTower className="text-cyan-400" size={24} />
            ) : (
              <Zap className="text-amber-400" size={24} />
            )}
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {isSubstation ? selectedSubstation?.name : selectedTransformer?.name}
              </h3>
              <p className="text-xs text-blue-200">
                {isSubstation
                  ? `${selectedSubstation?.voltage} Substation | ${selectedSubstation?.circle}`
                  : `Transformer Asset | ${selectedTransformer?.substationName}`}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {isSubstation && selectedSubstation && (
            <>
              {/* Top highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Total Capacity</span>
                  <strong className="text-base text-blue-700 font-bold">{selectedSubstation.capacityMVA} MVA</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Current Load</span>
                  <strong className="text-base text-cyan-600 font-bold">{selectedSubstation.currentLoadMW} MW</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Peak Load</span>
                  <strong className="text-base text-indigo-700 font-bold">{selectedSubstation.peakLoadMW} MW</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Health State</span>
                  <span
                    className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold text-white uppercase ${
                      selectedSubstation.health === 'Healthy'
                        ? 'bg-emerald-600'
                        : selectedSubstation.health === 'Moderate'
                        ? 'bg-amber-500'
                        : selectedSubstation.health === 'Critical'
                        ? 'bg-rose-600'
                        : 'bg-red-700'
                    }`}
                  >
                    {selectedSubstation.health}
                  </span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b pb-1">
                  <Activity size={14} className="text-blue-600" /> Substation Specifications & SCADA Details
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asset Code:</span>
                    <b>{selectedSubstation.code}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jurisdiction Zone:</span>
                    <b>{selectedSubstation.zone}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operating Division:</span>
                    <b>{selectedSubstation.division}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commissioning Year:</span>
                    <b>{selectedSubstation.commissioningYear}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Power Transformers:</span>
                    <b>{selectedSubstation.transformersCount} Units</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Connected Feeders:</span>
                    <b>{selectedSubstation.linesCount} Circuits</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active SCADA Alarms:</span>
                    <b className={selectedSubstation.activeAlarms > 0 ? 'text-red-600' : 'text-emerald-600'}>
                      {selectedSubstation.activeAlarms}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Maintenance:</span>
                    <b>{selectedSubstation.lastMaintenance}</b>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 bg-blue-50/70 p-2.5 rounded-lg border border-blue-200 text-[11px] text-blue-900">
                <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Physical Address:</span>
                  {selectedSubstation.address}
                </div>
              </div>
            </>
          )}

          {isTransformer && selectedTransformer && (
            <>
              {/* Transformer highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Rated Capacity</span>
                  <strong className="text-base text-blue-700 font-bold">{selectedTransformer.capacityMVA} MVA</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Current Loading</span>
                  <strong className={`text-base font-bold ${selectedTransformer.loadingPct > 90 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedTransformer.loadingPct}%
                  </strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Winding Temp</span>
                  <strong className={`text-base font-bold ${selectedTransformer.windingTemperatureC > 80 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {selectedTransformer.windingTemperatureC}°C
                  </strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">DGA State</span>
                  <span
                    className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold text-white uppercase ${
                      selectedTransformer.dgaStatus === 'Normal'
                        ? 'bg-emerald-600'
                        : selectedTransformer.dgaStatus === 'Caution'
                        ? 'bg-amber-500'
                        : selectedTransformer.dgaStatus === 'Warning'
                        ? 'bg-orange-600'
                        : 'bg-rose-700'
                    }`}
                  >
                    {selectedTransformer.dgaStatus}
                  </span>
                </div>
              </div>

              {/* Transformer Specs */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b pb-1">
                  <Gauge size={14} className="text-amber-600" /> Transformer Electrical Diagnostics
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Voltage Ratio:</span>
                    <b>{selectedTransformer.voltage}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Manufacturer Make:</span>
                    <b>{selectedTransformer.make}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Year of Manufacture:</span>
                    <b>{selectedTransformer.yearOfMfg}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Oil Temperature:</span>
                    <b>{selectedTransformer.oilTemperatureC}°C</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Load (MVA):</span>
                    <b>{selectedTransformer.currentLoadMVA} MVA</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Oil / DGA Test:</span>
                    <b>{selectedTransformer.lastTested}</b>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={close}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
