import { HiArrowTrendingUp } from "react-icons/hi2";

export default function MasteryTrendChart({ data = [] }) {
  if (!data || data.length === 0) return null;

  const width = 500;
  const height = 180;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  // Calculate coordinates for points
  const points = data.map((item, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    // Map 0-100% to y (height - paddingBottom down to paddingTop)
    const y = height - paddingBottom - (item.masteryPercent / 100) * chartHeight;
    return { x, y, date: item.date, percent: item.masteryPercent };
  });

  // Construct SVG Path strings
  const linePath = points.reduce((acc, point, index) => {
    return index === 0
      ? `M ${point.x},${point.y}`
      : `${acc} L ${point.x},${point.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x},${
    height - paddingBottom
  } L ${points[0].x},${height - paddingBottom} Z`;

  const latestPercent = points[points.length - 1]?.percent || 0;
  const firstPercent = points[0]?.percent || 0;
  const totalGain = latestPercent - firstPercent;

  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-5 sm:p-6 space-y-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-darker flex items-center gap-2">
            <HiArrowTrendingUp className="w-5 h-5 text-emerald-600" />
            Mastery Trend Over Time
          </h3>
          <p className="text-xs text-gray-500">Cumulative retention & quiz accuracy</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-emerald-600">+{totalGain}%</span>
          <p className="text-[11px] text-gray-400">Total improvement</p>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal baseline and 50% line) */}
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="currentColor"
            className="text-muted/30"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + chartHeight / 2}
            stroke="currentColor"
            className="text-muted/20"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#masteryGradient)" />

          {/* Smooth Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                className="fill-white stroke-brand stroke-[2.5] transition-transform duration-200 group-hover:r-6"
              />
              {/* Value Label above each point */}
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                className="text-[10px] font-bold fill-darker opacity-80"
              >
                {pt.percent}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Axis Date Labels */}
      <div className="flex justify-between text-xs font-semibold text-gray-400 px-1 pt-1 border-t border-muted/20">
        <span>{data[0]?.date}</span>
        <span className="text-gray-500 font-bold">Overall Mastery: {latestPercent}%</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
