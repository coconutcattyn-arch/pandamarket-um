import { BottomNav } from "@/components/BottomNav";
import { FilterPillLink } from "@/components/FilterPillLink";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PageShell, SectionHeader } from "@/components/ui";
import { categories, locationGroups, locations, productStatus } from "@/lib/data";
import { getProductsFromSupabase } from "@/lib/product-queries";
import type { ProductCategoryKey, ProductLocationKey, ProductStatusKey } from "@/lib/types";

export const revalidate = 60;

type ProductsSearchParams = {
  category?: string;
  area?: string;
  location?: string;
  status?: string;
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

function getLocationLabel(locationKey: string) {
  return locations.find((location) => location.key === locationKey)?.label ?? locationKey;
}

export default async function ProductsPage({ searchParams }: { searchParams?: ProductsSearchParams }) {
  const products = await getProductsFromSupabase();
  const selectedCategory = isCategoryKey(firstValue(searchParams?.category)) ? firstValue(searchParams?.category) : undefined;
  const selectedLocation = isLocationKey(firstValue(searchParams?.location)) ? firstValue(searchParams?.location) : undefined;
  const selectedStatus = isStatusKey(firstValue(searchParams?.status)) ? firstValue(searchParams?.status) : undefined;
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

    return true;
  });

  const baseCategoryParams = {
    area: selectedArea,
    location: selectedLocation,
    status: selectedStatus
  };
  const baseLocationParams = {
    category: selectedCategory,
    status: selectedStatus
  };
  const baseStatusParams = {
    category: selectedCategory,
    area: selectedArea,
    location: selectedLocation
  };

  return (
    <>
      <PageShell>
        <Header title="商品列表" />
        <section className="rounded-[1.8rem] border border-panda-line bg-white p-4 shadow-soft">
          <input
            className="w-full rounded-full border border-panda-line bg-panda-paper px-5 py-3 text-base text-panda-ink outline-none placeholder:text-panda-muted/70 focus:border-panda-lime focus:ring-4 focus:ring-panda-mint"
            placeholder="搜索关键词，例如：电饭煲、教材、桌子"
          />

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
                      {getLocationLabel(locationKey)}
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
          <SectionHeader eyebrow="Marketplace" title={`${filteredProducts.length} 件 UM 闲置`} />
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
