import React, { useState } from 'react';

interface StackedCycleRow {
  cycle: string;
  total: number;
  done: number;
  pending: number;
  overdue: number;
}

interface InteractiveStackedBarsProps {
  data: StackedCycleRow[];
  onCycleClick?: (cycle: string) => void;
}

export const InteractiveStackedBars: React.FC<InteractiveStackedBarsProps> = ({
  data,
  onCycleClick,
}) => {
  const [hoveredCycle, setHoveredCycle] = useState<string | null>(null);

  const maxTotal = Math.max(...data.map(d => d.total), 1400);

  return (
    <div className="p-2 space-y-2 select-none">
      {data.map(row => {
        const isHovered = hoveredCycle === row.cycle;
        const donePct = (row.done / maxTotal) * 100;
        const pendingPct = (row.pending / maxTotal) * 100;
        const completionRate = ((row.done / (row.total || 1)) * 100).toFixed(1);

        return (
          <div
            key={row.cycle}
            className={`flex items-center gap-2 p-1 rounded-md transition-colors cursor-pointer ${
              isHovered ? 'bg-blue-50/70' : ''
            }`}
            onMouseEnter={() => setHoveredCycle(row.cycle)}
            onMouseLeave={() => setHoveredCycle(null)}
            onClick={() => onCycleClick?.(row.cycle)}
          >
            {/* Cycle label */}
            <div className="w-18 text-right text-[9.5px] font-bold text-slate-700 truncate">
              {row.cycle}
            </div>

            {/* Stacked bar container */}
            <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden flex items-center shadow-inner relative">
              {/* Total indicator */}
              <div
                className="bg-blue-600 h-full flex items-center justify-center text-white text-[8px] font-bold transition-all duration-300"
                style={{ width: `${Math.max(15, donePct)}%` }}
                title={`Done: ${row.done.toLocaleString()}`}
              >
                {row.done.toLocaleString()}
              </div>

              {/* Pending indicator */}
              <div
                className="bg-amber-500 h-full flex items-center justify-center text-white text-[8px] font-bold transition-all duration-300 ml-0.5"
                style={{ width: `${Math.max(12, pendingPct)}%` }}
                title={`Pending: ${row.pending.toLocaleString()}`}
              >
                {row.pending.toLocaleString()}
              </div>

              {/* Percentage badge */}
              <div className="ml-auto pr-1 text-[8.5px] font-extrabold text-slate-600">
                {completionRate}%
              </div>
            </div>

            {/* Overdue tag */}
            <div className="w-14 text-right">
              {row.overdue > 0 ? (
                <span className="text-[8px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">
                  {row.overdue} Overdue
                </span>
              ) : (
                <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                  On Track
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-1 border-t border-slate-100 text-[8.5px] text-slate-600 font-medium">
        <span className="flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" /> Completed
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" /> Pending
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2.5 h-2.5 rounded-xs bg-red-500 inline-block" /> Overdue
        </span>
      </div>
    </div>
  );
};
