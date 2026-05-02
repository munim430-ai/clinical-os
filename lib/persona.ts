import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "clinical-os" });

export type Persona = "student" | "intern" | "gp";

export function getPersona(): Persona {
  return (storage.getString("persona") as Persona) ?? "intern";
}

export function setPersona(p: Persona) {
  storage.set("persona", p);
}

export function isOnboarded(): boolean {
  return storage.getBoolean("onboarded") ?? false;
}

export function markOnboarded() {
  storage.set("onboarded", true);
}
