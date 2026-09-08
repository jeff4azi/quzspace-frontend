import { useState } from "react";
import {
  HiCheckCircle,
  HiXCircle,
  HiChevronDown,
  HiChevronUp,
  HiSparkles,
} from "react-icons/hi2";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function AnswerReviewItem({ questionData, questionIndex, userAnswerIndex }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { question, options, correctAnswerIndex, topic, explanation } = questionData;
  const isCorrect = userAnswerIndex === correctAnswerIndex;
  const userOptionText = userAnswerIndex !== null ? options[userAnswerIndex] : "No answer selected";
  const correctOptionText = options[correctAnswerIndex];

  return (
    <div
      className={`
        bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs
        ${
          isCorrect
            ? "border-emerald-200 hover:border-emerald-300"
            : "border-amber-200 hover:border-amber-300"
        }
      `}
    >
      {/* Header Row */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none bg-white hover:bg-light/30 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          {/* Result Icon */}
          <div className="mt-0.5 shrink-0">
            {isCorrect ? (
              <HiCheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <HiXCircle className="w-6 h-6 text-amber-500" />
            )}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Question {questionIndex + 1}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                {topic}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {isCorrect ? "Correct (+1)" : "Incorrect"}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-darker leading-snug">
              {question}
            </h4>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-gray-400 hover:text-darker rounded-lg shrink-0 mt-0.5"
        >
          {isExpanded ? (
            <HiChevronUp className="w-5 h-5" />
          ) : (
            <HiChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 border-t border-muted/20 bg-light/20 space-y-3 text-xs sm:text-sm">
          {/* Options Breakdown */}
          <div className="space-y-2">
            {options.map((optText, idx) => {
              const isSelectedByUser = idx === userAnswerIndex;
              const isActualCorrect = idx === correctAnswerIndex;
              const letter = OPTION_LETTERS[idx];

              let borderBgStyle = "bg-white border-muted/20 text-gray-600";
              if (isActualCorrect) {
                borderBgStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
              } else if (isSelectedByUser && !isCorrect) {
                borderBgStyle = "bg-amber-50 border-amber-300 text-amber-900 font-semibold";
              }

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${borderBgStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-white/80 border border-muted/30 flex items-center justify-center font-bold text-[10px] text-gray-600 shrink-0">
                      {letter}
                    </span>
                    <span>{optText}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-bold">
                    {isActualCorrect && (
                      <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Correct Answer
                      </span>
                    )}
                    {isSelectedByUser && !isCorrect && (
                      <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        Your Choice
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          {explanation && (
            <div className="p-3.5 rounded-xl bg-white border border-muted/30 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-brand font-bold">
                <HiSparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Explanation</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
