import { useCallback, useEffect, useState } from "react";
import Button from "../ui/Button";
import api, { fetchWithIdempotency, getSpaceTopics } from "../../lib/api";
import {
  HiXMark,
  HiSparkles,
  HiOutlineQuestionMarkCircle,
  HiExclamationTriangle,
  HiCheckCircle,
  HiOutlineQueueList,
} from "react-icons/hi2";
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

function TopicsState({
  topics,
  topicsStatus,
  loading,
  error,
  allTopics,
  selectedCount,
  selectedSet,
  onToggleAll,
  onToggleTopic,
  onRetry,
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-24 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-full bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex items-start gap-3">
        <HiExclamationTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-amber-900">
            Couldn't load topics
          </p>
          <p className="text-[11px] text-amber-700/80 mt-0.5 leading-relaxed">
            {error.message || "Topics will be available once the AI finishes processing your files."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[11px] font-bold text-brand underline-offset-2 hover:underline"
          >
            Retry loading topics
          </button>
        </div>
      </div>
    );
  }

  if (topicsStatus === "not_generated" || topics.length === 0) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand/[0.03] p-3 flex items-start gap-3">
        <HiOutlineQueueList className="w-5 h-5 text-brand/70 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-brand/90">
            Topics are still generating
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            Once your files are processed we'll surface topic chips here.
            For now, your quiz will cover all available content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onToggleAll}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
              allTopics
                ? "bg-brand text-white border-brand shadow-xs"
                : "bg-white text-gray hover:text-brand border-muted/40"
            }`}
          >
            {allTopics ? (
              <>
                <HiCheckCircle className="w-3.5 h-3.5" />
                <span>All Topics</span>
              </>
            ) : (
              <span>
                {selectedCount > 0
                  ? `${selectedCount} selected`
                  : "Select Topics"}
              </span>
            )}
          </button>
          <span className="text-[11px] text-gray-400 font-semibold truncate">
            · {topics.length} available
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 pb-1">
        {topics.map((t) => (
          <TopicChip
            key={t}
            topic={t}
            isSelected={selectedSet.has(t)}
            onToggle={() => onToggleTopic(t)}
          />
        ))}
      </div>
    </div>
  );
}

function TopicChip({ topic, isSelected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
        isSelected
          ? "bg-brand text-white border-brand shadow-xs"
          : "bg-white text-gray hover:text-brand border-muted/40 hover:border-brand/40"
      }`}
    >
      <span className="truncate max-w-[180px]">{topic}</span>
      <span
        className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
          isSelected
            ? "bg-white/15 text-white"
            : "bg-gray-100 text-gray-400 group-hover:bg-brand/10 group-hover:text-brand"
        }`}
      >
        {isSelected ? "✓" : "+"}
      </span>
    </button>
  );
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

  const [selected, setSelected] = useState(() => new Set());
  const [topics, setTopics] = useState([]);
  const [topicsStatus, setTopicsStatus] = useState("idle");
  const [topicsError, setTopicsError] = useState(null);
  const [pollToken, setPollToken] = useState(0);

  const loadTopics = useCallback(async () => {
    if (!spaceId) return;
    setTopicsError(null);
    setTopicsStatus("loading");
    try {
      const res = await getSpaceTopics(spaceId);
      setTopics(res.topics || []);
      if (res.status === "ready" && (res.topics || []).length > 0) {
        setTopicsStatus("ready");
      } else {
        setTopicsStatus("not_generated");
      }
    } catch (err) {
      console.warn("topics load failed:", err?.message || err);
      setTopicsError(err);
      setTopicsStatus("error");
    }
  }, [spaceId]);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set());
    setTopics([]);
    setTopicsStatus("idle");
    setTopicsError(null);
    setError(null);
    void loadTopics();
  }, [isOpen, spaceId, pollToken, loadTopics]);

  useEffect(() => {
    if (!isOpen || topicsStatus !== "not_generated") return;
    const t = setTimeout(() => setPollToken((n) => n + 1), 2500);
    return () => clearTimeout(t);
  }, [isOpen, topicsStatus, pollToken]);

  const allTopics = selected.size === topics.length && topics.length > 0;

  const toggleTopic = useCallback((topic) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      const all = prev.size === topics.length && topics.length > 0;
      return new Set(all ? [] : topics);
    });
  }, [topics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!spaceId || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    const selectedTopics = allTopics ? [] : Array.from(selected);

    try {
      const idemKey = `quiz-gen-${spaceId}-${questionCount}-${difficulty}-${selectedTopics.join("|")}-${Date.now()}`;
      const res = await fetchWithIdempotency(
        `/spaces/${spaceId}/quizzes/generate`,
        { questionCount, difficulty, selectedTopics },
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      style={{ minHeight: "100dvh" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md sm:rounded-2xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 max-h-[90dvh] overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-muted/20 sticky top-0 bg-white z-10">
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

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-5">
          {error && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
              <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-rose-900">{error.title}</p>
                <p className="text-[11px] text-rose-700/80 mt-0.5 leading-relaxed">{error.message}</p>
              </div>
            </div>
          )}

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
                    py-2 rounded-lg transition-all text-center cursor-pointer active:scale-95
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
                    py-2 rounded-lg transition-all text-center text-[11px] sm:text-xs cursor-pointer active:scale-95
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

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand block">
              Focus Topics{" "}
              <span className="font-medium normal-case tracking-normal text-gray-400">
                (optional — blind cover-all if empty)
              </span>
            </label>
            <TopicsState
              topics={topics}
              topicsStatus={topicsStatus}
              loading={topicsStatus === "loading" || topicsStatus === "idle"}
              error={topicsError}
              allTopics={allTopics}
              selectedCount={selected.size}
              selectedSet={selected}
              onToggleAll={toggleAll}
              onToggleTopic={toggleTopic}
              onRetry={() => setPollToken((n) => n + 1)}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isGenerating}
              className="w-full sm:flex-1 py-3 text-xs font-bold"
              disabled={!spaceId}
            >
              {isGenerating ? (
                <>
                  <CgSpinner className="w-4 h-4 animate-spin" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <HiSparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Quiz</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isGenerating}
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
