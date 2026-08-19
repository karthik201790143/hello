import React, { useState } from 'react';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface InteractiveDonutProps {
  centerValue: string | number;
  centerLabel: string;
  segments: DonutSegment[];
  size?: number;
  holeRatio?: number;
  onSegmentClick?: (segment: DonutSegment) => void;
}

export const InteractiveDonut: React.FC<InteractiveDonutProps> = ({
  centerValue,
  centerLabel,
  segments,
  size = 110,
  holeRatio = 0.62,
  onSegmentClick,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;

  // Calculate SVG arc paths
  const radius = size / 2;
  const innerRadius = radius * holeRatio;
  const strokeWidth = radius - innerRadius;
  const midRadius = (radius + innerRadius) / 2;
  const circumference = 2 * Math.PI * midRadius;

  let cumulativeAngle = 0;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const ratio = seg.value / total;
          const strokeDasharray = `${ratio * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativeAngle * circumference;
          cumulativeAngle += ratio;
          const isHovered = hoveredIdx === i;

          return (
            <circle
              key={seg.label}
              cx={radius}
              cy={radius}
              r={midRadius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSegmentClick?.(seg)}
              style={{
                filter: isHovered ? 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))' : 'none',
              }}
            />
          );
        })}
      </svg>
      {/* Center text hole */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white text-center pointer-events-none transition-all shadow-inner"
        style={{
          width: innerRadius * 2 - 4,
          height: innerRadius * 2 - 4,
          margin: 'auto',
        }}
      >
        <strong className="text-gray-900 font-bold tracking-tight text-base leading-none">
          {hoveredIdx !== null ? segments[hoveredIdx].value.toLocaleString() : centerValue}
        </strong>
        <small className="text-gray-500 font-medium text-[9px] mt-0.5 max-w-[85%] truncate">
          {hoveredIdx !== null ? segments[hoveredIdx].label : centerLabel}
        </small>
      </div>
    </div>
  );
};
