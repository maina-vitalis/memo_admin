/**
 * [REFRESH TOKENS] Device ID helper for the admin web app.
 * Uses crypto.randomUUID when available (modern browsers).
 * Stored in localStorage so it is stable for the browser profile.
 */

const DEVICE_ID_KEY = "memo_device_id";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id as string);
    }
    return id as string;
  } catch {
    return `web-fallback-${Date.now()}`;
  }
}
