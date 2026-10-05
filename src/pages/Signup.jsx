import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";

const PASSWORD_MIN = 6;

export default function Signup() {
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: "",
    generic: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateFullName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name is too short";
    return "";
  };
  const validateEmail = (email) => {
    if (!email) return "Email address is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Please enter a valid email address";
  };
  const validatePassword = (pw) => {
    if (!pw) return "Password is required";
    if (pw.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`;
    return "";
  };
  const validateConfirm = (confirm, pw) => {
    if (!confirm) return "Please confirm your password";
    if (confirm !== pw) return "Passwords don't match";
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name] || errors.generic) {
      setErrors((prev) => ({ ...prev, [name]: "", generic: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      setErrors((p) => ({ ...p, fullName: validateFullName(value) }));
    } else if (name === "email") {
      setErrors((p) => ({ ...p, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors((p) => ({
        ...p,
        password: validatePassword(value),
        confirmPassword:
          formData.confirmPassword
            ? validateConfirm(formData.confirmPassword, value)
            : p.confirmPassword,
      }));
    } else if (name === "confirmPassword") {
      setErrors((p) => ({
        ...p,
        confirmPassword: validateConfirm(value, formData.password),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateFullName(formData.fullName);
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
    const confirmErr = validateConfirm(
      formData.confirmPassword,
      formData.password,
    );
    const termsErr = !formData.termsAgreed ? "You must agree to the Terms" : "";

    if (nameErr || emailErr || passwordErr || confirmErr || termsErr) {
      setErrors({
        fullName: nameErr,
        email: emailErr,
        password: passwordErr,
        confirmPassword: confirmErr,
        termsAgreed: termsErr,
        generic: "",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await signup({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.fullName.trim(),
      });

      localStorage.setItem("quzspace:pending-email", formData.email.trim());
      const emailConfirmOtpRequired =
        data?.session === null || data?.user?.identities?.length === 0;

      if (emailConfirmOtpRequired) {
        navigate("/verify-otp", {
          state: {
            email: formData.email.trim(),
            mode: "signup",
            from: redirectTo,
          },
        });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      const msg = err?.message || "Couldn't create your account. Try again.";
      setErrors((p) => ({
        ...p,
        generic: /email.*already.*registered|already.*registered|unique.*email|duplicate/i.test(msg)
          ? "This email is already registered. Try logging in instead."
          : msg,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      setErrors((p) => ({ ...p, generic: err?.message || "Google sign-in failed." }));
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Turn lecture notes into personalized AI study suites. We'll email you a verification code to confirm your address."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <div className="space-y-5">
        {errors.generic && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-semibold text-rose-700">
            {errors.generic}
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
            label="Full Name"
            type="text"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Doe"
            error={errors.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            error={errors.email}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`At least ${PASSWORD_MIN} characters`}
              error={errors.password}
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

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[42px] text-muted hover:text-gray transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-muted/50 text-brand focus:ring-brand accent-brand cursor-pointer"
              />
              <span className="text-xs text-gray leading-normal">
                I agree to the{" "}
                <Link to="#" className="text-brand font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-brand font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.termsAgreed && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.termsAgreed}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!formData.termsAgreed}
            className="mt-2 py-3.5"
          >
            Create Account
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
