// lib/activeClinic.ts
export const ACTIVE_CLINIC_ID_KEY = "odonto_active_clinic_id";

/**
 * Garante que sempre vamos trabalhar com um clinicId (uuid) em string.
 * Aceita string, objeto { id }, ou qualquer coisa que venha "errada".
 */
export function normalizeClinicId(input: unknown): string | null {
  if (!input) return null;

  // Já é string
  if (typeof input === "string") {
    const s = input.trim();
    return s.length ? s : null;
  }

  // Veio objeto com id
  if (typeof input === "object") {
    const anyObj = input as any;
    const id = anyObj?.id;

    if (typeof id === "string") {
      const s = id.trim();
      return s.length ? s : null;
    }
  }

  return null;
}

export function setActiveClinicId(clinicId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_CLINIC_ID_KEY, clinicId);
}

/**
 * Lê o clinicId do localStorage.
 * - Se estiver salvo errado (objeto em JSON), tenta extrair .id e corrige o storage.
 */
export function getActiveClinicId(): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(ACTIVE_CLINIC_ID_KEY);
  if (!raw) return null;

  // Caso normal: string uuid
  const asString = normalizeClinicId(raw);
  if (asString) return asString;

  // Caso antigo: salvaram um JSON do objeto da clínica
  try {
    const parsed = JSON.parse(raw);
    const fixed = normalizeClinicId(parsed);
    if (fixed) {
      localStorage.setItem(ACTIVE_CLINIC_ID_KEY, fixed); // corrige e nunca mais dá erro
      return fixed;
    }
  } catch {
    // não era JSON, ignora
  }

  return null;
}
