import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Field, PageShell, inputClass } from "@/components/ui";

export default function LoginPage() {
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

          <form className="mt-7 space-y-5">
            <Field label="邮箱或手机号">
              <input className={inputClass} placeholder="例如：name@email.com" />
            </Field>
            <Field label="密码">
              <input className={inputClass} placeholder="请输入密码" type="password" />
            </Field>
            <button className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]">
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
