"use client";

import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PlatformSettings } from "@/features/super-admin/settings/types/platform-settings";
import {
  loadPlatformSettings,
  savePlatformSettings,
} from "@/features/super-admin/settings/utils/platform-settings-storage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PlatformSettingsForm() {
  const [settings, setSettings] = useState<PlatformSettings>(loadPlatformSettings);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    savePlatformSettings(settings);
    toast.success("Platform defaults saved on this device");
  }

  return (
    <Card className="max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Platform defaults</CardTitle>
        <CardDescription>
          Defaults applied when provisioning new institutions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon />
          <AlertTitle>Stored on this device only</AlertTitle>
          <AlertDescription>
            There&apos;s no backend for platform-wide configuration yet, so these
            values save locally in this browser and won&apos;t sync to other admins
            or devices until that ships.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSave}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="platform-seat-quota">
                Default seat quota
              </FieldLabel>
              <Input
                id="platform-seat-quota"
                type="number"
                min={1}
                value={settings.defaultSeatQuota}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultSeatQuota: Number(event.target.value) || 0,
                  }))
                }
              />
              <FieldDescription>
                Pre-filled when provisioning a new TVET institution.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="platform-support-email">
                Support contact email
              </FieldLabel>
              <Input
                id="platform-support-email"
                type="email"
                placeholder="support@tvetmemo.com"
                value={settings.supportEmail}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, supportEmail: event.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="platform-banner">Announcement banner</FieldLabel>
              <Textarea
                id="platform-banner"
                placeholder="Shown to institution admins across the platform"
                rows={3}
                value={settings.announcementBanner}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    announcementBanner: event.target.value,
                  }))
                }
              />
            </Field>

            <Button type="submit" className="w-fit">
              Save defaults
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
