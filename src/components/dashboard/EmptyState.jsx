import Button from "../ui/Button";
import { HiOutlineFolderPlus, HiPlus } from "react-icons/hi2";

export default function EmptyState({ onCreateClick }) {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5 shadow-inner">
        <HiOutlineFolderPlus className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-extrabold text-brand tracking-tight mb-2">
        No Study Spaces Yet
      </h3>

      <p className="text-sm text-gray leading-relaxed mb-6">
        Upload your first lecture notes, PowerPoint slides, or PDF documents to generate an AI study suite with smart flashcards and quizzes.
      </p>

      <Button
        variant="primary"
        onClick={onCreateClick}
        className="px-6 py-3"
      >
        <HiPlus className="w-5 h-5" />
        <span>Create Your First Study Space</span>
      </Button>
    </div>
  );
}
