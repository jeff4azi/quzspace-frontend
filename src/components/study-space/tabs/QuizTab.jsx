import { useState } from "react";
import QuizCard from "../QuizCard";
import GenerateQuizModal from "../GenerateQuizModal";
import QuizEmptyState from "./QuizEmptyState";
import Button from "../../ui/Button";
import { usePlan } from "../../../context/PlanContext";
import { mockQuizzes } from "../../../data/mockQuizzes";
import { HiPlus, HiLockClosed, HiSparkles } from "react-icons/hi2";

export default function QuizTab({ isReadOnly = false }) {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFree, togglePlan, maxQuizzesLimit } = usePlan();

  const isLimitReached = quizzes.length >= maxQuizzesLimit;

  const handleQuizGenerated = (newQuiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleRetakeQuiz = (quizId) => {
    alert(`Retaking quiz session for ${quizId}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Row: Title, Count Badge & Generate Quiz Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight">
            Quizzes
          </h2>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            isLimitReached 
              ? "bg-amber-100 text-amber-800 border border-amber-300" 
              : "bg-brand/10 text-brand"
          }`}>
            {quizzes.length} / {maxQuizzesLimit} Quizzes Used
          </span>
        </div>

        {!isReadOnly && (
          <Button
            variant={isLimitReached ? "outline" : "primary"}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            {isLimitReached ? <HiLockClosed className="w-4 h-4 text-amber-600" /> : <HiPlus className="w-4 h-4" />}
            <span>{isLimitReached ? "Quiz Limit Reached" : "Generate New Quiz"}</span>
          </Button>
        )}
      </div>

      {/* Plan Limit Banner Notice if limit reached */}
      {!isReadOnly && isLimitReached && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-brand/5 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
              <HiLockClosed className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-darker">
                {isFree 
                  ? "Free Plan Quiz Limit Reached (2 / 2 Quizzes)" 
                  : "Maximum Space Quiz Limit Reached (5 / 5 Quizzes)"}
              </p>
              <p className="text-gray-600 text-[11px]">
                {isFree
                  ? "Free accounts can create up to 2 quizzes per space. Upgrade to Pro for up to 5 quizzes!"
                  : "Each Study Space supports up to 5 custom quizzes. Delete an existing quiz to create a new one."}
              </p>
            </div>
          </div>

          {isFree && (
            <Button
              variant="primary"
              size="sm"
              onClick={togglePlan}
              className="shrink-0 font-bold bg-brand text-xs py-2 px-3 shadow-xs"
            >
              <HiSparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade to Pro</span>
            </Button>
          )}
        </div>
      )}

      {/* Generate Quiz Modal */}
      <GenerateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizGenerated={handleQuizGenerated}
        currentQuizCount={quizzes.length}
      />

      {/* Quiz Grid OR Empty State */}
      {quizzes && quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onDelete={handleDeleteQuiz}
              onRetake={handleRetakeQuiz}
            />
          ))}
        </div>
      ) : (
        <QuizEmptyState onGenerateClick={() => setIsModalOpen(true)} />
      )}

    </div>
  );
}
