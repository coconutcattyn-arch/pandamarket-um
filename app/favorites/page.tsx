import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { currentUserId, getFavoriteProducts } from "@/lib/data";

export default function FavoritesPage() {
  const favoriteProducts = getFavoriteProducts(currentUserId);

  return (
    <>
      <PageShell>
        <Header title="我的收藏" />
        <section className="rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-panda-leaf">收藏列表</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-panda-ink">先存下，再慢慢看</h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            当前使用统一 mock 收藏数据，后续接入 Supabase 后可关联到登录用户。
          </p>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Favorites" title={`${favoriteProducts.length} 件收藏`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
