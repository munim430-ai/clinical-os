import { ifAuth, ifDb, insforge } from "@/lib/insforge";
import { getItem, removeItem, setItem } from "@/lib/storage";

const TOKEN_KEY = "insforge_access_token";
const USER_KEY = "insforge_user";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export function getStoredToken(): string | null {
  return getItem<string>(TOKEN_KEY) ?? null;
}

export function getStoredUser(): AuthUser | null {
  return getItem<AuthUser>(USER_KEY) ?? null;
}

export function restoreSession(): void {
  const token = getStoredToken();
  if (token) {
    insforge.tokenManager.setAccessToken(token);
  }
}

function persistSession(token: string, user: AuthUser): void {
  setItem(TOKEN_KEY, token);
  setItem(USER_KEY, user);
  insforge.tokenManager.setAccessToken(token);
}

function clearSession(): void {
  removeItem(TOKEN_KEY);
  removeItem(USER_KEY);
  insforge.tokenManager.clearSession();
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await ifAuth.signUp({ email, password, name });
  if (error) throw error;
  if (data?.accessToken && data.user) {
    persistSession(data.accessToken, {
      id: data.user.id,
      email: data.user.email,
      name: data.user.profile?.name ?? name,
      avatarUrl: data.user.profile?.avatar_url ?? null,
    });
    // Create profile row (ignore error — row may already exist)
    await ifDb.from("profiles").insert([{ id: data.user.id, full_name: name }]);
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await ifAuth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data?.accessToken && data.user) {
    persistSession(data.accessToken, {
      id: data.user.id,
      email: data.user.email,
      name: data.user.profile?.name ?? null,
      avatarUrl: data.user.profile?.avatar_url ?? null,
    });
  }
  return data;
}

export async function signOut() {
  await ifAuth.signOut();
  clearSession();
}

export async function verifyEmail(email: string, code: string) {
  const { data, error } = await ifAuth.verifyEmail({ email, code });
  if (error) throw error;
  return data;
}

export async function sendResetPassword(email: string) {
  const { error } = await ifAuth.sendResetPasswordEmail({ email });
  if (error) throw error;
}
