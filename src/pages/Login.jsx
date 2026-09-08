import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email format regex check
  const validateEmail = (email) => {
    if (!email) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change if fixed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsLoading(true);

    // Simulate login request
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your personalized AI study workspace."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
      <div className="space-y-5">
        {/* Decorative Google Auth Button */}
        <Button
          variant="google"
          fullWidth
          onClick={() => alert("Google Sign-In is decorative for preview.")}
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-muted/30 w-full" />
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-muted font-bold absolute">
            or
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            error={errors.email}
            required
          />

          {/* Password Input with Forgot Password link */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-brand"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset functionality placeholder.");
                }}
                className="text-xs font-semibold text-gray hover:text-brand transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              error={errors.password}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray hover:text-brand transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2 py-3.5"
          >
            Log In
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
