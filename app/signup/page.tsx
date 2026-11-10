import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";
import { T } from "@/lib/i18n";

export default function SignupPage() {
  return (
    <AuthShell>
      <h1>
        <T k="signup.title" />
      </h1>
      <p>
        <T k="signup.subtitle" />
      </p>
      <SignupForm />
      <p className="auth-alt">
        <T k="signup.haveAccount" />{" "}
        <Link href="/login">
          <T k="nav.login" />
        </Link>
      </p>
    </AuthShell>
  );
}
