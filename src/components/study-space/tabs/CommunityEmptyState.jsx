import { HiUsers, HiUserPlus } from "react-icons/hi2";
import Button from "../../ui/Button";

export default function CommunityEmptyState({ onInviteClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center bg-white rounded-2xl border border-muted/30 shadow-xs max-w-lg mx-auto my-4 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shadow-inner">
        <HiUsers className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-darker">No Collaborators Yet</h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Invite classmates or study buddies to collaborate on study materials, generate quizzes together, and compare test scores.
        </p>
      </div>

      <Button
        variant="primary"
        icon={HiUserPlus}
        onClick={onInviteClick}
        className="text-xs"
      >
        Invite Collaborators
      </Button>
    </div>
  );
}
