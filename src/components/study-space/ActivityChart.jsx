import { HiClock } from "react-icons/hi2";

export default function ActivityChart({ data = [] }) {
  // Find max minutes to scale bars
  const maxMinutes = Math.max(...data.map((item) => item.minutes), 1);
  const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-5 sm:p-6 space-y-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-darker flex items-center gap-2">
            <HiClock className="w-5 h-5 text-brand" />
            Weekly Activity
          </h3>
          <p className="text-xs text-gray-500">Minutes spent studying each day</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-brand">{totalMinutes} mins</span>
          <p className="text-[11px] text-gray-400">Total this week</p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-muted/20">
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.minutes / maxMinutes) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-darker text-light text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-xs z-10">
                {item.minutes} mins
              </div>

              {/* Today Badge */}
              {item.isToday && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-full mb-1">
                  Today
                </span>
              )}

              {/* Bar track & fill */}
              <div className="w-full max-w-[36px] bg-light/70 rounded-t-lg flex items-end overflow-hidden h-full">
                <div
                  className={`
                    w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110
                    ${item.isToday ? "bg-gradient-to-t from-brand to-amber-500" : "bg-brand/85"}
                  `}
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs font-semibold text-gray-400 px-1">
        {data.map((item, idx) => (
          <span
            key={idx}
            className={`flex-1 text-center ${item.isToday ? "text-brand font-bold" : ""}`}
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}
