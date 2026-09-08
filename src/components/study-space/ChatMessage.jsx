import { HiSparkles } from "react-icons/hi2";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start items-start gap-2.5"}`}>
      {/* Assistant AI Avatar Icon */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-brand text-light flex items-center justify-center shrink-0 shadow-xs mt-1">
          <HiSparkles className="w-4 h-4 text-amber-300" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[78%] space-y-1">
        <div
          className={`
            p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs
            ${
              isUser
                ? "bg-brand text-light rounded-tr-xs self-end"
                : "bg-white text-brand border border-muted/30 rounded-tl-xs self-start"
            }
          `}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span
          className={`text-[10px] text-gray-400 px-1 font-medium ${
            isUser ? "text-right self-end" : "text-left self-start"
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
