import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineArrowPath,
  HiOutlineQuestionMarkCircle,
  HiTrophy,
  HiSparkles,
  HiChevronRight,
} from "react-icons/hi2";
import { mockQuizzes, mockQuizAttempts } from "../data/mockQuizzes";
import { getQuizDetailsById } from "../data/mockQuizQuestions";

export default function QuizHistory() {
  const { id: spaceId, quizId } = useParams();
  const navigate = useNavigate();

  // Find quiz data from mockQuizzes
  const quiz = mockQuizzes.find((q) => q.id === quizId) || mockQuizzes[0];
  const quizDetails = getQuizDetailsById(quizId);
  const attempts = mockQuizAttempts[quiz.id] || [];

  // Calculate average score
  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percent, 0) / attempts.length,
        )
      : null;

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-muted/30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          {/* Back Button */}
          <Link
            to={`/spaces/${spaceId || "cs-301"}?tab=quiz`}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand transition-colors shrink-0 py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-gray-100"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">
              Past Attempts
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-darker line-clamp-1">
              {quizDetails?.title || quiz.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Performance Overview Banner */}
        <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-5 sm:p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Performance Overview
          </p>

          <div className="flex items-center justify-around divide-x divide-muted/20">
            {/* Best Score */}
            <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
              <span className="text-2xl font-black text-emerald-700">
                {quiz.bestScore !== null ? `${quiz.bestScore}%` : "—"}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                Best Score
              </span>
            </div>

            {/* Average */}
            <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
              <span className="text-2xl font-black text-brand">
                {avgScore !== null ? `${avgScore}%` : "—"}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                Average
              </span>
            </div>

            {/* Total Attempts */}
            <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
              <span className="text-2xl font-black text-gray-700">
                {attempts.length}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {attempts.length === 1 ? "Attempt" : "Attempts"}
              </span>
            </div>
          </div>
        </div>

        {/* Attempt History List */}
        <div>
          <h2 className="text-base font-extrabold text-brand mb-3">
            Attempt History
          </h2>

          {attempts.length > 0 ? (
            <div className="space-y-3.5">
              {attempts.map((attempt) => {
                const isHigh = attempt.percent >= 80;
                return (
                  <div
                    key={attempt.id}
                    className="bg-white rounded-2xl border border-muted/30 shadow-xs p-4 sm:p-5"
                  >
                    {/* Top Row: Attempt badge, date, score badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                          Attempt #{attempt.attemptNumber}
                        </span>
                        {attempt.isPB && (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <HiTrophy className="w-3 h-3" />
                            Personal Best
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium">
                          {attempt.completedAt}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          isHigh
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {attempt.percent}%
                      </span>
                    </div>

                    {/* Score Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? "bg-emerald-500" : "bg-amber-400"
                          }`}
                          style={{ width: `${attempt.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta info row */}
                    <div className="flex items-center gap-4 py-2 border-t border-muted/20 mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {attempt.score} / {attempt.totalQuestions} correct
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <HiOutlineClock className="w-3.5 h-3.5 text-muted" />
                        {attempt.timeTaken}
                      </span>
                    </div>

                    {/* View Breakdown Link */}
                    <Link
                      to={`/spaces/${spaceId || "cs-301"}/quiz/${quiz.id}/results`}
                      className="flex items-center justify-between pt-2 border-t border-muted/20 text-xs font-bold text-brand hover:text-darker transition-colors group"
                    >
                      <span>View Result Breakdown</span>
                      <HiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-muted/30 shadow-xs p-10 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                <HiOutlineQuestionMarkCircle className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-sm font-bold text-brand">
                No past attempts yet
              </h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Take this quiz to record your first score and start tracking
                your progress.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-muted/30 px-4 sm:px-8 py-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/spaces/${spaceId || "cs-301"}/quiz/${quiz.id}`}
            className="w-full flex items-center justify-center gap-2 bg-brand text-light py-3.5 px-4 rounded-xl text-xs font-bold shadow-xs hover:bg-darker transition-all"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
