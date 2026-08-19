import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  FileSpreadsheet,
  CloudDownload,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  FileText,
  FileBarChart,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    observations,
    substations,
    maintenanceRecords,
    outageEvents,
    filters,
    setIsExportModalOpen,
  } = useDashboard();

  const [selectedReport, setSelectedReport] = useState<'critical-audit' | 'asset-loading' | 'maintenance-compliance' | 'outage-summary'>('critical-audit');

  const handleQuickDownloadCSV = () => {
    let csv = '';
    let filename = `HVPNL_Report_${selectedReport}_${filters.financialYear}.csv`;

    if (selectedReport === 'critical-audit') {
      csv = 'Observation No,Substation,Circle,Voltage,Equipment,Severity,Status,Days Pending,Reported Date\n';
      observations.forEach(o => {
        csv += `"${o.observationNo}","${o.substation}","${o.circle}","${o.voltage}","${o.equipment}","${o.severity}","${o.status}","${o.daysPending}","${o.reportedDate}"\n`;
      });
    } else if (selectedReport === 'asset-loading') {
      csv = 'Substation Name,Code,Circle,Capacity MVA,Current Load MW,Peak Load MW,Health\n';
      substations.forEach(s => {
        csv += `"${s.name}","${s.code}","${s.circle}","${s.capacityMVA}","${s.currentLoadMW}","${s.peakLoadMW}","${s.health}"\n`;
      });
    } else if (selectedReport === 'maintenance-compliance') {
      csv = 'Asset Name,Substation,Circle,Cycle,Status,Due Date,Remarks\n';
      maintenanceRecords.forEach(m => {
        csv += `"${m.assetName}","${m.substation}","${m.circle}","${m.cycle}","${m.status}","${m.dueDate}","${m.remarks}"\n`;
      });
    } else {
      csv = 'Event ID,Timestamp,Asset Name,Voltage,Circle,Outage Type,Load Loss MW,Status\n';
      outageEvents.forEach(e => {
        csv += `"${e.id}","${e.timestamp}","${e.assetName}","${e.voltage}","${e.circle}","${e.outageType}","${e.loadLossMW}","${e.status}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setSelectedReport('critical-audit')}
          className={`p-3 rounded-lg border text-left transition shadow-2xs ${
            selectedReport === 'critical-audit'
              ? 'bg-blue-50/80 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileBarChart size={20} className="text-rose-600 mb-1" />
          <b className="text-xs font-bold text-slate-900 block">Critical M&amp;P Audit</b>
          <span className="text-[9.5px] text-slate-500">Defect tracking &amp; compliance</span>
        </button>

        <button
          onClick={() => setSelectedReport('asset-loading')}
          className={`p-3 rounded-lg border text-left transition shadow-2xs ${
            selectedReport === 'asset-loading'
              ? 'bg-blue-50/80 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet size={20} className="text-blue-600 mb-1" />
          <b className="text-xs font-bold text-slate-900 block">Asset Loading &amp; Utilization</b>
          <span className="text-[9.5px] text-slate-500">MVA capacity &amp; peak demand</span>
        </button>

        <button
          onClick={() => setSelectedReport('maintenance-compliance')}
          className={`p-3 rounded-lg border text-left transition shadow-2xs ${
            selectedReport === 'maintenance-compliance'
              ? 'bg-blue-50/80 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle size={20} className="text-emerald-600 mb-1" />
          <b className="text-xs font-bold text-slate-900 block">Maintenance PM Schedule</b>
          <span className="text-[9.5px] text-slate-500">Cycle-wise planned execution</span>
        </button>

        <button
          onClick={() => setSelectedReport('outage-summary')}
          className={`p-3 rounded-lg border text-left transition shadow-2xs ${
            selectedReport === 'outage-summary'
              ? 'bg-blue-50/80 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText size={20} className="text-amber-600 mb-1" />
          <b className="text-xs font-bold text-slate-900 block">Grid Outage &amp; Tripping Log</b>
          <span className="text-[9.5px] text-slate-500">Relay flag analysis &amp; restoration</span>
        </button>
      </div>

      {/* Report Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase">
            {selectedReport.replace('-', ' ')} REPORT (FY {filters.financialYear})
          </h3>
          <p className="text-[10.5px] text-slate-500">
            Generated with active circle and voltage filters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickDownloadCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <CloudDownload size={14} /> Download Excel / CSV
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* Tabular Preview */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
          Executive Preview Data Records
        </div>
        <div className="overflow-x-auto max-h-[420px]">
          {selectedReport === 'critical-audit' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Observation No.</th>
                  <th className="p-2.5">Substation</th>
                  <th className="p-2.5">Circle</th>
                  <th className="p-2.5">Equipment</th>
                  <th className="p-2.5">Defect Findings</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Days Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {observations.map(o => (
                  <tr key={o.id} className="hover:bg-blue-50/40">
                    <td className="p-2.5 font-bold font-mono text-blue-900">{o.observationNo}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{o.substation}</td>
                    <td className="p-2.5 text-slate-600">{o.circle}</td>
                    <td className="p-2.5 font-medium">{o.equipment}</td>
                    <td className="p-2.5 text-slate-600 max-w-[240px] truncate">{o.description}</td>
                    <td className="p-2.5 font-bold text-rose-600">{o.severity}</td>
                    <td className="p-2.5 font-semibold">{o.status}</td>
                    <td className="p-2.5 font-bold">{o.daysPending} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'asset-loading' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Substation Name</th>
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Circle</th>
                  <th className="p-2.5">Voltage</th>
                  <th className="p-2.5">Capacity</th>
                  <th className="p-2.5">Current Flow</th>
                  <th className="p-2.5">Peak Demand</th>
                  <th className="p-2.5">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {substations.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/40">
                    <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                    <td className="p-2.5 font-mono">{s.code}</td>
                    <td className="p-2.5 text-slate-600">{s.circle}</td>
                    <td className="p-2.5 font-bold text-blue-700">{s.voltage}</td>
                    <td className="p-2.5 font-bold">{s.capacityMVA} MVA</td>
                    <td className="p-2.5 font-bold text-blue-900">{s.currentLoadMW} MW</td>
                    <td className="p-2.5 text-slate-700">{s.peakLoadMW} MW</td>
                    <td className="p-2.5 font-semibold">{s.health}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'maintenance-compliance' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Equipment / Asset</th>
                  <th className="p-2.5">Substation</th>
                  <th className="p-2.5">Circle</th>
                  <th className="p-2.5">Cycle</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5">Engineer In-Charge</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {maintenanceRecords.map(m => (
                  <tr key={m.id} className="hover:bg-blue-50/40">
                    <td className="p-2.5 font-bold text-slate-900">{m.assetName}</td>
                    <td className="p-2.5 text-slate-700">{m.substation}</td>
                    <td className="p-2.5 text-slate-600">{m.circle}</td>
                    <td className="p-2.5 font-bold text-blue-700">{m.cycle}</td>
                    <td className="p-2.5 font-medium">{m.dueDate}</td>
                    <td className="p-2.5 text-slate-700">{m.engineerInCharge}</td>
                    <td className="p-2.5 font-bold">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'outage-summary' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold text-[10px]">
                  <th className="p-2.5">Event ID</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Asset</th>
                  <th className="p-2.5">Voltage</th>
                  <th className="p-2.5">Circle</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Relay Flags</th>
                  <th className="p-2.5">Load Impact</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {outageEvents.map(e => (
                  <tr key={e.id} className="hover:bg-blue-50/40">
                    <td className="p-2.5 font-bold font-mono text-blue-900">{e.id}</td>
                    <td className="p-2.5 font-medium text-slate-600">{e.timestamp}</td>
                    <td className="p-2.5 font-bold text-slate-900">{e.assetName}</td>
                    <td className="p-2.5 font-bold text-blue-700">{e.voltage}</td>
                    <td className="p-2.5 text-slate-600">{e.circle}</td>
                    <td className="p-2.5 font-bold">{e.outageType}</td>
                    <td className="p-2.5 font-mono text-[10px]">{e.relayOperated}</td>
                    <td className="p-2.5 font-bold text-rose-600">{e.loadLossMW} MW</td>
                    <td className="p-2.5 font-bold">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
