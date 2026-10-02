import { useState } from "react";
import { HiXMark, HiUserPlus, HiCheckCircle, HiEnvelope, HiExclamationTriangle } from "react-icons/hi2";
import Button from "../ui/Button";
import api from "../../lib/api";

function computeInitials(name = "", email = "") {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  if (/@/.test(source)) {
    return source.split("@")[0].slice(0, 2).toUpperCase();
  }
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-brand",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-blue-600",
];

function pickAvatarColor(idOrEmail = "") {
  let sum = 0;
  const s = String(idOrEmail);
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length] || "bg-brand";
}

export default function InviteCollaboratorModal({
  isOpen,
  onClose,
  onInviteSent,
  spaceId,
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collaborator");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isSending) return;

    setIsSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!spaceId) {
        throw new Error("Study space is not loaded.");
      }

      const payload = await api.post(`/spaces/${spaceId}/collaborators`, {
        email: email.trim(),
        role,
      });

      const result = payload || {};
      const collaborator = result.collaborator || result.data || result;

      const norm = {
        id: collaborator?.id || collaborator?.user_id || `collab-${Date.now()}`,
        name: collaborator?.full_name || collaborator?.name || email.split("@")[0],
        avatarInitials:
          collaborator?.avatar_initials ||
          collaborator?.avatarInitials ||
          computeInitials(collaborator?.full_name || collaborator?.name || "", email),
        avatarColor: collaborator?.avatar_color || collaborator?.avatarColor || pickAvatarColor(email),
        role: collaborator?.role || role,
        joinedDate: collaborator?.invited_at || collaborator?.joined_at || collaborator?.joinedDate || "Just invited",
        email: collaborator?.email || email,
        quizzesTaken: typeof collaborator?.quizzes_taken === "number" ? collaborator.quizzes_taken : 0,
        flashcardsReviewed: typeof collaborator?.flashcards_reviewed === "number" ? collaborator.flashcards_reviewed : 0,
        avgScore: typeof collaborator?.avg_score === "number" ? Math.round(collaborator.avg_score) : 0,
      };

      setSuccessMessage(`Invite sent to ${email}!`);

      if (onInviteSent) {
        onInviteSent(norm);
      }

      setTimeout(() => {
        setEmail("");
        setSuccessMessage("");
        onClose();
      }, 1400);
    } catch (err) {
      console.warn("collaborator invite failed:", err?.message || err);
      const status = err?.status;
      const code = err?.code;
      let msg = err?.message || "Couldn't send invite. Try again.";
      if (status === 404 || code === "USER_NOT_FOUND") {
        msg = "No QuzSpace user found with that email. Ask them to create an account first, or share the public link instead.";
      } else if (status === 409 || code === "ALREADY_INVITED") {
        msg = "This person is already a collaborator on this space.";
      } else if (status === 403) {
        msg = "You don't have permission to invite collaborators in this space.";
      } else if (status === 429) {
        msg = "Too many invites sent recently. Wait a moment and try again.";
      }
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-darker/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-muted/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMessage ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in">
              <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-semibold animate-in fade-in">
                  <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
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
              disabled={!email.trim() || isSending || !!successMessage}
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
