import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import StudySpaceCard from "../components/dashboard/StudySpaceCard";
import EmptyState from "../components/dashboard/EmptyState";
import Button from "../components/ui/Button";
import { mockStudySpaces } from "../data/mockStudySpaces";
import { HiPlus } from "react-icons/hi2";

export default function Dashboard() {
  const navigate = useNavigate();
  const [spaces] = useState(mockStudySpaces);

  const handleCreateSpace = () => {
    navigate("/create-space");
  };

  return (
    <AppLayout onCreateClick={handleCreateSpace}>
      <div className="space-y-6 sm:space-y-8">
        {/* Dashboard Header */}
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
