import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineRectangleStack } from "react-icons/hi2";

export default function FlashcardsTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineRectangleStack}
      title="Active Recall Flashcards"
      description="Interactive flashcard decks with spaced repetition to build long-term memory."
    />
  );
}
