import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader, primaryButtonClass } from "@/components/ui";
import { getProductsBySellerIdFromSupabase } from "@/lib/product-queries";
import { getCurrentUser } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function MyProductsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/my-products");
  }

  const myProducts = await getProductsBySellerIdFromSupabase(user.id);
  const displayName = user.user_metadata?.display_name ?? user.email ?? "PandaMarket";

  return (
    <>
      <PageShell>
        <Header title="我的商品" currentUser={user} />
        <section className="rounded-[1.7rem] border border-white bg-gradient-to-br from-white to-[#FFF4E8] p-5 shadow-[0_14px_36px_rgba(84,59,18,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF5A4F]"><T k="my.eyebrow" /></p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-panda-ink">
            {displayName}<T k="my.titleSuffix" />
          </h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            <T k="my.note" />
          </p>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="My Listings" titleKey="my.countTitle" titleValues={{ count: myProducts.length }} />
          {myProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {myProducts.map((product) => (
                <div key={product.id} className="space-y-3">
                  <ProductCard product={product} compact />
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      prefetch
                      className="rounded-full bg-[#FF5A4F] px-4 py-2 text-center text-sm font-bold text-white shadow-[0_10px_22px_rgba(255,90,79,0.2)] transition hover:bg-[#F04D43]"
                    >
                      <T k="common.edit" />
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.7rem] border border-white bg-white/94 p-8 text-center shadow-[0_14px_36px_rgba(84,59,18,0.08)]">
              <h2 className="text-2xl font-black text-panda-ink"><T k="my.emptyTitle" /></h2>
              <Link
                href="/publish"
                prefetch
                className={`mt-5 inline-flex text-sm ${primaryButtonClass}`}
              >
                <T k="my.emptyAction" />
              </Link>
            </div>
          )}
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
