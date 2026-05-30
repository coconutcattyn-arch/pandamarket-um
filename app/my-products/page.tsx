import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { currentUserId, defaultUserType, getMyProducts, getUserById, getUserTypeLabel } from "@/lib/data";

export default function MyProductsPage() {
  const currentUser = getUserById(currentUserId);
  const myProducts = getMyProducts(currentUserId);

  return (
    <>
      <PageShell>
        <Header title="我的商品" />
        <section className="rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-panda-leaf">{getUserTypeLabel(currentUser?.type ?? defaultUserType)}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-panda-ink">
            {currentUser?.name ?? "我的"}发布的商品
          </h1>
          <p className="mt-3 text-sm leading-6 text-panda-muted">
            当前展示 mock 用户发布的商品，后续接入 Supabase 后可按登录用户筛选。
          </p>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="My Listings" title={`${myProducts.length} 件商品`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
