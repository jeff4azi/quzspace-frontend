export default function Toggle({
  id,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {label && (
        <div className="flex flex-col pr-2 select-none cursor-pointer" onClick={() => !disabled && onChange && onChange(!checked)}>
          <label htmlFor={toggleId} className="text-sm font-bold text-brand cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2
          ${checked ? "bg-brand" : "bg-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className="sr-only">{label || "Toggle setting"}</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
            transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
