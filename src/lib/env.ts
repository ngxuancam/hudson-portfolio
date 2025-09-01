export const GAS_URL = import.meta.env.GAS_URL as string;
export const ALLOWED_ORIGINS = (import.meta.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);
