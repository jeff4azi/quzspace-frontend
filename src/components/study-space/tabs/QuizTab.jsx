import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizCard from "../QuizCard";
import GenerateQuizModal from "../GenerateQuizModal";
import QuizEmptyState from "./QuizEmptyState";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";
import { HiPlus } from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

function normalizeQuizListItem(q = {}) {
  return {
    id: q.id || q.quiz_id || `q-${Math.random().toString(36).slice(2, 8)}`,
    title:
      q.title ||
      `Custom ${q.difficulty || "Mixed"} Quiz (${q.question_count || q.questionCount || 10} Qs)`,
    questionCount: q.question_count || q.questionCount || 10,
    difficulty: q.difficulty || "Mixed",
    selectedTopics: Array.isArray(q.selected_topics)
      ? q.selected_topics
      : Array.isArray(q.selectedTopics)
      ? q.selectedTopics
      : [],
    createdAt: q.created_at
      ? (() => {
          try {
            const then = new Date(q.created_at).getTime();
            const diff = Date.now() - then;
            if (diff < 60 * 1000) return "Just now";
            if (diff < 60 * 60 * 1000)
              return `${Math.floor(diff / (60 * 1000))} min ago`;
            if (diff < 24 * 60 * 60 * 1000)
              return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
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

function CardSkeleton() {
  return (
    <div className="w-full h-[260px] sm:h-[280px] bg-white rounded-2xl border border-muted/30 shadow-xs animate-pulse p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-28 rounded-full bg-gray-100" />
        <div className="h-5 w-16 rounded-full bg-gray-100" />
      </div>
      <div className="space-y-2 py-3">
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-4/5 rounded bg-gray-100" />
      </div>
      <div className="mt-auto pt-4 space-y-3 border-t border-muted/20">
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-2 w-full rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

export default function QuizTab({ isReadOnly = false }) {
  const { id: spaceId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingIds, setDeletingIds] = useState({});

  const loadQuizzes = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/spaces/${spaceId}/quizzes`);
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.quizzes)
        ? res.quizzes
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setQuizzes(list.map(normalizeQuizListItem));
    } catch (err) {
      console.warn("quiz list load failed:", err?.message || err);
      setError({
        title: "Couldn't load your quizzes",
        message:
          err?.status === 403
            ? "You don't have permission to view quizzes in this study space."
            : err?.message || "Retry in a moment.",
      });
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  const handleQuizGenerated = useCallback(
    (newQuiz) => {
      setQuizzes((prev) => [normalizeQuizListItem(newQuiz), ...prev]);
    },
    [],
  );

  const handleDeleteQuiz = useCallback(
    async (quizId) => {
      if (!spaceId || isReadOnly) return;
      setDeletingIds((prev) => ({ ...prev, [quizId]: true }));
      try {
        await api.delete(`/spaces/${spaceId}/quizzes/${quizId}`);
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      } catch (err) {
        console.warn("quiz delete failed:", err?.message || err);
        setError({
          title: "Couldn't delete quiz",
          message: err?.message || "Please try again.",
        });
        setReloadKey((k) => k + 1);
      } finally {
        setDeletingIds((prev) => {
          const next = { ...prev };
          delete next[quizId];
          return next;
        });
      }
    },
    [spaceId, isReadOnly],
  );

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-muted/20">
          <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-44 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row: Title, Count Badge & Generate Quiz Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight">
            Quizzes
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
            {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}
          </span>
        </div>

        {!isReadOnly && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            <HiPlus className="w-4 h-4" />
            <span>Generate New Quiz</span>
          </Button>
        )}
      </div>

      {/* Generate Quiz Modal */}
      <GenerateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizGenerated={handleQuizGenerated}
        currentQuizCount={quizzes.length}
        spaceId={spaceId}
      />

      {/* Quiz Grid OR Empty State */}
      {quizzes && quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              spaceId={spaceId}
              onDelete={handleDeleteQuiz}
              onRetake={() => {}}
              isDeleting={!!deletingIds[quiz.id]}
            />
          ))}
        </div>
      ) : (
        <QuizEmptyState onGenerateClick={() => setIsModalOpen(true)} />
      )}
    </div>
  );
}
