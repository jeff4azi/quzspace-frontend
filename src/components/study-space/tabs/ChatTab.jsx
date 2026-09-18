import { useState, useRef, useEffect } from "react";
import {
  HiPaperAirplane,
  HiSparkles,
  HiTrash,
  HiArrowPath,
} from "react-icons/hi2";
import ChatMessage from "../ChatMessage";
import SuggestedPrompt from "../SuggestedPrompt";
import ChatEmptyState from "./ChatEmptyState";
import Button from "../../ui/Button";
import {
  mockChatMessages,
  mockSuggestedPrompts,
  cannedResponses,
} from "../../../data/mockChatMessages";

export default function ChatTab() {
  const [messages, setMessages] = useState(mockChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cannedIndex, setCannedIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, []);
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: timeString,
      },
    ]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          role: "assistant",
          content: cannedResponses[cannedIndex % cannedResponses.length],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setCannedIndex((prev) => prev + 1);
      setIsTyping(false);
    }, 1300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => setMessages([]);
  const handleRestoreMock = () => setMessages(mockChatMessages);

  return (
    <>
      {/* ── Flat layout — no outer box ────────────────────────────── */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-2">
        {/* Assistant Header — sticky under the tab bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-muted/20 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-light flex items-center justify-center shadow-xs shrink-0">
              <HiSparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-darker">
                  AI Study Assistant
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Trained on 8 uploaded materials · Computer Networks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length === 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreMock}
                icon={HiArrowPath}
                className="text-xs"
              >
                Restore Sample
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetChat}
                icon={HiTrash}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                Clear Chat
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5 bg-light/20 min-h-96">
          {messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand text-light flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <HiSparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <div className="bg-white border border-muted/30 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Spacer so last message clears the fixed dock */}
        <div className="h-36 lg:h-28" aria-hidden="true" />
      </div>

      {/* ── Fixed bottom dock — always visible, viewport-locked ───── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[270px] z-50 bg-white border-t border-muted/20 shadow-lg">
        {/* Suggested prompts */}
        {messages.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 pt-2.5 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-muted/10">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Ask:
            </span>
            {mockSuggestedPrompts.map((prompt, idx) => (
              <SuggestedPrompt
                key={idx}
                prompt={prompt}
                variant="compact"
                onClick={handleSendMessage}
              />
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 bg-light/60 border border-muted/30 rounded-2xl px-3 py-2 focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 transition-all shadow-xs"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your study material... (Shift+Enter for new line)"
              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-xs sm:text-sm text-darker placeholder-gray-400 resize-none max-h-28 py-1.5 px-1 leading-relaxed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                inputValue.trim() && !isTyping
                  ? "bg-brand text-light shadow-xs hover:bg-brand/90 active:scale-95"
                  : "bg-muted/40 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <HiPaperAirplane className="w-4 h-4 -rotate-45 translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
