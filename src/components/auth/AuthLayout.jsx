import { Link } from "react-router-dom";
import PublicNavbar from "../layout/PublicNavbar";
import Footer from "../layout/Footer";
import logo from "../../assets/Quzspace_logo.png";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light text-gray font-sans selection:bg-brand selection:text-light">
      {/* Navbar */}
      <PublicNavbar />

      {/* Main Centered Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Main Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-muted/30 p-6 sm:p-8">
            
            {/* Header Section: Logo + Title + Subtext */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
                <img
                  src={logo}
                  alt="QuzSpace Logo"
                  className="h-10 w-auto mx-auto object-contain"
                />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            {children}

            {/* Footer switch link */}
            {footerText && footerLinkTo && (
              <div className="mt-8 pt-6 border-t border-muted/20 text-center text-sm text-gray">
                {footerText}{" "}
                <Link
                  to={footerLinkTo}
                  className="font-bold text-brand hover:underline transition-all"
                >
                  {footerLinkText}
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
