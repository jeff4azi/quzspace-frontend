import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import { useAuth } from "../hooks/useAuth";
import {
  HiUser,
  HiAdjustmentsHorizontal,
  HiExclamationTriangle,
  HiCheckCircle,
  HiCheck,
  HiXMark,
} from "react-icons/hi2";

const AVATAR_COLORS = [
  { name: "Brand Dark", class: "bg-brand" },
  { name: "Purple", class: "bg-purple-600" },
  { name: "Emerald", class: "bg-emerald-600" },
  { name: "Amber", class: "bg-amber-600" },
  { name: "Rose", class: "bg-rose-600" },
  { name: "Blue", class: "bg-blue-600" },
];

const DEFAULT_PREFS = {
  emailNotifications: true,
  studyReminders: true,
  weeklyReport: true,
  soundEffects: false,
};

function computeInitials(name = "", email = "") {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, preferences: authPrefs, updatePreferences, updateProfile, logout } =
    useAuth();

  const [name, setName] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].class);

  const [preferences, setPreferences] = useState(DEFAULT_PREFS);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [toastMessage, setToastMessage] = useState(null);
  const [toastVariant, setToastVariant] = useState("success");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    else if (user?.user_metadata?.name) setName(user.user_metadata.name);
    else if (user?.email) setName(user.email.split("@")[0]);
  }, [profile?.name, user?.user_metadata?.name, user?.email]);

  useEffect(() => {
    if (profile?.avatarColor) {
      const known = AVATAR_COLORS.find((c) => c.class === profile.avatarColor);
      if (known) setAvatarColor(known.class);
    }
  }, [profile?.avatarColor]);

  useEffect(() => {
    if (authPrefs) setPreferences({ ...DEFAULT_PREFS, ...authPrefs });
  }, [authPrefs]);

  const displayEmail = useMemo(() => {
    if (profile?.email) return profile.email;
    return user?.email || "you@example.com";
  }, [profile?.email, user?.email]);

  const memberSince = useMemo(() => {
    if (profile?.joinedDate) return profile.joinedDate;
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }
    return "Recently";
  }, [profile?.joinedDate, user?.created_at]);

  const avatarInitials = useMemo(
    () => computeInitials(name, displayEmail),
    [name, displayEmail],
  );

  const showToast = (msg, variant = "success") => {
    setToastMessage(msg);
    setToastVariant(variant);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      showToast("Sign in required to save profile.", "error");
      return;
    }
    setIsSavingProfile(true);
    try {
      const initials = computeInitials(name, displayEmail);
      await updateProfile({
        name: name.trim(),
        avatarInitials: initials,
        avatarColor: avatarColor,
      });
      showToast("Profile information updated successfully!");
    } catch (err) {
      console.warn("profile save failed:", err?.message || err);
      showToast(
        err?.status === 403 || err?.code === "FORBIDDEN"
          ? "You don't have permission to edit this profile."
          : "Couldn't save profile right now. Try again shortly.",
        "error",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) {
      showToast("Sign in required to save preferences.", "error");
      return;
    }
    setIsSavingPrefs(true);
    try {
      await updatePreferences(preferences);
      showToast("Preferences saved!");
    } catch (err) {
      console.warn("preferences save failed:", err?.message || err);
      showToast(
        err?.status === 403
          ? "You don't have permission to edit preferences."
          : "Couldn't save preferences right now. Try again shortly.",
        "error",
      );
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    showToast(
      "Account deletion requires support assistance. You have been signed out for safety.",
      "error",
    );
    try {
      await logout();
    } catch (_) {
      /* noop */
    }
    navigate("/login", { replace: true });
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl pb-20 lg:pb-0">
        {toastMessage && (
          <div
            className={`fixed bottom-24 lg:bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              toastVariant === "error"
                ? "bg-rose-600 text-white border-rose-400/30"
                : "bg-brand text-light border-muted/30"
            }`}
          >
            <HiCheckCircle
              className={`w-5 h-5 shrink-0 ${
                toastVariant === "error" ? "text-rose-100" : "text-emerald-400"
              }`}
            />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-gray-200 hover:text-white p-1"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray mt-1">
            Manage your profile details and study preferences.
          </p>
        </div>

        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-muted/20 pb-4">
            <HiUser className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-brand">Profile Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full ${avatarColor} text-light text-xl font-bold flex items-center justify-center ring-4 ring-brand/10 shadow-xs shrink-0 transition-colors`}
              >
                {avatarInitials}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand block">
                  Email Address
                </label>
                <div className="w-full px-3 py-2.5 rounded-xl border border-muted/30 bg-light/60 text-xs text-gray-500 font-medium select-all">
                  {displayEmail}
                </div>
                <p className="text-[11px] text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingProfile}
              >
                <span>Save Profile Changes</span>
              </Button>

              <span className="text-xs text-gray font-medium hidden sm:inline">
                Member since {memberSince}
              </span>
            </div>
          </form>
        </section>

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
                setPreferences((prev) => ({
                  ...prev,
                  emailNotifications: val,
                }))
              }
            />

            <Toggle
              id="study-reminders"
              label="Study Streak Reminders"
              description="Get daily notifications to keep your active study streak going strong."
              checked={preferences.studyReminders}
              onChange={(val) =>
                setPreferences((prev) => ({
                  ...prev,
                  studyReminders: val,
                }))
              }
              className="pt-4"
            />

            <Toggle
              id="weekly-report"
              label="Weekly Performance Digest"
              description="Receive a weekly breakdown of your quiz mastery and recommended review areas."
              checked={preferences.weeklyReport}
              onChange={(val) =>
                setPreferences((prev) => ({
                  ...prev,
                  weeklyReport: val,
                }))
              }
              className="pt-4"
            />

            <Toggle
              id="sound-effects"
              label="Interactive Sound Effects"
              description="Play subtle feedback audio cues during quiz completion and flashcard flips."
              checked={preferences.soundEffects}
              onChange={(val) =>
                setPreferences((prev) => ({
                  ...prev,
                  soundEffects: val,
                }))
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

        <section className="bg-rose-50/40 p-5 sm:p-6 rounded-2xl border border-rose-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-200/60 pb-4">
            <HiExclamationTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-900">Delete Account</h3>
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
                spaces, AI summaries, flashcard mastery records, and quiz
                history will be erased immediately.
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
