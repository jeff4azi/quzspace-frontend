import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  supabase,
  getCurrentSession,
  signOut as supabaseSignOut,
} from "../lib/supabaseClient";
import api from "../lib/api";

const AuthContext = createContext(null);

const DEFAULT_PREFS = {
  emailNotifications: true,
  studyReminders: true,
  weeklyReport: true,
  soundEffects: false,
};

function normalizeProfile(raw = {}, fallbackUser = null) {
  if (!raw || typeof raw !== "object") {
    const email = fallbackUser?.email || null;
    const name =
      fallbackUser?.user_metadata?.full_name ||
      fallbackUser?.user_metadata?.name ||
      (email ? email.split("@")[0] : "");
    const initialsSource = (name || email || "U").trim();
    let avatarInitials = "U";
    if (initialsSource) {
      if (/@/.test(initialsSource)) {
        avatarInitials = initialsSource.split("@")[0].slice(0, 2).toUpperCase();
      } else {
        const parts = initialsSource.split(/\s+/).filter(Boolean);
        avatarInitials =
          parts.length === 1
            ? parts[0].slice(0, 2).toUpperCase()
            : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
    }
    return {
      id: fallbackUser?.id || null,
      name,
      email,
      avatarInitials,
      avatarColor: "bg-brand",
      joinedDate: fallbackUser?.created_at
        ? new Date(fallbackUser.created_at).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "Recently",
    };
  }

  const fullName =
    raw.full_name ||
    raw.name ||
    raw.displayName ||
    fallbackUser?.user_metadata?.full_name ||
    fallbackUser?.user_metadata?.name ||
    (fallbackUser?.email ? fallbackUser.email.split("@")[0] : "");
  const email = raw.email || fallbackUser?.email || null;

  const initialsSource = (fullName || email || "U").trim();
  let avatarInitials = raw.avatar_initials || raw.avatarInitials;
  if (!avatarInitials) {
    if (/@/.test(initialsSource)) {
      avatarInitials = initialsSource.split("@")[0].slice(0, 2).toUpperCase();
    } else {
      const parts = initialsSource.split(/\s+/).filter(Boolean);
      avatarInitials =
        parts.length === 1
          ? parts[0].slice(0, 2).toUpperCase()
          : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  return {
    id: raw.id || raw.user_id || fallbackUser?.id || null,
    name: fullName,
    email,
    avatarInitials,
    avatarColor: raw.avatar_color || raw.avatarColor || "bg-brand",
    joinedDate: raw.joined_at || raw.joinedDate
      ? new Date(raw.joined_at || raw.joinedDate).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })
      : fallbackUser?.created_at
      ? new Date(fallbackUser.created_at).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })
      : "Recently",
  };
}

function normalizePreferences(raw = {}) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PREFS };
  return {
    emailNotifications:
      typeof raw.email_notifications === "boolean"
        ? raw.email_notifications
        : typeof raw.emailNotifications === "boolean"
        ? raw.emailNotifications
        : DEFAULT_PREFS.emailNotifications,
    studyReminders:
      typeof raw.study_reminders === "boolean"
        ? raw.study_reminders
        : typeof raw.studyReminders === "boolean"
        ? raw.studyReminders
        : DEFAULT_PREFS.studyReminders,
    weeklyReport:
      typeof raw.weekly_report === "boolean"
        ? raw.weekly_report
        : typeof raw.weeklyReport === "boolean"
        ? raw.weeklyReport
        : DEFAULT_PREFS.weeklyReport,
    soundEffects:
      typeof raw.sound_effects === "boolean"
        ? raw.sound_effects
        : typeof raw.soundEffects === "boolean"
        ? raw.soundEffects
        : DEFAULT_PREFS.soundEffects,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async (userId, fallbackUser = null) => {
    if (!userId) return null;
    try {
      const res = await api.get("/auth/me");
      const payload = res && typeof res === "object" ? res : {};
      const prof = payload.profile || payload.data || payload;
      const prefs = payload.preferences || prof?.preferences || {};

      const normalizedProf = normalizeProfile(prof, fallbackUser);
      const normalizedPrefs = normalizePreferences(prefs);

      setProfile(normalizedProf);
      setPreferences(normalizedPrefs);
      return { profile: normalizedProf, preferences: normalizedPrefs };
    } catch (err) {
      console.warn(
        "Auth /auth/me fetch failed (backend auth endpoints may not be deployed yet); falling back to session defaults.",
        err?.message || err,
      );
      const fallback = normalizeProfile(null, fallbackUser || user);
      const fallbackPrefs = { ...DEFAULT_PREFS };
      setProfile(fallback);
      setPreferences(fallbackPrefs);
      return { profile: fallback, preferences: fallbackPrefs };
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await getCurrentSession();
      if (session?.user && mounted) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      }
      if (mounted) {
        setLoading(false);
        setInitialized(true);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const u = session?.user || null;
      setUser(u);
      if (u) {
        await fetchProfile(u.id, u);
      } else {
        setProfile(null);
        setPreferences(null);
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setPreferences(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [fetchProfile]);

  const updatePreferences = useCallback(
    async (nextPrefs) => {
      if (!user?.id) return preferences || { ...DEFAULT_PREFS };
      const merged = { ...(preferences || DEFAULT_PREFS), ...nextPrefs };
      setPreferences(merged);
      try {
        await api.patch("/auth/preferences", {
          email_notifications: merged.emailNotifications,
          study_reminders: merged.studyReminders,
          weekly_report: merged.weeklyReport,
          sound_effects: merged.soundEffects,
        });
      } catch (err) {
        console.warn(
          "preferences update via /auth/preferences PATCH failed (table or endpoint may not exist yet):",
          err?.message || err,
        );
        throw err;
      }
      return merged;
    },
    [user?.id, preferences],
  );

  const updateProfile = useCallback(
    async (patch = {}) => {
      if (!user?.id) return profile;
      const next = { ...(profile || {}), ...patch };
      setProfile(next);
      try {
        const res = await api.patch("/auth/me/profile", {
          full_name: next.name,
          avatar_initials: next.avatarInitials,
          avatar_color: next.avatarColor,
        });
        const payload = res || {};
        const updatedProf = payload.profile || payload.data || payload;
        if (updatedProf && typeof updatedProf === "object") {
          const refreshed = normalizeProfile(updatedProf, user);
          setProfile(refreshed);
          return refreshed;
        }
        return next;
      } catch (err) {
        console.warn(
          "profile update via /auth/me/profile PATCH failed:",
          err?.message || err,
        );
        throw err;
      }
    },
    [user?.id, profile],
  );

  const logout = useCallback(async () => {
    try {
      await supabaseSignOut();
    } catch (err) {
      console.warn("signOut error:", err?.message || err);
    }
    setUser(null);
    setProfile(null);
    setPreferences(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      preferences,
      loading,
      initialized,
      updatePreferences,
      updateProfile,
      logout,
      isAuthenticated: !!user,
    }),
    [
      user,
      profile,
      preferences,
      loading,
      initialized,
      updatePreferences,
      updateProfile,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
