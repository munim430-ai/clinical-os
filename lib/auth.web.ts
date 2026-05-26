export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export function getStoredToken(): string | null {
  return null;
}

export function getStoredUser(): AuthUser | null {
  return null;
}

export function restoreSession(): void {
}

export async function signUp(email: string, password: string, name: string) {
  return null;
}

export async function signIn(email: string, password: string) {
  return null;
}

export async function signOut() {
}

export async function verifyEmail(email: string, code: string) {
  return null;
}

export async function sendResetPassword(email: string) {
}
