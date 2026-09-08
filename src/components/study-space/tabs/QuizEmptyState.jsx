import Button from "../../ui/Button";
import { HiOutlineQuestionMarkCircle, HiPlus } from "react-icons/hi2";

export default function QuizEmptyState({ onGenerateClick }) {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5 shadow-inner">
        <HiOutlineQuestionMarkCircle className="w-8 h-8 text-brand" />
      </div>

      <h3 className="text-xl font-extrabold text-brand tracking-tight mb-2">
        No Quizzes Generated Yet
      </h3>

      <p className="text-sm text-gray leading-relaxed mb-6">
        Generate custom multiple choice and short answer quizzes tailored to your uploaded study materials.
      </p>

      <Button
        variant="primary"
        onClick={onGenerateClick}
        className="px-6 py-3"
      >
        <HiPlus className="w-5 h-5" />
        <span>Generate Your First Quiz</span>
      </Button>
    </div>
  );
}
