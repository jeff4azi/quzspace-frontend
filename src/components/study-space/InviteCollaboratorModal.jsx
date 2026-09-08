import { useState } from "react";
import { HiXMark, HiUserPlus, HiCheckCircle, HiEnvelope } from "react-icons/hi2";
import Button from "../ui/Button";

export default function InviteCollaboratorModal({ isOpen, onClose, onInviteSent }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collaborator");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || isSending) return;

    setIsSending(true);
    setSuccessMessage("");

    setTimeout(() => {
      setIsSending(false);
      setSuccessMessage(`Invite sent to ${email}!`);
      
      if (onInviteSent) {
        onInviteSent({
          id: `collab-${Date.now()}`,
          name: email.split("@")[0],
          avatarInitials: email.substring(0, 2).toUpperCase(),
          avatarColor: "bg-brand",
          role: role,
          joinedDate: "Just invited",
          email: email,
          quizzesTaken: 0,
          flashcardsReviewed: 0,
          avgScore: 0,
        });
      }

      setTimeout(() => {
        setEmail("");
        setSuccessMessage("");
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-darker/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-muted/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted/20 bg-light/50">
          <div className="flex items-center gap-2 text-brand">
            <HiUserPlus className="w-5 h-5" />
            <h3 className="text-base font-bold text-darker">Invite Collaborator</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-darker rounded-xl transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMessage ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in">
              <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-darker uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <HiEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. classmate@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-light/60 border border-muted/30 rounded-xl text-xs sm:text-sm text-darker placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-darker uppercase tracking-wider">
                  Permission Access
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-light/60 border border-muted/30 rounded-xl text-xs sm:text-sm text-darker focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                >
                  <option value="collaborator">Collaborator (Can Edit & Create Materials)</option>
                  <option value="visitor">Viewer (Can View & Take Quizzes)</option>
                </select>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                Collaborators receive an email invitation to view and edit files, summaries, flashcards, and quizzes in this Study Space.
              </p>
            </>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              type="button"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSending}
              disabled={!email.trim() || isSending}
              icon={HiUserPlus}
              className="text-xs"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
