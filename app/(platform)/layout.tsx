import { AuthGate } from "@/components/auth-gate";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGate>{children}</AuthGate>;
}
