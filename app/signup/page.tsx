import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { LogoMark } from "@/components/LogoMark";
import { T } from "@/lib/i18n";

// Placeholder until office accounts land in step 2 of docs/BUILD_PLAN.md.
export default function SignupPage() {
  return (
    <AuthShell>
      <LogoMark className="logo-mark auth-mark" />
      <h1>
        <T k="signup.title" />
      </h1>
      <p>
        <T k="signup.soon" />
      </p>
      <p className="auth-alt">
        <T k="signup.haveAccount" />{" "}
        <Link href="/login">
          <T k="nav.login" />
        </Link>
      </p>
    </AuthShell>
  );
}
