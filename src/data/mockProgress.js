export const mockProgressData = {
  quizzesCompleted: 14,
  flashcardsStudied: 128,
  studyStreak: 5,
  averageScore: 84,
  quizzesTrend: "+3 this week",
  flashcardsTrend: "+32 this week",
  scoreTrend: "+14% this month",

  weeklyActivity: [
    { day: "Mon", minutes: 25, isToday: false },
    { day: "Tue", minutes: 40, isToday: false },
    { day: "Wed", minutes: 15, isToday: false },
    { day: "Thu", minutes: 55, isToday: false },
    { day: "Fri", minutes: 35, isToday: false },
    { day: "Sat", minutes: 70, isToday: false },
    { day: "Sun", minutes: 45, isToday: true },
  ],

  masteryOverTime: [
    { date: "Aug 1", masteryPercent: 35 },
    { date: "Aug 8", masteryPercent: 48 },
    { date: "Aug 15", masteryPercent: 62 },
    { date: "Aug 22", masteryPercent: 71 },
    { date: "Aug 29", masteryPercent: 78 },
    { date: "Sep 5", masteryPercent: 84 },
  ],

  motivationalHeading: "You're on a 5-Day Study Streak! 🔥",
  motivationalText:
    "Your average quiz score improved by 14% this month. You're in the top 10% of consistent learners for Computer Networks — keep up the great momentum!",
};
