import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiUserPlus, HiUsers, HiLink, HiUserGroup } from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";
import CommunityMemberRow from "../CommunityMemberRow";
import CommunityEmptyState from "./CommunityEmptyState";
import InviteCollaboratorModal from "../InviteCollaboratorModal";
import Leaderboard from "../Leaderboard";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api, { fetchWithIdempotency } from "../../../lib/api";

const AVATAR_COLORS = [
  "bg-brand",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-blue-600",
  "bg-teal-600",
  "bg-indigo-600",
];

function pickAvatarColor(idOrEmail = "") {
  let sum = 0;
  const s = String(idOrEmail);
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length] || "bg-brand";
}

function computeInitials(name = "", email = "") {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  if (/@/.test(source)) {
    return source
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase();
  }
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeCollaborator(c = {}, idx = 0) {
  const name = c.full_name || c.name || c.email || "Collaborator";
  const email = c.email || "";
  return {
    id: c.id || c.user_id || `collab-${idx}-${email.slice(0, 6)}`,
    name,
    avatarInitials: c.avatar_initials || c.avatarInitials || computeInitials(name, email),
    avatarColor: c.avatar_color || c.avatarColor || pickAvatarColor(c.id || email || name),
    role: c.role || "collaborator",
    joinedDate: c.joined_at || c.invited_at || c.joinedDate || "Joined recently",
    email,
    quizzesTaken: typeof c.quizzes_taken === "number" ? c.quizzes_taken : typeof c.quizzesTaken === "number" ? c.quizzesTaken : 0,
    flashcardsReviewed:
      typeof c.flashcards_reviewed === "number"
        ? c.flashcards_reviewed
        : typeof c.flashcardsReviewed === "number"
        ? c.flashcardsReviewed
        : 0,
    avgScore:
      typeof c.avg_score === "number"
        ? Math.round(c.avg_score)
        : typeof c.avgScore === "number"
        ? Math.round(c.avgScore)
        : 0,
  };
}

function normalizeVisitor(v = {}, idx = 0) {
  const name = v.full_name || v.name || v.email || "Visitor";
  const email = v.email || "";
  return {
    id: v.id || v.user_id || v.visitor_id || `visitor-${idx}-${email.slice(0, 6)}`,
    name,
    avatarInitials: v.avatar_initials || v.avatarInitials || computeInitials(name, email),
    avatarColor: v.avatar_color || v.avatarColor || pickAvatarColor(v.id || email || name),
    role: v.role || "visitor",
    firstVisited: v.first_visited || v.firstVisited || v.joined_at || "Visited recently",
    quizzesTaken: typeof v.quizzes_taken === "number" ? v.quizzes_taken : typeof v.quizzesTaken === "number" ? v.quizzesTaken : 0,
    flashcardsReviewed:
      typeof v.flashcards_reviewed === "number"
        ? v.flashcards_reviewed
        : typeof v.flashcardsReviewed === "number"
        ? v.flashcardsReviewed
        : 0,
    avgScore:
      typeof v.avg_score === "number"
        ? Math.round(v.avg_score)
        : typeof v.avgScore === "number"
        ? Math.round(v.avgScore)
        : 0,
  };
}

function normalizeLeaderboardEntry(e = {}, idx = 0) {
  const name = e.full_name || e.name || e.email || "Learner";
  const email = e.email || "";
  return {
    id: e.id || e.user_id || `lb-${idx}-${email.slice(0, 6)}`,
    name,
    avatarInitials: e.avatar_initials || e.avatarInitials || computeInitials(name, email),
    avatarColor: e.avatar_color || e.avatarColor || pickAvatarColor(e.id || email || name),
    role: e.role || "learner",
    bestScore:
      typeof e.best_score === "number"
        ? Math.round(e.best_score)
        : typeof e.bestScore === "number"
        ? Math.round(e.bestScore)
        : typeof e.avg_score === "number"
        ? Math.round(e.avg_score)
        : 0,
    quizzesTaken: typeof e.quizzes_taken === "number" ? e.quizzes_taken : typeof e.quizzesTaken === "number" ? e.quizzesTaken : 0,
    flashcardsReviewed:
      typeof e.flashcards_reviewed === "number"
        ? e.flashcards_reviewed
        : typeof e.flashcardsReviewed === "number"
        ? e.flashcardsReviewed
        : 0,
    isCurrentUser: !!e.is_current_user || !!e.isCurrentUser,
  };
}

function MemberRowSkeleton({ keySeed = 0 }) {
  return (
    <div
      key={`sk-member-${keySeed}`}
      className="bg-white p-4 rounded-2xl border border-muted/30 shadow-2xs animate-pulse"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-5 w-14 bg-gray-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-muted/30 p-5 sm:p-6 shadow-xs space-y-5 animate-pulse">
      <div className="flex items-center justify-between gap-2 border-b border-muted/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10" />
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="space-y-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`lb-sk-${i}`}
            className="p-3 rounded-2xl border border-muted/20 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-6 h-6 rounded-full bg-gray-100" />
              <div className="w-8 h-8 rounded-xl bg-gray-100" />
              <div className="h-4 w-28 bg-gray-100 rounded flex-1" />
            </div>
            <div className="h-4 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunityTab() {
  const { id: spaceId } = useParams();

  const [collaborators, setCollaborators] = useState([]);
  const [linkTakers, setLinkTakers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareState, setShareState] = useState({
    isLoading: false,
    shareUrl: "",
    shareCode: "",
    shareEnabled: false,
    toast: "",
  });

  const loadCommunity = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/spaces/${spaceId}/community`);
      const payload = res && typeof res === "object" ? res : {};
      const rawCollabs = Array.isArray(payload.collaborators)
        ? payload.collaborators
        : Array.isArray(payload.data?.collaborators)
        ? payload.data.collaborators
        : [];
      const rawVisitors = Array.isArray(payload.visitors)
        ? payload.visitors
        : Array.isArray(payload.link_takers)
        ? payload.link_takers
        : Array.isArray(payload.data?.visitors)
        ? payload.data.visitors
        : [];
      const rawLeaderboard = Array.isArray(payload.leaderboard)
        ? payload.leaderboard
        : Array.isArray(payload.data?.leaderboard)
        ? payload.data.leaderboard
        : [];

      const normCollabs = rawCollabs.map(normalizeCollaborator);
      const normVisitors = rawVisitors.map(normalizeVisitor);
      const lbRaw =
        rawLeaderboard.length > 0
          ? rawLeaderboard
          : [
              ...normCollabs.map((c) => ({
                ...c,
                bestScore: c.avgScore,
                role: c.role,
              })),
              ...normVisitors.map((v) => ({
                ...v,
                bestScore: v.avgScore,
                role: v.role,
              })),
            ];
      const normLB = lbRaw
        .map(normalizeLeaderboardEntry)
        .sort((a, b) => b.bestScore - a.bestScore);

      const me = normLB.find((e) => e.isCurrentUser);
      setCurrentUserId(me?.id || null);
      setCollaborators(normCollabs);
      setLinkTakers(normVisitors);
      setLeaderboard(normLB);

      if (payload.share) {
        setShareState((s) => ({
          ...s,
          shareEnabled: !!payload.share.enabled,
          shareCode: payload.share.share_code || payload.share.code || "",
          shareUrl: payload.share.share_url || payload.share.url || "",
        }));
      }
    } catch (err) {
      console.warn("community load failed:", err?.message || err);
      const status = err?.status;
      setError({
        title: "Couldn't load community",
        message:
          status === 403
            ? "You don't have permission to view collaborators in this space."
            : err?.message || "Try again in a moment.",
      });
      setCollaborators([]);
      setLinkTakers([]);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    void loadCommunity();
  }, [loadCommunity]);

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  const handleInviteSent = useCallback((newCollaborator) => {
    const norm = normalizeCollaborator(newCollaborator, Date.now());
    setCollaborators((prev) => [norm, ...prev]);
  }, []);

  const handleToggleShare = useCallback(async () => {
    if (!spaceId) return;
    setShareState((s) => ({ ...s, isLoading: true, toast: "" }));
    try {
      if (shareState.shareEnabled) {
        await api.delete(`/spaces/${spaceId}/share`);
        setShareState((s) => ({
          ...s,
          isLoading: false,
          shareEnabled: false,
          shareUrl: "",
          shareCode: "",
          toast: "Public access revoked.",
        }));
      } else {
        const resp = await fetchWithIdempotency(`/spaces/${spaceId}/share`, {
          filesVisible: true,
        });
        const payload = resp || {};
        const code = payload.share_code || payload.code || shareState.shareCode;
        const url =
          payload.share_url ||
          payload.url ||
          (code
            ? `${window.location.origin}/s/${code}`
            : "");
        setShareState((s) => ({
          ...s,
          isLoading: false,
          shareEnabled: true,
          shareCode: code,
          shareUrl: url,
          toast: url ? "Share link copied!" : "Share link created!",
        }));
        if (url && navigator?.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(url);
          } catch (_) {
            /* clipboard fail, still show toast created */
          }
        }
      }
      setTimeout(() => setShareState((s) => ({ ...s, toast: "" })), 3500);
    } catch (err) {
      console.warn("share toggle failed:", err?.message || err);
      setShareState((s) => ({
        ...s,
        isLoading: false,
        toast: "Couldn't update share settings. Try again.",
      }));
      setTimeout(() => setShareState((s) => ({ ...s, toast: "" })), 3500);
    }
  }, [spaceId, shareState.shareEnabled, shareState.shareCode]);

  const handleCopyLink = useCallback(async () => {
    if (!shareState.shareUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareState.shareUrl);
      }
      setShareState((s) => ({ ...s, toast: "Link copied to clipboard!" }));
      setTimeout(() => setShareState((s) => ({ ...s, toast: "" })), 3500);
    } catch (_) {
      setShareState((s) => ({ ...s, toast: "Couldn't copy link." }));
      setTimeout(() => setShareState((s) => ({ ...s, toast: "" })), 3500);
    }
  }, [shareState.shareUrl]);

  const totalMembers = collaborators.length + linkTakers.length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs animate-pulse">
          <div className="space-y-2 w-full sm:w-2/3">
            <div className="h-6 w-56 bg-gray-100 rounded" />
            <div className="h-4 w-4/5 bg-gray-100 rounded" />
          </div>
          <div className="h-9 w-40 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-3">
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              <MemberRowSkeleton keySeed={0} />
              <MemberRowSkeleton keySeed={1} />
            </section>
            <section className="space-y-3 pt-4 border-t border-muted/20">
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              <MemberRowSkeleton keySeed={2} />
              <MemberRowSkeleton keySeed={3} />
            </section>
          </div>
          <div className="lg:col-span-1 sticky top-20">
            <LeaderboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {shareState.toast && (
        <div className="fixed top-4 right-4 z-50 bg-brand text-light px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CgSpinner className={shareState.isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          <span>{shareState.toast}</span>
        </div>
      )}

      {error && (
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-muted/30 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-darker flex items-center gap-2">
              <HiUsers className="w-5 h-5 text-brand" />
              Community & Collaborators
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/20">
              {totalMembers + 1} total members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Everyone learning, generating quizzes, and revising materials in this space.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row shrink-0 gap-2">
          <Button
            variant={shareState.shareEnabled ? "outline" : "ghost"}
            onClick={shareState.shareUrl && shareState.shareEnabled ? handleCopyLink : handleToggleShare}
            isLoading={shareState.isLoading}
            icon={HiLink}
            className="text-xs font-bold"
          >
            {shareState.shareEnabled
              ? shareState.shareUrl
                ? "Copy Invite Link"
                : "Revoke Share Link"
              : "Enable Public Link"}
          </Button>
          <Button
            variant="primary"
            icon={HiUserPlus}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto text-xs sm:text-sm font-bold"
          >
            Invite Collaborators
          </Button>
        </div>
      </div>

      <InviteCollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInviteSent={handleInviteSent}
        spaceId={spaceId}
      />

      {totalMembers === 0 ? (
        <CommunityEmptyState onInviteClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-darker flex items-center gap-2">
                  <HiUserGroup className="w-4 h-4 text-brand" />
                  <span>Invited Collaborators</span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({collaborators.length})
                  </span>
                </h3>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Full Access
                </span>
              </div>

              <div className="space-y-3">
                {collaborators.length === 0 ? (
                  <div className="text-xs text-gray-400 italic p-3">
                    No invited collaborators yet. Invite people by email to edit this space.
                  </div>
                ) : (
                  collaborators.map((member) => (
                    <CommunityMemberRow key={member.id} member={member} />
                  ))
                )}
              </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-muted/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-darker flex items-center gap-2">
                  <HiLink className="w-4 h-4 text-emerald-600" />
                  <span>Public Link Visitors</span>
                  <span className="text-xs text-gray-400 font-normal">
                    ({linkTakers.length})
                  </span>
                </h3>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Quiz & Flashcard Access
                </span>
              </div>

              <div className="space-y-3">
                {linkTakers.length === 0 ? (
                  <div className="text-xs text-gray-400 italic p-3">
                    {shareState.shareEnabled
                      ? "No one has visited via the public link yet."
                      : "Enable the public link above to allow open quiz/flashcard access."}
                  </div>
                ) : (
                  linkTakers.map((member) => (
                    <CommunityMemberRow key={member.id} member={member} />
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 sticky top-20">
            <Leaderboard
              entries={leaderboard}
              currentUserId={currentUserId}
              title="Overall Space Leaderboard"
              subtext="Combined performance across quizzes & active recall"
              showRoleBadges={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
