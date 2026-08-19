import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { CloudDownload, X, FileSpreadsheet, FileCode, Printer, Check } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, substations, observations, maintenanceRecords, outageEvents, filters } = useDashboard();
  const [exportType, setExportType] = useState<'observations' | 'substations' | 'maintenance' | 'outages'>('observations');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownloadCSV = () => {
    let csvContent = '';
    let filename = `HVPNL_${exportType}_${filters.financialYear}.csv`;

    if (exportType === 'observations') {
      csvContent = 'Observation No,Substation,Circle,Voltage,Equipment,Severity,Status,Reported Date,Due Date,Inspector,Remarks\n';
      observations.forEach(o => {
        csvContent += `"${o.observationNo}","${o.substation}","${o.circle}","${o.voltage}","${o.equipment}","${o.severity}","${o.status}","${o.reportedDate}","${o.dueDate}","${o.inspectorName}","${o.remarks || ''}"\n`;
      });
    } else if (exportType === 'substations') {
      csvContent = 'Substation Name,Code,Circle,Zone,Voltage,Capacity MVA,Current Load MW,Health,Transformers,Commissioning Year\n';
      substations.forEach(s => {
        csvContent += `"${s.name}","${s.code}","${s.circle}","${s.zone}","${s.voltage}","${s.capacityMVA}","${s.currentLoadMW}","${s.health}","${s.transformersCount}","${s.commissioningYear}"\n`;
      });
    } else if (exportType === 'maintenance') {
      csvContent = 'Asset Name,Substation,Circle,Cycle,Status,Due Date,Engineer,Remarks\n';
      maintenanceRecords.forEach(m => {
        csvContent += `"${m.assetName}","${m.substation}","${m.circle}","${m.cycle}","${m.status}","${m.dueDate}","${m.engineerInCharge}","${m.remarks}"\n`;
      });
    } else {
      csvContent = 'Timestamp,Asset Name,Voltage,Circle,Outage Type,Cause,Relay Operated,Load Loss MW,Status\n';
      outageEvents.forEach(e => {
        csvContent += `"${e.timestamp}","${e.assetName}","${e.voltage}","${e.circle}","${e.outageType}","${e.cause}","${e.relayOperated}","${e.loadLossMW}","${e.status}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setIsExportModalOpen(false);
    }, 1500);
  };

  const handleDownloadJSON = () => {
    let dataToExport: any = observations;
    if (exportType === 'substations') dataToExport = substations;
    if (exportType === 'maintenance') dataToExport = maintenanceRecords;
    if (exportType === 'outages') dataToExport = outageEvents;

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `HVPNL_${exportType}_data.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setIsExportModalOpen(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudDownload size={22} className="text-white" />
            <h3 className="text-sm font-bold tracking-tight">Export Transmission Data</h3>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Dataset to Export</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'observations', label: 'M&P Observations' },
                { id: 'substations', label: 'Substation Inventory' },
                { id: 'maintenance', label: 'Maintenance Log' },
                { id: 'outages', label: 'Outage & Trippings' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExportType(opt.id as any)}
                  className={`p-2.5 rounded-lg border text-left font-medium transition ${
                    exportType === opt.id
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Financial Year:</span>
              <b className="text-slate-800">{filters.financialYear}</b>
            </div>
            <div className="flex justify-between">
              <span>Circle Filter:</span>
              <b className="text-slate-800">{filters.circle}</b>
            </div>
            <div className="flex justify-between">
              <span>Selected Voltage:</span>
              <b className="text-slate-800">{filters.voltageLevel}</b>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadCSV}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <FileSpreadsheet size={16} /> Export to Excel / CSV (.csv)
            </button>

            <button
              onClick={handleDownloadJSON}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <FileCode size={16} /> Export Structured JSON (.json)
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-center text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check size={16} /> File generated and downloaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
