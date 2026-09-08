import { useLocation, useParams, Link } from "react-router-dom";
import {
  HiXMark,
  HiArrowPath,
  HiCheckCircle,
  HiXCircle,
  HiAcademicCap,
  HiClock,
  HiTrophy,
} from "react-icons/hi2";
import Button from "../components/ui/Button";
import AnswerReviewItem from "../components/quiz/AnswerReviewItem";
import { mockQuizQuestions, getQuizDetailsById } from "../data/mockQuizQuestions";

export default function QuizResults() {
  const { id: spaceId, quizId } = useParams();
  const location = useLocation();

  const quizDetails = getQuizDetailsById(quizId);
  const questions = location.state?.questions || mockQuizQuestions;
  const userAnswers = location.state?.userAnswers || [1, 1, 1, 1, 1, 0, 2, 1];
  
  let score = location.state?.score;
  if (score === undefined || score === null) {
    score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx]?.correctAnswerIndex) score += 1;
    });
  }

  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  // SVG Circular Ring Calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Tiered contextual feedback message
  const getFeedbackMessage = (pct) => {
    if (pct >= 80) {
      return {
        title: "Outstanding Mastery!",
        text: "You have a solid grasp of this material. Ready for your final exam!",
        badge: "Top Performance",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    }
    if (pct >= 60) {
      return {
        title: "Great Effort!",
        text: "Good progress! A quick review of the missed questions below will push you to 100%.",
        badge: "Proficient",
        color: "text-brand bg-brand/10 border-brand/20",
      };
    }
    return {
      title: "Keep Practicing!",
      text: "Don't worry! Review the detailed explanations below to strengthen your weak topics.",
      badge: "Needs Review",
      color: "text-amber-800 bg-amber-50 border-amber-200",
    };
  };

  const feedback = getFeedbackMessage(percent);

  return (
    <div className="min-h-screen bg-light flex flex-col justify-between">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-muted/30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Quiz Results
            </span>
            <h1 className="text-sm sm:text-base font-bold text-darker line-clamp-1">
              {quizDetails.title}
            </h1>
          </div>

          <Link
            to={`/spaces/${spaceId || "cs-301"}?tab=quiz`}
            className="p-2 text-gray-400 hover:text-darker hover:bg-gray-100 rounded-xl transition-colors shrink-0"
            title="Return to Study Space"
          >
            <HiXMark className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Score Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-muted/20 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-brand fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-darker tracking-tight">
                  {percent}%
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {score} / {total}
                </span>
              </div>
            </div>

            {/* Contextual Feedback Content */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border ${feedback.color}`}
                >
                  <HiTrophy className="w-3.5 h-3.5" />
                  {feedback.badge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-darker tracking-tight">
                {feedback.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {feedback.text}
              </p>

              {/* Metric Breakdown Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center sm:justify-start text-xs font-semibold">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <HiCheckCircle className="w-4 h-4 text-emerald-600" />
                  {score} Correct
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                  <HiXCircle className="w-4 h-4 text-amber-600" />
                  {total - score} Incorrect
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-muted/20">
                  <HiClock className="w-4 h-4 text-gray-400" />
                  Completed in 3m 45s
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-muted/20">
            <Link
              to={`/spaces/${spaceId || "cs-301"}/quiz/${quizId || "quiz-1"}`}
              className="w-full sm:w-auto flex-1"
            >
              <Button
                variant="outline"
                size="md"
                icon={HiArrowPath}
                className="w-full justify-center text-xs sm:text-sm"
              >
                Retake Quiz
              </Button>
            </Link>

            <Link
              to={`/spaces/${spaceId || "cs-301"}?tab=quiz`}
              className="w-full sm:w-auto flex-1"
            >
              <Button
                variant="primary"
                size="md"
                icon={HiAcademicCap}
                className="w-full justify-center text-xs sm:text-sm"
              >
                Back to Study Space
              </Button>
            </Link>
          </div>
        </div>

        {/* Answer Breakdown Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-1 uppercase tracking-wider">
            <span>Detailed Answer Breakdown</span>
            <span>{questions.length} Questions</span>
          </div>

          <div className="space-y-3.5">
            {questions.map((q, idx) => (
              <AnswerReviewItem
                key={q.id || idx}
                questionData={q}
                questionIndex={idx}
                userAnswerIndex={userAnswers[idx]}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
