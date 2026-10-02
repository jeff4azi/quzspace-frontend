import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import StudySpaceCard from "../components/dashboard/StudySpaceCard";
import EmptyState from "../components/dashboard/EmptyState";
import ErrorBanner from "../components/shared/ErrorBanner";
import Button from "../components/ui/Button";
import api from "../lib/api";
import { HiPlus } from "react-icons/hi2";

const ACCENT_STYLES = [
  "from-brand to-gray-700",
  "from-emerald-700 to-brand",
  "from-brand to-slate-800",
  "from-amber-700 to-brand",
  "from-indigo-800 to-brand",
  "from-rose-800 to-brand",
];

function pickAccent(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return ACCENT_STYLES[hash % ACCENT_STYLES.length];
}

function formatRelativeAgo(isoDate) {
  if (!isoDate) return "Recently";
  try {
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return "Recently";
    const diffMs = Date.now() - then;
    const min = 60 * 1000;
    const hr = 60 * min;
    const day = 24 * hr;
    const week = 7 * day;

    if (diffMs < min) return "Just now";
    if (diffMs < hr) return `${Math.floor(diffMs / min)} min ago`;
    if (diffMs < day) return `${Math.floor(diffMs / hr)} hours ago`;
    if (diffMs < 2 * day) return "Yesterday";
    if (diffMs < week) return `${Math.floor(diffMs / day)} days ago`;
    if (diffMs < 2 * week) return "1 week ago";
    return `${Math.floor(diffMs / week)} weeks ago`;
  } catch {
    return "Recently";
  }
}

function normalizeSpace(s = {}) {
  return {
    id: s.id || s.space_id || `space-${Math.random().toString(36).slice(2, 8)}`,
    title: s.title || "Untitled Study Space",
    subject: s.subject || "General",
    fileCount: typeof s.file_count === "number" ? s.file_count : s.fileCount ?? 0,
    lastAccessed:
      typeof s.last_accessed === "string"
        ? formatRelativeAgo(s.last_accessed)
        : s.lastAccessed || "Recently",
    progressPercent:
      typeof s.progress_percent === "number"
        ? s.progress_percent
        : s.progressPercent ?? 0,
    accentStyle: s.accent_style || s.accentStyle || pickAccent(String(s.id || "")),
    activeMembers: Array.isArray(s.active_members)
      ? s.active_members.map((m) => ({
          id: m.id,
          name: m.name || m.full_name || "Collaborator",
          avatarInitials: m.avatar_initials || m.avatarInitials || "??",
          avatarColor: m.avatar_color || m.avatarColor || "bg-brand",
        }))
      : s.activeMembers || [],
  };
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-5 sm:p-6 shadow-xs h-[260px] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 bg-gray-100 rounded-lg" />
        <div className="h-7 w-7 bg-gray-100 rounded-lg" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-5 w-full bg-gray-100 rounded" />
        <div className="h-5 w-3/4 bg-gray-100 rounded" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="h-4 w-36 bg-gray-100 rounded" />
        <div className="h-7 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-2 w-full bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const loadSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/spaces");
      const list = Array.isArray(res) ? res : res?.spaces || [];
      setSpaces(list.map(normalizeSpace));
    } catch (err) {
      console.warn("dashboard spaces load failed:", err?.message || err);
      setError({
        title: "Couldn't load your study spaces",
        message:
          err?.status === 401 || err?.code === "HTTP_401"
            ? "Your session may have expired. Please sign in again."
            : "The backend may still be warming up, or there's a temporary network issue. Hit retry in a moment.",
      });
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces, attempt]);

  const handleCreateSpace = () => {
    navigate("/create-space");
  };

  const handleRetry = () => setAttempt((n) => n + 1);

  return (
    <AppLayout onCreateClick={handleCreateSpace}>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
              Your Study Spaces
            </h1>
            <p className="text-sm text-gray mt-1">
              Manage your AI-generated summaries, active recall flashcards, and
              quizzes.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              onClick={handleCreateSpace}
              className="w-full sm:w-auto py-3 px-5 text-sm"
            >
              <HiPlus className="w-5 h-5" />
              <span>Create New Study Space</span>
            </Button>
          </div>
        </div>

        {error && !loading && (
          <ErrorBanner
            title={error.title}
            message={error.message}
            onRetry={handleRetry}
          />
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : spaces && spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {spaces.map((space) => (
              <StudySpaceCard
                key={space.id}
                id={space.id}
                title={space.title}
                subject={space.subject}
                fileCount={space.fileCount}
                lastAccessed={space.lastAccessed}
                progressPercent={space.progressPercent}
                accentStyle={space.accentStyle}
                activeMembers={space.activeMembers}
              />
            ))}
          </div>
        ) : !error ? (
          <EmptyState onCreateClick={handleCreateSpace} />
        ) : null}
      </div>
    </AppLayout>
  );
}
