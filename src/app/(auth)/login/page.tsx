import { redirect } from "next/navigation";

/**
 * Canonical redirect: /login is the authoritative login route.
 * This file ensures the (auth) route group variant also resolves correctly.
 */
export default function AuthGroupLoginPage() {
  redirect("/login");
}
