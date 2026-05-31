import { BottomNav } from "@/components/BottomNav";
import { FilterPillLink } from "@/components/FilterPillLink";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductSortControls, type ProductSortKey } from "@/components/ProductSortControls";
import { PageShell, SectionHeader } from "@/components/ui";
import { categories, getCategoryLabel, getLocationLabel, locationGroups, locations, productStatus } from "@/lib/data";
import { getProductsFromSupabase } from "@/lib/product-queries";
import type { ProductCategoryKey, ProductLocationKey, ProductStatusKey } from "@/lib/types";

export const revalidate = 60;

type ProductsSearchParams = {
  category?: string;
  area?: string;
  location?: string;
  status?: string;
  q?: string;
  sort?: string;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildProductsHref(params: ProductsSearchParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `/products?${query}` : "/products";
}

function isCategoryKey(value?: string): value is ProductCategoryKey {
  return Boolean(value && categories.some((category) => category.key === value));
}

function isLocationKey(value?: string): value is ProductLocationKey {
  return Boolean(value && locations.some((location) => location.key === value));
}

function isStatusKey(value?: string): value is ProductStatusKey {
  return Boolean(value && productStatus.some((status) => status.key === value));
}

function isSortKey(value?: string): value is ProductSortKey {
  return value === "latest" || value === "oldest" || value === "price_asc" || value === "price_desc";
}

function safeTime(value: string | undefined) {
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function safePrice(value: number | string | undefined, fallback: number) {
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) ? price : fallback;
}

export default async function ProductsPage({ searchParams }: { searchParams?: ProductsSearchParams }) {
  const products = await getProductsFromSupabase();
  const selectedCategory = isCategoryKey(firstValue(searchParams?.category)) ? firstValue(searchParams?.category) : undefined;
  const selectedLocation = isLocationKey(firstValue(searchParams?.location)) ? firstValue(searchParams?.location) : undefined;
  const selectedStatus = isStatusKey(firstValue(searchParams?.status)) ? firstValue(searchParams?.status) : undefined;
  const keyword = firstValue(searchParams?.q)?.trim() ?? "";
  const rawSort = firstValue(searchParams?.sort);
  const selectedSort: ProductSortKey = isSortKey(rawSort) ? rawSort : "latest";
  const requestedArea = firstValue(searchParams?.area);
  const areaFromLocation = locationGroups.find((group) =>
    selectedLocation ? (group.locationKeys as readonly string[]).includes(selectedLocation) : false
  )?.key;
  const selectedArea = locationGroups.some((group) => group.key === requestedArea)
    ? requestedArea
    : areaFromLocation;
  const selectedAreaGroup = locationGroups.find((group) => group.key === selectedArea);

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

    if (selectedStatus && product.status !== selectedStatus) {
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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "oldest") {
      return safeTime(a.createdAt) - safeTime(b.createdAt);
    }

    if (selectedSort === "price_asc") {
      return safePrice(a.price, Number.POSITIVE_INFINITY) - safePrice(b.price, Number.POSITIVE_INFINITY);
    }

    if (selectedSort === "price_desc") {
      return safePrice(b.price, Number.NEGATIVE_INFINITY) - safePrice(a.price, Number.NEGATIVE_INFINITY);
    }

    return safeTime(b.createdAt) - safeTime(a.createdAt);
  });

  const baseCategoryParams = {
    area: selectedArea,
    location: selectedLocation,
    status: selectedStatus,
    q: keyword,
    sort: selectedSort === "latest" ? undefined : selectedSort
  };
  const baseLocationParams = {
    category: selectedCategory,
    status: selectedStatus,
    q: keyword,
    sort: selectedSort === "latest" ? undefined : selectedSort
  };
  const baseStatusParams = {
    category: selectedCategory,
    area: selectedArea,
    location: selectedLocation,
    q: keyword,
    sort: selectedSort === "latest" ? undefined : selectedSort
  };

  return (
    <>
      <PageShell>
        <Header title="商品列表" />
        <section className="rounded-[1.8rem] border border-panda-line bg-white p-4 shadow-soft">
          <form action="/products">
            {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
            {selectedArea ? <input name="area" type="hidden" value={selectedArea} /> : null}
            {selectedLocation ? <input name="location" type="hidden" value={selectedLocation} /> : null}
            {selectedStatus ? <input name="status" type="hidden" value={selectedStatus} /> : null}
            {selectedSort !== "latest" ? <input name="sort" type="hidden" value={selectedSort} /> : null}
            <input
              name="q"
              defaultValue={keyword}
            className="w-full rounded-full border border-panda-line bg-panda-paper px-5 py-3 text-base text-panda-ink outline-none placeholder:text-panda-muted/70 focus:border-panda-lime focus:ring-4 focus:ring-panda-mint"
            placeholder="搜索关键词，例如：电饭煲、教材、桌子"
            />
          </form>

          <div className="mt-5 space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-panda-muted">物品类别</p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <FilterPillLink href={buildProductsHref(baseCategoryParams)} active={!selectedCategory}>
                全部类别
              </FilterPillLink>
              {categories.map((category) => (
                <FilterPillLink
                  key={category.key}
                  href={buildProductsHref({ ...baseCategoryParams, category: category.key })}
                  active={selectedCategory === category.key}
                >
                  {category.label}
                </FilterPillLink>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-panda-muted">位置</p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <FilterPillLink href={buildProductsHref(baseLocationParams)} active={!selectedArea && !selectedLocation}>
                全部位置
              </FilterPillLink>
              {locationGroups.map((group) => (
                <FilterPillLink
                  key={group.key}
                  href={buildProductsHref({ ...baseLocationParams, area: group.key })}
                  active={selectedArea === group.key && !selectedLocation}
                >
                  {group.label}
                </FilterPillLink>
              ))}
            </div>

            {selectedAreaGroup ? (
              <div className="rounded-[1.4rem] border border-panda-line bg-panda-paper p-3">
                <div className="flex flex-wrap gap-2">
                  <FilterPillLink
                    href={buildProductsHref({ ...baseLocationParams, area: selectedAreaGroup.key })}
                    active={!selectedLocation}
                  >
                    {selectedAreaGroup.label}全部
                  </FilterPillLink>
                  {selectedAreaGroup.locationKeys.map((locationKey) => (
                    <FilterPillLink
                      key={locationKey}
                      href={buildProductsHref({
                        ...baseLocationParams,
                        area: selectedAreaGroup.key,
                        location: locationKey
                      })}
                      active={selectedLocation === locationKey}
                    >
                      {getLocationLabel(locationKey as ProductLocationKey)}
                    </FilterPillLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-panda-muted">商品状态</p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <FilterPillLink href={buildProductsHref(baseStatusParams)} active={!selectedStatus}>
                全部状态
              </FilterPillLink>
              {productStatus.map((status) => (
                <FilterPillLink
                  key={status.key}
                  href={buildProductsHref({ ...baseStatusParams, status: status.key })}
                  active={selectedStatus === status.key}
                >
                  {status.label}
                </FilterPillLink>
              ))}
            </div>
          </div>

          <ProductSortControls selectedSort={selectedSort} />
        </section>

        <section className="mt-8">
          <SectionHeader eyebrow="Marketplace" title={`${sortedProducts.length} 件 UM 闲置`} />
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.8rem] border border-panda-line bg-white px-5 py-10 text-center text-panda-muted shadow-soft">
              暂无符合条件的商品
            </div>
          )}
        </section>
      </PageShell>
      <BottomNav />
    </>
  );
}
