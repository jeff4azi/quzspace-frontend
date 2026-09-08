import { useState } from "react";
import Button from "../ui/Button";
import { HiXMark, HiSparkles, HiOutlineQuestionMarkCircle } from "react-icons/hi2";

export default function GenerateQuizModal({ isOpen, onClose, onQuizGenerated }) {
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState("Medium");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const newQuiz = {
        id: `q-${Date.now()}`,
        title: `Custom ${difficulty} Quiz (${questionCount} Qs)`,
        questionCount: questionCount,
        difficulty: difficulty,
        createdAt: "Just now",
        bestScore: null,
        attemptsCount: 0,
      };

      onQuizGenerated(newQuiz);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      {/* Modal Container: Bottom sheet on mobile, centered modal on desktop */}
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-muted/30 shadow-2xl p-6 space-y-6 animate-in slide-in-from-bottom-6 sm:zoom-in-95 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-muted/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <HiOutlineQuestionMarkCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-brand tracking-tight">
              Generate New Quiz
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {[10, 20, 50, 100].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`
                    py-2 rounded-lg transition-all text-center
                    ${
                      questionCount === count
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {["Easy", "Medium", "Hard", "Mixed"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-2 rounded-lg transition-all text-center text-[11px] sm:text-xs
                    ${
                      difficulty === level
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-1/3 py-3 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isGenerating}
              className="w-full sm:w-2/3 py-3 text-xs font-bold"
            >
              <HiSparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Quiz</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
