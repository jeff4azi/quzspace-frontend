import {
  HiAcademicCap,
  HiRectangleStack,
  HiUser,
  HiUsers,
  HiShieldCheck,
  HiUserPlus,
  HiUserMinus,
  HiTrash,
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

export default function CommunityMemberRow({
  member,
  canManage = false,
  busy = false,
  onPromote,
  onDemote,
  onRemove,
}) {
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
  const isViewer = !isCollaborator && !isOwner;

  let roleBadge = (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <HiUsers className="w-3 h-3 text-emerald-600" />
      Viewer
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
        <HiShieldCheck className="w-3 h-3 text-amber-600" />
        Owner
      </span>
    );
  }

  const showActions = canManage && !isOwner;
  const showPromote = showActions && isViewer;
  const showDemote = showActions && isCollaborator;

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

      {/* Right: Stats + Owner actions */}
      <div className="flex items-center gap-4 self-end sm:self-center">
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
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

        {showActions && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-muted/20">
            {busy ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <CgSpinner className="w-4 h-4 animate-spin" />
                Saving
              </span>
            ) : (
              <>
                {showPromote && (
                  <button
                    type="button"
                    onClick={onPromote}
                    title="Make contributor"
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-brand bg-brand/10 hover:bg-brand/20 transition-colors"
                  >
                    <HiUserPlus className="w-3.5 h-3.5" />
                    Make contributor
                  </button>
                )}

                {showDemote && (
                  <button
                    type="button"
                    onClick={onDemote}
                    title="Make viewer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-gray-600 bg-light hover:bg-muted/20 transition-colors"
                  >
                    <HiUserMinus className="w-3.5 h-3.5" />
                    Make viewer
                  </button>
                )}

                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    title="Remove from space"
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
