import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
import { ProductEditForm } from "@/components/ProductEditForm";
import { PageShell } from "@/components/ui";
import { getProductByIdFromSupabase } from "@/lib/product-queries";
import { getCurrentUser } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/products/${params.id}/edit`);
  }

  const product = await getProductByIdFromSupabase(params.id);

  if (!product) {
    notFound();
  }

  if (product.sellerId !== user.id) {
    redirect(`/products/${product.id}`);
  }

  return (
    <PageShell>
      <Header title="编辑商品" currentUser={user} />
      <section className="rounded-[1.7rem] border border-white bg-gradient-to-br from-white to-[#FFF4E8] p-6 text-panda-ink shadow-[0_14px_36px_rgba(84,59,18,0.08)] sm:p-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#FF5A4F]"><T k="edit.eyebrow" /></p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl"><T k="edit.title" /></h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-panda-muted">
          <T k="edit.note" />
        </p>
      </section>
      <ProductEditForm product={product} />
      <Link href={`/products/${product.id}`} prefetch className="mt-5 inline-flex text-sm font-bold text-[#FF5A4F]">
        <T k="edit.back" />
      </Link>
    </PageShell>
  );
}
