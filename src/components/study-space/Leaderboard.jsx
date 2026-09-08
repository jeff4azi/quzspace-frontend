import { HiTrophy, HiAcademicCap } from "react-icons/hi2";

export default function Leaderboard({
  entries = [],
  currentUserId = null,
  title = "Space Leaderboard",
  subtext = "Top performers by quiz score",
  showRoleBadges = false,
}) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-muted/30 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-muted/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
            <HiTrophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-darker tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500">{subtext}</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-light text-gray-500 border border-muted/20">
          {entries.length} learners
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {entries.map((item, idx) => {
          const rank = idx + 1;
          const isUser = item.isCurrentUser || item.id === currentUserId;

          // Rank styling for Top 3
          let rankBadge = (
            <span className="w-6 h-6 rounded-full bg-light text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
              #{rank}
            </span>
          );

          if (rank === 1) {
            rankBadge = (
              <span className="w-6 h-6 rounded-full bg-amber-500 text-light flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
                1
              </span>
            );
          } else if (rank === 2) {
            rankBadge = (
              <span className="w-6 h-6 rounded-full bg-slate-400 text-light flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
                2
              </span>
            );
          } else if (rank === 3) {
            rankBadge = (
              <span className="w-6 h-6 rounded-full bg-amber-700 text-light flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
                3
              </span>
            );
          }

          return (
            <div
              key={item.id || idx}
              className={`
                p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all text-xs sm:text-sm
                ${
                  isUser
                    ? "bg-brand/5 border-brand/30 ring-1 ring-brand/10 font-bold"
                    : rank === 1
                    ? "bg-amber-500/5 border-amber-200/80"
                    : "bg-white border-muted/20 hover:border-brand/20"
                }
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Rank Badge */}
                {rankBadge}

                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full ${item.avatarColor} text-light flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs`}
                >
                  {item.avatarInitials}
                </div>

                {/* Name & Quiz Count */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-darker truncate leading-tight">
                      {item.name}
                    </span>
                    {isUser && (
                      <span className="text-[10px] text-brand font-extrabold">(You)</span>
                    )}
                    {showRoleBadges && item.role && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          item.role === "collaborator"
                            ? "bg-brand/10 text-brand border border-brand/20"
                            : item.role === "owner"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-gray-100 text-gray-500 border border-muted/20"
                        }`}
                      >
                        {item.role === "collaborator"
                          ? "Collab"
                          : item.role === "owner"
                          ? "Owner"
                          : "Visitor"}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    <HiAcademicCap className="w-3 h-3 text-gray-400" />
                    {item.quizzesTaken} quiz{item.quizzesTaken === 1 ? "" : "zes"}
                  </span>
                </div>
              </div>

              {/* Best Score Badge */}
              <div className="shrink-0 text-right">
                <span
                  className={`
                    inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-xl border
                    ${
                      rank === 1
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : isUser
                        ? "bg-brand text-light border-brand"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }
                  `}
                >
                  {item.bestScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
