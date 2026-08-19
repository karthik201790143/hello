import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ObservationSeverity, ObservationStatus, VoltageLevel } from '../../types';
import { CIRCLES } from '../../data/mockData';
import { PlusCircle, X, Check } from 'lucide-react';

export const NewObservationModal: React.FC = () => {
  const { isNewObservationModalOpen, setIsNewObservationModalOpen, addObservation } = useDashboard();

  const [substation, setSubstation] = useState('220kV Rohtak Bypass');
  const [circle, setCircle] = useState('Rohtak Circle');
  const [zone, setZone] = useState('Central Zone');
  const [voltage, setVoltage] = useState<VoltageLevel>('220kV');
  const [equipment, setEquipment] = useState('');
  const [equipmentType, setEquipmentType] = useState<any>('Transformer');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<ObservationSeverity>('Critical');
  const [status, setStatus] = useState<ObservationStatus>('Critical Pending');
  const [inspectorName, setInspectorName] = useState('Er. R. K. Sharma (XEN M&P)');
  const [assignedEngineer, setAssignedEngineer] = useState('Er. Amit Verma (SDO TS)');
  const [dueDate, setDueDate] = useState('2026-06-15');

  if (!isNewObservationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment || !description) return;

    addObservation({
      substation,
      circle,
      zone,
      voltage,
      equipment,
      equipmentType,
      description,
      severity,
      status,
      reportedDate: new Date().toISOString().split('T')[0],
      dueDate,
      inspectorName,
      assignedEngineer,
      remarks: 'Newly logged observation pending initial field inspection.',
    });

    setIsNewObservationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle size={22} className="text-white" />
            <h3 className="text-sm font-bold tracking-tight">Log New M&P Inspection Observation</h3>
          </div>
          <button
            onClick={() => setIsNewObservationModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Substation Name</label>
              <input
                type="text"
                required
                value={substation}
                onChange={e => setSubstation(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Circle</label>
              <select
                value={circle}
                onChange={e => setCircle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                {CIRCLES.filter(c => c !== 'All Circles').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Voltage Level</label>
              <select
                value={voltage}
                onChange={e => setVoltage(e.target.value as VoltageLevel)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                <option value="400kV">400kV</option>
                <option value="220kV">220kV</option>
                <option value="132kV">132kV</option>
                <option value="66kV">66kV</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Equipment Type</label>
              <select
                value={equipmentType}
                onChange={e => setEquipmentType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                <option value="Transformer">Transformer</option>
                <option value="Circuit Breaker">Circuit Breaker</option>
                <option value="Isolator">Isolator</option>
                <option value="Wave Trap">Wave Trap</option>
                <option value="CT/PT">CT / PT</option>
                <option value="Relay">Relay</option>
                <option value="Battery Bank">Battery Bank</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as ObservationSeverity)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Equipment Tag / Identifier</label>
            <input
              type="text"
              required
              placeholder="e.g. 160MVA PTR-1 or 220kV Bus Isolator ISO-202"
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Defect Observation Findings</label>
            <textarea
              required
              rows={3}
              placeholder="Detailed description of defect, test findings, leakage, heating delta T, or relay issue..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Inspecting Officer</label>
              <input
                type="text"
                value={inspectorName}
                onChange={e => setInspectorName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Rectification Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-3 bg-slate-50 -mx-5 -mb-5 border-t border-slate-200 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsNewObservationModalOpen(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Check size={14} /> Submit Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
