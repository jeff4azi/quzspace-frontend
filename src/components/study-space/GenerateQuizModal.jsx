import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { usePlan } from "../../context/PlanContext";
import { 
  HiXMark, 
  HiSparkles, 
  HiOutlineQuestionMarkCircle,
  HiLockClosed,
  HiCheckCircle
} from "react-icons/hi2";

export default function GenerateQuizModal({ isOpen, onClose, onQuizGenerated, currentQuizCount = 0 }) {
  const { isFree, togglePlan, maxQuizzesLimit } = usePlan();

  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState("Easy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [proPromptNotice, setProPromptNotice] = useState(null);

  // Fallback defaults for Free plan users
  useEffect(() => {
    if (isFree) {
      if (questionCount > 20) setQuestionCount(20);
      if (difficulty === "Medium" || difficulty === "Hard") setDifficulty("Easy");
    }
  }, [isFree, questionCount, difficulty]);

  if (!isOpen) return null;

  const isLimitReached = currentQuizCount >= maxQuizzesLimit;

  const handleSelectCount = (count) => {
    if (isFree && (count === 30 || count === 50)) {
      setProPromptNotice(`30 and 50 question quizzes are exclusive to Pro users.`);
      return;
    }
    setProPromptNotice(null);
    setQuestionCount(count);
  };

  const handleSelectDifficulty = (level) => {
    if (isFree && (level === "Medium" || level === "Hard")) {
      setProPromptNotice(`Medium and Hard difficulties are exclusive to Pro users.`);
      return;
    }
    setProPromptNotice(null);
    setDifficulty(level);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLimitReached) return;

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
      {/* Modal Container */}
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
            <div>
              <h3 className="text-lg font-extrabold text-brand tracking-tight">
                Generate New Quiz
              </h3>
              <p className="text-[11px] font-semibold text-gray-400">
                {currentQuizCount} of {maxQuizzesLimit} quizzes used in this space
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

        {/* Limit Reached Warning State */}
        {isLimitReached ? (
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-brand/5 border border-amber-500/30 p-6 rounded-2xl space-y-4 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
              <HiLockClosed className="w-6 h-6 text-amber-700" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-darker">
                {isFree ? "Quiz Limit Reached (2/2)" : "Space Limit Reached (5/5)"}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFree
                  ? "Free plan accounts can create up to 2 quizzes per Study Space. Upgrade to Pro to unlock up to 5 quizzes!"
                  : "You have reached the maximum of 5 quizzes allowed per Study Space."}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {isFree && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    togglePlan();
                    setProPromptNotice(null);
                  }}
                  className="w-full py-3 text-xs font-bold shadow-md bg-brand"
                >
                  <HiSparkles className="w-4 h-4 text-amber-300" />
                  <span>Upgrade to Pro Plan</span>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Configuration Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Inline Pro Locked Notice Banner */}
            {proPromptNotice && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <HiLockClosed className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{proPromptNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={togglePlan}
                  className="text-[11px] font-bold underline text-amber-900 hover:text-amber-700 shrink-0 cursor-pointer"
                >
                  Unlock Pro →
                </button>
              </div>
            )}

            {/* Question Count Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand">
                <span>Number of Questions</span>
                {isFree && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Free Plan: 10 & 20 only
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
                {[10, 20, 30, 50].map((count) => {
                  const isLocked = isFree && (count === 30 || count === 50);
                  const isSelected = questionCount === count;

                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleSelectCount(count)}
                      className={`
                        py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer
                        ${
                          isSelected
                            ? "bg-white text-brand shadow-xs"
                            : isLocked
                            ? "text-gray-400 opacity-60 hover:text-amber-800 hover:bg-amber-50/50"
                            : "text-gray hover:text-brand"
                        }
                      `}
                    >
                      <span>{count}</span>
                      {isLocked && <HiLockClosed className="w-3 h-3 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand">
                <span>Difficulty Level</span>
                {isFree && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Free Plan: Easy & Mixed
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
                {["Easy", "Medium", "Hard", "Mixed"].map((level) => {
                  const isLocked = isFree && (level === "Medium" || level === "Hard");
                  const isSelected = difficulty === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleSelectDifficulty(level)}
                      className={`
                        py-2 rounded-lg transition-all text-center text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer
                        ${
                          isSelected
                            ? "bg-white text-brand shadow-xs"
                            : isLocked
                            ? "text-gray-400 opacity-60 hover:text-amber-800 hover:bg-amber-50/50"
                            : "text-gray hover:text-brand"
                        }
                      `}
                    >
                      <span>{level}</span>
                      {isLocked && <HiLockClosed className="w-3 h-3 text-amber-600" />}
                    </button>
                  );
                })}
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
        )}

      </div>
    </div>
  );
}
