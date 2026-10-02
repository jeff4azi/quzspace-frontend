import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { HiOutlineArrowPath, HiOutlineSparkles } from "react-icons/hi2";
import { requestOtpSignIn, verifyOtp, googleOAuthSignIn, resendOtp } from "../lib/supabaseClient";
import { FcGoogle } from "react-icons/fc";

const OTP_DIGITS = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";
  const initialEmail = location.state?.email || localStorage.getItem("quzspace:pending-email") || "";
  const initialMode = location.state?.mode || "login";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(Array(OTP_DIGITS).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate(initialMode === "signup" ? "/signup" : "/login", { replace: true });
  }, [email, navigate, initialMode]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus?.();
  }, []);

  const handleOtpChange = (idx, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError("");
    if (digit && idx < OTP_DIGITS - 1) {
      inputRefs.current[idx + 1]?.focus?.();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus?.();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus?.();
    } else if (e.key === "ArrowRight" && idx < OTP_DIGITS - 1) {
      inputRefs.current[idx + 1]?.focus?.();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, OTP_DIGITS);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_DIGITS).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_DIGITS - 1);
    inputRefs.current[focusIdx]?.focus?.();
    if (pasted.length === OTP_DIGITS) {
      setTimeout(() => handleVerify(), 50);
    }
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length !== OTP_DIGITS) {
      setError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      const otpType = initialMode === "signup" ? "signup" : "email";
      const { session } = await verifyOtp({ email, token, type: otpType });
      if (!session) {
        if (otpType === "signup") {
          throw new Error(
            "That code didn't work. Check your email for the latest verification link.",
          );
        }
        throw new Error("No session returned. Wrong code?");
      }
      localStorage.removeItem("quzspace:pending-email");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      if (initialMode === "signup") {
        await resendOtp({ email, type: "signup" });
      } else {
        await requestOtpSignIn({ email });
      }
      setResendCountdown(30);
      setOtp(Array(OTP_DIGITS).fill(""));
      inputRefs.current[0]?.focus?.();
    } catch (err) {
      setError(err?.message || "Couldn't resend code. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleOAuthSignIn();
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
    }
  };

  return (
    <AuthLayout
      title={initialMode === "signup" ? "Confirm your email" : "Verify your email"}
      subtitle={
        initialMode === "signup"
          ? `We sent a 6-digit verification code to ${email || "your email"}. Enter it below to activate your account.`
          : `We sent a 6-digit one-time code to ${email || "your email"}. Enter it below to continue.`
      }
      footerText={`Not ${email || "your email"}?`}
      footerLinkText="Use a different email"
      footerLinkTo={initialMode === "signup" ? "/signup" : "/login"}
    >
      <div className="space-y-6">
        <Button
          variant="google"
          fullWidth
          onClick={handleGoogle}
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </Button>

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-muted/30 w-full" />
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-muted font-bold absolute">
            or enter code
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={idx === 0 ? handleOtpPaste : undefined}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                aria-label={`Digit ${idx + 1}`}
                className={`
                  w-full h-14 text-center text-2xl font-extrabold text-brand
                  rounded-xl border transition-all outline-none
                  ${error
                    ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/40"
                    : "border-muted/40 focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white"
                  }
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium text-center">{error}</p>
          )}

          <Button
            type="button"
            variant="primary"
            fullWidth
            isLoading={isVerifying}
            onClick={handleVerify}
            disabled={otp.some((d) => !d)}
            className="py-3.5"
          >
            <HiOutlineSparkles className="w-5 h-5 text-amber-300" />
            <span>Verify & Continue</span>
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isResending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineArrowPath className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              <span>
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : isResending
                  ? "Resending…"
                  : "Resend code"}
              </span>
            </button>
          </div>
        </div>

        <Link
          to={initialMode === "signup" ? "/signup" : "/login"}
          className="block text-center text-[11px] font-semibold text-muted/80 hover:text-brand transition-colors"
        >
          ← Back to {initialMode === "signup" ? "create account" : "log in"}
        </Link>
      </div>
    </AuthLayout>
  );
}
