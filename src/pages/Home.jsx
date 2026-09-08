import { Link } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import FeatureGrid from "../components/home/FeatureGrid";
import Footer from "../components/layout/Footer";
import { HiArrowRight, HiSparkles } from "react-icons/hi2";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-light text-gray font-sans selection:bg-brand selection:text-light">
      {/* 1. Navbar */}
      <PublicNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. How It Works Section */}
        <HowItWorks />

        {/* 4. Features Section */}
        <FeatureGrid />

        {/* 5. Final CTA Section */}
        <section className="py-20 bg-brand text-light relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light/10 text-amber-300 text-xs font-semibold mb-6">
              <HiSparkles className="w-4 h-4" />
              <span>Ready to transform your grades?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-light mb-6 leading-tight">
              Start studying smarter with QuzSpace today.
            </h2>

            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of students turning dense lecture slides and notes into effortless AI flashcards, quizzes, and summaries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-light text-brand px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-white transition-all transform hover:-translate-y-0.5"
              >
                <span>Create Your Free Workspace</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-xs text-muted/70 mt-4">
              Free plan available • No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
