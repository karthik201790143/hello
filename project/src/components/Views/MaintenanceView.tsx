import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { MaintenanceCycleType } from '../../types';
import {
  Wrench,
  CalendarDays,
  CheckCircle2,
  Timer,
  AlertTriangle,
  Plus,
  Check,
  Search,
} from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceRecords,
    markMaintenanceDone,
    addMaintenanceRecord,
    summaryMetrics,
    filters,
  } = useDashboard();

  const [cycleFilter, setCycleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Maintenance Schedule Form State
  const [assetName, setAssetName] = useState('');
  const [substation, setSubstation] = useState('400kV Bawal');
  const [circle, setCircle] = useState('Rewari Circle');
  const [cycle, setCycle] = useState<MaintenanceCycleType>('Quarterly');
  const [dueDate, setDueDate] = useState('2026-06-30');
  const [engineerInCharge, setEngineerInCharge] = useState('Er. Amit Verma');
  const [remarks, setRemarks] = useState('');

  const filteredRecords = maintenanceRecords.filter(m => {
    if (cycleFilter !== 'All' && m.cycle !== cycleFilter) return false;
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;
    return true;
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName) return;

    addMaintenanceRecord({
      assetType: 'Transformer',
      assetName,
      substation,
      circle,
      zone: 'South Zone',
      cycle,
      financialYear: filters.financialYear,
      status: 'Pending',
      dueDate,
      engineerInCharge,
      remarks: remarks || 'Scheduled maintenance as per annual plan.',
    });

    setIsScheduleModalOpen(false);
    setAssetName('');
    setRemarks('');
  };

  return (
    <div className="space-y-3 select-none">
      {/* Maintenance Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Due (FY)</span>
            <CalendarDays size={18} className="text-blue-600" />
          </div>
          <strong className="text-xl text-slate-900 font-extrabold block mt-1">
            {summaryMetrics.maintenanceDue.toLocaleString()}
          </strong>
          <span className="text-[9.5px] text-slate-500">Planned PM Work Orders</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-700 font-bold uppercase">Completed</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <strong className="text-xl text-emerald-700 font-extrabold block mt-1">
            {summaryMetrics.maintenanceDone.toLocaleString()}
          </strong>
          <span className="text-[9.5px] text-emerald-600 font-semibold">{summaryMetrics.maintenanceCompletionPct}% Compliance Rate</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 font-bold uppercase">Pending</span>
            <Timer size={18} className="text-amber-600" />
          </div>
          <strong className="text-xl text-amber-700 font-extrabold block mt-1">
            {summaryMetrics.maintenancePending.toLocaleString()}
          </strong>
          <span className="text-[9.5px] text-amber-600 font-semibold">Under scheduling</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-700 font-bold uppercase">Overdue Tasks</span>
            <AlertTriangle size={18} className="text-rose-600" />
          </div>
          <strong className="text-xl text-rose-700 font-extrabold block mt-1">
            {summaryMetrics.maintenanceOverdue}
          </strong>
          <span className="text-[9.5px] text-rose-600 font-semibold">Requires immediate PTW</span>
        </div>
      </div>

      {/* Filter and Schedule Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Filter By:</span>
          <select
            value={cycleFilter}
            onChange={e => setCycleFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Cycles</option>
            <option value="Annual">Annual</option>
            <option value="Half Yearly">Half Yearly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Monthly">Monthly</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-medium bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Done">Done</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-xs transition"
        >
          <Plus size={14} /> Schedule Maintenance Task
        </button>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                <th className="p-2.5">Asset / Equipment Name</th>
                <th className="p-2.5">Substation Location</th>
                <th className="p-2.5">Circle</th>
                <th className="p-2.5">Cycle</th>
                <th className="p-2.5">Target Due Date</th>
                <th className="p-2.5">Engineer In-Charge</th>
                <th className="p-2.5">Remarks / Scope</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredRecords.map(m => (
                <tr key={m.id} className="hover:bg-blue-50/40 transition">
                  <td className="p-2.5 font-bold text-slate-900">{m.assetName}</td>
                  <td className="p-2.5 text-slate-700">{m.substation}</td>
                  <td className="p-2.5 text-slate-600">{m.circle}</td>
                  <td className="p-2.5 font-semibold text-blue-700">{m.cycle}</td>
                  <td className="p-2.5 font-medium">{m.dueDate}</td>
                  <td className="p-2.5 text-slate-700">{m.engineerInCharge}</td>
                  <td className="p-2.5 text-slate-500 max-w-[200px] truncate" title={m.remarks}>
                    {m.remarks}
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        m.status === 'Done'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-2.5">
                    {m.status !== 'Done' ? (
                      <button
                        onClick={() => markMaintenanceDone(m.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition"
                      >
                        <Check size={12} /> Mark Done
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Schedule Preventive Maintenance (PM)</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateSchedule} className="p-5 space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-semibold block mb-1">Asset / Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 315 MVA ICT-1 or 220kV SF6 Breaker CB-101"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Substation</label>
                  <input
                    type="text"
                    value={substation}
                    onChange={e => setSubstation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Circle</label>
                  <input
                    type="text"
                    value={circle}
                    onChange={e => setCircle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Maintenance Cycle</label>
                  <select
                    value={cycle}
                    onChange={e => setCycle(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Engineer In-Charge</label>
                <input
                  type="text"
                  value={engineerInCharge}
                  onChange={e => setEngineerInCharge(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Maintenance Scope & Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Testing procedure, oil filtration, contact resistance measurement..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
                >
                  Schedule Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
