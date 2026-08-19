import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Activity, RadioTower, Zap, X } from 'lucide-react';

interface NodeCity {
  id: string;
  name: string;
  x: number;
  y: number;
  voltage: string;
  loadMW: number;
  capacityMVA: number;
  status: 'normal' | 'minor' | 'major' | 'outage';
  alarms: number;
  substationsCount: number;
}

const mapCities: NodeCity[] = [
  { id: 'PKL', name: 'Panchkula', x: 54, y: 14, voltage: '220kV / 66kV', loadMW: 280, capacityMVA: 620, status: 'normal', alarms: 0, substationsCount: 14 },
  { id: 'AMB', name: 'Ambala', x: 42, y: 22, voltage: '220kV / 132kV', loadMW: 410, capacityMVA: 840, status: 'normal', alarms: 0, substationsCount: 18 },
  { id: 'YNR', name: 'Yamunanagar', x: 68, y: 24, voltage: '220kV / 132kV', loadMW: 370, capacityMVA: 760, status: 'normal', alarms: 0, substationsCount: 16 },
  { id: 'KRL', name: 'Karnal', x: 62, y: 38, voltage: '220kV / 132kV', loadMW: 480, capacityMVA: 980, status: 'normal', alarms: 0, substationsCount: 22 },
  { id: 'KTH', name: 'Kaithal', x: 44, y: 36, voltage: '132kV / 66kV', loadMW: 260, capacityMVA: 520, status: 'minor', alarms: 1, substationsCount: 12 },
  { id: 'PNP', name: 'Panipat', x: 64, y: 49, voltage: '400kV / 220kV', loadMW: 690, capacityMVA: 1400, status: 'major', alarms: 4, substationsCount: 24 },
  { id: 'JND', name: 'Jind', x: 46, y: 52, voltage: '220kV / 132kV', loadMW: 340, capacityMVA: 680, status: 'normal', alarms: 0, substationsCount: 15 },
  { id: 'HSR', name: 'Hisar', x: 26, y: 58, voltage: '400kV / 220kV', loadMW: 580, capacityMVA: 1260, status: 'normal', alarms: 0, substationsCount: 20 },
  { id: 'RTK', name: 'Rohtak', x: 50, y: 66, voltage: '220kV / 132kV', loadMW: 450, capacityMVA: 920, status: 'minor', alarms: 2, substationsCount: 19 },
  { id: 'GGM', name: 'Gurugram', x: 66, y: 78, voltage: '400kV / 220kV', loadMW: 920, capacityMVA: 1850, status: 'normal', alarms: 0, substationsCount: 28 },
  { id: 'FBD', name: 'Faridabad', x: 78, y: 80, voltage: '220kV / 132kV', loadMW: 540, capacityMVA: 1100, status: 'outage', alarms: 5, substationsCount: 21 },
  { id: 'RWR', name: 'Rewari', x: 44, y: 86, voltage: '400kV / 220kV', loadMW: 490, capacityMVA: 1040, status: 'major', alarms: 3, substationsCount: 16 },
];

const transmissionPaths = [
  { from: 'PKL', to: 'AMB', kv: '220kV' },
  { from: 'AMB', to: 'YNR', kv: '220kV' },
  { from: 'AMB', to: 'KRL', kv: '220kV' },
  { from: 'KRL', to: 'KTH', kv: '132kV' },
  { from: 'KRL', to: 'PNP', kv: '220kV' },
  { from: 'PNP', to: 'JND', kv: '220kV' },
  { from: 'JND', to: 'HSR', kv: '220kV' },
  { from: 'PNP', to: 'RTK', kv: '220kV' },
  { from: 'RTK', to: 'GGM', kv: '400kV' },
  { from: 'GGM', to: 'FBD', kv: '220kV' },
  { from: 'GGM', to: 'RWR', kv: '400kV' },
  { from: 'HSR', to: 'RTK', kv: '220kV' },
  { from: 'RWR', to: 'RTK', kv: '220kV' },
];

