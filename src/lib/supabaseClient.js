import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Where Supabase email links (magic link / confirm signup) send the user back to.
// The AuthCallback page lets the client finish the session exchange, then routes on.
export function getAuthRedirectUrl() {
  const base = import.meta.env.VITE_APP_URL || window.location.origin;
  return `${base.replace(/\/$/, "")}/auth/callback`;
}

export async function requestOtpSignIn({ email, options = {} }) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: getAuthRedirectUrl(),
      ...options,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyOtp({ email, token, type = "email" }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });
  if (error) throw error;
  return data;
}

export async function resendOtp({ email, type = "signup" }) {
  const { data, error } = await supabase.auth.resend({
    type,
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      data: {
        name,
        full_name: name,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function googleOAuthSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        (import.meta.env.VITE_APP_URL || window.location.origin) + "/dashboard",
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}
