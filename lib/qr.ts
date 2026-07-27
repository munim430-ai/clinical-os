import { createId } from "@paralleldrive/cuid2";

export function generateQrToken(): string {
  return createId();
}

export function buildVerifyUrl(token: string): string {
  return `https://clinical-os-eta.vercel.app/verify/${token}`;
}
