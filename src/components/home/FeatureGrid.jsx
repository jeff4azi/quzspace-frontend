import FeatureCard from "./FeatureCard";
import { 
  HiOutlineDocumentText, 
  HiOutlineRectangleStack, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineExclamationTriangle, 
  HiOutlineArrowTrendingUp 
} from "react-icons/hi2";

const featuresData = [
  {
    icon: HiOutlineDocumentText,
    title: "AI Summaries",
    description: "Get key takeaways, structured outlines, and essential concepts distilled from hundreds of pages in seconds.",
    badge: "Instant",
  },
  {
    icon: HiOutlineRectangleStack,
    title: "Smart Flashcards",
    description: "Automated active-recall flashcard decks generated directly from your notes with spaced repetition support.",
    badge: "Auto-Generated",
  },
  {
    icon: HiOutlineQuestionMarkCircle,
    title: "Smart Quizzes",
    description: "Multiple choice, true/false, and short answer practice quizzes tailored to test your exam readiness.",
    badge: "Interactive",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "AI Chat Tutor",
    description: "Ask questions, request simpler explanations, or test your understanding with a contextual 24/7 AI tutor.",
    badge: "24/7 Assistant",
  },
  {
    icon: HiOutlineExclamationTriangle,
    title: "Weak Area Detection",
    description: "Smart analytics pinpoints topics you consistently struggle with so you spend study time where it matters.",
    badge: "Smart Analytics",
  },
  {
    icon: HiOutlineArrowTrendingUp,
    title: "Progress Tracking",
    description: "Visual dashboards track your mastery level, quiz scores, and study streaks over time to keep you motivated.",
    badge: "Real-Time",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-gray uppercase tracking-widest mb-3">
            All-In-One Study Platform
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight mb-4">
            Everything you need to excel in your exams
          </p>
          <p className="text-base sm:text-lg text-gray">
            Powered by artificial intelligence to make your studying more efficient, focused, and enjoyable.
          </p>
        </div>

        {/* Feature Grid: 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuresData.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
