import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import { mockUser } from "../data/mockUser";
import {
  HiUser,
  HiAdjustmentsHorizontal,
  HiExclamationTriangle,
  HiCheckCircle,
  HiLockClosed,
  HiCheck,
  HiXMark,
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

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    showToast(
      "⚠️ Account deletion simulated. In a real app, your data would be removed.",
    );
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl pb-20 lg:pb-0">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-24 lg:bottom-6 right-6 z-50 bg-brand text-light px-4 py-3 rounded-2xl shadow-xl border border-muted/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
            Manage your profile details and study preferences.
          </p>
        </div>

        {/* SECTION 1: PROFILE */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-muted/20 pb-4">
            <HiUser className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-brand">
              Profile Information
            </h2>
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

        {/* SECTION 2: PREFERENCES */}
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
              <h3 className="text-sm font-bold text-rose-900">
                Delete Account
              </h3>
              <p className="text-xs text-rose-700/80 mt-0.5 max-w-lg leading-relaxed">
                Permanently remove your account, study spaces, flashcard decks,
                and quiz attempt records. This action cannot be undone.
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
                  <h3 className="text-lg font-bold text-brand">
                    Confirm Account Deletion
                  </h3>
                  <p className="text-xs text-gray-500">
                    This action is permanent and irreversible.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                Are you sure you want to delete your account? All your study
                spaces (<strong>{user.studySpacesUsed} spaces</strong>), AI
                summaries, flashcard mastery records, and quiz history will be
                erased immediately.
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
