import type { TenantStatus } from "@/features/super-admin/dashboard/types/tenant";

export type StatusBreakdownItem = {
  status: TenantStatus;
  label: string;
  count: number;
};

export type PlanBreakdownItem = {
  plan: "trial" | "basic" | "pro";
  label: string;
  count: number;
};

export type SeatUtilizationItem = {
  id: string;
  name: string;
  shortcode: string;
  seatsActive: number;
  seatQuota: number;
  utilization: number;
};

export type OnboardingTrendPoint = {
  key: string;
  label: string;
  count: number;
};

export type AnalyticsSummary = {
  totalInstitutions: number;
  activeInstitutions: number;
  totalUsersActive: number;
  totalSeatQuota: number;
  totalSeatsActive: number;
  avgUtilization: number;
  expiringSoonCount: number;
  expiredCount: number;
  statusBreakdown: StatusBreakdownItem[];
  planBreakdown: PlanBreakdownItem[];
  seatUtilization: SeatUtilizationItem[];
  onboardingTrend: OnboardingTrendPoint[];
};
