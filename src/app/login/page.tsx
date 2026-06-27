<<<<<<< HEAD
import { LoginForm } from "@/features/super-admin/auth/components/login-form";

export default function LoginPage() {
  return <LoginForm />;
=======
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      <LoginForm />
    </main>
  );
>>>>>>> 8e5303006be458d7f1c79692b03ba1221dfcc55f
}
