import { usePlan } from "../../context/PlanContext";
import { HiSparkles, HiLockClosed, HiCheck } from "react-icons/hi2";

export default function DevPlanSwitcher() {
  const { userPlan, togglePlan, isFree } = usePlan();

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex items-center gap-2 bg-brand text-light p-1.5 pl-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-bold animate-in fade-in">
      <div className="flex items-center gap-1.5 text-amber-300 shrink-0">
        <HiSparkles className="w-4 h-4" />
        <span className="hidden sm:inline uppercase text-[10px] tracking-wider text-light/70">
          Dev Switch:
        </span>
      </div>

      <button
        type="button"
        onClick={togglePlan}
        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all border border-white/10 cursor-pointer"
        title="Click to toggle user plan mode for testing"
      >
        <span className={isFree ? "text-amber-300 font-extrabold" : "text-emerald-400 font-extrabold"}>
          {isFree ? "Free Tier" : "Pro Plan"}
        </span>

        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-light font-mono">
          {isFree ? "2 Quizzes Max" : "5 Quizzes Max"}
        </span>

        <span className="text-light/60 text-[10px] underline ml-1">
          Switch →
        </span>
      </button>
    </div>
  );
}
