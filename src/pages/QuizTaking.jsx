import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HiXMark, HiArrowLeft, HiArrowRight, HiSparkles } from "react-icons/hi2";
import QuestionCard from "../components/quiz/QuestionCard";
import Button from "../components/ui/Button";
import { mockQuizQuestions, getQuizDetailsById } from "../data/mockQuizQuestions";

export default function QuizTaking() {
  const { id: spaceId, quizId } = useParams();
  const navigate = useNavigate();

  const quizDetails = getQuizDetailsById(quizId);
  const questions = mockQuizQuestions;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(totalQuestions).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedOptionIndex = userAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = optionIndex;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);

    // Calculate score
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswerIndex) {
        score += 1;
      }
    });

    setTimeout(() => {
      navigate(`/spaces/${spaceId || "cs-301"}/quiz/${quizId || "quiz-1"}/results`, {
        state: {
          questions,
          userAnswers,
          score,
          total: totalQuestions,
          quizTitle: quizDetails.title,
        },
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-light flex flex-col justify-between">
      {/* Minimal Top Bar (Exam Mode Header) */}
      <header className="sticky top-0 z-30 bg-white border-b border-muted/30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Title */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Exam Mode
            </span>
            <h1 className="text-sm sm:text-base font-bold text-darker line-clamp-1">
              {quizDetails.title}
            </h1>
          </div>

          {/* Center Progress Bar */}
          <div className="hidden sm:flex flex-col items-center gap-1 w-48">
            <span className="text-xs font-semibold text-gray-500">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="w-full h-2 bg-light rounded-full overflow-hidden border border-muted/20">
              <div
                className="h-full bg-brand rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Exit Button */}
          <Link
            to={`/spaces/${spaceId || "cs-301"}?tab=quiz`}
            className="p-2 text-gray-400 hover:text-darker hover:bg-gray-100 rounded-xl transition-colors shrink-0"
            title="Exit Exam Mode"
          >
            <HiXMark className="w-6 h-6" />
          </Link>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mt-2 pt-2 border-t border-muted/20 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-500">
            Q{currentIndex + 1} / {totalQuestions}
          </span>
          <div className="w-36 h-1.5 bg-light rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {isSubmitting ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-muted/30 shadow-md text-center space-y-4 max-w-md mx-auto my-auto animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-inner">
              <HiSparkles className="w-7 h-7 text-brand animate-spin" />
            </div>
            <h3 className="text-xl font-extrabold text-darker">Scoring Your Quiz</h3>
            <p className="text-xs text-gray-500">
              Analyzing answers and compiling topic feedback...
            </p>
          </div>
        ) : (
          <QuestionCard
            questionData={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionIndex={selectedOptionIndex}
            onSelectOption={handleSelectOption}
          />
        )}
      </main>

      {/* Bottom Fixed Navigation Footer */}
      {!isSubmitting && (
        <footer className="sticky bottom-0 bg-white border-t border-muted/30 px-4 sm:px-8 py-4 shadow-md">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              icon={HiArrowLeft}
              className="text-xs sm:text-sm"
            >
              Previous
            </Button>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={selectedOptionIndex === null}
                icon={HiArrowRight}
                iconPosition="right"
                className="text-xs sm:text-sm"
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitQuiz}
                disabled={selectedOptionIndex === null}
                icon={HiSparkles}
                className="text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
