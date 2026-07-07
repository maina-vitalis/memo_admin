import { differenceInCalendarDays, format } from "date-fns";
import type {
  SubscriptionEndsVariant,
  Tenant,
} from "@/features/super-admin/dashboard/types/tenant";
import type { InstitutionRecord } from "@/features/super-admin/shared/types/institution";

function getSubscriptionEndsMeta(
  subscriptionEndsAt: string | null,
): Pick<Tenant, "subscriptionEndsLabel" | "subscriptionEndsVariant"> {
  if (!subscriptionEndsAt) {
    return {
      subscriptionEndsLabel: "No end date",
      subscriptionEndsVariant: "default",
    };
  }

  const endDate = new Date(subscriptionEndsAt);
  const daysRemaining = differenceInCalendarDays(endDate, new Date());

  if (daysRemaining < 0) {
    return {
      subscriptionEndsLabel: `Ended ${format(endDate, "MMM d, yyyy")}`,
      subscriptionEndsVariant: "error",
    };
  }

  if (daysRemaining <= 14) {
    return {
      subscriptionEndsLabel:
        daysRemaining === 0
          ? "Ends today"
          : `Ends in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
      subscriptionEndsVariant: "warning",
    };
  }

  return {
    subscriptionEndsLabel: format(endDate, "MMM d, yyyy"),
    subscriptionEndsVariant: "default",
  };
}

export function mapInstitutionToTenant(institution: InstitutionRecord): Tenant {
  const subscriptionMeta = getSubscriptionEndsMeta(
    institution.subscriptionEndsAt,
  );

  return {
    id: institution.id,
    name: institution.name,
    subdomain: institution.subdomain,
    shortcode: institution.schoolCode,
    status: institution.status,
    seatsActive: institution.seatsActive ?? 0,
    seatQuota: institution.seatQuota,
    usersActive: institution.usersActive ?? 0,
    plan: institution.plan,
    contactEmail: institution.contactEmail,
    isActive: institution.isActive,
    provisioningNotes: institution.provisioningNotes ?? undefined,
    ...subscriptionMeta,
  };
}
