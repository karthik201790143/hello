import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ObservationStatus } from '../../types';
import { ClipboardCheck, X, AlertTriangle, User, Calendar, Save, CheckCircle2 } from 'lucide-react';

export const ObservationDetailModal: React.FC = () => {
  const { selectedObservation, setSelectedObservation, updateObservationStatus } = useDashboard();
  const [newStatus, setNewStatus] = useState<ObservationStatus | null>(null);
  const [remarks, setRemarks] = useState('');

  if (!selectedObservation) return null;

  const currentStatus = newStatus || selectedObservation.status;

  const handleSave = () => {
    if (newStatus) {
      updateObservationStatus(selectedObservation.id, newStatus, remarks || undefined);
    }
    setSelectedObservation(null);
    setNewStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={22} className="text-white" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">{selectedObservation.observationNo}</h3>
              <p className="text-[11px] text-orange-100">
                {selectedObservation.substation} | {selectedObservation.circle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedObservation(null)}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-slate-700">
          {/* Severity & Status Badges */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Equipment:</span>
              <b className="text-slate-900 font-bold">{selectedObservation.equipment} ({selectedObservation.equipmentType})</b>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                  selectedObservation.severity === 'Critical'
                    ? 'bg-rose-600'
                    : selectedObservation.severity === 'Moderate'
                    ? 'bg-amber-500'
                    : 'bg-blue-600'
                }`}
              >
                {selectedObservation.severity}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentStatus === 'Closed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentStatus === 'Critical Pending'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentStatus}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Observation Description & Defect Findings:</label>
            <p className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-slate-800 leading-relaxed text-xs">
              {selectedObservation.description}
            </p>
          </div>

          {/* Timeline & Personnel Details */}
          <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Reported Date:</span>
              <b>{selectedObservation.reportedDate}</b>
            </div>
            <div>
              <span className="text-slate-500 block">Due Date:</span>
              <b>{selectedObservation.dueDate}</b>
            </div>
            <div>
              <span className="text-slate-500 block">Inspected By:</span>
              <b>{selectedObservation.inspectorName}</b>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Engineer:</span>
              <b>{selectedObservation.assignedEngineer}</b>
            </div>
          </div>

          {/* Existing Remarks */}
          {selectedObservation.remarks && (
            <div className="space-y-1">
              <span className="font-bold text-slate-700 block">Engineer Remarks / Action Taken:</span>
              <p className="p-2 bg-slate-100 rounded text-slate-700 italic text-[11px]">
                "{selectedObservation.remarks}"
              </p>
            </div>
          )}

          {/* Update Status Interactive Controls */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <label className="font-bold text-slate-800 block">Update Observation Status:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Critical Pending', 'Under Rectification', 'Closed'] as ObservationStatus[]).map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewStatus(status)}
                  className={`py-1.5 px-2 rounded text-xs font-semibold border transition ${
                    currentStatus === status
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Add rectification notes or update engineer remarks..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full mt-2 p-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setSelectedObservation(null)}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Save size={14} /> Save Status
          </button>
        </div>
      </div>
    </div>
  );
};
