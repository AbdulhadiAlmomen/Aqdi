import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { LogoMark } from "@/components/LogoMark";
import { T } from "@/lib/i18n";

// Placeholder until office accounts land in step 2 of docs/BUILD_PLAN.md.
export default function LoginPage() {
  return (
    <AuthShell>
      <LogoMark className="logo-mark auth-mark" />
      <h1>
        <T k="login.title" />
      </h1>
      <p>
        <T k="login.soon" />
      </p>
      <p className="auth-alt">
        <T k="login.noAccount" />{" "}
        <Link href="/signup">
          <T k="nav.start" />
        </Link>
      </p>
    </AuthShell>
  );
}
