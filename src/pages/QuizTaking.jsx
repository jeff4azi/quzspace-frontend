import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  HiXMark,
  HiArrowLeft,
  HiArrowRight,
  HiSparkles,
  HiExclamationTriangle,
} from "react-icons/hi2";
import QuestionCard from "../components/quiz/QuestionCard";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/shared/ErrorBanner";
import api from "../lib/api";
import { CgSpinner } from "react-icons/cg";

function normalizeQuestions(resp = {}) {
  const list = Array.isArray(resp)
    ? resp
    : Array.isArray(resp?.questions)
    ? resp.questions
    : Array.isArray(resp?.data)
    ? resp.data
    : [];
  return list.map((q, idx) => ({
    id: q.id || q.question_id || `q-${idx}`,
    question: q.question || q.text || q.prompt || "",
    options:
      Array.isArray(q.options)
        ? q.options
        : [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
    topic: q.topic || null,
    explanation: q.explanation || null,
    correctAnswerIndex:
      typeof q.correct_answer_index === "number"
        ? q.correct_answer_index
        : typeof q.correctAnswerIndex === "number"
        ? q.correctAnswerIndex
        : null,
  }));
}

function normalizeQuizMeta(resp = {}, fallbackQuizId) {
  const q = resp?.quiz || resp;
  return {
    id: q.id || q.quiz_id || fallbackQuizId,
    title:
      q.title ||
      `Custom ${q.difficulty || ""} Quiz (${q.question_count || 10} Qs)`,
    difficulty: q.difficulty || "Mixed",
    questionCount: q.question_count || q.questionCount || 0,
  };
}

export default function QuizTaking() {
  const { id: spaceId, quizId } = useParams();
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState({ id: quizId, title: "Loading Quiz…", questionCount: 0 });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const loadQuizForTaking = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    try {
      const [metaRes, takeRes] = await Promise.all([
        api.get(`/quizzes/${quizId}`).catch(() => ({ id: quizId })),
        api.get(`/quizzes/${quizId}/take`),
      ]);
      const meta = normalizeQuizMeta(metaRes, quizId);
      const qs = normalizeQuestions(takeRes);
      setQuizDetails({
        ...meta,
        questionCount: meta.questionCount || qs.length,
      });
      setQuestions(qs);
      setUserAnswers(Array(qs.length).fill(null));
    } catch (err) {
      console.warn("quiz take load failed:", err?.message || err);
      setError({
        title: "Couldn't load this quiz",
        message:
          err?.status === 403
            ? "You don't have permission to take this quiz."
            : err?.status === 404
            ? "This quiz no longer exists."
            : err?.message || "Retry in a moment.",
      });
      setQuestions([]);
    } finally {
      setLoading(true);
      setTimeout(() => setLoading(false), 50);
    }
  }, [quizId, reloadKey]);

  useEffect(() => {
    void loadQuizForTaking();
  }, [loadQuizForTaking]);

  const currentQuestion = questions[currentIndex] || {
    question: "",
    options: [],
  };
  const selectedOptionIndex = userAnswers[currentIndex];
  const progressPercent =
    totalQuestions > 0
      ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
      : 0;
  const answeredCount = userAnswers.filter((a) => a !== null).length;

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

  const handleSubmitQuiz = async () => {
    if (!quizId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const answersPayload = questions.map((q, idx) => ({
        questionId: q.id,
        optionIndex:
          typeof userAnswers[idx] === "number" ? userAnswers[idx] : null,
      }));

      const res = await api.post(`/quizzes/${quizId}/submit`, {
        answers: answersPayload,
      });

      const graded = res?.data || res || {};
      const gradedQuestions =
        Array.isArray(graded?.review)
          ? graded.review
          : Array.isArray(graded?.questions)
          ? graded.questions
          : Array.isArray(graded?.answers)
          ? graded.answers
          : [];

      const mergedQuestions = questions.map((q, idx) => {
        const rev = gradedQuestions[idx] || {};
        return {
          ...q,
          correctAnswerIndex:
            typeof rev.correctAnswerIndex === "number"
              ? rev.correctAnswerIndex
              : typeof rev.correct_answer_index === "number"
              ? rev.correct_answer_index
              : q.correctAnswerIndex,
          explanation: rev.explanation || q.explanation || "",
          isCorrect:
            typeof rev.isCorrect === "boolean"
              ? rev.isCorrect
              : typeof rev.is_correct === "boolean"
              ? rev.is_correct
              : rev.userAnswerIndex === rev.correctAnswerIndex ||
                rev.user_answer_index === rev.correct_answer_index,
          userAnswerIndex:
            typeof rev.userAnswerIndex === "number"
              ? rev.userAnswerIndex
              : typeof rev.user_answer_index === "number"
              ? rev.user_answer_index
              : userAnswers[idx],
        };
      });

      navigate(`/spaces/${spaceId || "general"}/quiz/${quizId}/results`, {
        state: {
          questions: mergedQuestions,
          userAnswers: mergedQuestions.map((q) => q.userAnswerIndex),
          score:
            typeof graded.score === "number"
              ? graded.score
              : typeof graded.correct === "number"
              ? graded.correct
              : mergedQuestions.filter((q) => q.isCorrect).length,
          total:
            typeof graded.total === "number"
              ? graded.total
              : mergedQuestions.length,
          percent:
            typeof graded.percent === "number"
              ? graded.percent
              : typeof graded.score_percent === "number"
              ? graded.score_percent
              : null,
          quizTitle: quizDetails.title,
          timeTakenMs: graded.timeTakenMs || graded.time_taken_ms,
        },
      });
    } catch (err) {
      console.warn("quiz submit failed:", err?.message || err);
      setSubmitError(
        err?.message || "Couldn't grade your quiz. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-muted/30 shadow-md p-8 sm:p-10 max-w-md w-full text-center space-y-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto">
            <CgSpinner className="w-7 h-7 animate-spin" />
          </div>
          <h3 className="text-lg font-extrabold text-darker">Loading your quiz…</h3>
          <p className="text-xs text-gray-500">Fetching questions and preparing exam mode.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full">
          <ErrorBanner
            title={error.title}
            message={error.message}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
          <div className="mt-4 flex justify-center">
            <Link
              to={`/spaces/${spaceId || "general"}?tab=quiz`}
              className="text-xs font-bold text-brand hover:text-darker transition-colors"
            >
              ← Back to Quizzes list
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Question {currentIndex + 1} of {totalQuestions} · {answeredCount} answered
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
            to={`/spaces/${spaceId || "general"}?tab=quiz`}
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

      {/* Submit Error Banner */}
      {submitError && (
        <div className="px-4 sm:px-8 pt-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
              <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-rose-900">Submit failed</p>
                <p className="text-[11px] text-rose-700/80 mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {isSubmitting ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-muted/30 shadow-md text-center space-y-4 max-w-md mx-auto my-auto animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-inner">
              <HiSparkles className="w-7 h-7 text-brand animate-spin" />
            </div>
            <h3 className="text-xl font-extrabold text-darker">Scoring Your Quiz</h3>
            <p className="text-xs text-gray-500">
              Analyzing answers and compiling topic feedback…
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
      {!isSubmitting && totalQuestions > 0 && (
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
