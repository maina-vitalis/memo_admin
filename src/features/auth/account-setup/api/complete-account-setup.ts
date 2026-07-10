import { applyLoginResult } from '@/features/auth/auth-storage';
import type { CompleteAccountSetupInput } from '@/features/auth/account-setup/types/account-setup';
import type { LoginResult } from '@/features/auth/types';
import { Role } from '@/lib/rbac/role.enum';

type CompleteSetupResponse = {
  tokenType?: 'Bearer';
  expiresIn?: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    institutionId: string | null;
  };
  institution?: {
    id: string;
    name: string;
    subdomain: string;
  };
};

export class CompleteAccountSetupError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'CompleteAccountSetupError';
  }
}

export async function completeAccountSetup(
  input: CompleteAccountSetupInput,
): Promise<LoginResult> {
  const res = await fetch('/api/auth/setup/complete', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: input.token,
      password: input.password,
      deviceType: 'web',
    }),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      message?: string | string[];
    };
    const raw = errBody?.message;
    const message = Array.isArray(raw)
      ? raw.join(', ')
      : (raw ?? 'Failed to complete account setup');
    throw new CompleteAccountSetupError(message, res.status);
  }

  const json = (await res.json()) as
    | { data?: CompleteSetupResponse }
    | CompleteSetupResponse;

  const result =
    'data' in json && json.data ? json.data : (json as CompleteSetupResponse);

  const loginResult: LoginResult = {
    tokenType: result.tokenType,
    expiresIn: result.expiresIn,
    user: {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      role: result.user.role ?? Role.INSTITUTION_ADMIN,
      institutionId: result.user.institutionId,
    },
    institution: result.institution ?? null,
  };

  applyLoginResult(loginResult);
  return loginResult;
}
