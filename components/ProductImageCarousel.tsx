"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ProductImage } from "@/lib/types";

const fallbackImage: ProductImage = {
  id: "fallback-product-image",
  url: "/images/product-books.svg",
  alt: "商品图片",
  sortOrder: 1
};

export function ProductImageCarousel({
  images,
  statusBadge
}: {
  images: ProductImage[];
  statusBadge: React.ReactNode;
}) {
  const sortedImages = useMemo(
    () => (images.length > 0 ? [...images].sort((a, b) => a.sortOrder - b.sortOrder) : [fallbackImage]),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeImage = sortedImages[activeIndex] ?? sortedImages[0];
  const hasMultipleImages = sortedImages.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? sortedImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === sortedImages.length - 1 ? 0 : current + 1));
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null || !hasMultipleImages) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(deltaX) > 42) {
      if (deltaX > 0) {
        showPrevious();
      } else {
        showNext();
      }
    }

    setTouchStartX(null);
  }

  return (
    <section>
      <div
        className="relative aspect-[4/3] bg-[#FFF3DE]"
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <Image src={activeImage.url} alt={activeImage.alt} fill className="object-cover" priority />
        <div className="absolute left-4 top-4">{statusBadge}</div>
        <div className="absolute bottom-4 right-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-panda-ink shadow-sm">
          {activeIndex + 1} / {sortedImages.length}
        </div>
        {hasMultipleImages ? (
          <>
            <button
              aria-label="上一张图片"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-xl font-bold text-[#FF5A4F] shadow-sm transition hover:bg-white"
              type="button"
              onClick={showPrevious}
            >
              ‹
            </button>
            <button
              aria-label="下一张图片"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-xl font-bold text-[#FF5A4F] shadow-sm transition hover:bg-white"
              type="button"
              onClick={showNext}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto border-b border-panda-line/70 bg-[#FFF8EC] p-3 no-scrollbar">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              aria-label={`查看第 ${index + 1} 张图片`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border bg-white transition ${
                index === activeIndex ? "border-[#FF5A4F] ring-2 ring-[#FFD1B8]" : "border-panda-line/80"
              }`}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
