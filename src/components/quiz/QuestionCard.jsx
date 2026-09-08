import { HiCheck } from "react-icons/hi2";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  questionData,
  questionNumber,
  totalQuestions,
  selectedOptionIndex,
  onSelectOption,
}) {
  const { question, options, topic } = questionData;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-muted/30 shadow-xs space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Topic Tag & Counter */}
      <div className="flex items-center justify-between gap-2 border-b border-muted/20 pb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/20">
          Topic: {topic}
        </span>
        <span className="text-xs font-semibold text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Question Title */}
      <h2 className="text-lg sm:text-xl font-extrabold text-darker leading-snug tracking-tight">
        {question}
      </h2>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((optionText, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const letter = OPTION_LETTERS[idx] || `${idx + 1}`;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(idx)}
              className={`
                w-full p-4 sm:p-4.5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer text-xs sm:text-sm font-medium min-h-[56px]
                ${
                  isSelected
                    ? "bg-brand text-light border-brand shadow-sm ring-2 ring-brand/20 scale-[1.005]"
                    : "bg-white text-darker border-muted/35 hover:border-brand/40 hover:bg-light/40"
                }
              `}
            >
              <div className="flex items-center gap-3.5 flex-1">
                {/* Option Letter Badge */}
                <div
                  className={`
                    w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-extrabold transition-colors
                    ${
                      isSelected
                        ? "bg-light/20 text-light"
                        : "bg-light text-gray-600 border border-muted/30"
                    }
                  `}
                >
                  {letter}
                </div>

                <span className="leading-relaxed flex-1">{optionText}</span>
              </div>

              {/* Selection Checkmark */}
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all
                  ${
                    isSelected
                      ? "bg-amber-300 text-brand border-amber-300"
                      : "border-muted/30 bg-transparent opacity-0"
                  }
                `}
              >
                <HiCheck className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
