import { useState } from "react";
import DefinitionCard from "../DefinitionCard";
import SummaryEmptyState from "./SummaryEmptyState";
import Button from "../../ui/Button";
import { mockSummary } from "../../../data/mockSummary";
import { 
  HiOutlineArrowPath, 
  HiCheckCircle, 
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineSparkles
} from "react-icons/hi2";

export default function SummaryTab({ isReadOnly = false }) {
  const [summary, setSummary] = useState(mockSummary);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setSummary({
        ...mockSummary,
        generatedAt: "Just now",
      });
    }, 1200);
  };

  if (!summary) {
    return <SummaryEmptyState onGenerateClick={handleRegenerate} />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header Row: Title, Timestamp & Regenerate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-amber-500" />
            <span>AI Summary</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-muted/20">
            {summary.generatedAt}
          </span>
        </div>

        {!isReadOnly && (
          <Button
            variant="secondary"
            isLoading={isRegenerating}
            onClick={handleRegenerate}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            <span>Regenerate Summary</span>
          </Button>
        )}
      </div>

      {/* 1. Key Takeaways Section */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-muted/30 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-brand tracking-tight flex items-center gap-2">
          <HiOutlineSparkles className="w-5 h-5 text-brand" />
          <span>Key Takeaways</span>
        </h3>

        <ul className="space-y-3">
          {summary.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray leading-relaxed">
              <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Important Definitions Section (2 Cols Desktop, 1 Col Mobile) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineBookOpen className="w-5 h-5 text-brand" />
          <h3 className="text-base font-extrabold text-brand tracking-tight">
            Important Definitions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.definitions.map((def, idx) => (
            <DefinitionCard
              key={idx}
              term={def.term}
              definition={def.definition}
            />
          ))}
        </div>
      </section>

      {/* 3. Main Concepts Section */}
      <section className="space-y-4">
        <h3 className="text-base font-extrabold text-brand tracking-tight flex items-center gap-2">
          <HiOutlineSparkles className="w-5 h-5 text-brand" />
          <span>Core Concepts & Mechanics</span>
        </h3>

        <div className="space-y-4">
          {summary.mainConcepts.map((concept, idx) => (
            <div
              key={idx}
              className="border-l-4 border-brand bg-white rounded-r-2xl p-5 sm:p-6 shadow-xs border-y border-r border-muted/20 space-y-2 hover:shadow-md transition-shadow"
            >
              <h4 className="text-sm font-bold text-brand tracking-tight">
                {concept.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray leading-relaxed">
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Exam Tips Callout Box */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-brand/5 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-amber-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <HiOutlineLightBulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">
              High-Yield Exam Tips
            </h3>
            <p className="text-xs text-amber-900/80 font-medium">
              Actionable advice for midterms and final exams
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 pt-1">
          {summary.examTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-900 font-bold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
