"use client";

import { PlatformSettingsForm } from "@/features/super-admin/settings/components/platform-settings-form";
import { ProfileForm } from "@/features/super-admin/settings/components/profile-form";
import { SecurityTab } from "@/features/super-admin/settings/components/security-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your admin account and platform defaults.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="platform" className="mt-4">
          <PlatformSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
