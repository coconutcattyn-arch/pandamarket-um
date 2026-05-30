import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Field, PageShell, inputClass } from "@/components/ui";

export default function RegisterPage() {
  return (
    <>
      <PageShell>
        <Header title="注册" />
        <section className="mx-auto max-w-md rounded-[2rem] border border-panda-line bg-white p-6 shadow-soft sm:p-8">
          <p className="mb-3 text-sm font-semibold text-panda-leaf">加入校园交易社区</p>
          <h1 className="text-3xl font-semibold tracking-tight text-panda-ink">创建 PandaMarket 账号</h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            先用基础账号完成原型验证，未来支持学校邮箱认证和 UM 认证用户标识。
          </p>

          <form className="mt-7 space-y-5">
            <Field label="昵称">
              <input className={inputClass} placeholder="例如：小林" />
            </Field>
            <Field label="邮箱">
              <input className={inputClass} placeholder="name@email.com" type="email" />
            </Field>
            <Field label="密码">
              <input className={inputClass} placeholder="至少 8 位字符" type="password" />
            </Field>
            <button className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]">
              注册
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-panda-muted">
            已有账号？
            <Link href="/login" className="font-semibold text-panda-leaf">
              去登录
            </Link>
          </p>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
