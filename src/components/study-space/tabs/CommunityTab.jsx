import { useState } from "react";
import { HiUserPlus, HiUsers, HiLink, HiUserGroup } from "react-icons/hi2";
import CommunityMemberRow from "../CommunityMemberRow";
import CommunityEmptyState from "./CommunityEmptyState";
import InviteCollaboratorModal from "../InviteCollaboratorModal";
import Leaderboard from "../Leaderboard";
import Button from "../../ui/Button";
import {
  mockCollaborators,
  mockLinkTakers,
  mockOverallLeaderboard,
} from "../../../data/mockCommunity";

export default function CommunityTab() {
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [linkTakers] = useState(mockLinkTakers);
  const [leaderboard] = useState(mockOverallLeaderboard);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInviteSent = (newCollaborator) => {
    setCollaborators((prev) => [newCollaborator, ...prev]);
  };

  const totalMembers = collaborators.length + linkTakers.length;

  return (
    <div className="space-y-8">
      {/* Header Row */}
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

        <div className="shrink-0">
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

      {/* Invite Collaborator Modal */}
      <InviteCollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInviteSent={handleInviteSent}
      />

      {/* Main 2-Column Responsive Layout */}
      {totalMembers === 0 ? (
        <CommunityEmptyState onInviteClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: People Lists (Collaborators & Community Members) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Invited Collaborators Section */}
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
                {collaborators.map((member) => (
                  <CommunityMemberRow key={member.id} member={member} />
                ))}
              </div>
            </section>

            {/* 2. Link Takers / Community Members Section */}
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
                {linkTakers.map((member) => (
                  <CommunityMemberRow key={member.id} member={member} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Overall Space Leaderboard Widget */}
          <div className="lg:col-span-1 sticky top-20">
            <Leaderboard
              entries={leaderboard}
              currentUserId="u-owner"
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
