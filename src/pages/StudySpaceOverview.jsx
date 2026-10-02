import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import {
  TABS_CONFIG,
  getActiveTabComponent,
} from "../components/study-space/SpaceTabs";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/shared/ErrorBanner";
import InviteCollaboratorModal from "../components/study-space/InviteCollaboratorModal";
import { SpaceDataProvider, useSpaceData } from "../hooks/useSpaceData";
import api, { fetchWithIdempotency } from "../lib/api";
import {
  HiArrowLeft,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineShare,
  HiOutlineSparkles,
  HiCheckCircle,
  HiUserPlus,
  HiXMark,
} from "react-icons/hi2";

function TabStrip({ activeTabId, onTabClick, compact = false }) {
  return (
    <div
      className={`relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-linear-to-l after:from-white after:to-transparent after:pointer-events-none lg:after:hidden ${
        compact ? "" : "after:from-light"
      }`}
    >
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-1 py-1">
        {TABS_CONFIG.map((tab) => {
          const isActive = activeTabId === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabClick(tab.id)}
              className={`
                inline-flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 shrink-0
                ${compact ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs"}
                ${
                  isActive
                    ? "bg-brand text-light shadow-sm"
                    : "text-gray hover:bg-gray-200/60 hover:text-brand"
                }
              `}
            >
              <TabIcon
                className={`w-3.5 h-3.5 ${isActive ? "text-light" : "text-gray"}`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OverviewInner() {
  const navigate = useNavigate();
  const { space, loading, error, notFound, reload } = useSpaceData();
  const { id: spaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get("tab") || "summary";
  const ActiveTabComponent = getActiveTabComponent(activeTabId);

  const expandedHeaderRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapseProgress, setCollapseProgress] = useState(0);

  const [shareState, setShareState] = useState({
    isLoading: false,
    shareUrl: "",
    shareEnabled: false,
  });
  const [shareToast, setShareToast] = useState({ show: false, msg: "", kind: "success" });
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    const COLLAPSE_START = 60;
    const COLLAPSE_END = 130;

    const onScroll = () => {
      const y = window.scrollY;
      const progress = Math.min(
        1,
        Math.max(0, (y - COLLAPSE_START) / (COLLAPSE_END - COLLAPSE_START)),
      );
      setCollapseProgress(progress);
      setIsCollapsed(progress > 0.5);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTabClick = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleShare = async () => {
    if (!spaceId) return;
    setShareState((s) => ({ ...s, isLoading: true }));
    setShareToast({ show: false, msg: "", kind: "success" });
    try {
      let url = shareState.shareUrl;
      let enabled = shareState.shareEnabled;
      if (!enabled || !url) {
        const resp = await fetchWithIdempotency(`/spaces/${spaceId}/share`, {
          filesVisible: true,
        });
        const payload = resp || {};
        const code = payload.share_code || payload.code;
        url =
          payload.share_url ||
          payload.url ||
          (code ? `${window.location.origin}/s/${code}` : "");
        enabled = true;
      }
      if (url && navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
        } catch (_) {
          /* noop */
        }
      }
      setShareState({ isLoading: false, shareUrl: url, shareEnabled: enabled });
      setShareToast({
        show: true,
        msg: url ? "Invite link copied to clipboard!" : "Share link created!",
        kind: "success",
      });
    } catch (err) {
      console.warn("share failed:", err?.message || err);
      setShareState((s) => ({ ...s, isLoading: false }));
      setShareToast({
        show: true,
        msg: "Couldn't create share link right now. Try again.",
        kind: "error",
      });
    }
  };

  useEffect(() => {
    if (!shareToast.show) return;
    const t = setTimeout(() => setShareToast({ ...shareToast, show: false }), 4500);
    return () => clearTimeout(t);
  }, [shareToast.show]);

  const expandedOpacity = 1 - collapseProgress;
  const collapsedOpacity = collapseProgress;

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
        <div className="h-4 w-40 bg-gray-100 rounded" />
        <div className="h-8 w-3/4 bg-gray-100 rounded-lg" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto pt-8">
        <ErrorBanner
          title="This study space doesn't exist"
          message="It may have been deleted, or the link is incorrect. Head back to your dashboard to pick an existing space, or create a new one."
        />
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="max-w-3xl mx-auto pt-8">
        <ErrorBanner
          title={error?.title || "Couldn't open this study space"}
          message={error?.message || "Try again in a moment."}
          onRetry={reload}
        />
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-muted/20 shadow-sm transition-transform duration-300 ease-out"
        style={{
          opacity: collapsedOpacity,
          transform: `translateY(${isCollapsed ? "0%" : "-100%"})`,
          pointerEvents: isCollapsed ? "auto" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 py-2.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray hover:text-brand transition-colors shrink-0"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <span className="w-px h-4 bg-muted/40 shrink-0" />

          <h1 className="text-sm font-extrabold text-brand truncate flex-1 tracking-tight">
            {space.title}
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 border-t border-muted/10">
          <TabStrip
            activeTabId={activeTabId}
            onTabClick={handleTabClick}
            compact
          />
        </div>
      </div>

      <div
        ref={expandedHeaderRef}
        className="space-y-4 mb-2 transition-opacity duration-200"
        style={{ opacity: expandedOpacity }}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray hover:text-brand transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Button
            variant="secondary"
            onClick={handleShare}
            isLoading={shareState.isLoading}
            className="py-1.5 px-3.5 text-xs font-bold"
          >
            <HiOutlineShare className="w-4 h-4" />
            <span>Share Space</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="self-start inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100/90 text-brand border border-muted/20">
            {space.subject}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
            {space.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray pt-1">
          <span className="flex items-center gap-1.5 font-semibold text-brand">
            <HiOutlineDocumentText className="w-4 h-4" />
            {space.fileCount} {space.fileCount === 1 ? "file" : "files"}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineClock className="w-4 h-4 text-muted" />
            Last active {space.lastAccessed}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineCalendar className="w-4 h-4 text-muted" />
            Created {space.createdDate}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-emerald-600" />
            {space.progressPercent}% Mastery
          </span>
        </div>
      </div>

      <div
        className="mb-6 border-b border-muted/30 transition-opacity duration-200"
        style={{ opacity: expandedOpacity }}
      >
        <TabStrip activeTabId={activeTabId} onTabClick={handleTabClick} />
      </div>

      {isCollapsed && <div className="h-[84px]" aria-hidden="true" />}

      <div className={activeTabId === "chat" ? "" : "min-h-75"}>
        <ActiveTabComponent />
      </div>

      {shareToast.show && (
        <div
          className={`fixed bottom-24 lg:bottom-6 right-4 z-50 max-w-sm w-full sm:w-auto px-4 py-3 rounded-2xl shadow-xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            shareToast.kind === "error"
              ? "bg-rose-600 text-white border-rose-400/30"
              : "bg-brand text-light border-muted/30"
          }`}
        >
          {shareToast.kind === "error" ? (
            <HiXMark className="w-5 h-5 shrink-0 text-rose-100" />
          ) : (
            <HiCheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          )}
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold block">{shareToast.msg}</span>
            {shareToast.kind === "success" && (
              <button
                onClick={() => {
                  setShareToast({ ...shareToast, show: false });
                  setIsInviteOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors"
              >
                <HiUserPlus className="w-3.5 h-3.5" />
                <span>Invite by email</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setShareToast({ ...shareToast, show: false })}
            className="shrink-0 p-1 rounded-lg text-gray-200/80 hover:text-white hover:bg-white/10"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
      )}

      <InviteCollaboratorModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        spaceId={spaceId}
      />
    </>
  );
}

export default function StudySpaceOverview() {
  const { id } = useParams();
  return (
    <AppLayout hideBottomNav hideSidebar>
      <SpaceDataProvider spaceId={id}>
        <OverviewInner />
      </SpaceDataProvider>
    </AppLayout>
  );
}
