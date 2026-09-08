import { useState } from "react";
import { 
  HiCheckCircle, 
  HiOutlineCheckCircle, 
  HiOutlineArrowPath,
  HiSparkles
} from "react-icons/hi2";

export default function FlashcardTile({ card, cardNumber, onToggleMastered }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMasteredClick = (e) => {
    e.stopPropagation();
    onToggleMastered(card.id);
  };

  return (
    <div 
      className="w-full h-72 sm:h-80 cursor-pointer select-none [perspective:1000px] group"
      onClick={handleCardClick}
    >
      <div
        className={`
          relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform
          ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
        `}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border border-muted/30 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-brand/40 transition-all flex flex-col justify-between [backface-visibility:hidden]">
          
          {/* Top Row: Card Number & Mastered Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-light text-brand border border-muted/20">
              Card {cardNumber}
            </span>

            {card.mastered ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mastered</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-muted">
                Not Mastered
              </span>
            )}
          </div>

          {/* Question Content */}
          <div className="py-2 flex-1 flex items-center justify-center text-center">
            <p className="text-sm sm:text-base font-bold text-brand leading-relaxed">
              {card.front}
            </p>
          </div>

          {/* Bottom Flip Hint */}
          <div className="pt-3 border-t border-muted/20 flex items-center justify-between text-xs text-gray-400 group-hover:text-brand transition-colors">
            <span className="font-semibold text-[11px]">Click or tap to flip</span>
            <HiOutlineArrowPath className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          </div>

        </div>

        {/* ================= BACK SIDE ================= */}
        <div className="absolute inset-0 w-full h-full bg-darker text-light rounded-2xl border border-brand/40 p-5 sm:p-6 shadow-2xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
          
          {/* Top Row: Answer Badge & Quick Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <HiSparkles className="w-3 h-3 text-amber-300" /> Answer
            </span>

            <button
              type="button"
              onClick={handleMasteredClick}
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                card.mastered
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {card.mastered ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Mastered</span>
                </>
              ) : (
                <>
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  <span>Mark Mastered</span>
                </>
              )}
            </button>
          </div>

          {/* Answer Content */}
          <div className="py-2 flex-1 flex items-center justify-center text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-200 leading-relaxed whitespace-pre-line">
              {card.back}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <button
              type="button"
              onClick={handleMasteredClick}
              className={`font-bold transition-colors ${
                card.mastered ? "text-emerald-400 hover:text-emerald-300" : "text-amber-300 hover:text-white"
              }`}
            >
              {card.mastered ? "✓ Mastered (click to unmark)" : "+ Mark as Mastered"}
            </button>

            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <HiOutlineArrowPath className="w-3.5 h-3.5" /> Flip back
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
