import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuperAdminHelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Guides and contact options for platform administrators."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>
              Provision institutions, invite admins, and monitor usage from the
              super-admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use the Dashboard to review tenant health. Analytics and Reports
            provide deeper insight into adoption and memo activity.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need assistance?</CardTitle>
            <CardDescription>
              Contact your TVET MEMO platform operator for billing, access, or
              technical issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Institution admins manage day-to-day users and memos from their own
            portal. Super-admins focus on tenants and platform configuration.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
