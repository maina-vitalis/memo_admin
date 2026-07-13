import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettings,
} from "@/features/super-admin/settings/types/platform-settings";

const STORAGE_KEY = "memo_super_admin_platform_settings";

/**
 * There is no backend endpoint for platform-wide config yet, so these values
 * are persisted locally on this device only — they do not sync across admins
 * or devices until a real settings endpoint ships.
 */
export function loadPlatformSettings(): PlatformSettings {
  if (typeof window === "undefined") return DEFAULT_PLATFORM_SETTINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLATFORM_SETTINGS;
    return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function savePlatformSettings(settings: PlatformSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
