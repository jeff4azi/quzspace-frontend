import { useState } from "react";
import { HiTrophy, HiChevronDown, HiChevronUp, HiClock } from "react-icons/hi2";

export default function QuizLeaderboardPreview({ leaderboard = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no attempts yet on this quiz
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium pt-1">
        <HiTrophy className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
        <span>Be the first to top this quiz!</span>
      </div>
    );
  }

  const topViewers = leaderboard.slice(0, 3);
  const topScore = leaderboard[0];

  return (
    <div className="space-y-2 pt-1">
      {/* Compact Trigger Row */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-light/60 hover:bg-light border border-muted/20 cursor-pointer transition-all select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <HiTrophy className="w-4 h-4 text-amber-500 shrink-0" />

          {/* Overlapping Top 3 Avatars */}
          <div className="flex items-center -space-x-1.5 overflow-hidden shrink-0">
            {topViewers.map((user) => (
              <div
                key={user.id}
                className={`w-5 h-5 rounded-full ${user.avatarColor} text-light flex items-center justify-center text-[9px] font-extrabold ring-1 ring-white shrink-0`}
                title={user.name}
              >
                {user.avatarInitials}
              </div>
            ))}
          </div>

          <span className="text-[11px] font-semibold text-darker truncate">
            Top: {topScore.name} ({topScore.score}%)
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-[10px] font-bold text-brand hover:underline shrink-0"
        >
          <span>{isExpanded ? "Hide" : "Leaderboard"}</span>
          {isExpanded ? (
            <HiChevronUp className="w-3.5 h-3.5" />
          ) : (
            <HiChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Per-Quiz Leaderboard */}
      {isExpanded && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-3 rounded-xl bg-white border border-muted/30 shadow-2xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="flex items-center justify-between border-b border-muted/20 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Quiz Rankings</span>
            <span>{leaderboard.length} attempts</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
            {leaderboard.map((item, idx) => {
              const rank = idx + 1;
              let rankStyle = "bg-gray-100 text-gray-500";
              if (rank === 1) rankStyle = "bg-amber-500 text-white font-extrabold";
              else if (rank === 2) rankStyle = "bg-slate-400 text-white font-extrabold";
              else if (rank === 3) rankStyle = "bg-amber-700 text-white font-extrabold";

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-light/50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${rankStyle}`}
                    >
                      {rank}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full ${item.avatarColor} text-light flex items-center justify-center text-[9px] font-bold shrink-0`}
                    >
                      {item.avatarInitials}
                    </div>

                    <span className="font-semibold text-darker truncate leading-tight">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <HiClock className="w-3 h-3 text-muted" />
                      {item.completedAt}
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                      {item.score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
