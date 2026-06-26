import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
import { LocalizedTextInput } from "@/components/LocalizedInput";
import { Field, PageShell, inputClass, primaryButtonClass } from "@/components/ui";
import { signUpAction } from "@/lib/auth-actions";

function errorMessage(error?: string) {
  if (!error) return null;
  if (error === "missing_config") return "missing_config";
  if (error === "missing_fields") return "missing_fields";
  return decodeURIComponent(error);
}

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  const message = errorMessage(searchParams?.error);

  return (
    <>
      <PageShell>
        <Header title="注册" />
        <section className="mx-auto max-w-md overflow-hidden rounded-[1.7rem] border border-white bg-white/94 shadow-[0_18px_46px_rgba(84,59,18,0.1)]">
          <div className="bg-gradient-to-br from-[#FF7B45] via-[#FF6154] to-[#FF3F68] p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75"><T k="register.eyebrow" /></p>
            <h1 className="mt-2 text-3xl font-black tracking-tight"><T k="register.title" /></h1>
            <p className="mt-3 text-sm leading-6 text-white/82">
              <T k="register.hero" />
            </p>
          </div>
          <div className="p-6 sm:p-8">
          <p className="text-sm leading-6 text-panda-muted">
            <T k="register.note" />
          </p>

          {message ? (
            <p className="mt-5 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message === "missing_config" ? <T k="error.missingConfig" /> : message === "missing_fields" ? <T k="error.missingRegisterFields" /> : message}
            </p>
          ) : null}

          <form action={signUpAction} className="mt-7 space-y-5">
            <Field label={<T k="register.displayName" />}>
              <LocalizedTextInput className={inputClass} name="displayName" placeholderKey="register.displayNamePlaceholder" required />
            </Field>
            <Field label={<T k="login.email" />}>
              <LocalizedTextInput className={inputClass} name="email" placeholderKey="login.emailPlaceholder" type="email" required />
            </Field>
            <Field label={<T k="login.password" />}>
              <LocalizedTextInput className={inputClass} name="password" placeholderKey="register.passwordPlaceholder" type="password" required />
            </Field>
            <button className={`w-full ${primaryButtonClass}`} type="submit">
              <T k="common.register" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-panda-muted">
            <T k="register.hasAccount" />
            <Link href="/login" className="font-bold text-[#FF5A4F]">
              <T k="register.goLogin" />
            </Link>
          </p>
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
