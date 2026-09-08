import { HiAcademicCap, HiRectangleStack, HiUser } from "react-icons/hi2";

export default function CommunityMemberRow({ member }) {
  const {
    name,
    avatarInitials,
    avatarColor,
    role,
    joinedDate,
    firstVisited,
    quizzesTaken,
    flashcardsReviewed,
    avgScore,
  } = member;

  const isCollaborator = role === "collaborator";
  const isOwner = role === "owner";

  let roleBadge = (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-muted/20">
      <HiUser className="w-3 h-3 text-gray-400" />
      Visitor
    </span>
  );

  if (isCollaborator) {
    roleBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
        <HiUser className="w-3 h-3 text-brand" />
        Collaborator
      </span>
    );
  } else if (isOwner) {
    roleBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
        <HiUser className="w-3 h-3 text-amber-600" />
        Owner
      </span>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-muted/30 shadow-2xs hover:border-brand/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-2xl ${avatarColor} text-light flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0`}
        >
          {avatarInitials}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-darker">{name}</h4>
            {roleBadge}
          </div>
          <p className="text-xs text-gray-400">
            {joinedDate || firstVisited || "Active in space"}
          </p>
        </div>
      </div>

      {/* Right: Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium self-end sm:self-center">
        {quizzesTaken !== undefined && (
          <span className="flex items-center gap-1">
            <HiAcademicCap className="w-4 h-4 text-brand" />
            {quizzesTaken} quiz{quizzesTaken === 1 ? "" : "zes"}
          </span>
        )}

        {flashcardsReviewed !== undefined && (
          <span className="flex items-center gap-1">
            <HiRectangleStack className="w-4 h-4 text-muted" />
            {flashcardsReviewed} cards
          </span>
        )}

        {avgScore !== undefined && (
          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {avgScore}% avg
          </span>
        )}
      </div>
    </div>
  );
}
