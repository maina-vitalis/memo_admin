"use client";

import { PageHeader } from "@/components/page-header";
import { InstitutionProfileForm } from "@/features/tenant-admin/settings/components/institution-profile-form";
import { SecurityTab } from "@/features/tenant-admin/settings/components/security-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your institution's profile and account security."
      />

      <Tabs defaultValue="institution">
        <TabsList>
          <TabsTrigger value="institution">Institution Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="mt-4">
          <InstitutionProfileForm />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
