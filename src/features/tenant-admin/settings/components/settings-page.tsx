"use client";

import { InstitutionProfileForm } from "@/features/tenant-admin/settings/components/institution-profile-form";
import { SecurityTab } from "@/features/tenant-admin/settings/components/security-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your institution&apos;s profile and account security.
        </p>
      </div>

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
