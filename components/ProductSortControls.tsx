"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProductSortKey = "latest" | "oldest" | "price_asc" | "price_desc";

export function ProductSortControls({ selectedSort }: { selectedSort: ProductSortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        className="min-w-0 rounded-full border border-panda-line bg-white px-4 py-3 text-sm text-panda-ink outline-none"
        value={selectedSort === "oldest" ? "oldest" : "latest"}
        onChange={(event) => updateSort(event.target.value as ProductSortKey)}
      >
        <option value="latest">最新发布</option>
        <option value="oldest">最早发布</option>
      </select>
      <select
        aria-label="价格排序"
        className="min-w-0 rounded-full border border-panda-line bg-white px-4 py-3 text-sm text-panda-ink outline-none"
        value={selectedSort === "price_asc" || selectedSort === "price_desc" ? selectedSort : ""}
        onChange={(event) => updateSort((event.target.value || "latest") as ProductSortKey)}
      >
        <option value="">价格排序</option>
        <option value="price_asc">价格从低到高</option>
        <option value="price_desc">价格从高到低</option>
      </select>
    </div>
  );
}

