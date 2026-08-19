import React, { useState } from 'react';

interface LoadPoint {
  hour: string;
  loadMW: number;
  frequency: number;
}

interface InteractiveLoadCurveProps {
  data: LoadPoint[];
  liveLoadMW?: number;
  liveFreq?: number;
}

export const InteractiveLoadCurve: React.FC<InteractiveLoadCurveProps> = ({
  data,
  liveLoadMW = 6245,
  liveFreq = 50.02,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<LoadPoint | null>(null);

  const minLoad = 4000;
  const maxLoad = 7000;
  const svgWidth = 540;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Build SVG path
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = paddingY + chartH - ((d.loadMW - minLoad) / (maxLoad - minLoad)) * chartH;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="w-full bg-slate-900 text-white rounded-lg p-3 relative overflow-hidden select-none shadow-md">
      {/* Top telemetry info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="font-bold text-slate-200">Haryana Grid 24-Hour Load Profile</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400">Current Load: </span>
            <b className="text-cyan-400">{liveLoadMW.toLocaleString()} MW</b>
          </div>
          <div>
            <span className="text-slate-400">Frequency: </span>
            <b className={liveFreq < 49.95 ? 'text-amber-400' : 'text-emerald-400'}>{liveFreq} Hz</b>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          <defs>
            <linearGradient id="loadAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[4500, 5500, 6500].map(val => {
            const y = paddingY + chartH - ((val - minLoad) / (maxLoad - minLoad)) * chartH;
            return (
              <g key={val}>
                <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#loadAreaGradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" />

          {/* Interactive data dots */}
          {points.map((p, i) => (
            <g key={i} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#0e7490"
                stroke="#67e8f9"
                strokeWidth="1.5"
                className="transition-transform hover:scale-150"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X axis labels */}
              <text x={p.x} y={svgHeight - 8} textAnchor="middle" fill="#94a3b8" fontSize="8">
                {p.hour}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover inspection tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-cyan-500/50 rounded px-2.5 py-1 text-center text-xs shadow-xl pointer-events-none">
            <span className="text-cyan-300 font-bold">{hoveredPoint.hour}</span>
            <span className="text-slate-300 mx-2">|</span>
            <span className="text-white font-semibold">Load: <b>{hoveredPoint.loadMW} MW</b></span>
            <span className="text-slate-300 mx-2">|</span>
            <span className="text-emerald-400">Freq: {hoveredPoint.frequency} Hz</span>
          </div>
        )}
      </div>
    </div>
  );
};
