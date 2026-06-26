import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { T } from "@/components/I18nProvider";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { currentUserId, getFavoriteProducts } from "@/lib/data";

export default function FavoritesPage() {
  const favoriteProducts = getFavoriteProducts(currentUserId);

  return (
    <>
      <PageShell>
        <Header title="我的收藏" />
        <section className="rounded-[1.7rem] border border-white bg-gradient-to-br from-white to-[#FFF4E8] p-5 shadow-[0_14px_36px_rgba(84,59,18,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF5A4F]"><T k="favorites.eyebrow" /></p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-panda-ink"><T k="favorites.title" /></h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            <T k="favorites.note" />
          </p>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Favorites" titleKey="favorites.countTitle" titleValues={{ count: favoriteProducts.length }} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
