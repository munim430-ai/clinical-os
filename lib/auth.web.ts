// Web stub for auth module to prevent native auth logic from bleeding into web builds
import type { AuthUser } from "./auth";

export type { AuthUser };

export function getStoredToken(): string | null {
  return null;
}

export function getStoredUser(): AuthUser | null {
  return null;
}

export function restoreSession(): void {
  // no-op
}

export async function signUp(email: string, password: string, name: string) {
  throw new Error("Auth not supported on web");
}

export async function signIn(email: string, password: string) {
  throw new Error("Auth not supported on web");
}

export async function signOut() {
  // no-op
}

export async function verifyEmail(email: string, code: string) {
  throw new Error("Auth not supported on web");
}

export async function sendResetPassword(email: string) {
  throw new Error("Auth not supported on web");
}
