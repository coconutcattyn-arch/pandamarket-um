import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
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
        <Header title="发布商品" currentUser={user} />
        <section className="rounded-[1.7rem] border border-white bg-gradient-to-br from-white to-[#FFF4E8] p-6 text-panda-ink shadow-[0_14px_36px_rgba(84,59,18,0.08)] sm:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#FF5A4F]"><T k="publish.eyebrow" /></p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl"><T k="publish.title" /></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-panda-muted">
            <T k="publish.note" />
          </p>
        </section>

        <PublishProductForm />
      </PageShell>
      <BottomNav />
    </>
  );
}
