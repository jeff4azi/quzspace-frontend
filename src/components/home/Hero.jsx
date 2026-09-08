import { Link } from "react-router-dom";
import { 
  HiArrowRight, 
  HiSparkles, 
  HiOutlineBookOpen, 
  HiOutlineLightBulb, 
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-muted/20 via-brand/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/5 border border-brand/15 text-brand text-xs sm:text-sm font-medium mb-6">
              <HiSparkles className="w-4 h-4 text-brand" />
              <span>Next-Gen AI Powered Learning Workspace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-brand tracking-tight leading-[1.15] mb-6">
              Turn your notes into an <span className="underline decoration-muted decoration-wavy underline-offset-4">interactive AI study</span> workspace.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray max-w-xl leading-relaxed mb-8">
              Upload your lecture slides, PDFs, or raw notes. QuzSpace instantly transforms them into smart summaries, custom flashcards, practice quizzes, and a 24/7 AI tutor.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-light px-7 py-3.5 rounded-xl font-semibold shadow-md hover:bg-darker transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand border border-muted/50 px-6 py-3.5 rounded-xl font-semibold hover:border-brand hover:bg-gray-50 transition-all"
              >
                <span>See how it works</span>
              </a>
            </div>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-gray">
              <span className="flex items-center gap-1.5">
                <HiOutlineCheckCircle className="w-4 h-4 text-brand" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineCheckCircle className="w-4 h-4 text-brand text-emerald-600" /> Instant PDF setup
              </span>
            </div>

          </div>

          {/* Right Column: Stylized Mock UI Card */}
          <div className="lg:col-span-6 w-full">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Decorative accent element behind browser window */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand/20 to-muted/40 rounded-2xl blur-lg opacity-70 -z-10" />

              {/* Browser Mockup Container */}
              <div className="bg-white rounded-2xl shadow-2xl border border-muted/30 overflow-hidden text-left">
                
                {/* Browser Window Header Bar */}
                <div className="bg-darker px-4 py-3 flex items-center justify-between border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400 opacity-80" />
                  </div>
                  <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-md font-mono max-w-[200px] sm:max-w-xs truncate text-center opacity-80">
                    quzspace.ai/workspace/biology-101
                  </div>
                  <div className="w-4" />
                </div>

                {/* Main App Canvas Inside Mockup */}
                <div className="p-4 sm:p-6 bg-light/50 space-y-4">
                  
                  {/* Top Bar inside App */}
                  <div className="flex items-center justify-between pb-3 border-b border-muted/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-brand uppercase tracking-wider">Biology 101 • Chapter 4</span>
                    </div>
                    <span className="text-xs bg-brand/10 text-brand px-2.5 py-0.5 rounded-full font-medium">AI Active</span>
                  </div>

                  {/* Quick Tabs Preview */}
                  <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-medium">
                    <div className="bg-white py-1.5 px-1 rounded-lg text-brand font-bold shadow-sm border border-muted/30 flex items-center justify-center gap-1">
                      <HiOutlineBookOpen className="w-3.5 h-3.5 text-brand" /> Summary
                    </div>
                    <div className="bg-gray-100/80 py-1.5 px-1 rounded-lg text-gray hover:bg-white transition-colors flex items-center justify-center gap-1">
                      <HiOutlineLightBulb className="w-3.5 h-3.5" /> Cards
                    </div>
                    <div className="bg-gray-100/80 py-1.5 px-1 rounded-lg text-gray hover:bg-white transition-colors flex items-center justify-center gap-1">
                      <HiOutlineAcademicCap className="w-3.5 h-3.5" /> Quiz
                    </div>
                    <div className="bg-gray-100/80 py-1.5 px-1 rounded-lg text-gray hover:bg-white transition-colors flex items-center justify-center gap-1">
                      <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" /> Tutor
                    </div>
                  </div>

                  {/* Active Flashcard Widget Mock */}
                  <div className="bg-white p-4 rounded-xl border border-muted/40 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray">
                      <span className="font-semibold text-brand">Flashcard 4 of 20</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Mastered</span>
                    </div>
                    <div className="py-2">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Question</p>
                      <p className="text-sm font-semibold text-brand mt-0.5">
                        What is the net ATP yield produced per glucose molecule in Glycolysis?
                      </p>
                    </div>
                    <div className="pt-2 border-t border-dashed border-muted/30 flex items-center justify-between">
                      <span className="text-xs text-brand font-medium flex items-center gap-1">
                        <HiSparkles className="w-3.5 h-3.5 text-amber-500" /> Key Exam Topic
                      </span>
                      <button className="text-xs font-semibold bg-brand text-light px-3 py-1 rounded-lg">
                        Reveal Answer
                      </button>
                    </div>
                  </div>

                  {/* AI Assistant Insight Bubble */}
                  <div className="bg-darker text-light p-3.5 rounded-xl text-xs space-y-1.5 shadow-md">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                      <HiSparkles className="w-4 h-4" />
                      <span>AI Study Tutor Suggestion</span>
                    </div>
                    <p className="text-gray-300 leading-snug">
                      "You scored 92% on ATP Synthesis! Would you like a 5-question quick quiz on Krebs Cycle next?"
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
