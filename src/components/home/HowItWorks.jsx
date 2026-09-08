import StepCard from "./StepCard";
import { 
  HiOutlineDocumentPlus, 
  HiOutlineCpuChip, 
  HiOutlineAcademicCap, 
  HiOutlineChartBar 
} from "react-icons/hi2";

const stepsData = [
  {
    stepNumber: 1,
    icon: HiOutlineDocumentPlus,
    title: "Upload Materials",
    description: "Drag and drop your lecture PDFs, PowerPoint slides, textbook chapters, or raw handwritten notes into your workspace.",
  },
  {
    stepNumber: 2,
    icon: HiOutlineCpuChip,
    title: "AI Analysis",
    description: "QuzSpace parses your documents, identifying key concepts, vocabulary, complex formulas, and high-yield exam topics.",
  },
  {
    stepNumber: 3,
    icon: HiOutlineAcademicCap,
    title: "Get Study Tools",
    description: "Instantly generate concise summaries, active recall flashcard decks, and tailored interactive practice quizzes.",
  },
  {
    stepNumber: 4,
    icon: HiOutlineChartBar,
    title: "Master & Track",
    description: "Study with your 24/7 AI tutor, focus on detected weak areas, and monitor your score progress over time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-gray uppercase tracking-widest mb-3">
            Simple 4-Step Process
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight mb-4">
            How QuzSpace turns materials into mastery
          </p>
          <p className="text-base sm:text-lg text-gray">
            Stop spending hours manually creating flashcards. Let AI transform your study load in four easy steps.
          </p>
        </div>

        {/* 4-Step Grid: 4 columns on desktop, 2 on tablet, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stepsData.map((step) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
