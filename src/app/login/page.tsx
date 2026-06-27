import type { Metadata } from "next";
import { LoginCard } from "@/features/auth/login/components/login-card";

export const metadata: Metadata = {
  title: "Sign In — NostalQic Admin",
  description:
    "Sign in to the NostalQic admin portal as a platform admin or institution admin.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <LoginCard />
    </div>
  );
}
