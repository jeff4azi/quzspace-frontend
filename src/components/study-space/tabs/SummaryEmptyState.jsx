import Button from "../../ui/Button";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi2";

export default function SummaryEmptyState({ onGenerateClick }) {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-5 shadow-inner">
        <HiOutlineSparkles className="w-8 h-8 text-amber-500" />
      </div>

      <h3 className="text-xl font-extrabold text-brand tracking-tight mb-2">
        No Summary Generated Yet
      </h3>

      <p className="text-sm text-gray leading-relaxed mb-6">
        Generate a structured AI summary of your uploaded lecture slides and PDFs to get key takeaways, definitions, and exam tips.
      </p>

      <Button
        variant="primary"
        onClick={onGenerateClick}
        className="px-6 py-3"
      >
        <HiSparkles className="w-5 h-5 text-amber-400" />
        <span>Generate AI Summary</span>
      </Button>
    </div>
  );
}
