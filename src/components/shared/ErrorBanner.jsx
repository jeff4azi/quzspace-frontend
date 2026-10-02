import { HiExclamationTriangle, HiArrowPath } from "react-icons/hi2";

export default function ErrorBanner({
  title = "Something went wrong",
  message = "We couldn't load this right now.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`bg-rose-50/60 border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-xs ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
          <HiExclamationTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="text-sm font-extrabold text-rose-900">{title}</h3>
            {message && (
              <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs"
            >
              <HiArrowPath className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
