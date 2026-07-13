import { format, isPast, differenceInCalendarDays, subMonths } from "date-fns";
import { fetchInstitutionRecords } from "@/features/super-admin/shared/api/institutions";
import type { InstitutionRecord } from "@/features/super-admin/shared/types/institution";
import { TENANT_STATUSES } from "@/features/super-admin/dashboard/types/tenant";
import type {
  AnalyticsSummary,
  OnboardingTrendPoint,
} from "@/features/super-admin/analytics/types/analytics";

const STATUS_LABELS: Record<(typeof TENANT_STATUSES)[number], string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  trial: "Trial",
};

const PLAN_ORDER = ["trial", "basic", "pro"] as const;
const PLAN_LABELS: Record<(typeof PLAN_ORDER)[number], string> = {
  trial: "Trial",
  basic: "Basic",
  pro: "Pro",
};

const SEAT_UTILIZATION_LIMIT = 8;
const TREND_MONTHS = 6;
const EXPIRING_SOON_DAYS = 14;

function utilizationOf(institution: InstitutionRecord): number {
  if (!institution.seatQuota) return 0;
  const seatsActive = institution.seatsActive ?? 0;
  return Math.round((seatsActive / institution.seatQuota) * 100);
}

function buildOnboardingTrend(
  institutions: InstitutionRecord[],
): OnboardingTrendPoint[] {
  const now = new Date();
  const buckets = new Map<string, OnboardingTrendPoint>();

  for (let offset = TREND_MONTHS - 1; offset >= 0; offset -= 1) {
    const monthDate = subMonths(now, offset);
    const key = format(monthDate, "yyyy-MM");
    buckets.set(key, { key, label: format(monthDate, "MMM yyyy"), count: 0 });
  }

  for (const institution of institutions) {
    const key = format(new Date(institution.createdAt), "yyyy-MM");
    const bucket = buckets.get(key);
    if (bucket) bucket.count += 1;
  }

  return Array.from(buckets.values());
}

export function buildAnalyticsSummary(
  institutions: InstitutionRecord[],
): AnalyticsSummary {
  const totalInstitutions = institutions.length;
  const activeInstitutions = institutions.filter((i) => i.isActive).length;
  const totalUsersActive = institutions.reduce(
    (sum, i) => sum + (i.usersActive ?? 0),
    0,
  );
  const totalSeatQuota = institutions.reduce((sum, i) => sum + i.seatQuota, 0);
  const totalSeatsActive = institutions.reduce(
    (sum, i) => sum + (i.seatsActive ?? 0),
    0,
  );
  const avgUtilization = totalSeatQuota
    ? Math.round((totalSeatsActive / totalSeatQuota) * 100)
    : 0;

  let expiringSoonCount = 0;
  let expiredCount = 0;
  for (const institution of institutions) {
    if (!institution.subscriptionEndsAt) continue;
    const endsAt = new Date(institution.subscriptionEndsAt);
    if (isPast(endsAt)) {
      expiredCount += 1;
    } else if (differenceInCalendarDays(endsAt, new Date()) <= EXPIRING_SOON_DAYS) {
      expiringSoonCount += 1;
    }
  }

  const statusBreakdown = TENANT_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: institutions.filter((i) => i.status === status).length,
  }));

  const planBreakdown = PLAN_ORDER.map((plan) => ({
    plan,
    label: PLAN_LABELS[plan],
    count: institutions.filter((i) => i.plan === plan).length,
  }));

  const seatUtilization = [...institutions]
    .map((institution) => ({
      id: institution.id,
      name: institution.name,
      shortcode: institution.schoolCode,
      seatsActive: institution.seatsActive ?? 0,
      seatQuota: institution.seatQuota,
      utilization: utilizationOf(institution),
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, SEAT_UTILIZATION_LIMIT);

  const onboardingTrend = buildOnboardingTrend(institutions);

  return {
    totalInstitutions,
    activeInstitutions,
    totalUsersActive,
    totalSeatQuota,
    totalSeatsActive,
    avgUtilization,
    expiringSoonCount,
    expiredCount,
    statusBreakdown,
    planBreakdown,
    seatUtilization,
    onboardingTrend,
  };
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const institutions = await fetchInstitutionRecords();
  return buildAnalyticsSummary(institutions);
}
