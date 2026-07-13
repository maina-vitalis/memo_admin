export type PlatformSettings = {
  defaultSeatQuota: number;
  supportEmail: string;
  announcementBanner: string;
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  defaultSeatQuota: 500,
  supportEmail: "",
  announcementBanner: "",
};
