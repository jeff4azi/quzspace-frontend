import { useState } from "react";

export default function AvatarStack({
  viewers = [],
  size = "default",
  showLabel = true,
  labelSuffix = "studying now",
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!viewers || viewers.length === 0) return null;

  const isSmall = size === "sm";
  const visibleViewers = viewers.slice(0, isSmall ? 3 : 4);
  const extraCount = viewers.length - visibleViewers.length;

  const avatarSizeClass = isSmall ? "w-5 h-5 text-[9px]" : "w-6 h-6 text-[10px]";
  const containerPadding = isSmall ? "px-2 py-1" : "px-3 py-1.5";
  const gapClass = isSmall ? "gap-1.5" : "gap-2";
  const overlapClass = isSmall ? "-space-x-1.5" : "-space-x-2";

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip((prev) => !prev);
        }}
        className={`flex items-center ${gapClass} ${containerPadding} cursor-pointer bg-white rounded-full border border-muted/30 shadow-2xs hover:border-brand/30 transition-all select-none`}
      >
        {/* Pulsing Live Dot Indicator */}
        <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </div>

        {/* Overlapping Avatar Stack */}
        <div className={`flex items-center ${overlapClass} overflow-hidden py-0.5`}>
          {visibleViewers.map((viewer) => (
            <div
              key={viewer.id}
              className={`${avatarSizeClass} rounded-full ${viewer.avatarColor} text-light flex items-center justify-center font-bold ring-2 ring-white shadow-2xs shrink-0`}
              title={viewer.name}
            >
              {viewer.avatarInitials}
            </div>
          ))}
          {extraCount > 0 && (
            <div
              className={`${avatarSizeClass} rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-extrabold ring-2 ring-white shrink-0`}
            >
              +{extraCount}
            </div>
          )}
        </div>

        {/* Count Label */}
        {showLabel && (
          <span
            className={`whitespace-nowrap font-bold text-darker ${
              isSmall ? "text-[11px]" : "text-xs"
            }`}
          >
            {viewers.length} {labelSuffix}
          </span>
        )}
      </div>

      {/* Tooltip / Popover of Active Viewers */}
      {showTooltip && (
        <div className="absolute left-0 top-8 z-50 w-52 bg-white rounded-2xl border border-muted/30 shadow-xl p-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between border-b border-muted/20 pb-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Active Members ({viewers.length})
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
            {viewers.map((viewer) => (
              <div key={viewer.id} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-5 h-5 rounded-full ${viewer.avatarColor} text-light flex items-center justify-center text-[9px] font-bold shrink-0`}
                >
                  {viewer.avatarInitials}
                </div>
                <span className="font-semibold text-darker line-clamp-1 flex-1">
                  {viewer.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
