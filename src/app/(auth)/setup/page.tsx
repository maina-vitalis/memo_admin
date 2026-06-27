import { redirect } from "next/navigation";

/**
 * Redirect: /setup is the authoritative account setup route.
 */
export default function AuthGroupSetupPage() {
  redirect("/setup");
}
