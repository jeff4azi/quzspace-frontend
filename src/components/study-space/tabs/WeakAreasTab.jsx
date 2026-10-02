import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  HiExclamationTriangle,
  HiArrowPath,
  HiCheckCircle,
} from "react-icons/hi2";
import WeakTopicCard from "../WeakTopicCard";
import WeakAreasEmptyState from "./WeakAreasEmptyState";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";
import { CgSpinner } from "react-icons/cg";

function normalizeWeakArea(w = {}, idx = 0) {
  return {
    id: w.id || w.topic_id || `wa-${idx}-${(w.topic || "").slice(0, 8)}`,
    topic: w.topic || w.title || "Untitled Topic",
    masteryPercent:
      typeof w.mastery_percent === "number"
        ? Math.round(w.mastery_percent)
        : typeof w.masteryPercent === "number"
        ? Math.round(w.masteryPercent)
        : 50,
    relatedQuizzes: Array.isArray(w.related_quizzes)
      ? w.related_quizzes
      : Array.isArray(w.relatedQuizzes)
      ? w.relatedQuizzes
      : [],
    lastReviewed: w.last_reviewed || w.lastReviewed || "Not reviewed yet",
    explanation: w.explanation || w.description || "",
    keyTips: Array.isArray(w.key_tips)
      ? w.key_tips
      : Array.isArray(w.keyTips)
      ? w.keyTips
      : [],
  };
}

function CardSkeleton({ count = 2 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`wa-sk-${i}`}
          className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-gray-100 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="space-y-2 pb-4">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function WeakAreasTab() {
  const { id: spaceId } = useParams();
  const [, setSearchParams] = useSearchParams();

  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotGenerated, setIsNotGenerated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const loadWeakAreas = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    setIsNotGenerated(false);
    try {
      const res = await api.get(`/spaces/${spaceId}/weak-areas`);
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.weak_areas)
        ? res.weak_areas
        : Array.isArray(res?.data)
        ? res.data
        : [];
      const normalized = list.map(normalizeWeakArea).sort(
        (a, b) => a.masteryPercent - b.masteryPercent,
      );
      setWeakTopics(normalized);
      if (normalized.length === 0) setIsNotGenerated(true);
    } catch (err) {
      const status = err?.status;
      if (status === 425) {
        setWeakTopics([]);
        setIsNotGenerated(true);
      } else {
        console.warn("weak areas load failed:", err?.message || err);
        setError({
          title: "Couldn't load weak areas",
          message:
            status === 403
              ? "You don't have permission to view weak areas in this space."
              : err?.message || "Retry in a moment.",
        });
        setWeakTopics([]);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    void loadWeakAreas();
  }, [loadWeakAreas]);

  const handleRefresh = useCallback(async () => {
    if (!spaceId) return;
    setIsRefreshing(true);
    setError(null);
    try {
      await api.post(`/spaces/${spaceId}/weak-areas/refresh`, {});
      setReloadKey((k) => k + 1);
    } catch (err) {
      if (err?.status === 425 || err?.status === 202) {
        setTimeout(() => setReloadKey((k) => k + 1), 3000);
        return;
      }
      console.warn("weak areas refresh failed:", err?.message || err);
      setError({
        title: "Couldn't refresh weak areas",
        message: err?.message || "Try again in a moment.",
      });
      setIsRefreshing(false);
    }
  }, [spaceId]);

  const handleTakeQuiz = () => {
    setSearchParams({ tab: "quiz" });
  };

  const handlePracticeFlashcards = (topicName) => {
    setToastMessage(`Switched to Flashcards mode for "${topicName}"`);
    setTimeout(() => {
      setSearchParams({ tab: "flashcards" });
    }, 600);
  };

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
          <div className="space-y-2 w-full sm:w-1/2">
            <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-9 w-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <CardSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-darker text-light px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-darker flex items-center gap-2">
              <HiExclamationTriangle className="w-5 h-5 text-amber-500" />
              Weak Areas
            </h2>
            {weakTopics.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {weakTopics.length} topic{weakTopics.length === 1 ? "" : "s"}{" "}
                need review
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Topics you've struggled with based on your quiz performance and
            flashcard reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            icon={HiArrowPath}
            className="text-xs"
          >
            {isRefreshing ? "Refreshing…" : "Refresh Analysis"}
          </Button>
        </div>
      </div>

      {/* List of Weak Topics or Empty State */}
      {(isNotGenerated || weakTopics.length === 0) && !error ? (
        <WeakAreasEmptyState
          onTakeQuiz={handleTakeQuiz}
          onRefreshAnalysis={handleRefresh}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-1">
            <span>SORTED BY LOWEST MASTERY</span>
            <span>{weakTopics.length} TOPICS</span>
          </div>

          <div className="space-y-4">
            {weakTopics.map((item) => (
              <WeakTopicCard
                key={item.id}
                topicData={item}
                onPracticeFlashcards={handlePracticeFlashcards}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
