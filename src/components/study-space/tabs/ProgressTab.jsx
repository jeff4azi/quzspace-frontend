import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  HiAcademicCap,
  HiSparkles,
  HiFire,
  HiChartBar,
  HiOutlineSparkles,
  HiArrowTrendingUp,
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";
import StatCard from "../StatCard";
import ActivityChart from "../ActivityChart";
import MasteryTrendChart from "../MasteryTrendChart";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";

const DEFAULT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildWeeklyActivity(rawArr = []) {
  if (Array.isArray(rawArr) && rawArr.length === 7) {
    const todayIdx = (new Date().getDay() + 6) % 7;
    return rawArr.map((item, idx) => ({
      day: item.day || item.label || DEFAULT_DAYS[idx] || `D${idx + 1}`,
      minutes:
        typeof item.minutes === "number"
          ? item.minutes
          : typeof item.study_minutes === "number"
          ? item.study_minutes
          : typeof item.value === "number"
          ? item.value
          : 0,
      isToday:
        typeof item.isToday === "boolean"
          ? item.isToday
          : typeof item.is_today === "boolean"
          ? item.is_today
          : idx === todayIdx,
    }));
  }

  const todayIdx = (new Date().getDay() + 6) % 7;
  return DEFAULT_DAYS.map((day, idx) => ({
    day,
    minutes: 0,
    isToday: idx === todayIdx,
  }));
}

function buildMasteryOverTime(rawArr = []) {
  if (Array.isArray(rawArr) && rawArr.length > 0) {
    return rawArr.map((item, idx) => ({
      date:
        item.date ||
        item.label ||
        (item.week_of
          ? new Date(item.week_of).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : `W${idx + 1}`),
      masteryPercent:
        typeof item.masteryPercent === "number"
          ? Math.round(item.masteryPercent)
          : typeof item.mastery_percent === "number"
          ? Math.round(item.mastery_percent)
          : typeof item.value === "number"
          ? Math.round(item.value)
          : 0,
    }));
  }

  const today = new Date();
  return Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (5 - idx) * 7);
    return {
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      masteryPercent: 0,
    };
  });
}

function buildTrend(raw, prefix = "+") {
  if (typeof raw === "string" && raw.length > 0) return raw;
  if (typeof raw === "number") {
    return raw >= 0 ? `${prefix}${raw}` : `${raw}`;
  }
  return "No change";
}

function normalizeProgress(raw = {}) {
  const quizzesCompleted =
    typeof raw.quizzes_completed === "number"
      ? raw.quizzes_completed
      : typeof raw.quizzesCompleted === "number"
      ? raw.quizzesCompleted
      : typeof raw.total_quizzes === "number"
      ? raw.total_quizzes
      : 0;
  const flashcardsStudied =
    typeof raw.flashcards_studied === "number"
      ? raw.flashcards_studied
      : typeof raw.flashcardsStudied === "number"
      ? raw.flashcardsStudied
      : typeof raw.flashcards_reviewed === "number"
      ? raw.flashcards_reviewed
      : typeof raw.total_flashcards === "number"
      ? raw.total_flashcards
      : 0;
  const studyStreak =
    typeof raw.study_streak === "number"
      ? raw.study_streak
      : typeof raw.studyStreak === "number"
      ? raw.studyStreak
      : typeof raw.current_streak === "number"
      ? raw.current_streak
      : 0;
  const averageScore =
    typeof raw.average_score === "number"
      ? Math.round(raw.average_score)
      : typeof raw.averageScore === "number"
      ? Math.round(raw.averageScore)
      : typeof raw.avg_score === "number"
      ? Math.round(raw.avg_score)
      : 0;

  return {
    quizzesCompleted,
    flashcardsStudied,
    studyStreak,
    averageScore,
    quizzesTrend: buildTrend(raw.quizzes_trend || raw.quizzesTrend || raw.quizzes_delta, "+"),
    flashcardsTrend: buildTrend(raw.flashcards_trend || raw.flashcardsTrend || raw.flashcards_delta, "+"),
    scoreTrend: buildTrend(raw.score_trend || raw.scoreTrend || raw.score_delta, "+"),
    weeklyActivity: buildWeeklyActivity(raw.weekly_activity || raw.weeklyActivity),
    masteryOverTime: buildMasteryOverTime(raw.mastery_over_time || raw.masteryOverTime),
    motivationalHeading:
      raw.motivational_heading ||
      raw.motivationalHeading ||
      raw.heading ||
      (studyStreak > 0
        ? `You're on a ${studyStreak}-Day Study Streak! 🔥`
        : "You're Making Progress!"),
    motivationalText:
      raw.motivational_text ||
      raw.motivationalText ||
      raw.text ||
      `You've completed ${quizzesCompleted} quizzes and studied ${flashcardsStudied} flashcards. Keep your streak alive with a quick quiz today!`,
  };
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-8 w-16 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-40 bg-gray-100 rounded" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-48 w-full bg-gray-100 rounded-xl" />
    </div>
  );
}

