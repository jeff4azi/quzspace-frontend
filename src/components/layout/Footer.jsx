import { Link } from "react-router-dom";
import logoWhite from "../../assets/Quzspace_logo_white.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darker text-light border-t border-brand/40 pt-12 pb-28 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-8 border-b border-gray-800">
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-light mb-3">
              <img 
                src={logoWhite} 
                alt="QuzSpace Logo" 
                className="h-8 w-auto object-contain"
              />
              <span>QuzSpace</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Turn your lecture notes, PDFs, and study materials into personalized AI study suites in seconds.
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted">
            <a href="#how-it-works" className="hover:text-light transition-colors">How It Works</a>
            <a href="#features" className="hover:text-light transition-colors">Features</a>
            <Link to="/login" className="hover:text-light transition-colors">Log In</Link>
            <Link to="/signup" className="hover:text-light transition-colors">Sign Up</Link>
            <a href="#" className="hover:text-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-light transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {currentYear} QuzSpace Inc. All rights reserved.</p>
          <p className="text-gray-500">Built for modern learners and educators.</p>
        </div>
      </div>
    </footer>
  );
}
