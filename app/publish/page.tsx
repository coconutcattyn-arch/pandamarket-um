import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { PublishProductForm } from "@/components/PublishProductForm";
import { PageShell } from "@/components/ui";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function PublishPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/publish");
  }

  return (
    <>
      <PageShell>
        <Header title="发布商品" />
        <section className="rounded-[2rem] border border-panda-line bg-white p-6 text-panda-ink shadow-soft sm:p-8">
          <p className="mb-3 text-sm font-semibold text-panda-leaf">发布商品不超过 1 分钟</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">把闲置交给附近需要的人。</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-panda-muted">
            填写核心信息即可发布。平台只做信息展示和匹配，交易请在线下自行完成。
          </p>
        </section>

        <PublishProductForm />
      </PageShell>
      <BottomNav />
    </>
  );
}
