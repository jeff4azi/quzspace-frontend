import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../lib/api";

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
    return `${Math.floor(diffMs / week)} weeks ago`;
  } catch {
    return "Recently";
  }
}

function formatDateLong(isoDate) {
  if (!isoDate) return "Recently";
  try {
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function normalizeSpace(payload = {}, spaceIdFallback = "") {
  const s = payload?.space || payload;
  const role = payload?.role || s?.user_role || s?.role || "viewer";
  return {
    id: s.id || s.space_id || spaceIdFallback,
    title: s.title || "Untitled Study Space",
    subject: s.subject || "General",
    description: s.description || "",
    fileCount: typeof s.file_count === "number" ? s.file_count : s.fileCount ?? 0,
    lastAccessed:
      typeof s.last_accessed === "string"
        ? formatRelativeAgo(s.last_accessed)
        : s.lastAccessed || "Recently",
    createdDate:
      typeof s.created_at === "string"
        ? formatDateLong(s.created_at)
        : s.createdDate || "Recently",
    progressPercent:
      typeof s.progress_percent === "number"
        ? s.progress_percent
        : s.progressPercent ?? 0,
    accentStyle: s.accent_style || s.accentStyle || pickAccent(String(s.id || spaceIdFallback)),
    ownerId: s.owner_id || s.ownerId || null,
    ownerName: s.owner?.full_name || s.owner_name || null,
    role,
    isOwner: role === "owner",
    canEdit: ["owner", "collaborator"].includes(role),
    flags: s.flags || payload.flags || {},
  };
}

const SpaceDataContext = createContext(null);

export function SpaceDataProvider({ spaceId: spaceIdProp, children }) {
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((n) => n + 1), []);

  const bumpVisit = useCallback(async (sid) => {
    try {
      await api.post(`/spaces/${sid}/visit`, {});
    } catch (_) {
      /* visit bump is fire-and-forget best effort */
    }
  }, []);

  useEffect(() => {
    if (!spaceIdProp) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const res = await api.get(`/spaces/${spaceIdProp}`);
        const normalized = normalizeSpace(res, spaceIdProp);
        if (mounted) setSpace(normalized);
        bumpVisit(spaceIdProp);
      } catch (err) {
        const status = err?.status || err?.response?.status;
        if (status === 404 && mounted) setNotFound(true);
        else if (mounted) {
          console.warn("space load failed:", err?.message || err);
          setError({
            title: "Couldn't load this study space",
            message:
              status === 403
                ? "You don't have permission to view this space. Request access from the owner."
                : "This might be temporary — retry in a moment, or head back to Dashboard.",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [spaceIdProp, reloadKey, bumpVisit]);

  const value = useMemo(
    () => ({
      spaceId: spaceIdProp,
      space,
      loading,
      error,
      notFound,
      reload,
    }),
    [spaceIdProp, space, loading, error, notFound, reload],
  );

  return (
    <SpaceDataContext.Provider value={value}>{children}</SpaceDataContext.Provider>
  );
}

export function useSpaceData() {
  const ctx = useContext(SpaceDataContext);
  if (!ctx) {
    throw new Error("useSpaceData must be used within a SpaceDataProvider");
  }
  return ctx;
}

export default SpaceDataContext;
