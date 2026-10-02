import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineArrowPath,
  HiOutlineQuestionMarkCircle,
  HiTrophy,
  HiChevronRight,
  HiExclamationTriangle,
} from "react-icons/hi2";
import ErrorBanner from "../components/shared/ErrorBanner";
import api from "../lib/api";
import { CgSpinner } from "react-icons/cg";

function normalizeAttempt(a = {}, idx = 0) {
  const score =
    typeof a.score === "number"
      ? a.score
      : typeof a.correct === "number"
      ? a.correct
      : 0;
  const total =
    typeof a.total_questions === "number"
      ? a.total_questions
      : typeof a.total === "number"
      ? a.total
      : 0;
  const percent =
    typeof a.percent === "number"
      ? Math.round(a.percent)
      : typeof a.score_percent === "number"
      ? Math.round(a.score_percent)
      : total > 0
      ? Math.round((score / total) * 100)
      : 0;
  const completedAt = a.completed_at || a.created_at || a.submitted_at;
  return {
    id: a.id || a.attempt_id || `attempt-${idx}`,
    attemptNumber:
      typeof a.attempt_number === "number"
        ? a.attempt_number
        : typeof a.attemptNumber === "number"
        ? a.attemptNumber
        : idx + 1,
    isPB: !!a.is_pb || !!a.isPersonalBest,
    completedAt: completedAt
      ? (() => {
          try {
            return new Date(completedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch {
            return "Recently";
          }
        })()
      : "Recently",
    percent,
    score,
    totalQuestions: total,
    timeTaken:
      typeof a.time_taken === "string"
        ? a.time_taken
        : typeof a.timeTakenMs === "number"
        ? (() => {
            const m = Math.max(1, Math.round(a.timeTakenMs / 60000));
            const s = Math.round((a.timeTakenMs % 60000) / 1000);
            return `${m}m ${s}s`;
          })()
        : a.timeTaken || "3m 45s",
  };
}

function normalizeQuizInfo(resp = {}, fallbackQuizId) {
  const q = resp?.quiz || resp;
  return {
    id: q.id || q.quiz_id || fallbackQuizId,
    title:
      q.title ||
      `Custom ${q.difficulty || ""} Quiz (${q.question_count || 10} Qs)`,
    bestScore:
      typeof q.best_score === "number"
        ? q.best_score
        : typeof q.bestScore === "number"
        ? q.bestScore
        : null,
    attemptsCount: q.attempts_count ?? q.attemptsCount ?? 0,
  };
}

function OverviewSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 sm:p-6 space-y-4 animate-pulse">
      <div className="h-4 w-48 bg-gray-100 rounded" />
      <div className="flex items-center justify-around divide-x divide-muted/20">
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <div className="h-8 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <div className="h-8 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <div className="h-8 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function AttemptSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-4 sm:p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 bg-gray-100 rounded-full" />
        <div className="h-6 w-14 bg-gray-100 rounded-full" />
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full" />
      <div className="flex items-center gap-4 pt-2 border-t border-muted/20">
        <div className="h-3 w-36 bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default function QuizHistory() {
  const { id: spaceId, quizId } = useParams();

  const [quiz, setQuiz] = useState({ id: quizId, title: "Loading…" });
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadHistory = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    try {
      const [quizRes, histRes] = await Promise.all([
        api.get(`/quizzes/${quizId}`).catch(() => ({ id: quizId })),
        api.get(`/quizzes/${quizId}/history`),
      ]);

      setQuiz(normalizeQuizInfo(quizRes, quizId));

      const list = Array.isArray(histRes)
        ? histRes
        : Array.isArray(histRes?.attempts)
        ? histRes.attempts
        : Array.isArray(histRes?.data)
        ? histRes.data
        : [];
      setAttempts(
        list.map(normalizeAttempt).sort((a, b) => (b.id > a.id ? 1 : -1)),
      );
    } catch (err) {
      console.warn("quiz history load failed:", err?.message || err);
      setError({
        title: "Couldn't load quiz history",
        message:
          err?.status === 403
            ? "You don't have permission to view this quiz's history."
            : err?.status === 404
            ? "This quiz no longer exists."
            : err?.message || "Retry in a moment.",
      });
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [quizId, reloadKey]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // Calculate average score
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percent, 0) / attempts.length)
      : null;

  const bestScore =
    quiz?.bestScore !== null && quiz?.bestScore !== undefined
      ? quiz.bestScore
      : attempts.length > 0
      ? Math.max(...attempts.map((a) => a.percent))
      : null;

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-muted/30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          {/* Back Button */}
          <Link
            to={`/spaces/${spaceId || "general"}?tab=quiz`}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand transition-colors shrink-0 py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-gray-100"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">
              Past Attempts
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-darker line-clamp-1">
              {loading ? "Loading history…" : quiz?.title || "Quiz History"}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
          <ErrorBanner
            title={error.title}
            message={error.message}
            onRetry={handleRetry}
          />
        )}

        {/* Performance Overview Banner */}
        {loading ? (
          <OverviewSkeleton />
        ) : (
          <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 sm:p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Performance Overview
            </p>

            <div className="flex items-center justify-around divide-x divide-muted/20">
              {/* Best Score */}
              <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
                <span className="text-2xl font-black text-emerald-700">
                  {bestScore !== null ? `${bestScore}%` : "—"}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  Best Score
                </span>
              </div>

              {/* Average */}
              <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
                <span className="text-2xl font-black text-brand">
                  {avgScore !== null ? `${avgScore}%` : "—"}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  Average
                </span>
              </div>

              {/* Total Attempts */}
              <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
                <span className="text-2xl font-black text-gray-700">
                  {attempts.length}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {attempts.length === 1 ? "Attempt" : "Attempts"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Attempt History List */}
        <div>
          <h2 className="text-base font-extrabold text-brand mb-3">
            Attempt History
          </h2>

          {loading ? (
            <div className="space-y-3.5">
              <AttemptSkeleton />
              <AttemptSkeleton />
            </div>
          ) : attempts.length > 0 ? (
            <div className="space-y-3.5">
              {attempts.map((attempt) => {
                const isHigh = attempt.percent >= 80;
                return (
                  <div
                    key={attempt.id}
                    className="bg-white rounded-2xl border border-muted/30 shadow-xs p-4 sm:p-5"
                  >
                    {/* Top Row: Attempt badge, date, score badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                          Attempt #{attempt.attemptNumber}
                        </span>
                        {attempt.isPB && (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <HiTrophy className="w-3 h-3" />
                            Personal Best
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium">
                          {attempt.completedAt}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          isHigh
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {attempt.percent}%
                      </span>
                    </div>

                    {/* Score Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? "bg-emerald-500" : "bg-amber-400"
                          }`}
                          style={{ width: `${attempt.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta info row */}
                    <div className="flex items-center gap-4 py-2 border-t border-muted/20 mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {attempt.score} / {attempt.totalQuestions} correct
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <HiOutlineClock className="w-3.5 h-3.5 text-muted" />
                        {attempt.timeTaken}
                      </span>
                    </div>

                    {/* View Breakdown Link */}
                    <Link
                      to={`/spaces/${spaceId || "general"}/quiz/${quiz.id}/results`}
                      className="flex items-center justify-between pt-2 border-t border-muted/20 text-xs font-bold text-brand hover:text-darker transition-colors group"
                    >
                      <span>View Result Breakdown</span>
                      <HiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-10 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                <HiOutlineQuestionMarkCircle className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-sm font-bold text-brand">
                No past attempts yet
              </h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Take this quiz to record your first score and start tracking
                your progress.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-muted/30 px-4 sm:px-8 py-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/spaces/${spaceId || "general"}/quiz/${quiz.id || quizId}`}
            className="w-full flex items-center justify-center gap-2 bg-brand text-light py-3.5 px-4 rounded-xl text-xs font-bold shadow-xs hover:bg-darker transition-all"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
