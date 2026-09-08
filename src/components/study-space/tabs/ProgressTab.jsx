import {
  HiAcademicCap,
  HiSparkles,
  HiFire,
  HiChartBar,
  HiOutlineSparkles,
  HiArrowTrendingUp,
} from "react-icons/hi2";
import StatCard from "../StatCard";
import ActivityChart from "../ActivityChart";
import MasteryTrendChart from "../MasteryTrendChart";
import { mockProgressData } from "../../../data/mockProgress";

export default function ProgressTab() {
  const {
    quizzesCompleted,
    flashcardsStudied,
    studyStreak,
    averageScore,
    quizzesTrend,
    flashcardsTrend,
    scoreTrend,
    weeklyActivity,
    masteryOverTime,
    motivationalHeading,
    motivationalText,
  } = mockProgressData;

  const statCardsConfig = [
    {
      label: "Quizzes Completed",
      value: quizzesCompleted,
      trend: quizzesTrend,
      icon: HiAcademicCap,
      isHighlight: false,
    },
    {
      label: "Flashcards Studied",
      value: flashcardsStudied,
      trend: flashcardsTrend,
      icon: HiSparkles,
      isHighlight: false,
    },
    {
      label: "Study Streak",
      value: `${studyStreak} Days`,
      trend: "Personal Best!",
      icon: HiFire,
      isHighlight: true,
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      trend: scoreTrend,
      icon: HiChartBar,
      isHighlight: false,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-darker flex items-center gap-2">
            <HiArrowTrendingUp className="w-5 h-5 text-brand" />
            Your Progress
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Track how you're mastering this study space over time.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            On Track for A Grade
          </span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsConfig.map((card, idx) => (
          <StatCard
            key={idx}
            icon={card.icon}
            label={card.label}
            value={card.value}
            trend={card.trend}
            isHighlight={card.isHighlight}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart data={weeklyActivity} />
        <MasteryTrendChart data={masteryOverTime} />
      </div>

      {/* Motivational Callout Banner (Matching Exam Tips callout style) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-300/40 p-5 sm:p-6 rounded-2xl space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-darker font-bold text-sm sm:text-base">
          <HiFire className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
          <h3>{motivationalHeading}</h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-7">
          {motivationalText}
        </p>
      </div>
    </div>
  );
}
