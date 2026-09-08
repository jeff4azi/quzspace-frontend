import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlineClock, 
  HiOutlineEllipsisHorizontal,
  HiOutlinePlay,
  HiOutlineArrowPath,
  HiOutlineChartBar,
  HiOutlineTrash,
  HiCheckCircle,
  HiOutlineSparkles
} from "react-icons/hi2";

function getDifficultyBadge(difficulty) {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Medium":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Hard":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "Mixed":
    default:
      return "bg-purple-100 text-purple-800 border-purple-200";
  }
}

export default function QuizCard({ quiz, onDelete, onRetake }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const badgeStyle = getDifficultyBadge(quiz.difficulty);

  const handleAction = (e, actionCallback, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    if (actionCallback) {
      actionCallback(quiz.id);
    } else {
      alert(`${actionName} placeholder for "${quiz.title}"`);
    }
  };

  return (
    <div className="relative group bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs hover:border-brand/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-4">
      
      <div className="space-y-3">
        {/* Top Row: Difficulty Badge & Overflow Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
              {quiz.difficulty}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {quiz.questionCount} Questions
            </span>
          </div>

          {/* Overflow Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Quiz options"
            >
              <HiOutlineEllipsisHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-muted/30 p-1.5 z-50 animate-in fade-in">
                <Link
                  to={`/spaces/cs-301/quiz/${quiz.id}`}
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <HiOutlineArrowPath className="w-4 h-4 text-gray-500" />
                  <span>Retake Quiz</span>
                </Link>
                {quiz.bestScore !== null && (
                  <Link
                    to={`/spaces/cs-301/quiz/${quiz.id}/results`}
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <HiOutlineChartBar className="w-4 h-4 text-gray-500" />
                    <span>View Results</span>
                  </Link>
                )}
                <button
                  onClick={(e) => handleAction(e, onDelete, "Delete Quiz")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                >
                  <HiOutlineTrash className="w-4 h-4 text-rose-500" />
                  <span>Delete Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-brand group-hover:text-black transition-colors line-clamp-2 leading-snug">
          {quiz.title}
        </h3>

        {/* Created date & attempts metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <HiOutlineClock className="w-3.5 h-3.5 text-muted" />
            {quiz.createdAt}
          </span>
          {quiz.attemptsCount > 0 && (
            <span>• {quiz.attemptsCount} {quiz.attemptsCount === 1 ? "attempt" : "attempts"}</span>
          )}
        </div>
      </div>

      {/* Score Section & Action CTA */}
      <div className="pt-4 border-t border-muted/20 space-y-3">
        
        {/* Score Progress Bar OR Unattempted State */}
        {quiz.bestScore !== null ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-500 flex items-center gap-1">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-500" /> Best Score
              </span>
              <span className="text-emerald-700 font-extrabold">{quiz.bestScore}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${quiz.bestScore}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium py-1">
            <HiOutlineQuestionMarkCircle className="w-4 h-4 text-muted" />
            <span>Not attempted yet</span>
          </div>
        )}

        {/* Take Quiz Button */}
        <Link
          to={`/spaces/cs-301/quiz/${quiz.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-light py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs hover:bg-darker transition-all cursor-pointer"
        >
          <HiOutlinePlay className="w-4 h-4" />
          <span>{quiz.bestScore !== null ? "Retake Quiz" : "Take Quiz"}</span>
        </Link>

      </div>

    </div>
  );
}
