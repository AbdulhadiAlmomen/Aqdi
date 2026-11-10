import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/AuthForms";
import { T } from "@/lib/i18n";

export default function LoginPage() {
  return (
    <AuthShell>
      <h1>
        <T k="login.title" />
      </h1>
      <p>
        <T k="login.subtitle" />
      </p>
      <LoginForm />
      <p className="auth-alt">
        <T k="login.noAccount" />{" "}
        <Link href="/signup">
          <T k="nav.start" />
        </Link>
      </p>
    </AuthShell>
  );
}
