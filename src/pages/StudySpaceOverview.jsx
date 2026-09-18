import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import {
  TABS_CONFIG,
  getActiveTabComponent,
} from "../components/study-space/SpaceTabs";
import Button from "../components/ui/Button";
import { getSpaceById } from "../data/mockActiveSpace";
import {
  HiArrowLeft,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineShare,
  HiOutlineSparkles,
} from "react-icons/hi2";

// ─── Shared tab strip used in both expanded and collapsed headers ─────────────
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function StudySpaceOverview() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const space = getSpaceById(id);
  const activeTabId = searchParams.get("tab") || "summary";
  const ActiveTabComponent = getActiveTabComponent(activeTabId);

  // Ref to the expanded header so we know when it's scrolled out of view
  const expandedHeaderRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Track exact scroll progress (0 → 1) through the collapse zone for smooth cross-fades
  const [collapseProgress, setCollapseProgress] = useState(0);

  useEffect(() => {
    const COLLAPSE_START = 60; // px scrolled before animation begins
    const COLLAPSE_END = 130; // px scrolled when fully collapsed

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
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTabClick = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleShare = () => {
    alert("Share Study Space placeholder.");
  };

  // Derived opacity/transform values for smooth transitions
  const expandedOpacity = 1 - collapseProgress;
  const collapsedOpacity = collapseProgress;

  return (
    <AppLayout hideBottomNav>
      {/* ── Sticky Collapsed Header (fixed, above content) ──────────── */}
      <div
        className="fixed top-0 left-0 right-0 lg:left-[270px] z-20 bg-white border-b border-muted/20 shadow-sm transition-transform duration-300 ease-out"
        style={{
          opacity: collapsedOpacity,
          transform: `translateY(${isCollapsed ? "0%" : "-100%"})`,
          pointerEvents: isCollapsed ? "auto" : "none",
        }}
      >
        {/* Top row: back + title */}
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

        {/* Tab strip */}
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 border-t border-muted/10">
          <TabStrip
            activeTabId={activeTabId}
            onTabClick={handleTabClick}
            compact
          />
        </div>
      </div>

      {/* ── Expanded Header (scrolls with page) ─────────────────────── */}
      <div
        ref={expandedHeaderRef}
        className="space-y-4 mb-2 transition-opacity duration-200"
        style={{ opacity: expandedOpacity }}
      >
        {/* Top row: Back link + Share Button */}
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
            className="py-1.5 px-3.5 text-xs font-bold"
          >
            <HiOutlineShare className="w-4 h-4" />
            <span>Share Space</span>
          </Button>
        </div>

        {/* Category badge + Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="self-start inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100/90 text-brand border border-muted/20">
            {space.subject}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
            {space.title}
          </h1>
        </div>

        {/* Metadata Row */}
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

      {/* ── Expanded Tab Strip (scrolls with page, hidden once collapsed) */}
      <div
        className="mb-6 border-b border-muted/30 transition-opacity duration-200"
        style={{ opacity: expandedOpacity }}
      >
        <TabStrip activeTabId={activeTabId} onTabClick={handleTabClick} />
      </div>

      {/* Spacer so content doesn't jump under the fixed collapsed header */}
      {isCollapsed && <div className="h-[84px]" aria-hidden="true" />}

      {/* ── Tab Content ─────────────────────────────────────────────── */}
      <div className={activeTabId === "chat" ? "" : "min-h-75"}>
        <ActiveTabComponent />
      </div>
    </AppLayout>
  );
}
