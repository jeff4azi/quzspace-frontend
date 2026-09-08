import { CgSpinner } from "react-icons/cg";

export default function Button({
  children,
  variant = "primary", // "primary" | "secondary" | "google"
  type = "button",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl text-sm transition-all duration-200 outline-none active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary:
      "bg-brand text-light shadow-md hover:bg-darker focus:ring-2 focus:ring-brand/40",
    secondary:
      "bg-white border border-muted/50 text-brand hover:border-brand hover:bg-gray-50 focus:ring-2 focus:ring-brand/20",
    google:
      "bg-white border border-muted/40 text-brand shadow-sm hover:bg-gray-50 hover:border-muted/80 focus:ring-2 focus:ring-brand/20",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const paddingStyle = "px-5 py-3";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${widthStyle} ${paddingStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <CgSpinner className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
