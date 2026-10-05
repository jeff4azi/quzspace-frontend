import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExpiredBanner, setShowExpiredBanner] = useState(
    new URLSearchParams(location.search).get("expired") === "1",
  );

  const validateEmail = (value) => {
    if (!value) return "Email address is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? "" : "Please enter a valid email address";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email.trim());
    const passwordErr = validatePassword(password);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    if (passwordErr) {
      setError(passwordErr);
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err?.message || "Couldn't sign in. Try again.";
      setError(
        /invalid.*credentials|email.*or.*password|invalid.*password/i.test(msg)
          ? "Incorrect email or password. Check your details and try again."
          : msg,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your email and password to continue studying."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
      <div className="space-y-5">
        {showExpiredBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs font-semibold text-amber-800 flex items-center gap-2">
            <span>Session expired.</span>
            <button
              type="button"
              className="ml-auto text-amber-700 hover:text-amber-900 underline"
              onClick={() => setShowExpiredBanner(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        <Button variant="google" fullWidth onClick={handleGoogle}>
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-muted/30 w-full" />
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-muted font-bold absolute">
            or use email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              if (showExpiredBanner) setShowExpiredBanner(false);
            }}
            placeholder="you@example.com"
            error={error}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[42px] text-muted hover:text-gray transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex justify-end -mt-1">
            <Link
              to="/signup"
              className="text-[11px] font-semibold text-muted/80 hover:text-brand transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-1 py-3.5"
          >
            Sign In
          </Button>
        </form>

        <p className="text-[11px] leading-relaxed text-gray/80 text-center pt-1">
          By continuing you agree to QuzSpace's{" "}
          <Link to="#" className="text-brand font-semibold hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-brand font-semibold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
