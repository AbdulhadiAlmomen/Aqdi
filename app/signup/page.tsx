import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";
import { RichT } from "@/components/Legal";
import { messages, T } from "@/lib/i18n";

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
      <p className="legal-agree">
        <RichT
          k="legal.agree.signup"
          parts={{
            terms: (l) => <Link href="/terms">{messages[l]["legal.link.terms"]}</Link>,
            privacy: (l) => <Link href="/privacy">{messages[l]["legal.link.privacy"]}</Link>,
          }}
        />
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
