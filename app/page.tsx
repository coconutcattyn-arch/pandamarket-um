import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { BrandLockup } from "@/components/BrandLockup";
import { FilterPillLink } from "@/components/FilterPillLink";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { categories, getCategoryLabel, getLocationLabel, locationGroups, locations } from "@/lib/data";
import { getProductsFromSupabase } from "@/lib/product-queries";
import type { ProductCategoryKey, ProductLocationKey } from "@/lib/types";

export const revalidate = 60;

type HomeSearchParams = {
  category?: string;
  area?: string;
  location?: string;
  q?: string;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildHomeHref(params: HomeSearchParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `/?${query}` : "/";
}

function isCategoryKey(value?: string): value is ProductCategoryKey {
  return Boolean(value && categories.some((category) => category.key === value));
}

function isLocationKey(value?: string): value is ProductLocationKey {
  return Boolean(value && locations.some((location) => location.key === value));
}

export default async function HomePage({ searchParams }: { searchParams?: HomeSearchParams }) {
  const products = await getProductsFromSupabase();
  const selectedCategory = isCategoryKey(firstValue(searchParams?.category)) ? firstValue(searchParams?.category) : undefined;
  const selectedLocation = isLocationKey(firstValue(searchParams?.location)) ? firstValue(searchParams?.location) : undefined;
  const keyword = firstValue(searchParams?.q)?.trim() ?? "";
  const requestedArea = firstValue(searchParams?.area);
  const areaFromLocation = locationGroups.find((group) =>
    selectedLocation ? (group.locationKeys as readonly string[]).includes(selectedLocation) : false
  )?.key;
  const selectedArea = locationGroups.some((group) => group.key === requestedArea) ? requestedArea : areaFromLocation;
  const selectedAreaGroup = locationGroups.find((group) => group.key === selectedArea);
  const baseCategoryParams = {
    area: selectedArea,
    location: selectedLocation,
    q: keyword
  };
  const baseLocationParams = {
    category: selectedCategory,
    q: keyword
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    if (selectedLocation && product.location !== selectedLocation) {
      return false;
    }

    if (!selectedLocation && selectedAreaGroup && !(selectedAreaGroup.locationKeys as readonly string[]).includes(product.location)) {
      return false;
    }

    if (keyword) {
      const haystack = [
        product.title,
        product.description,
        getCategoryLabel(product.category),
        getLocationLabel(product.location)
      ].join(" ").toLowerCase();

      if (!haystack.includes(keyword.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const latestProducts = [...filteredProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const freeProducts = filteredProducts.filter((product) => product.category === "free");
  const graduationProducts = filteredProducts.filter((product) => product.category === "graduation_sale");

  return (
    <>
      <PageShell>
        <section className="sticky top-0 z-20 -mx-4 mb-3 border-b border-panda-line/70 bg-[#FFFDF7]/88 px-4 pb-2.5 pt-2 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <BrandLockup priority />
            <Link
              href="/publish"
              prefetch
              className="shrink-0 rounded-full bg-panda-lime px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
            >
              发布
            </Link>
          </div>
        </section>
        <section className="pb-3 sm:pb-5">
          <form action="/" className="mt-4 rounded-full border border-panda-line bg-white px-4 py-2.5 shadow-sm">
            {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
            {selectedArea ? <input name="area" type="hidden" value={selectedArea} /> : null}
            {selectedLocation ? <input name="location" type="hidden" value={selectedLocation} /> : null}
            <input
              className="w-full bg-transparent text-sm text-panda-ink outline-none placeholder:text-panda-muted/70 sm:text-base"
              name="q"
              defaultValue={keyword}
              placeholder="搜索二手商品"
            />
          </form>
        </section>

        <section className="mt-1">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <FilterPillLink href={buildHomeHref(baseCategoryParams)} active={!selectedCategory}>
              全部类别
            </FilterPillLink>
            {categories.slice(0, 8).map((category) => (
              <FilterPillLink
                key={category.key}
                href={buildHomeHref({ ...baseCategoryParams, category: category.key })}
                active={selectedCategory === category.key}
              >
                {category.label}
              </FilterPillLink>
            ))}
          </div>
        </section>

        <section className="mt-2">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <FilterPillLink href={buildHomeHref(baseLocationParams)} active={!selectedArea && !selectedLocation}>
              全部位置
            </FilterPillLink>
            {locationGroups.map((group) => (
              <FilterPillLink
                key={group.key}
                href={buildHomeHref({ ...baseLocationParams, area: group.key })}
                active={selectedArea === group.key && !selectedLocation}
              >
                {group.label}
              </FilterPillLink>
            ))}
          </div>
          {selectedAreaGroup ? (
            <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
              <FilterPillLink href={buildHomeHref({ ...baseLocationParams, area: selectedAreaGroup.key })} active={!selectedLocation}>
                {selectedAreaGroup.label}全部
              </FilterPillLink>
              {selectedAreaGroup.locationKeys.map((locationKey) => (
                <FilterPillLink
                  key={locationKey}
                  href={buildHomeHref({
                    ...baseLocationParams,
                    area: selectedAreaGroup.key,
                    location: locationKey
                  })}
                  active={selectedLocation === locationKey}
                >
                  {getLocationLabel(locationKey)}
                </FilterPillLink>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-4">
          <SectionHeader eyebrow="Latest" title="最新发布" actionHref="/products" actionText="查看全部" />
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.4rem] border border-panda-line bg-white px-4 py-8 text-center text-sm text-panda-muted shadow-soft">
              暂无符合条件的商品
            </div>
          )}
        </section>

        <section className="mt-7">
          <SectionHeader eyebrow="Free" title="免费赠送专区" actionHref="/products" actionText="去看看" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {freeProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader eyebrow="Graduation" title="毕业季急出专区" actionHref="/products" actionText="查看专区" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {graduationProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