export const NetworkMap: React.FC = () => {
  const { setFilter, setSelectedSubstation, substations } = useDashboard();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeNode, setActiveNode] = useState<NodeCity | null>(null);

  const getNodeColor = (status: NodeCity['status']) => {
    switch (status) {
      case 'normal':
        return '#22c55e'; // Green
      case 'minor':
        return '#eab308'; // Yellow
      case 'major':
        return '#f97316'; // Orange
      case 'outage':
        return '#ef4444'; // Red
    }
  };

  const handleNodeClick = (node: NodeCity) => {
    setActiveNode(node);
  };

  const handleFilterByCity = (cityName: string) => {
    const matchedCircle = `${cityName} Circle`;
    setFilter('circle', matchedCircle);
    setActiveNode(null);
  };

  return (
    <div className="relative w-full h-[260px] bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg overflow-hidden border border-slate-200 select-none">
      {/* Zoom / Reset Controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1 shadow-sm">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
          className="w-7 h-7 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-bold flex items-center justify-center text-sm transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
          className="w-7 h-7 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-bold flex items-center justify-center text-sm transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-7 h-7 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium flex items-center justify-center text-[10px] transition-colors"
          title="Reset Map"
        >
          ⛶
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[250px] p-2">
          {/* Subtle boundary shape of Haryana */}
          <path
            d="M 52,10 L 70,20 L 74,32 L 66,45 L 80,72 L 78,86 L 56,92 L 40,88 L 32,74 L 20,60 L 24,46 L 40,30 Z"
            fill="#e2e8f0"
            fillOpacity="0.45"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Transmission lines */}
          {transmissionPaths.map((path, idx) => {
            const fromNode = mapCities.find(c => c.id === path.from);
            const toNode = mapCities.find(c => c.id === path.to);
            if (!fromNode || !toNode) return null;

            const is400kV = path.kv === '400kV';
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={is400kV ? '#2563eb' : '#0d9488'}
                strokeWidth={is400kV ? '1.4' : '0.9'}
                strokeDasharray={is400kV ? 'none' : '1.5 1'}
                strokeOpacity="0.75"
              />
            );
          })}

          {/* City Substation Nodes */}
          {mapCities.map(city => {
            const color = getNodeColor(city.status);
            const isAlert = city.status === 'major' || city.status === 'outage';

            return (
              <g
                key={city.id}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(city)}
                transform={`translate(${city.x}, ${city.y})`}
              >
                {/* Pulsing ring for alerts */}
                {isAlert && (
                  <circle
                    r="4.5"
                    fill={color}
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Node circle */}
                <circle
                  r="2.8"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  className="transition-transform group-hover:scale-130"
                />

                {/* City label */}
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="3.4"
                  fontWeight="bold"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none drop-shadow-sm select-none"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Details Floating Modal */}
      {activeNode && (
        <div className="absolute top-2 left-3 z-30 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-lg shadow-xl p-2.5 w-60 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <RadioTower size={14} className="text-blue-600" />
              <b className="text-xs text-slate-800 font-bold">{activeNode.name} Transmission Grid</b>
            </div>
            <button
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X size={13} />
            </button>
          </div>

          <div className="space-y-1 text-[9px] text-slate-600">
            <div className="flex justify-between">
              <span>Voltage Ratings:</span>
              <b className="text-slate-800">{activeNode.voltage}</b>
            </div>
            <div className="flex justify-between">
              <span>Current Flow:</span>
              <b className="text-blue-700">{activeNode.loadMW} MW</b>
            </div>
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <b className="text-slate-800">{activeNode.capacityMVA} MVA</b>
            </div>
            <div className="flex justify-between">
              <span>Substations:</span>
              <b className="text-slate-800">{activeNode.substationsCount} Nodes</b>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span>Health Status:</span>
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase text-white"
                style={{ backgroundColor: getNodeColor(activeNode.status) }}
              >
                {activeNode.status}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 flex gap-1.5">
            <button
              onClick={() => handleFilterByCity(activeNode.name)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[8.5px] font-semibold py-1 px-2 rounded transition-colors"
            >
              Filter Circle
            </button>
            <button
              onClick={() => {
                const found = substations.find(s => s.name.includes(activeNode.name));
                if (found) setSelectedSubstation(found);
                setActiveNode(null);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8.5px] font-semibold py-1 px-2 rounded transition-colors"
            >
              Inspect
            </button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-3 text-[8.5px] text-slate-600 bg-white/85 backdrop-blur-xs py-0.5 border-t border-slate-200">
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Normal
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Minor Issue
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Major Issue
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Outage
        </span>
      </div>
    </div>
  );
};
