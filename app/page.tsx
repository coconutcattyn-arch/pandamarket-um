import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { FilterPillLink } from "@/components/FilterPillLink";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { categories, homeLocationTags } from "@/lib/data";
import { getProductsFromSupabase } from "@/lib/product-queries";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProductsFromSupabase();
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const freeProducts = products.filter((product) => product.category === "free");
  const graduationProducts = products.filter((product) => product.category === "graduation_sale");

  return (
    <>
      <PageShell>
        <Header />
        <section className="overflow-hidden rounded-[2rem] border border-panda-line bg-white px-6 py-8 shadow-soft sm:px-10 sm:py-12">
          <p className="mb-4 text-sm font-semibold text-panda-leaf">UM校园交易社区</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-panda-ink sm:text-6xl">
            PandaMarket
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-panda-muted">
            更轻松地出售闲置，找到身边的校园好物。第一阶段聚焦 UM，平台只做信息展示和买卖双方匹配。
          </p>
          <div className="mt-7 rounded-full border border-panda-line bg-panda-paper p-1.5 shadow-sm">
            <input
              className="w-full rounded-full bg-white px-5 py-3 text-base text-panda-ink outline-none placeholder:text-panda-muted/70"
              placeholder="搜索 UM 闲置：教材、桌子、电饭煲"
            />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-panda-lime px-5 py-3 text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]">
              浏览商品
            </Link>
            <Link href="/publish" className="rounded-full border border-panda-line bg-white px-5 py-3 text-sm font-semibold text-panda-ink">
              发布闲置
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Categories" title="常用分类" />
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            <FilterPillLink href="/products">全部类别</FilterPillLink>
            {categories.map((category) => (
              <FilterPillLink key={category.key} href={`/products?category=${category.key}`}>
                {category.label}
              </FilterPillLink>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Locations" title="常用地点" />
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            <FilterPillLink href="/products">全部位置</FilterPillLink>
            {homeLocationTags.map((location) => (
              <FilterPillLink key={location.key} href={location.key === "near_um" ? "/products?area=university" : `/products?location=${location.key}`}>
                {location.label}
              </FilterPillLink>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Latest" title="最新发布" actionHref="/products" actionText="查看全部" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Free" title="免费赠送专区" actionHref="/products" actionText="去看看" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {freeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Graduation" title="毕业季急出专区" actionHref="/products" actionText="查看专区" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {graduationProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
