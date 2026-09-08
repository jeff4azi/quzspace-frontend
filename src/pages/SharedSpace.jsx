import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  HiXMark,
  HiLockClosed,
  HiOutlineDocumentText,
  HiOutlineRectangleStack,
  HiOutlineQuestionMarkCircle,
  HiSparkles,
  HiUserCircle,
  HiOutlineCalendar,
  HiOutlineSparkles,
} from "react-icons/hi2";

import logo from "../assets/Quzspace_logo.png";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import SummaryTab from "../components/study-space/tabs/SummaryTab";
import FlashcardsTab from "../components/study-space/tabs/FlashcardsTab";
import QuizTab from "../components/study-space/tabs/QuizTab";
import { mockSharedSpace } from "../data/mockSharedSpace";

const SHARED_TABS = [
  { id: "summary", label: "Summary", icon: HiOutlineDocumentText, component: SummaryTab },
  { id: "flashcards", label: "Flashcards", icon: HiOutlineRectangleStack, component: FlashcardsTab },
  { id: "quiz", label: "Quiz", icon: HiOutlineQuestionMarkCircle, component: QuizTab },
];

export default function SharedSpace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBanner, setShowBanner] = useState(true);

  const space = mockSharedSpace;
  const activeTabId = searchParams.get("tab") || "summary";
  const activeTabObj = SHARED_TABS.find((t) => t.id === activeTabId) || SHARED_TABS[0];
  const ActiveComponent = activeTabObj.component;

  const handleTabClick = (id) => {
    setSearchParams({ tab: id });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col justify-between">
      <div>
        {/* Top Bar (Public Lightweight Navbar) */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <img src={logo} alt="QuzSpace Logo" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand">
                Quz<span className="text-gray-600 font-semibold">Space</span>
              </span>
            </Link>

            {/* Right Sign Up Free CTA */}
            <Link to="/signup">
              <Button variant="primary" size="sm" className="text-xs sm:text-sm shadow-xs">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </header>

        {/* Slim Banner Strip */}
        {showBanner && (
          <div className="bg-brand text-light px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between gap-4 animate-in fade-in">
            <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center text-center">
              <HiSparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                You're viewing a shared Study Space · Powered by{" "}
                <strong className="font-extrabold">QuzSpace</strong>
              </span>
              <Link to="/signup" className="underline font-bold hover:text-amber-200 ml-1">
                Sign Up
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="p-1 text-light/80 hover:text-light rounded-lg shrink-0"
              title="Dismiss banner"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Shared Space Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand/10 text-brand border border-brand/20">
                  {space.subject}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-muted/30">
                  <HiUserCircle className="w-4 h-4 text-brand" />
                  Shared by {space.ownerName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-darker tracking-tight leading-tight">
                {space.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
                {space.description}
              </p>
            </div>
          </div>

          {/* Metadata & Permission Boundary Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 pt-2 border-t border-muted/20">
            {/* Locked Files Indicator */}
            {!space.filesVisible && (
              <span className="flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <HiLockClosed className="w-3.5 h-3.5 text-amber-600" />
                Files not shared by owner
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4 text-muted" />
              Shared {space.sharedDate}
            </span>

            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-emerald-600" />
              {space.progressPercent}% Mastery Score
            </span>
          </div>
        </div>

        {/* Read-Only Shared Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="border-b border-muted/30 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {SHARED_TABS.map((tab) => {
                const isActive = activeTabId === tab.id;
                const TabIcon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer
                      ${
                        isActive
                          ? "bg-brand text-light shadow-sm"
                          : "text-gray-600 hover:bg-gray-200/60 hover:text-brand"
                      }
                    `}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content Area */}
          <div className="min-h-[400px] mb-12">
            <ActiveComponent isReadOnly={true} />
          </div>

          {/* Access Gate / Free-Tier Upgrade Prompt Card */}
          <div className="mb-12 bg-gradient-to-br from-brand/10 via-brand/5 to-white border border-brand/20 p-6 sm:p-8 rounded-3xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-bold uppercase tracking-wider text-brand">
                <HiSparkles className="w-4 h-4 text-amber-500" />
                <span>Unlock Full AI Power</span>
              </div>
              <h3 className="text-xl font-extrabold text-darker">
                Want to create your own Study Spaces?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Sign up free to upload your own PDFs, get 24/7 AI Chat tutoring, generate custom quizzes, and track weak areas automatically.
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/signup">
                <Button variant="primary" size="md" className="font-bold shadow-md">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
