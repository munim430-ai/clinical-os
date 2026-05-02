export type Persona = "student" | "intern" | "gp";

export function getPersona(): Persona {
  return (localStorage.getItem("persona") as Persona) ?? "intern";
}

export function setPersona(p: Persona) {
  localStorage.setItem("persona", p);
}

export function isOnboarded(): boolean {
  return localStorage.getItem("onboarded") === "true";
}

export function markOnboarded() {
  localStorage.setItem("onboarded", "true");
}
