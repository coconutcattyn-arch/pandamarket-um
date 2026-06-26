"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export type ProductSortKey = "latest" | "oldest" | "price_asc" | "price_desc";

export function ProductSortControls({ selectedSort }: { selectedSort: ProductSortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  function updateSort(sort: ProductSortKey) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (sort === "latest") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", sort);
    }

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <select
        aria-label="发布时间排序"
        className="min-w-0 rounded-full border border-panda-line/80 bg-white px-4 py-3 text-sm font-semibold text-panda-ink shadow-sm outline-none"
        value={selectedSort === "oldest" ? "oldest" : "latest"}
        onChange={(event) => updateSort(event.target.value as ProductSortKey)}
      >
        <option value="latest">{t("sort.latest")}</option>
        <option value="oldest">{t("sort.oldest")}</option>
      </select>
      <select
        aria-label="价格排序"
        className="min-w-0 rounded-full border border-panda-line/80 bg-white px-4 py-3 text-sm font-semibold text-panda-ink shadow-sm outline-none"
        value={selectedSort === "price_asc" || selectedSort === "price_desc" ? selectedSort : ""}
        onChange={(event) => updateSort((event.target.value || "latest") as ProductSortKey)}
      >
        <option value="">{t("sort.price")}</option>
        <option value="price_asc">{t("sort.priceAsc")}</option>
        <option value="price_desc">{t("sort.priceDesc")}</option>
      </select>
    </div>
  );
}
