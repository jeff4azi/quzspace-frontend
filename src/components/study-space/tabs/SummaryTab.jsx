import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DefinitionCard from "../DefinitionCard";
import SummaryEmptyState from "./SummaryEmptyState";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";
import { 
  HiOutlineArrowPath, 
  HiCheckCircle, 
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

const POLL_MS = 1500;
const MAX_POLLS = 40;

function formatGeneratedAgo(isoDate) {
  if (!isoDate) return "Recently generated";
  try {
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return "Recently generated";
    const diff = Date.now() - then;
    const min = 60 * 1000;
    const hr = 60 * min;
    const day = 24 * hr;
    if (diff < 2 * min) return "Just now";
    if (diff < hr) return `${Math.floor(diff / min)} min ago`;
    if (diff < day) return `Generated ${Math.floor(diff / hr)} hours ago`;
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently generated";
  }
}

function normalizeSummary(payload = {}) {
  const s = payload?.summary || payload;
  return {
    generatedAt: formatGeneratedAgo(s.generated_at || s.updated_at),
    keyPoints: Array.isArray(s.key_points) ? s.key_points : s.keyPoints || [],
    definitions: Array.isArray(s.definitions)
      ? s.definitions.map((d) => ({
          term: d.term || d.title || "",
          definition: d.definition || d.body || d.description || "",
        }))
      : s.definitions || [],
    mainConcepts: Array.isArray(s.main_concepts)
      ? s.main_concepts.map((c) => ({
          title: c.title || c.heading || "",
          description: c.description || c.body || "",
        }))
      : s.mainConcepts || [],
    examTips: Array.isArray(s.exam_tips) ? s.exam_tips : s.examTips || [],
  };
}

function hasContent(summary) {
  if (!summary) return false;
  const { keyPoints, definitions, mainConcepts, examTips } = summary;
  return (
    keyPoints.length > 0 ||
    definitions.length > 0 ||
    mainConcepts.length > 0 ||
    examTips.length > 0
  );
}

function PollingLoader({ label }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/30 shadow-sm max-w-lg mx-auto my-10 text-center space-y-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
        <CgSpinner className="w-6 h-6 animate-spin" />
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-brand">{label}</h3>
        <p className="text-xs text-gray mt-1">Warming up AI models on your material...</p>
      </div>
    </div>
  );
}

