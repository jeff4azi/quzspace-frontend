import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CgSpinner } from "react-icons/cg";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <CgSpinner className="w-10 h-10 text-brand animate-spin" />
          <p className="text-xs font-bold text-brand uppercase tracking-wider">
            Loading QuzSpace…
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (!requireAuth && isAuthenticated && (location.pathname === "/login" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
