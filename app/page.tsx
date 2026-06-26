import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { BrandLockup } from "@/components/BrandLockup";
import { FilterPillLink } from "@/components/FilterPillLink";
import { CategoryLabel, LanguageToggle, LocationGroupLabel, LocationLabel, T } from "@/components/I18nProvider";
import { LocalizedSearchInput } from "@/components/LocalizedInput";
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

const categoryVisuals: Record<string, { mark: string; tone: string }> = {
  kitchen: { mark: "⌁", tone: "from-[#FF8A45] to-[#FFB13B]" },
  electronics: { mark: "◇", tone: "from-[#FF6B5B] to-[#FF965B]" },
  furniture: { mark: "▱", tone: "from-[#8A7CFF] to-[#B69CFF]" },
  appliances: { mark: "○", tone: "from-[#35A7FF] to-[#77D4FF]" },
  books: { mark: "▤", tone: "from-[#FF5D7A] to-[#FF9AAE]" },
  fashion: { mark: "△", tone: "from-[#F25F8B] to-[#FF9A76]" },
  sports: { mark: "◎", tone: "from-[#28C6A6] to-[#6AE2C8]" },
  beauty: { mark: "✦", tone: "from-[#C46AFF] to-[#F0A4FF]" }
};

function getCategoryVisual(key: string) {
  return categoryVisuals[key] ?? { mark: "•", tone: "from-[#8FD3F4] to-[#84FAB0]" };
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
        <section className="sticky top-0 z-20 -mx-4 mb-3 border-b border-white/70 bg-[#FFFDF7]/86 px-4 py-2 shadow-[0_10px_30px_rgba(95,69,20,0.06)] backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <BrandLockup priority />
            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle />
              <Link
                href="/publish"
                prefetch
                className="rounded-full bg-[#FF5A4F] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,79,0.24)] transition hover:bg-[#F04D43]"
              >
                <T k="common.publish" />
              </Link>
            </div>
          </div>
        </section>
        <section className="overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#FF7B45] via-[#FF6154] to-[#FF3F68] p-4 text-white shadow-[0_18px_46px_rgba(255,90,79,0.22)] sm:rounded-[2rem] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[72%]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75"><T k="home.eyebrow" /></p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">
                <T k="home.heroTitle1" />
                <span className="block text-[#FFE36F]"><T k="home.heroTitle2" /></span>
              </h1>
              <p className="mt-2 text-sm font-medium text-white/82 sm:text-base"><T k="home.heroBody" /></p>
            </div>
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.6rem] bg-white/18 shadow-inner sm:h-28 sm:w-28">
              <div className="absolute left-4 top-4 h-8 w-8 rounded-2xl bg-white/80 shadow-sm sm:h-10 sm:w-10" />
              <div className="absolute bottom-4 right-4 h-10 w-10 rounded-[1rem] bg-[#FFE36F] shadow-sm sm:h-14 sm:w-14" />
              <div className="absolute left-5 top-10 h-8 w-12 rotate-[-10deg] rounded-xl bg-[#B71422]/80 shadow-sm sm:left-7 sm:top-14 sm:h-10 sm:w-16" />
            </div>
          </div>
          <form action="/" className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_10px_30px_rgba(73,35,18,0.18)]">
            {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
            {selectedArea ? <input name="area" type="hidden" value={selectedArea} /> : null}
            {selectedLocation ? <input name="location" type="hidden" value={selectedLocation} /> : null}
            <span className="text-sm text-[#FF5A4F]">⌕</span>
            <LocalizedSearchInput
              className="w-full bg-transparent text-sm text-panda-ink outline-none placeholder:text-panda-muted/70 sm:text-base"
              name="q"
              defaultValue={keyword}
              placeholderKey="home.searchPlaceholder"
            />
          </form>
        </section>

        <section className="mt-4">
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            <Link
              href={buildHomeHref(baseCategoryParams)}
              prefetch
              className={`flex min-w-[72px] shrink-0 flex-col items-center gap-2 rounded-[1.1rem] border px-3 py-3 text-center text-xs font-semibold transition ${
                !selectedCategory
                  ? "border-[#FF5A4F] bg-[#FFF0E8] text-[#FF4F45] shadow-sm"
                  : "border-white bg-white text-panda-ink shadow-sm"
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#FFD071] to-[#FF8A45] text-sm font-black text-white">∞</span>
              <T k="home.allCategoryShort" />
            </Link>
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.key}
                href={buildHomeHref({ ...baseCategoryParams, category: category.key })}
                prefetch
                className={`flex min-w-[72px] shrink-0 flex-col items-center gap-2 rounded-[1.1rem] border px-3 py-3 text-center text-xs font-semibold transition ${
                  selectedCategory === category.key
                    ? "border-[#FF5A4F] bg-[#FFF0E8] text-[#FF4F45] shadow-sm"
                    : "border-white bg-white text-panda-ink shadow-sm"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br ${getCategoryVisual(category.key).tone} text-sm font-black text-white shadow-sm`}>
                  {getCategoryVisual(category.key).mark}
                </span>
                <CategoryLabel value={category.key} />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-2">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
            <FilterPillLink href={buildHomeHref(baseLocationParams)} active={!selectedArea && !selectedLocation}>
              <T k="home.allLocations" />
            </FilterPillLink>
            {locationGroups.map((group) => (
              <FilterPillLink
                key={group.key}
                href={buildHomeHref({ ...baseLocationParams, area: group.key })}
                active={selectedArea === group.key && !selectedLocation}
              >
                <LocationGroupLabel value={group.key} />
              </FilterPillLink>
            ))}
          </div>
          {selectedAreaGroup ? (
            <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
              <FilterPillLink href={buildHomeHref({ ...baseLocationParams, area: selectedAreaGroup.key })} active={!selectedLocation}>
                <LocationGroupLabel value={selectedAreaGroup.key} /> <T k="home.allCategoryShort" />
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
                  <LocationLabel value={locationKey} />
                </FilterPillLink>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-4">
          <SectionHeader eyebrow="Recently Added" titleKey="home.latestTitle" actionHref="/products" actionTextKey="common.viewAll" />
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.4rem] border border-white bg-white/94 px-4 py-8 text-center text-sm text-panda-muted shadow-[0_14px_36px_rgba(84,59,18,0.08)]">
              <T k="common.noMatchingProducts" />
            </div>
          )}
        </section>

        <section className="mt-7">
          <SectionHeader eyebrow="Free" titleKey="home.freeTitle" actionHref="/products" actionTextKey="common.explore" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {freeProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader eyebrow="Graduation" titleKey="home.graduationTitle" actionHref="/products" actionTextKey="common.viewAll" />
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
