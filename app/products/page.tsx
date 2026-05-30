import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, Pill, SectionHeader } from "@/components/ui";
import { categories, locations, productStatus } from "@/lib/data";
import { getProductsFromSupabase } from "@/lib/product-queries";

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProductsFromSupabase();

  return (
    <>
      <PageShell>
        <Header title="商品列表" />
        <section className="rounded-[1.8rem] border border-panda-line bg-white p-4 shadow-soft">
          <input
            className="w-full rounded-full border border-panda-line bg-panda-paper px-5 py-3 text-base text-panda-ink outline-none placeholder:text-panda-muted/70 focus:border-panda-lime focus:ring-4 focus:ring-panda-mint"
            placeholder="搜索关键词，例如：电饭煲、教材、桌子"
          />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <Pill active>全部</Pill>
            {categories.map((category) => (
              <Pill key={category.key}>{category.label}</Pill>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <Pill active>全部地点</Pill>
            {locations.map((location) => (
              <Pill key={location.key}>{location.label}</Pill>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <Pill active>全部状态</Pill>
            {productStatus.map((status) => (
              <Pill key={status.key}>{status.label}</Pill>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select className="rounded-full border border-panda-line bg-white px-4 py-3 text-sm text-panda-ink outline-none">
              <option>发布时间排序</option>
              <option>最新优先</option>
              <option>最早优先</option>
            </select>
            <select className="rounded-full border border-panda-line bg-white px-4 py-3 text-sm text-panda-ink outline-none">
              <option>价格排序</option>
              <option>价格从低到高</option>
              <option>价格从高到低</option>
            </select>
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Marketplace" title={`${products.length} 件 UM 闲置`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
