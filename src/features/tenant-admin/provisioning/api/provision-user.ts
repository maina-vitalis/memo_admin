import { tenantApi } from "../../shared/api/client";
import type { ProvisionUserFormValues } from "../schemas/provision-user.schema";
import type { ProvisionedUser } from "../types/provision-user";

export async function provisionUser(
  data: ProvisionUserFormValues,
): Promise<ProvisionedUser> {
  return tenantApi<ProvisionedUser>("/users/provision", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
