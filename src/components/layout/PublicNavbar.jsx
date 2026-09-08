import { Link } from "react-router-dom";
import logo from "../../assets/Quzspace_logo.png";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-light/90 backdrop-blur-md border-b border-muted/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <img 
            src={logo} 
            alt="QuzSpace Logo" 
            className="h-9 w-auto object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-brand">
            Quz<span className="text-gray font-semibold">Space</span>
          </span>
        </Link>

        {/* Right side Auth Navigation - Flat on all screen sizes */}
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray hover:text-brand px-3 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-brand text-light px-4 py-2 rounded-lg shadow-sm hover:bg-darker transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
