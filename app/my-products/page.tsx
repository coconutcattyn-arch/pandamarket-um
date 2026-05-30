import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { getProductsBySellerIdFromSupabase } from "@/lib/product-queries";
import { getCurrentUser } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function MyProductsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/my-products");
  }

  const myProducts = await getProductsBySellerIdFromSupabase(user.id);
  const displayName = user.user_metadata?.display_name ?? user.email ?? "我的";

  return (
    <>
      <PageShell>
        <Header title="我的商品" />
        <section className="rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-panda-leaf">已登录</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-panda-ink">
            {displayName}发布的商品
          </h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            这里会显示你通过当前账号发布的商品。
          </p>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="My Listings" title={`${myProducts.length} 件商品`} />
          {myProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myProducts.map((product) => (
                <div key={product.id} className="space-y-3">
                  <ProductCard product={product} />
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="rounded-full bg-panda-lime px-4 py-2 text-center text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
                    >
                      编辑
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-panda-line bg-white p-8 text-center shadow-soft">
              <h2 className="text-2xl font-semibold text-panda-ink">你还没有发布商品</h2>
              <Link
                href="/publish"
                className="mt-5 inline-flex rounded-full bg-panda-lime px-5 py-3 text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
              >
                去发布第一件商品
              </Link>
            </div>
          )}
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
