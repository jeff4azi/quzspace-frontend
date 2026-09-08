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

  // Auto scroll to bottom
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isTyping]);

  // Handle send message
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay & assistant response
    setTimeout(() => {
      const assistantMsg = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: cannedResponses[cannedIndex % cannedResponses.length],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
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

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleRestoreMock = () => {
    setMessages(mockChatMessages);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] min-h-[580px] max-h-[760px] bg-white rounded-2xl border border-muted/30 shadow-xs overflow-hidden pb-16 lg:pb-0">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-muted/20 bg-light/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand text-light flex items-center justify-center shadow-xs">
            <HiSparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-darker">AI Study Assistant</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                Online
              </span>
            </div>
            <p className="text-xs text-gray-500">
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

      {/* Message scroll area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-light/30">
        {messages.length === 0 ? (
          <ChatEmptyState onSelectPrompt={handleSendMessage} />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-light flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <HiSparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="bg-white border border-muted/30 p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Prompt Chips (visible when there are messages) */}
      {messages.length > 0 && (
        <div className="px-4 py-2.5 border-t border-muted/15 bg-white/80 backdrop-blur-xs flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
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

      {/* Fixed Input area at bottom of tab container */}
      <div className="p-3 sm:p-4 border-t border-muted/20 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2 bg-light/60 border border-muted/30 rounded-2xl p-2 focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 transition-all shadow-2xs"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your study material... (Shift+Enter for new line)"
            className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-xs sm:text-sm text-darker placeholder-gray-400 resize-none max-h-28 py-1.5 px-2 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer
              ${
                inputValue.trim() && !isTyping
                  ? "bg-brand text-light shadow-xs hover:bg-brand/90 active:scale-95"
                  : "bg-muted/40 text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Send message"
          >
            <HiPaperAirplane className="w-4 h-4 -rotate-45 translate-x-0.5" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Simulated AI Tutor · Answers generated from study space material
        </p>
      </div>
    </div>
  );
}
