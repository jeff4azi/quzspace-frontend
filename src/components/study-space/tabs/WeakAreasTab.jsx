import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  HiExclamationTriangle,
  HiArrowPath,
  HiCheckCircle,
} from "react-icons/hi2";
import WeakTopicCard from "../WeakTopicCard";
import WeakAreasEmptyState from "./WeakAreasEmptyState";
import Button from "../../ui/Button";
import { mockWeakAreas } from "../../../data/mockWeakAreas";

export default function WeakAreasTab() {
  const [, setSearchParams] = useSearchParams();
  const [weakTopics, setWeakTopics] = useState(
    [...mockWeakAreas].sort((a, b) => a.masteryPercent - b.masteryPercent)
  );
  const [toastMessage, setToastMessage] = useState("");

  const handleTakeQuiz = () => {
    setSearchParams({ tab: "quiz" });
  };

  const handlePracticeFlashcards = (topicName) => {
    setToastMessage(`Switched to Flashcards mode for "${topicName}"`);
    setTimeout(() => {
      setSearchParams({ tab: "flashcards" });
    }, 600);
  };

  const handleClear = () => {
    setWeakTopics([]);
  };

  const handleRestore = () => {
    setWeakTopics(
      [...mockWeakAreas].sort((a, b) => a.masteryPercent - b.masteryPercent)
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-darker text-light px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-darker flex items-center gap-2">
              <HiExclamationTriangle className="w-5 h-5 text-amber-500" />
              Weak Areas
            </h2>
            {weakTopics.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {weakTopics.length} topic{weakTopics.length === 1 ? "" : "s"} need review
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Topics you've struggled with based on your quiz performance and flashcard reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {weakTopics.length === 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestore}
              icon={HiArrowPath}
              className="text-xs"
            >
              Restore Sample
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-brand"
            >
              Simulate 100% Mastery
            </Button>
          )}
        </div>
      </div>

      {/* List of Weak Topics or Empty State */}
      {weakTopics.length === 0 ? (
        <WeakAreasEmptyState
          onTakeQuiz={handleTakeQuiz}
          onRestoreSample={handleRestore}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-1">
            <span>SORTED BY LOWEST MASTERY</span>
            <span>{weakTopics.length} TOPICS</span>
          </div>

          <div className="space-y-4">
            {weakTopics.map((item) => (
              <WeakTopicCard
                key={item.id}
                topicData={item}
                onPracticeFlashcards={handlePracticeFlashcards}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
