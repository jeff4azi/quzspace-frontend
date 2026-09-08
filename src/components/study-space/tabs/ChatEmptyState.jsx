import { HiSparkles, HiChatBubbleBottomCenterText } from "react-icons/hi2";
import SuggestedPrompt from "../SuggestedPrompt";
import { mockSuggestedPrompts } from "../../../data/mockChatMessages";

export default function ChatEmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-6 text-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4 shadow-inner">
        <HiChatBubbleBottomCenterText className="w-7 h-7" />
      </div>

      <div className="flex items-center gap-1.5 justify-center text-xs font-semibold uppercase tracking-wider text-brand mb-1">
        <HiSparkles className="w-4 h-4 text-amber-500" />
        <span>AI Study Assistant</span>
      </div>

      <h3 className="text-xl font-bold text-darker mb-2">
        Ask me anything about your material
      </h3>

      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        I can summarize chapters, test your knowledge, explain tricky concepts, or highlight high-yield exam topics.
      </p>

      <div className="w-full space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide text-left px-1">
          Suggested Prompts
        </p>
        <div className="flex flex-col gap-2">
          {mockSuggestedPrompts.map((prompt, idx) => (
            <SuggestedPrompt
              key={idx}
              prompt={prompt}
              onClick={onSelectPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
