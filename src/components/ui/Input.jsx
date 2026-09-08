import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    rightElement,
    id,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    required = false,
    className = "",
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full flex flex-col">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-brand"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        </div>
      )}

      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3.5 py-2.5 rounded-xl border text-sm text-brand placeholder:text-muted/70 bg-white
            transition-all duration-200 outline-none
            ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/30"
                : "border-muted/40 hover:border-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
            }
            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
            ${rightElement ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center text-gray hover:text-brand transition-colors">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-gray/80 mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
