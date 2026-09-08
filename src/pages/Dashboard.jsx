import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import StudySpaceCard from "../components/dashboard/StudySpaceCard";
import EmptyState from "../components/dashboard/EmptyState";
import Button from "../components/ui/Button";
import { mockStudySpaces } from "../data/mockStudySpaces";
import { HiPlus, HiSparkles } from "react-icons/hi2";

export default function Dashboard() {
  const navigate = useNavigate();
  const [spaces] = useState(mockStudySpaces);

  const handleCreateSpace = () => {
    navigate("/create-space");
  };

  return (
    <AppLayout onCreateClick={handleCreateSpace}>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Mobile Plan Usage Banner (lg:hidden, since desktop sidebar shows it) */}
        <div className="lg:hidden bg-white p-4 rounded-xl border border-muted/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand flex items-center gap-1">
              <HiSparkles className="w-4 h-4 text-amber-500" /> Free Plan
            </span>
            <span className="text-gray font-semibold">2 of 3 Spaces Used</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
            <div className="bg-brand h-full rounded-full w-[66%]" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray">Need more space?</span>
            <button
              onClick={() => alert("Upgrade plan placeholder")}
              className="text-xs font-bold text-brand hover:underline"
            >
              Upgrade Plan →
            </button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
              Your Study Spaces
            </h1>
            <p className="text-sm text-gray mt-1">
              Manage your AI-generated summaries, active recall flashcards, and quizzes.
            </p>
          </div>

          {/* Desktop Create Button */}
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

        {/* Study Spaces Grid or Empty State */}
        {spaces && spaces.length > 0 ? (
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
        ) : (
          <EmptyState onCreateClick={handleCreateSpace} />
        )}

      </div>
    </AppLayout>
  );
}
