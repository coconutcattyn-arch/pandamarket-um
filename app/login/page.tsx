import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Field, PageShell, inputClass } from "@/components/ui";
import { signInAction } from "@/lib/auth-actions";

function errorMessage(error?: string) {
  if (!error) return null;
  if (error === "missing_config") return "请先配置 Supabase 环境变量。";
  if (error === "missing_fields") return "请填写邮箱和密码。";
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
        <section className="mx-auto max-w-md rounded-[2rem] border border-panda-line bg-white p-6 shadow-soft sm:p-8">
          <p className="mb-3 text-sm font-semibold text-panda-leaf">欢迎回来</p>
          <h1 className="text-3xl font-semibold tracking-tight text-panda-ink">登录 PandaMarket</h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            第一阶段面向 UM 中国留学生验证，后续可扩展学校邮箱认证。
          </p>

          {searchParams?.registered ? (
            <p className="mt-5 rounded-[1.2rem] border border-panda-line bg-panda-paper px-4 py-3 text-sm font-medium text-panda-ink">
              注册成功，请登录。
            </p>
          ) : null}
          {message ? (
            <p className="mt-5 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </p>
          ) : null}

          <form action={signInAction} className="mt-7 space-y-5">
            <input name="next" type="hidden" value={next} />
            <Field label="邮箱">
              <input className={inputClass} name="email" placeholder="例如：name@email.com" type="email" required />
            </Field>
            <Field label="密码">
              <input className={inputClass} name="password" placeholder="请输入密码" type="password" required />
            </Field>
            <button className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]" type="submit">
              登录
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/register" className="font-semibold text-panda-leaf">
              创建账号
            </Link>
            <button className="text-panda-muted">找回密码</button>
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
