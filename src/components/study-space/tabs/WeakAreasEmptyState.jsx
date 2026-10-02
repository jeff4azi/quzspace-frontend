import { HiTrophy, HiSparkles, HiAcademicCap, HiArrowPath } from "react-icons/hi2";
import Button from "../../ui/Button";

export default function WeakAreasEmptyState({ onTakeQuiz, onRefreshAnalysis }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center bg-white rounded-2xl border border-muted/30 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
        <HiTrophy className="w-8 h-8" />
      </div>

      <div className="flex items-center gap-1.5 justify-center text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
        <HiSparkles className="w-4 h-4" />
        <span>Keep Going!</span>
      </div>

      <h3 className="text-xl font-bold text-darker mb-2">
        No Weak Areas Detected Yet
      </h3>

      <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm">
        Take a quiz or review flashcard decks to generate targeted AI insights on topics that need extra practice. If you've already completed materials, refresh the analysis below.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="primary"
          icon={HiAcademicCap}
          onClick={onTakeQuiz}
          className="text-xs"
        >
          Take a Quiz
        </Button>

        {onRefreshAnalysis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshAnalysis}
            icon={HiArrowPath}
            className="text-xs text-gray-500 hover:text-brand"
          >
            Refresh Analysis
          </Button>
        )}
      </div>
    </div>
  );
}
