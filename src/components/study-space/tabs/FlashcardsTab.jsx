import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FlashcardTile from "../FlashcardTile";
import FlashcardStudyMode from "../FlashcardStudyMode";
import FlashcardsEmptyState from "./FlashcardsEmptyState";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api, { fetchWithIdempotency } from "../../../lib/api";
import { 
  HiOutlineArrowPath, 
  HiOutlineSquares2X2, 
  HiOutlineAcademicCap 
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 40;
const LAZY_TRIGGER_DELAY_MS = 300;

function PollingLoader({ label }) {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-xs">
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 to-brand/20 flex items-center justify-center">
          <CgSpinner className="w-6 h-6 text-brand animate-spin" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-extrabold text-brand tracking-tight truncate">
          {label || "AI is working…"}
        </h4>
        <p className="text-xs text-gray leading-relaxed mt-1">
          Generating active-recall flashcards tailored to your study material.
          This page will update automatically when ready.
        </p>
      </div>
    </div>
  );
}

function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`fc-sk-${i}`}
          className="w-full h-72 sm:h-80 bg-white rounded-2xl border border-muted/30 shadow-xs animate-pulse p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-20 rounded-full bg-gray-100" />
            <div className="h-5 w-24 rounded-full bg-gray-100" />
          </div>
          <div className="space-y-2 py-4">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
          <div className="mt-auto pt-4 border-t border-muted/20">
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatReviewedAgo(isoDate) {
  if (!isoDate) return "";
  try {
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return "";
    const now = Date.now();
    const diffMs = now - then;
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;
    if (diffMs < min) return "Just now";
    if (diffMs < hour) {
      const m = Math.floor(diffMs / min);
      return `${m} min ago`;
    }
    if (diffMs < day) {
      const h = Math.floor(diffMs / hour);
      return `${h}h ago`;
    }
    const d = Math.floor(diffMs / day);
    if (d < 7) return `${d}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

function normalizeCard(c) {
  const mastered =
    typeof c.mastered === "boolean"
      ? c.mastered
      : typeof c.is_mastered === "boolean"
      ? c.is_mastered
      : typeof c.mastery === "boolean"
      ? c.mastery
      : false;
  return {
    id: c.id || c.flashcard_id || `fc-${Math.random().toString(36).slice(2, 8)}`,
    front: c.front || c.question || c.term || "",
    back: c.back || c.answer || c.definition || "",
    mastered,
    category: c.category || c.group || null,
    difficulty: c.difficulty || "medium",
    lastReviewedAt: formatReviewedAgo(c.last_reviewed_at || c.reviewed_at || c.updated_at),
  };
}

function normalizeCardsList(resp) {
  let list = [];
  if (Array.isArray(resp)) list = resp;
  else if (resp && Array.isArray(resp.flashcards)) list = resp.flashcards;
  else if (resp && Array.isArray(resp.cards)) list = resp.cards;
  else if (resp && Array.isArray(resp.data)) list = resp.data;
  return list.map(normalizeCard);
}

export default function FlashcardsTab({ isReadOnly = false }) {
  const { id: spaceId } = useParams();
  const [cards, setCards] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotGenerated, setIsNotGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const lazyTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const pollAttemptRef = useRef(0);

  const clearLazyTimer = () => {
    if (lazyTimerRef.current) {
      clearTimeout(lazyTimerRef.current);
      lazyTimerRef.current = null;
    }
  };
  const clearPollTimer = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const triggerGenerate = useCallback(
    async ({ forceIdempotent = false } = {}) => {
      if (!spaceId || isReadOnly) return;
      const idemKey = forceIdempotent
        ? crypto.randomUUID()
        : `flashcards-gen-${spaceId}-${Date.now().toString().slice(0, -3)}`;
      try {
        setIsGenerating(true);
        setIsNotGenerated(false);
        setError(null);
        pollAttemptRef.current = 0;
        setPollAttempt(0);
        await fetchWithIdempotency(`/spaces/${spaceId}/flashcards/generate`, {}, { idempotencyKey: idemKey });
      } catch (err) {
        if (err?.status === 409 || err?.code === "ALREADY_GENERATING") {
          // ignore — poll loop will pick up
        } else if (err?.status !== 425) {
          setError({
            title: "Couldn't start flashcard generation",
            message: err?.message || "Something went wrong when starting generation. Try again.",
          });
          setIsGenerating(false);
          return;
        }
      }
      // start poll loop
      scheduleNextPoll();
    },
    [spaceId, isReadOnly],
  );

  const scheduleNextPoll = useCallback(() => {
    clearPollTimer();
    pollTimerRef.current = setTimeout(() => {
      pollAttemptRef.current += 1;
      setPollAttempt(pollAttemptRef.current);
      void loadFlashcards({ fromPoll: true });
    }, POLL_INTERVAL_MS);
  }, []);

  const loadFlashcards = useCallback(
    async ({ fromPoll = false, autoTriggerLazy = false } = {}) => {
      if (!spaceId) return;
      try {
        if (!fromPoll) setError(null);
        const resp = await api.get(`/spaces/${spaceId}/flashcards`);
        const list = normalizeCardsList(resp);
        setCards(list);
        setIsNotGenerated(false);
        setIsGenerating(false);
        setIsRegenerating(false);
        setLoading(false);
        clearPollTimer();
      } catch (err) {
        const status = err?.status;
        if (status === 425) {
          setCards([]);
          setIsNotGenerated(true);
          setLoading(false);
          if (isReadOnly) {
            setIsGenerating(false);
            clearPollTimer();
          } else if (fromPoll) {
            if (pollAttemptRef.current >= POLL_MAX_ATTEMPTS) {
              clearPollTimer();
              setIsGenerating(false);
              setError({
                title: "Generation is taking longer than expected",
                message: "AI is still processing. Refresh this tab or come back in a minute.",
              });
            } else {
              scheduleNextPoll();
            }
          } else if (autoTriggerLazy) {
            // lazy trigger after short delay on first visit
            clearLazyTimer();
            lazyTimerRef.current = setTimeout(() => {
              void triggerGenerate();
            }, LAZY_TRIGGER_DELAY_MS);
          } else {
            setIsGenerating(false);
          }
          return;
        }

        // not 425
        if (fromPoll && pollAttemptRef.current < POLL_MAX_ATTEMPTS && (status === 202 || status === 409)) {
          scheduleNextPoll();
          return;
        }
        clearPollTimer();
        setIsGenerating(false);
        setIsRegenerating(false);
        if (!fromPoll) {
          setLoading(false);
          setError({
            title: "Couldn't load flashcards",
            message:
              status === 403
                ? "You don't have permission to view flashcards in this study space."
                : err?.message || "Something went wrong when loading your deck.",
          });
        }
      }
    },
    [spaceId, isReadOnly, scheduleNextPoll, triggerGenerate],
  );

  // Initial mount: load + auto-lazy-trigger on 425
  useEffect(() => {
    setLoading(true);
    pollAttemptRef.current = 0;
    setPollAttempt(0);
    void loadFlashcards({ autoTriggerLazy: true });
    return () => {
      clearLazyTimer();
      clearPollTimer();
    };
  }, [spaceId, reloadKey, loadFlashcards]);

  const handleToggleMastered = useCallback(
    async (cardId) => {
      if (!spaceId || isReadOnly) return;
      const current = cards.find((c) => c.id === cardId);
      const nextVal = !current?.mastered;
      // optimistic update
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, mastered: nextVal } : c)));
      try {
        await api.patch(`/flashcards/${cardId}/mastery`, { mastered: nextVal });
      } catch (err) {
        // rollback
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, mastered: !nextVal } : c)));
        setError({
          title: "Couldn't update mastery",
          message: err?.message || "Your change didn't save. Try again.",
        });
      }
    },
    [spaceId, isReadOnly, cards],
  );

  const handleRegenerate = useCallback(async () => {
    if (!spaceId || isReadOnly) return;
    setIsRegenerating(true);
    setError(null);
    pollAttemptRef.current = 0;
    setPollAttempt(0);
    try {
      const idemKey = `flashcards-regen-${spaceId}-${crypto.randomUUID()}`;
      await fetchWithIdempotency(`/spaces/${spaceId}/flashcards/regenerate`, {}, { idempotencyKey: idemKey });
      setIsNotGenerated(true);
      scheduleNextPoll();
    } catch (err) {
      if (err?.status === 425 || err?.status === 409 || err?.status === 202) {
        setIsNotGenerated(true);
        scheduleNextPoll();
        return;
      }
      setIsRegenerating(false);
      setError({
        title: "Couldn't regenerate deck",
        message: err?.message || "Something went wrong. Try again in a moment.",
      });
    }
  }, [spaceId, isReadOnly, scheduleNextPoll]);

  const handleEmptyGenerate = useCallback(() => {
    void triggerGenerate({ forceIdempotent: true });
  }, [triggerGenerate]);

  const handleRetry = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const masteredCount = cards.filter((c) => c.mastered).length;

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 pb-16 lg:pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-muted/20">
          <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-80 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <CardGridSkeleton count={6} />
      </div>
    );
  }

  if (error && !isGenerating && !isRegenerating) {
    return (
      <div className="space-y-4 pb-16 lg:pb-0">
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (isNotGenerated || isGenerating || isRegenerating) {
    const pollingLabel = isRegenerating
      ? "Regenerating your flashcard deck…"
      : isGenerating
      ? "Generating flashcards from your content…"
      : "Preparing flashcards…";

    return (
      <div className="space-y-6 sm:space-y-8 pb-16 lg:pb-0">
        <PollingLoader label={pollingLabel} />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return <FlashcardsEmptyState onGenerateClick={handleEmptyGenerate} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 lg:pb-0">
      
      {/* Header Row: Title, Count Badge, Segmented Mode Switcher & Regenerate Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        
        {/* Title & Count Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight">
            Flashcards Deck
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
            {cards.length} cards · <span className="text-emerald-700">{masteredCount} mastered</span>
          </span>
        </div>

        {/* View Mode Segmented Switcher & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Segmented Mode Control */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`
                flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg transition-all
                ${
                  viewMode === "grid"
                    ? "bg-white text-brand shadow-xs"
                    : "text-gray hover:text-brand"
                }
              `}
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              <span>Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("study")}
              className={`
                flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg transition-all
                ${
                  viewMode === "study"
                    ? "bg-white text-brand shadow-xs"
                    : "text-gray hover:text-brand"
                }
              `}
            >
              <HiOutlineAcademicCap className="w-4 h-4" />
              <span>Study Mode</span>
            </button>
          </div>

          {/* Regenerate Button (Owner only) */}
          {!isReadOnly && (
            <Button
              variant="secondary"
              isLoading={isRegenerating}
              onClick={handleRegenerate}
              className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
            >
              <HiOutlineArrowPath className="w-4 h-4" />
              <span>Regenerate Deck</span>
            </Button>
          )}

        </div>

      </div>

      {/* Main View Area: Grid View OR Study Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <FlashcardTile
              key={card.id}
              card={card}
              cardNumber={idx + 1}
              onToggleMastered={handleToggleMastered}
            />
          ))}
        </div>
      ) : (
        <FlashcardStudyMode
          cards={cards}
          onToggleMastered={handleToggleMastered}
        />
      )}

    </div>
  );
}
