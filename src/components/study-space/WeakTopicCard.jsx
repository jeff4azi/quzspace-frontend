import { useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiSparkles,
  HiExclamationTriangle,
  HiAcademicCap,
  HiClock,
  HiDocumentCheck,
} from "react-icons/hi2";
import Button from "../ui/Button";

export default function WeakTopicCard({ topicData, onPracticeFlashcards }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    topic,
    masteryPercent,
    relatedQuizzes,
    lastReviewed,
    explanation,
    keyTips,
  } = topicData;

  // Determine badge & bar color based on mastery percent (Warm caution palette)
  const getMasteryColorClass = (percent) => {
    if (percent < 30) {
      return {
        bar: "bg-amber-500",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Needs Priority Review",
      };
    }
    if (percent < 45) {
      return {
        bar: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Low Mastery",
      };
    }
    return {
      bar: "bg-brand",
      badge: "bg-brand/10 text-brand border-brand/20",
      label: "Moderate Mastery",
    };
  };

  const style = getMasteryColorClass(masteryPercent);

  return (
    <div
      className={`
        bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-xs
        ${isExpanded ? "border-brand/40 ring-2 ring-brand/10" : "border-muted/30 hover:border-brand/20"}
      `}
    >
      {/* Main summary row */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-darker leading-snug">
                {topic}
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${style.badge}`}
              >
                <HiExclamationTriangle className="w-3 h-3 shrink-0" />
                {style.label} · {masteryPercent}%
              </span>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <HiDocumentCheck className="w-3.5 h-3.5 text-gray-400" />
                Missed in {relatedQuizzes} quiz attempt{relatedQuizzes > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5 text-gray-400" />
                {lastReviewed ? `Last reviewed ${lastReviewed}` : "Not reviewed yet"}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 self-start sm:self-center">
            <Button
              variant={isExpanded ? "outline" : "primary"}
              size="sm"
              onClick={() => setIsExpanded((prev) => !prev)}
              icon={isExpanded ? HiChevronUp : HiChevronDown}
              iconPosition="right"
              className="text-xs"
            >
              {isExpanded ? "Close Review" : "Review This Topic"}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-gray-500">
            <span>Mastery Level</span>
            <span className="font-semibold text-darker">{masteryPercent}%</span>
          </div>
          <div className="w-full h-2 bg-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Accordion Expand Detail Section */}
      {isExpanded && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-4 border-t border-muted/20 bg-light/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
            <HiSparkles className="w-4 h-4 text-amber-500" />
            <span>AI Quick Tutor Recap</span>
          </div>

          <p className="text-xs sm:text-sm text-dark font-normal leading-relaxed bg-white p-4 rounded-xl border border-muted/30 shadow-2xs">
            {explanation}
          </p>

          {/* Key study tips */}
          {keyTips && keyTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-700">Key Concepts to Remember:</h4>
              <ul className="space-y-1.5 pl-1">
                {keyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={HiAcademicCap}
              onClick={() => onPracticeFlashcards && onPracticeFlashcards(topic)}
              className="text-xs justify-center"
            >
              Practice Flashcards for this Topic
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
