import { useState } from "react";
import Button from "../ui/Button";
import { 
  HiChevronLeft, 
  HiChevronRight, 
  HiOutlineArrowPath,
  HiCheckCircle,
  HiOutlineXMark,
  HiSparkles
} from "react-icons/hi2";

export default function FlashcardStudyMode({ cards, onToggleMastered }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cards.length - 1;

  const handlePrev = () => {
    setIsFlipped(false);
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGotIt = () => {
    if (!currentCard.mastered) {
      onToggleMastered(currentCard.id);
    }
    setTimeout(() => {
      if (!isLast) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 400);
  };

  const handleStillLearning = () => {
    if (currentCard.mastered) {
      onToggleMastered(currentCard.id);
    }
    setTimeout(() => {
      if (!isLast) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6 select-none">
      
      {/* Top Session Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-brand">
          <span>Focused Study Session</span>
          <span>Card {currentIndex + 1} of {cards.length}</span>
        </div>
        <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Centered 3D Flip Card */}
      <div
        className="w-full h-80 sm:h-96 cursor-pointer [perspective:1000px] group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`
            relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform
            ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
          `}
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-muted/30 p-6 sm:p-8 shadow-xl flex flex-col justify-between [backface-visibility:hidden]">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-light text-brand border border-muted/20">
                Card {currentIndex + 1} / {cards.length}
              </span>
              {currentCard.mastered && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <HiCheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Mastered</span>
                </span>
              )}
            </div>

            <div className="py-4 flex-1 flex items-center justify-center text-center">
              <p className="text-base sm:text-xl font-bold text-brand leading-relaxed max-w-md">
                {currentCard.front}
              </p>
            </div>

            <div className="pt-4 border-t border-muted/20 flex items-center justify-between text-xs text-gray-400 group-hover:text-brand transition-colors">
              <span className="font-semibold">Tap to reveal answer</span>
              <HiOutlineArrowPath className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
            </div>

          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 w-full h-full bg-darker text-light rounded-3xl border border-brand/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <HiSparkles className="w-3.5 h-3.5 text-amber-300" /> Answer
              </span>
              {currentCard.mastered && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <HiCheckCircle className="w-4 h-4" /> Mastered
                </span>
              )}
            </div>

            <div className="py-4 flex-1 flex items-center justify-center text-center">
              <p className="text-sm sm:text-base font-medium text-gray-200 leading-relaxed whitespace-pre-line max-w-md">
                {currentCard.back}
              </p>
            </div>

            {/* Back Side Interactive Action Buttons */}
            <div className="pt-4 border-t border-gray-800 grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleStillLearning}
                className="py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <HiOutlineXMark className="w-4 h-4" />
                <span>Still Learning</span>
              </button>

              <button
                type="button"
                onClick={handleGotIt}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <HiCheckCircle className="w-4 h-4" />
                <span>Got It!</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Controls Row */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={isFirst}
          className="px-4 py-2.5 text-xs font-bold"
        >
          <HiChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <span className="text-xs text-gray font-semibold">
          Use buttons or tap card to flip
        </span>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={isLast}
          className="px-4 py-2.5 text-xs font-bold"
        >
          <span>Next</span>
          <HiChevronRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
