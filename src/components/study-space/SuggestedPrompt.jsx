import { HiSparkles } from "react-icons/hi2";

export default function SuggestedPrompt({ prompt, onClick, variant = "default" }) {
  const isCompact = variant === "compact";

  return (
    <button
      type="button"
      onClick={() => onClick(prompt)}
      className={`
        inline-flex items-center gap-2 rounded-full border text-xs transition-all text-left cursor-pointer
        ${
          isCompact
            ? "px-3 py-1.5 bg-white hover:bg-light border-muted/30 text-brand text-xs shadow-2xs hover:border-brand/30 shrink-0"
            : "px-4 py-2.5 bg-white hover:bg-light/80 border-muted/30 text-brand font-medium shadow-xs hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        }
      `}
    >
      <HiSparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      <span className="line-clamp-1">{prompt}</span>
    </button>
  );
}
