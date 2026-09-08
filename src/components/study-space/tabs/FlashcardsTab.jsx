import { useState } from "react";
import FlashcardTile from "../FlashcardTile";
import FlashcardStudyMode from "../FlashcardStudyMode";
import FlashcardsEmptyState from "./FlashcardsEmptyState";
import Button from "../../ui/Button";
import { mockFlashcards } from "../../../data/mockFlashcards";
import { 
  HiOutlineArrowPath, 
  HiOutlineSquares2X2, 
  HiOutlineAcademicCap 
} from "react-icons/hi2";

export default function FlashcardsTab() {
  const [cards, setCards] = useState(mockFlashcards);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "study"
  const [isRegenerating, setIsRegenerating] = useState(false);

  const masteredCount = cards.filter((c) => c.mastered).length;

  const handleToggleMastered = (cardId) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setCards(mockFlashcards);
    }, 1200);
  };

  if (!cards || cards.length === 0) {
    return <FlashcardsEmptyState onGenerateClick={handleRegenerate} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Row: Title, Count Badge, Segmented Mode Switcher & Regenerate Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-muted/20">
        
        {/* Title & Count Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight">
            Flashcards Deck
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
            {cards.length} cards · <span className="text-emerald-700">{masteredCount} mastered</span>
          </span>
        </div>

        {/* View Mode Segmented Switcher & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Segmented Mode Control */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`
                flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg transition-all
                ${
                  viewMode === "grid"
                    ? "bg-white text-brand shadow-xs"
                    : "text-gray hover:text-brand"
                }
              `}
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              <span>Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("study")}
              className={`
                flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg transition-all
                ${
                  viewMode === "study"
                    ? "bg-white text-brand shadow-xs"
                    : "text-gray hover:text-brand"
                }
              `}
            >
              <HiOutlineAcademicCap className="w-4 h-4" />
              <span>Study Mode</span>
            </button>
          </div>

          {/* Regenerate Button */}
          <Button
            variant="secondary"
            isLoading={isRegenerating}
            onClick={handleRegenerate}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            <span>Regenerate Deck</span>
          </Button>

        </div>

      </div>

      {/* Main View Area: Grid View OR Study Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <FlashcardTile
              key={card.id}
              card={card}
              cardNumber={idx + 1}
              onToggleMastered={handleToggleMastered}
            />
          ))}
        </div>
      ) : (
        <FlashcardStudyMode
          cards={cards}
          onToggleMastered={handleToggleMastered}
        />
      )}

    </div>
  );
}
