import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  HiPaperAirplane,
  HiSparkles,
  HiTrash,
  HiExclamationTriangle,
} from "react-icons/hi2";
import ChatMessage from "../ChatMessage";
import SuggestedPrompt from "../SuggestedPrompt";
import ChatEmptyState from "./ChatEmptyState";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";
import { CgSpinner } from "react-icons/cg";

function normalizeMessage(m = {}, idx = 0) {
  const role = m.role === "user" ? "user" : "assistant";
  const ts = m.timestamp || m.created_at || m.sent_at;
  return {
    id: m.id || m.message_id || `msg-${idx}-${role}`,
    role,
    content: m.content || m.text || m.body || "",
    timestamp: ts
      ? (() => {
          try {
            return new Date(ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch {
            return "";
          }
        })()
      : "",
  };
}

const STATIC_SUGGESTED = [
  "Summarize the most important concepts in this material",
  "What topics am I weakest at based on my quiz history?",
  "Give me 5 practice exam questions and grade me",
  "Explain the hardest concept from the uploaded files",
];

export default function ChatTab() {
  const { id: spaceId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState(STATIC_SUGGESTED);
  const [isClearing, setIsClearing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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

  const loadMessages = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const [msgRes, promptRes] = await Promise.all([
        api.get(`/spaces/${spaceId}/chat/messages`).catch(() => []),
        api
          .get(`/spaces/${spaceId}/chat/suggested-prompts`)
          .catch(() => STATIC_SUGGESTED),
      ]);

      const msgList = Array.isArray(msgRes)
        ? msgRes
        : Array.isArray(msgRes?.messages)
        ? msgRes.messages
        : Array.isArray(msgRes?.data)
        ? msgRes.data
        : [];
      setMessages(msgList.map(normalizeMessage));

      const promptList = Array.isArray(promptRes)
        ? promptRes
        : Array.isArray(promptRes?.prompts)
        ? promptRes.prompts
        : Array.isArray(promptRes?.data)
        ? promptRes.data
        : STATIC_SUGGESTED;
      setSuggestedPrompts(promptList.slice(0, 4).length >= 3 ? promptList.slice(0, 4) : STATIC_SUGGESTED);
    } catch (err) {
      console.warn("chat load failed:", err?.message || err);
      setError({
        title: "Couldn't load your chat history",
        message: err?.message || "Retry in a moment.",
      });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const handleSendMessage = useCallback(
    async (textToSend) => {
      const text = (textToSend || inputValue).trim();
      if (!text || isTyping || loading || !spaceId) return;

      const timeString = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg = {
        id: `msg-u-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: timeString,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);
      setError(null);

      try {
        const res = await api.post(`/spaces/${spaceId}/chat/messages`, {
          content: text,
        });
        const uM = res?.userMessage ? normalizeMessage(res.userMessage) : userMsg;
        const aM = res?.assistantMessage
          ? normalizeMessage(res.assistantMessage)
          : res
          ? normalizeMessage(
              Array.isArray(res)
                ? res[res.length - 1]
                : res?.message || res,
            )
          : null;
        setMessages((prev) => {
          const base = prev.length ? [...prev] : [];
          if (base.length && base[base.length - 1].id === userMsg.id) {
            base[base.length - 1] = uM;
          } else {
            base.push(uM);
          }
          if (aM && aM.content) base.push(aM);
          return base;
        });
      } catch (err) {
        console.warn("chat send failed:", err?.message || err);
        setError({
          title: "Couldn't send your message",
          message:
            err?.status === 429
              ? "You've sent too many messages. Please wait a moment and try again."
              : err?.message || "The AI service might be busy. Try again.",
        });
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, loading, spaceId],
  );

  const handleClearChat = useCallback(async () => {
    if (!spaceId || isClearing) return;
    setIsClearing(true);
    try {
      await api.delete(`/spaces/${spaceId}/chat/messages`);
      setMessages([]);
    } catch (err) {
      console.warn("chat clear failed:", err?.message || err);
      setError({
        title: "Couldn't clear chat history",
        message: err?.message || "Try again in a moment.",
      });
    } finally {
      setIsClearing(false);
    }
  }, [spaceId, isClearing]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <>
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
                  {loading ? "Loading…" : "Online"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Answers are grounded in your uploaded study materials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                isLoading={isClearing}
                icon={HiTrash}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                Clear Chat
              </Button>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <ErrorBanner
              title={error.title}
              message={error.message}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Messages */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5 bg-light/20 min-h-96">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`chat-sk-${i}`}
                  className={`flex items-start gap-3 ${
                    i % 2 ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 max-w-md space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <ChatEmptyState
              onSelectPrompt={handleSendMessage}
              suggestedPrompts={suggestedPrompts}
            />
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
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="w-full max-w-7xl mx-auto lg:px-8">
          <div className="bg-white border border-muted/20 shadow-lg lg:rounded-t-2xl overflow-hidden">
            {/* Suggested prompts */}
            {suggestedPrompts?.length > 0 && !loading && (
              <div className="px-4 sm:px-5 pt-2.5 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-muted/10">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                  Ask:
                </span>
                {suggestedPrompts.map((prompt, idx) => (
                  <SuggestedPrompt
                    key={`${prompt}-${idx}`}
                    prompt={typeof prompt === "string" ? prompt : prompt.text || prompt.prompt || ""}
                    variant="compact"
                    onClick={handleSendMessage}
                  />
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 sm:px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSendMessage();
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
                  disabled={loading || isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || loading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    inputValue.trim() && !isTyping && !loading
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
        </div>
      </div>
    </>
  );
}
