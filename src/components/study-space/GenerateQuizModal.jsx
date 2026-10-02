import { useState } from "react";
import Button from "../ui/Button";
import api, { fetchWithIdempotency } from "../../lib/api";
import {
  HiXMark,
  HiSparkles,
  HiOutlineQuestionMarkCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

function normalizeQuizListItem(q = {}) {
  return {
    id: q.id || q.quiz_id || `q-${Math.random().toString(36).slice(2, 8)}`,
    title:
      q.title ||
      `Custom ${q.difficulty || "Mixed"} Quiz (${q.question_count || q.questionCount || 10} Qs)`,
    questionCount: q.question_count || q.questionCount || 10,
    difficulty: q.difficulty || "Mixed",
    createdAt: q.created_at
      ? (() => {
          try {
            const then = new Date(q.created_at).getTime();
            const diff = Date.now() - then;
            if (diff < 60 * 1000) return "Just now";
            if (diff < 60 * 60 * 1000)
              return `${Math.floor(diff / (60 * 1000))} min ago`;
            return new Date(q.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
          } catch {
            return "Recently";
          }
        })()
      : q.createdAt || "Recently",
    bestScore:
      typeof q.best_score === "number"
        ? q.best_score
        : typeof q.bestScore === "number"
        ? q.bestScore
        : null,
    attemptsCount: q.attempts_count ?? q.attemptsCount ?? 0,
    leaderboard: Array.isArray(q.leaderboard)
      ? q.leaderboard.map((e) => ({
          id: e.user_id || e.id || "",
          name: e.name || e.full_name || "Anonymous",
          score: e.score ?? e.percent ?? 0,
          avatarInitials: e.avatar_initials || e.avatarInitials || "??",
          avatarColor: e.avatar_color || e.avatarColor || "bg-brand",
        }))
      : [],
  };
}

export default function GenerateQuizModal({
  isOpen,
  onClose,
  onQuizGenerated,
  currentQuizCount = 0,
  spaceId,
}) {
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState("Easy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!spaceId || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const idemKey = `quiz-gen-${spaceId}-${questionCount}-${difficulty}-${Date.now()}`;
      const res = await fetchWithIdempotency(
        `/spaces/${spaceId}/quizzes/generate`,
        { questionCount, difficulty },
        { idempotencyKey: idemKey },
      );
      const normalized = normalizeQuizListItem(
        res?.quiz || res?.data || res,
      );
      if (onQuizGenerated) onQuizGenerated(normalized);
      onClose();
    } catch (err) {
      console.warn("quiz generate failed:", err?.message || err);
      setError({
        title: "Couldn't generate your quiz",
        message:
          err?.status === 429
            ? "You've generated too many quizzes recently. Please wait a moment and try again."
            : err?.message ||
              "The AI service might be busy. Try again in a moment.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      style={{ minHeight: "100dvh" }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full sm:max-w-md sm:rounded-2xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 max-h-[90dvh] overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-muted/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <HiOutlineQuestionMarkCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-brand tracking-tight">
                Generate New Quiz
              </h3>
              <p className="text-[11px] font-semibold text-gray-400">
                {currentQuizCount} {currentQuizCount === 1 ? "quiz" : "quizzes"}{" "}
                in this space
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
              <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-rose-900">{error.title}</p>
                <p className="text-[11px] text-rose-700/80 mt-0.5 leading-relaxed">{error.message}</p>
              </div>
            </div>
          )}
          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand block">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {[10, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`
                    py-2 rounded-lg transition-all text-center cursor-pointer
                    ${
                      questionCount === count
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {["Easy", "Medium", "Hard", "Mixed"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-2 rounded-lg transition-all text-center text-[11px] sm:text-xs cursor-pointer
                    ${
                      difficulty === level
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isGenerating}
              className="w-full sm:flex-1 py-3 text-xs font-bold"
            >
              <HiSparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Quiz</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto sm:px-6 py-3 text-xs font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
