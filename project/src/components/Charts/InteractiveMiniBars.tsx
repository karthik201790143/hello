import React, { useState } from 'react';

interface MiniBarsProps {
  data: Array<{ year: string; value: number }>;
  color?: string;
  unit?: string;
}

export const InteractiveMiniBars: React.FC<MiniBarsProps> = ({
  data,
  color = '#18a6ae',
  unit = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value)) * 1.15;

  return (
    <div className="relative h-[140px] flex items-end justify-between px-2 pt-6 pb-2 select-none">
      {data.map((item, idx) => {
        const heightPct = Math.max(12, (item.value / max) * 100);
        const isHovered = hoveredIndex === idx;

        return (
          <div
            key={item.year}
            className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip on hover */}
            {isHovered && (
              <div className="absolute -top-7 z-20 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap animate-in fade-in">
                {item.value.toLocaleString()} {unit}
              </div>
            )}

            {/* Value label */}
            <span
              className={`text-[8.5px] font-semibold transition-colors duration-150 mb-1 ${
                isHovered ? 'text-blue-700 font-bold' : 'text-slate-600'
              }`}
            >
              {item.value.toLocaleString()}
            </span>

            {/* Bar */}
            <div className="w-full flex justify-center">
              <div
                className="w-4.5 rounded-t transition-all duration-300 shadow-sm"
                style={{
                  height: `${(heightPct / 100) * 72}px`,
                  backgroundColor: isHovered ? '#0b5da7' : color,
                  transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                }}
              />
            </div>

            {/* Label below */}
            <span className="text-[7.5px] font-medium text-slate-500 mt-1.5 -rotate-30 origin-top-left whitespace-nowrap">
              {item.year}
            </span>
          </div>
        );
      })}
    </div>
  );
};
