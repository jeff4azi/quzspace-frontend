import { useState } from "react";
import QuizCard from "../QuizCard";
import GenerateQuizModal from "../GenerateQuizModal";
import QuizEmptyState from "./QuizEmptyState";
import Button from "../../ui/Button";
import { mockQuizzes } from "../../../data/mockQuizzes";
import { HiPlus } from "react-icons/hi2";

export default function QuizTab({ isReadOnly = false }) {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
          </span>
        </div>

        {!isReadOnly && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            <HiPlus className="w-4 h-4" />
            <span>Generate New Quiz</span>
          </Button>
        )}
      </div>

      {/* Generate Quiz Modal */}
      <GenerateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizGenerated={handleQuizGenerated}
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
