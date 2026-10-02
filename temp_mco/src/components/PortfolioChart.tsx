import React, { useState, useRef, useMemo } from 'react';
import { CHART_TIMEFRAMES, ChartDataPoint } from '../data/mockData';
import { playTap } from '../utils/audio';

interface PortfolioChartProps {
  onHoverPoint?: (point: ChartDataPoint | null) => void;
  activeTimeframe: string;
  onTimeframeChange: (tf: string) => void;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  onHoverPoint,
  activeTimeframe,
  onTimeframeChange,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dataset = useMemo(() => {
    return CHART_TIMEFRAMES[activeTimeframe] || CHART_TIMEFRAMES['1D'];
  }, [activeTimeframe]);

  const points = dataset.points;

  // Calculate SVG curve geometry
  const width = 500;
  const height = 180;
  const paddingX = 10;
  const paddingTop = 20;
  const paddingBottom = 20;

  const minVal = Math.min(...points.map((p) => p.value));
  const maxVal = Math.max(...points.map((p) => p.value));
  const valRange = maxVal - minVal || 1;

  const coords = useMemo(() => {
    return points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * (width - 2 * paddingX);
      const normalizedY = (p.value - minVal) / valRange;
      const y = height - paddingBottom - normalizedY * (height - paddingTop - paddingBottom);
      return { x, y, data: p };
    });
  }, [points, minVal, valRange]);

  // Construct smooth SVG path using Catmull-Rom or cubic bezier
  const pathD = useMemo(() => {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? i : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [coords]);

  const areaD = useMemo(() => {
    if (!pathD) return '';
    return `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
  }, [pathD, coords]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clientX / rect.width;
    const closestIdx = Math.round(ratio * (points.length - 1));
    const clampedIdx = Math.max(0, Math.min(closestIdx, points.length - 1));

    setHoverIndex(clampedIdx);
    onHoverPoint?.(points[clampedIdx]);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
    onHoverPoint?.(null);
  };

  const activeCoord = hoverIndex !== null ? coords[hoverIndex] : null;

  return (
    <div className="w-full">
      {/* Interactive Chart Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[180px] touch-none cursor-crosshair select-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5FD3A0" stopOpacity="0.28" />
              <stop offset="40%" stopColor="#5FD3A0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#5FD3A0" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Primary Spline Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#5FD3A0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Active Crosshair Scrub Guide */}
          {activeCoord && (
            <g>
              {/* Vertical guideline */}
              <line
                x1={activeCoord.x}
                y1={0}
                x2={activeCoord.x}
                y2={height}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Outer pulsing ring */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="8"
                fill="#5FD3A0"
                fillOpacity="0.25"
                className="animate-ping"
              />

              {/* Glowing center dot */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#5FD3A0"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating crosshair tool badge */}
        {activeCoord && (
          <div
            className="pointer-events-none absolute -top-3 transform -translate-x-1/2 z-20 px-2.5 py-1 rounded-lg bg-[#181B22]/90 backdrop-blur-md border border-white/10 text-[11px] shadow-lg flex items-center gap-2"
            style={{
              left: `${(activeCoord.x / width) * 100}%`,
            }}
          >
            <span className="font-mono-num font-bold text-white">
              ${activeCoord.data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/60 font-medium">{activeCoord.data.time || activeCoord.data.label}</span>
          </div>
        )}
      </div>

      {/* Segmented Timeframe Switcher (Interactive Filter Buttons) */}
      <div className="flex items-center justify-between mt-3 px-1">
        {(['1H', '1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => {
          const isActive = activeTimeframe === tf;
          return (
            <button
              key={tf}
              onClick={() => {
                playTap();
                onTimeframeChange(tf);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#E6DFCF] text-[#121316] shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tf}
            </button>
          );
        })}
      </div>
    </div>
  );
};