export default function ProgressTab() {
  const { id: spaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState(null);

  const loadProgress = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/spaces/${spaceId}/progress`);
      const payload = res && typeof res === "object" ? res : {};
      const base =
        Array.isArray(payload) || !payload
          ? {}
          : payload.progress || payload.data || payload;
      const norm = normalizeProgress(base);
      setData(norm);
    } catch (err) {
      console.warn("progress load failed:", err?.message || err);
      const status = err?.status;
      setError({
        title: "Couldn't load progress",
        message:
          status === 403
            ? "You don't have permission to view progress in this space."
            : err?.message || "Try again in a moment.",
      });
      setData(normalizeProgress({}));
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  const {
    quizzesCompleted,
    flashcardsStudied,
    studyStreak,
    averageScore,
    quizzesTrend,
    flashcardsTrend,
    scoreTrend,
    weeklyActivity,
    masteryOverTime,
    motivationalHeading,
    motivationalText,
  } = data || normalizeProgress({});

  const statCardsConfig = useMemo(
    () => [
      {
        label: "Quizzes Completed",
        value: quizzesCompleted,
        trend: quizzesTrend,
        icon: HiAcademicCap,
        isHighlight: false,
      },
      {
        label: "Flashcards Studied",
        value: flashcardsStudied,
        trend: flashcardsTrend,
        icon: HiSparkles,
        isHighlight: false,
      },
      {
        label: "Study Streak",
        value: `${studyStreak} Days`,
        trend: studyStreak >= 5 ? "Personal Best!" : "Keep it going",
        icon: HiFire,
        isHighlight: true,
      },
      {
        label: "Average Score",
        value: `${averageScore}%`,
        trend: scoreTrend,
        icon: HiChartBar,
        isHighlight: false,
      },
    ],
    [
      quizzesCompleted,
      flashcardsStudied,
      studyStreak,
      averageScore,
      quizzesTrend,
      flashcardsTrend,
      scoreTrend,
    ],
  );

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs animate-pulse">
          <div className="space-y-2 w-full sm:w-2/3">
            <div className="h-6 w-48 bg-gray-100 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
          </div>
          <div className="h-8 w-36 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="bg-amber-500/10 border border-amber-300/40 p-5 sm:p-6 rounded-2xl animate-pulse">
          <div className="h-5 w-2/3 bg-amber-200/60 rounded mb-2" />
          <div className="h-3 w-full bg-amber-200/60 rounded" />
          <div className="h-3 w-5/6 bg-amber-200/60 rounded mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {error && (
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-darker flex items-center gap-2">
            <HiArrowTrendingUp className="w-5 h-5 text-brand" />
            Your Progress
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Track how you're mastering this study space over time.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            {averageScore >= 80
              ? "On Track for A Grade"
              : averageScore >= 60
              ? "Making Solid Progress"
              : "Needs More Practice"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsConfig.map((card, idx) => (
          <StatCard
            key={idx}
            icon={card.icon}
            label={card.label}
            value={card.value}
            trend={card.trend}
            isHighlight={card.isHighlight}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart data={weeklyActivity} />
        <MasteryTrendChart data={masteryOverTime} />
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-300/40 p-5 sm:p-6 rounded-2xl space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-darker font-bold text-sm sm:text-base">
          {motivationalHeading?.includes("🔥") || motivationalHeading?.includes("Streak") ? (
            <HiFire className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
          ) : (
            <CgSpinner className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          <h3>{motivationalHeading}</h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-7">
          {motivationalText}
        </p>
      </div>
    </div>
  );
}
