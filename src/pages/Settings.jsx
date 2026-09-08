import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import { mockUser } from "../data/mockUser";
import {
  HiUser,
  HiSparkles,
  HiAdjustmentsHorizontal,
  HiExclamationTriangle,
  HiCheckCircle,
  HiLockClosed,
  HiCreditCard,
  HiArrowPath,
  HiCheck,
  HiXMark,
  HiOutlineShieldCheck,
  HiArrowRightOnRectangle,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";

const AVATAR_COLORS = [
  { name: "Brand Dark", class: "bg-brand" },
  { name: "Purple", class: "bg-purple-600" },
  { name: "Emerald", class: "bg-emerald-600" },
  { name: "Amber", class: "bg-amber-600" },
  { name: "Rose", class: "bg-rose-600" },
  { name: "Blue", class: "bg-blue-600" },
];

export default function Settings() {
  // Local state initialized from mock user
  const [user, setUser] = useState(mockUser);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [avatarColor, setAvatarColor] = useState(mockUser.avatarColor);
  const [planState, setPlanState] = useState(mockUser.plan); // "free" | "premium"

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: mockUser.preferences.emailNotifications,
    studyReminders: mockUser.preferences.studyReminders,
    weeklyReport: mockUser.preferences.weeklyReport,
    soundEffects: mockUser.preferences.soundEffects,
  });

  // Danger Zone confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Simulated notification toast state
  const [toastMessage, setToastMessage] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setUser((prev) => ({
        ...prev,
        name,
        email,
        avatarColor,
        avatarInitials: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      }));
      showToast("Profile information updated successfully!");
    }, 600);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      showToast("Password updated successfully!");
    }, 700);
  };

  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      showToast("Preferences saved!");
    }, 500);
  };

  const handleUpgradeClick = () => {
    setPlanState("premium");
    showToast("🎉 Simulated Upgrade Success! You are now on Premium Pro.");
  };

  const handleDowngradeClick = () => {
    setPlanState("free");
    showToast("Plan switched back to Free Tier.");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    showToast("⚠️ Account deletion simulated. In a real app, your data would be removed.");
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl pb-12">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-brand text-light px-4 py-3 rounded-2xl shadow-xl border border-muted/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <HiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Settings Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray mt-1">
            Manage your profile details, subscription plan, and study preferences.
          </p>
        </div>

        {/* SECTION 1: PROFILE */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-muted/20 pb-4">
            <HiUser className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-brand">Profile Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full ${avatarColor} text-light text-xl font-bold flex items-center justify-center ring-4 ring-brand/10 shadow-xs shrink-0 transition-colors`}
              >
                {user.avatarInitials}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand block">
                  Avatar Color Theme
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setAvatarColor(col.class)}
                      className={`w-7 h-7 rounded-full ${col.class} flex items-center justify-center transition-transform ${
                        avatarColor === col.class
                          ? "ring-2 ring-offset-2 ring-brand scale-110"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      title={col.name}
                    >
                      {avatarColor === col.class && (
                        <HiCheck className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingProfile}
              >
                <span>Save Profile Changes</span>
              </Button>

              <span className="text-xs text-gray font-medium hidden sm:inline">
                Member since {user.joinedDate}
              </span>
            </div>
          </form>

          {/* Separate Action: Change Password Drawer */}
          <div className="pt-4 border-t border-muted/20 space-y-4">
            <button
              type="button"
              onClick={() => setShowPasswordSection((prev) => !prev)}
              className="flex items-center justify-between w-full py-2 text-left text-xs font-bold text-brand hover:text-darker transition-colors"
            >
              <div className="flex items-center gap-2">
                <HiLockClosed className="w-4 h-4 text-gray-500" />
                <span>Change Password</span>
              </div>
              {showPasswordSection ? (
                <HiChevronUp className="w-4 h-4" />
              ) : (
                <HiChevronDown className="w-4 h-4" />
              )}
            </button>

            {showPasswordSection && (
              <form
                onSubmit={handleSavePassword}
                className="p-4 rounded-xl bg-light/50 border border-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 chars"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPasswordSection(false)}
                    className="py-2 px-4 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSavingPassword}
                    className="py-2 px-4 text-xs"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* SECTION 2: PLAN & BILLING */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-muted/20 pb-4">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-brand">Plan & Subscription</h2>
            </div>

            {/* Quick Toggle to test both Free & Premium states */}
            <div className="flex items-center gap-2 text-xs bg-light p-1 rounded-xl border border-muted/30">
              <span className="text-gray-500 font-semibold px-2">Demo View:</span>
              <button
                type="button"
                onClick={() => setPlanState("free")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  planState === "free"
                    ? "bg-white text-brand shadow-xs"
                    : "text-gray-500 hover:text-brand"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setPlanState("premium")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  planState === "premium"
                    ? "bg-brand text-light shadow-xs"
                    : "text-gray-500 hover:text-brand"
                }`}
              >
                Premium
              </button>
            </div>
          </div>

          {/* Current Plan Usage Status Card */}
          <div className="p-5 rounded-2xl bg-light/60 border border-muted/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-brand">
                    {planState === "free" ? "Free Tier Plan" : "Premium Pro Plan"}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      planState === "free"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {planState === "free" ? "Active Free" : "Active Subscription"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {planState === "free"
                    ? "Standard access to Study Spaces, flashcards, and AI quizzes."
                    : "Unlimited AI generation, unlimited spaces, and priority support."}
                </p>
              </div>

              {planState === "premium" && (
                <div className="text-right">
                  <span className="text-xs font-bold text-brand block">$9.99 / month</span>
                  <span className="text-[11px] text-gray-500">Renews Oct 15, 2026</span>
                </div>
              )}
            </div>

            {/* Usage Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-muted/20">
              {/* Study Spaces Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Study Spaces Used</span>
                  <span className="text-brand">
                    {planState === "free" ? `${user.studySpacesUsed} / ${user.studySpacesLimit}` : `${user.studySpacesUsed} / Unlimited`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand h-full rounded-full transition-all duration-500"
                    style={{
                      width: planState === "free" ? `${(user.studySpacesUsed / user.studySpacesLimit) * 100}%` : "30%",
                    }}
                  />
                </div>
              </div>

              {/* Shared Spaces Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Shared Links Used</span>
                  <span className="text-brand">
                    {planState === "free" ? `${user.sharedSpacesUsed} / ${user.sharedSpacesLimit}` : `${user.sharedSpacesUsed} / Unlimited`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: planState === "free" ? `${(user.sharedSpacesUsed / user.sharedSpacesLimit) * 100}%` : "20%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Content depending on Plan State */}
          {planState === "free" ? (
            /* Upgrade Comparison Callout */
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-brand/5 via-white to-amber-500/5 border border-brand/20 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <HiSparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-extrabold text-brand">
                      Unlock Unlimited Potential with Premium Pro
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-xl">
                    Get unlimited study spaces, faster AI generation, full collaborator sharing, and weak area mastery breakdown.
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleUpgradeClick}
                  className="shrink-0 py-3 px-6 text-xs shadow-md"
                >
                  <HiSparkles className="w-4 h-4 text-amber-300" />
                  <span>Upgrade to Premium ($9.99/mo)</span>
                </Button>
              </div>

              {/* Feature Comparison List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="space-y-2 p-3.5 rounded-xl bg-white/80 border border-muted/30">
                  <span className="font-extrabold text-gray-500 block uppercase tracking-wider text-[10px]">
                    Free Plan Features
                  </span>
                  <ul className="space-y-1.5 text-gray-600">
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Up to 3 Study Spaces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Standard AI Summaries & Flashcards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Community overall leaderboards</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-brand/5 border border-brand/30">
                  <span className="font-extrabold text-brand block uppercase tracking-wider text-[10px]">
                    ★ Premium Pro Highlights
                  </span>
                  <ul className="space-y-1.5 text-brand font-medium">
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-brand shrink-0" />
                      <span><strong>Unlimited</strong> Study Spaces & Files</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-brand shrink-0" />
                      <span>Priority AI generation & explanations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HiCheck className="w-4 h-4 text-brand shrink-0" />
                      <span>Unlimited Shared Space invites</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Premium Subscription Actions */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-light/40 border border-muted/20">
              <div className="flex items-center gap-3">
                <HiCreditCard className="w-6 h-6 text-brand" />
                <div className="text-xs">
                  <span className="font-bold text-brand block">Visa ending in 4242</span>
                  <span className="text-gray-500">Next billing date: October 15, 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  onClick={() => showToast("Manage Billing portal modal simulated.")}
                  className="py-2 px-4 text-xs w-full sm:w-auto"
                >
                  Manage Billing
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDowngradeClick}
                  className="py-2 px-4 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 w-full sm:w-auto"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: PREFERENCES */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-muted/20 pb-4">
            <HiAdjustmentsHorizontal className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-brand">App Preferences</h2>
          </div>

          <div className="space-y-5 divide-y divide-muted/20">
            <Toggle
              id="email-notifications"
              label="Email Notifications"
              description="Receive updates about shared spaces, quiz attempts, and community milestones."
              checked={preferences.emailNotifications}
              onChange={(val) =>
                setPreferences((prev) => ({ ...prev, emailNotifications: val }))
              }
            />

            <Toggle
              id="study-reminders"
              label="Study Streak Reminders"
              description="Get daily notifications to keep your active study streak going strong."
              checked={preferences.studyReminders}
              onChange={(val) =>
                setPreferences((prev) => ({ ...prev, studyReminders: val }))
              }
              className="pt-4"
            />

            <Toggle
              id="weekly-report"
              label="Weekly Performance Digest"
              description="Receive a weekly breakdown of your quiz mastery and recommended review areas."
              checked={preferences.weeklyReport}
              onChange={(val) =>
                setPreferences((prev) => ({ ...prev, weeklyReport: val }))
              }
              className="pt-4"
            />

            <Toggle
              id="sound-effects"
              label="Interactive Sound Effects"
              description="Play subtle feedback audio cues during quiz completion and flashcard flips."
              checked={preferences.soundEffects}
              onChange={(val) =>
                setPreferences((prev) => ({ ...prev, soundEffects: val }))
              }
              className="pt-4"
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              onClick={handleSavePreferences}
              isLoading={isSavingPrefs}
              className="py-2.5 px-5 text-xs"
            >
              Save Preferences
            </Button>
          </div>
        </section>

        {/* SECTION 4: DANGER ZONE */}
        <section className="bg-rose-50/40 p-5 sm:p-6 rounded-2xl border border-rose-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-200/60 pb-4">
            <HiExclamationTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-900">Delete Account</h3>
              <p className="text-xs text-rose-700/80 mt-0.5 max-w-lg leading-relaxed">
                Permanently remove your account, study spaces, flashcard decks, and quiz attempt records. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-5">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <HiExclamationTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand">Confirm Account Deletion</h3>
                  <p className="text-xs text-gray-500">This action is permanent and irreversible.</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                Are you sure you want to delete your account? All your study spaces (<strong>{user.studySpacesUsed} spaces</strong>), AI summaries, flashcard mastery records, and quiz history will be erased immediately.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand block">
                  Type <span className="text-rose-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 rounded-xl border border-muted/40 text-xs font-bold uppercase tracking-wider outline-none focus:border-rose-500"
                />
              </div>

              {/* Mobile-Safe Spaced Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 text-xs"
                >
                  Cancel Keep Account
                </Button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Confirm Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
