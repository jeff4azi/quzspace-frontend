import { HiArrowTrendingUp } from "react-icons/hi2";

export default function StatCard({ icon: Icon, label, value, trend, isHighlight = false }) {
  return (
    <div
      className={`
        p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3
        ${
          isHighlight
            ? "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300/60 ring-2 ring-amber-500/10"
            : "bg-white border-muted/30 hover:border-brand/20"
        }
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs
            ${
              isHighlight
                ? "bg-amber-500 text-light shadow-amber-500/20"
                : "bg-brand/10 text-brand"
            }
          `}
        >
          <Icon className={`w-5 h-5 ${isHighlight ? "animate-pulse" : ""}`} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-darker tracking-tight">
          {value}
        </div>

        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <HiArrowTrendingUp className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
