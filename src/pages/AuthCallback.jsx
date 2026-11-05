import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { useAuth } from "../hooks/useAuth";

// Supabase puts link errors in the URL (hash or query); give it a moment to
// finish the session exchange before giving up.
const FALLBACK_TIMEOUT_MS = 8000;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();
  const [error, setError] = useState("");
  const finishedRef = useRef(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const raw =
      hash.get("error_description") ||
      query.get("error_description") ||
      hash.get("error") ||
      query.get("error");
    if (raw) {
      setError(decodeURIComponent(raw).replace(/\+/g, " "));
    }
  }, []);

  useEffect(() => {
    if (error || finishedRef.current) return;
    if (initialized && isAuthenticated) {
      finishedRef.current = true;
      navigate("/dashboard", { replace: true });
    }
  }, [error, initialized, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) return;
    const timer = setTimeout(() => {
      if (!finishedRef.current) {
        navigate("/login?expired=1", { replace: true });
      }
    }, FALLBACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-muted/30 p-8 text-center">
        {error ? (
          <>
            <h1 className="text-lg font-extrabold text-brand mb-2">
              Link expired or invalid
            </h1>
            <p className="text-sm text-gray mb-6">{error}</p>
            <Link
              to="/login"
              className="inline-block text-sm font-bold text-brand hover:underline"
            >
              Back to log in
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <CgSpinner className="w-10 h-10 text-brand animate-spin" />
            <p className="text-xs font-bold text-brand uppercase tracking-wider">
              Signing you in…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