export default function SummaryTab({ isReadOnly = false }) {
  const { id: spaceId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notGenerated, setNotGenerated] = useState(false);
  const [error, setError] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const autoStartedRef = useRef(false);

  const loadSummary = useCallback(async () => {
    if (!spaceId) return null;
    setLoading(true);
    setError(null);
    setNotGenerated(false);
    try {
      const res = await api.get(`/spaces/${spaceId}/summary`);
      const normalized = normalizeSummary(res);
      if (hasContent(normalized)) {
        setSummary(normalized);
        return "ready";
      }
      setSummary(null);
      setNotGenerated(true);
      return "empty";
    } catch (err) {
      const status = err?.status;
      if (status === 425) {
        setSummary(null);
        setNotGenerated(true);
        return "pending";
      }
      console.warn("summary load failed:", err?.message || err);
      setError({
        title: "Couldn't load the AI summary",
        message:
          status === 403
            ? "This summary isn't available for viewers of this shared space."
            : "Retry in a moment, or click Regenerate to create it fresh.",
      });
      setSummary(null);
      return "error";
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (!notGenerated) return;
    if (loading || isRegenerating) return;
    if (autoStartedRef.current) return;
    if (isReadOnly) return;
    autoStartedRef.current = true;
    const t = setTimeout(async () => {
      let attempts = 0;
      while (attempts < MAX_POLLS) {
        attempts++;
        try {
          const res = await api.get(`/spaces/${spaceId}/summary`);
          const normalized = normalizeSummary(res);
          if (hasContent(normalized)) {
            setSummary(normalized);
            setNotGenerated(false);
            return;
          }
        } catch (err) {
          if (err?.status !== 425 && err?.status && err.status >= 500) {
            /* transient */
          } else if (err?.status && err.status < 500 && err?.status !== 425) {
            break;
          }
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    }, 400);
    return () => clearTimeout(t);
  }, [notGenerated, loading, isRegenerating, isReadOnly, spaceId]);

  const handleGenerateOrRegenerate = useCallback(async () => {
    if (!spaceId) return;
    setIsRegenerating(true);
    setError(null);
    setNotGenerated(false);
    setSummary(null);
    try {
      await api.post(`/spaces/${spaceId}/summary/regenerate`, {}, {
        idempotencyKey: `summary-regen-${spaceId}-${Date.now()}`,
      });
      let polls = 0;
      while (polls < MAX_POLLS) {
        polls++;
        try {
          const res = await api.get(`/spaces/${spaceId}/summary`);
          const normalized = normalizeSummary(res);
          if (hasContent(normalized)) {
            setSummary(normalized);
            return;
          }
        } catch (err) {
          if (err?.status !== 425 && err?.status && err.status < 500) {
            throw err;
          }
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
      setNotGenerated(true);
    } catch (err) {
      console.warn("summary regenerate failed:", err?.message || err);
      setError({
        title: "Couldn't regenerate the summary right now",
        message: "The AI service may be temporarily unavailable. Try again shortly.",
      });
    } finally {
      setIsRegenerating(false);
    }
  }, [spaceId]);

  if (loading) {
    return <PollingLoader label="Loading your AI summary..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl space-y-6">
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={() => setReloadKey((n) => n + 1)}
        />
        {!isReadOnly && (
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={handleGenerateOrRegenerate}
              isLoading={isRegenerating}
              className="py-2.5 px-4 text-xs font-bold"
            >
              <HiOutlineArrowPath className="w-4 h-4" />
              <span>Regenerate Summary</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (notGenerated || !hasContent(summary)) {
    return (
      <div className="max-w-4xl space-y-4">
        <SummaryEmptyState onGenerateClick={handleGenerateOrRegenerate} />
        {isRegenerating && <PollingLoader label="AI is writing your summary..." />}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-amber-500" />
            <span>AI Summary</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-muted/20">
            {summary.generatedAt}
          </span>
        </div>

        {!isReadOnly && (
          <Button
            variant="secondary"
            isLoading={isRegenerating}
            onClick={handleGenerateOrRegenerate}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            <span>Regenerate Summary</span>
          </Button>
        )}
      </div>

      {summary.keyPoints.length > 0 && (
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-muted/30 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-brand tracking-tight flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-brand" />
            <span>Key Takeaways</span>
          </h3>

          <ul className="space-y-3">
            {summary.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray leading-relaxed">
                <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {summary.definitions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HiOutlineBookOpen className="w-5 h-5 text-brand" />
            <h3 className="text-base font-extrabold text-brand tracking-tight">
              Important Definitions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.definitions.map((def, idx) => (
              <DefinitionCard
                key={idx}
                term={def.term}
                definition={def.definition}
              />
            ))}
          </div>
        </section>
      )}

      {summary.mainConcepts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-extrabold text-brand tracking-tight flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-brand" />
            <span>Core Concepts & Mechanics</span>
          </h3>

          <div className="space-y-4">
            {summary.mainConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="border-l-4 border-brand bg-white rounded-r-2xl p-5 sm:p-6 shadow-xs border-y border-r border-muted/20 space-y-2 hover:shadow-md transition-shadow"
              >
                <h4 className="text-sm font-bold text-brand tracking-tight">
                  {concept.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray leading-relaxed">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {summary.examTips.length > 0 && (
        <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-brand/5 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <HiOutlineLightBulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                High-Yield Exam Tips
              </h3>
              <p className="text-xs text-amber-900/80 font-medium">
                Actionable advice for midterms and final exams
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-1">
            {summary.examTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-900 font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
