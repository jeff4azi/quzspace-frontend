import { useState } from "react";
import Button from "../ui/Button";
import {
  HiXMark,
  HiSparkles,
  HiOutlineQuestionMarkCircle,
  HiCheckCircle,
} from "react-icons/hi2";

export default function GenerateQuizModal({
  isOpen,
  onClose,
  onQuizGenerated,
  currentQuizCount = 0,
}) {
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState("Easy");
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      style={{ minHeight: "100dvh" }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full sm:max-w-md sm:rounded-2xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 max-h-[90dvh] overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-muted/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <HiOutlineQuestionMarkCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-brand tracking-tight">
                Generate New Quiz
              </h3>
              <p className="text-[11px] font-semibold text-gray-400">
                {currentQuizCount} {currentQuizCount === 1 ? "quiz" : "quizzes"}{" "}
                in this space
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand block">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {[10, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`
                    py-2 rounded-lg transition-all text-center cursor-pointer
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
            <label className="text-xs font-bold uppercase tracking-wider text-brand block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
              {["Easy", "Medium", "Hard", "Mixed"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-2 rounded-lg transition-all text-center text-[11px] sm:text-xs cursor-pointer
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
          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isGenerating}
              className="w-full sm:flex-1 py-3 text-xs font-bold"
            >
              <HiSparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Quiz</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto sm:px-6 py-3 text-xs font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
