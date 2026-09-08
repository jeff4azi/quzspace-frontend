import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation rules
  const validateFullName = (name) => {
    if (!name.trim()) return "Full name is required";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear error for field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Dynamic re-validation for confirm password if main password changes
    if (name === "password" && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      setErrors((prev) => ({ ...prev, fullName: validateFullName(value) }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, formData.password),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateFullName(formData.fullName);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.confirmPassword, formData.password);
    const termsErr = !formData.termsAgreed ? "You must agree to the Terms to continue" : "";

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      setErrors({
        fullName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
        termsAgreed: termsErr,
      });
      return;
    }

    setIsLoading(true);

    // Simulate signup submission
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email !== "" &&
    formData.password.length >= 8 &&
    formData.confirmPassword === formData.password &&
    formData.termsAgreed;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Turn lecture notes into personalized AI study suites today."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name Input */}
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Doe"
            error={errors.fullName}
            required
          />

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

          {/* Password Input */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="At least 8 characters"
            helperText="Must be at least 8 characters long"
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

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter password"
            error={errors.confirmPassword}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-gray hover:text-brand transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeSlash className="w-5 h-5" />
                ) : (
                  <HiOutlineEye className="w-5 h-5" />
                )}
              </button>
            }
          />

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
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
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.termsAgreed}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid}
            className="mt-2 py-3.5"
          >
            Create Account
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
