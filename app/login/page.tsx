import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
import { LocalizedTextInput } from "@/components/LocalizedInput";
import { Field, PageShell, inputClass, primaryButtonClass } from "@/components/ui";
import { signInAction } from "@/lib/auth-actions";

function errorMessage(error?: string) {
  if (!error) return null;
  if (error === "missing_config") return "missing_config";
  if (error === "missing_fields") return "missing_fields";
  return decodeURIComponent(error);
}

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string; next?: string; registered?: string };
}) {
  const message = errorMessage(searchParams?.error);
  const next = searchParams?.next ?? "/products";

  return (
    <>
      <PageShell>
        <Header title="登录" />
        <section className="mx-auto max-w-md overflow-hidden rounded-[1.7rem] border border-white bg-white/94 shadow-[0_18px_46px_rgba(84,59,18,0.1)]">
          <div className="bg-gradient-to-br from-[#FF7B45] via-[#FF6154] to-[#FF3F68] p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75"><T k="login.eyebrow" /></p>
            <h1 className="mt-2 text-3xl font-black tracking-tight"><T k="login.title" /></h1>
            <p className="mt-3 text-sm leading-6 text-white/82">
              <T k="login.hero" />
            </p>
          </div>
          <div className="p-6 sm:p-8">
          <p className="text-sm leading-6 text-panda-muted">
            <T k="login.note" />
          </p>

          {searchParams?.registered ? (
            <p className="mt-5 rounded-[1.2rem] border border-panda-line bg-panda-paper px-4 py-3 text-sm font-medium text-panda-ink">
              <T k="login.registered" />
            </p>
          ) : null}
          {message ? (
            <p className="mt-5 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message === "missing_config" ? <T k="error.missingConfig" /> : message === "missing_fields" ? <T k="error.missingLoginFields" /> : message}
            </p>
          ) : null}

          <form action={signInAction} className="mt-7 space-y-5">
            <input name="next" type="hidden" value={next} />
            <Field label={<T k="login.email" />}>
              <LocalizedTextInput className={inputClass} name="email" placeholderKey="login.emailPlaceholder" type="email" required />
            </Field>
            <Field label={<T k="login.password" />}>
              <LocalizedTextInput className={inputClass} name="password" placeholderKey="login.passwordPlaceholder" type="password" required />
            </Field>
            <button className={`w-full ${primaryButtonClass}`} type="submit">
              <T k="common.login" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/register" className="font-bold text-[#FF5A4F]">
              <T k="login.createAccount" />
            </Link>
            <button className="text-panda-muted"><T k="login.forgotPassword" /></button>
          </div>
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
