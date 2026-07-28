import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export async function retryMemoPush(id: string): Promise<{
  enqueued: true;
  recipientCount: number;
}> {
  return tenantApi(`/memos/${id}/retry-push`, { method: "POST" });
}
