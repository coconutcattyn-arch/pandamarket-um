"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryLabel, LocationLabel, useLocalizedDate } from "@/components/I18nProvider";
import { getPrimaryProductImage } from "@/lib/data";
import type { Product } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({
  product,
  compact = false
}: {
  product: Product;
  compact?: boolean;
}) {
  const image = getPrimaryProductImage(product);
  const formatDate = useLocalizedDate();

  return (
    <Link
      href={`/products/${product.id}`}
      prefetch
      className={`group block overflow-hidden border border-white bg-white shadow-[0_12px_34px_rgba(84,59,18,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(84,59,18,0.12)] ${
        compact ? "rounded-[1.15rem]" : "rounded-[1.6rem]"
      }`}
    >
      <div className="relative aspect-square bg-[#FFF3DE]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 50vw"
          quality={68}
        />
        <div className="absolute left-2.5 top-2.5">
          <StatusBadge status={product.status} />
        </div>
      </div>
      <div className={compact ? "p-3" : "p-4"}>
        <div className={compact ? "space-y-1.5" : "mb-2 flex items-start justify-between gap-3"}>
          <h3 className={`line-clamp-2 font-semibold leading-snug text-panda-ink ${compact ? "text-sm" : "text-base"}`}>{product.title}</h3>
          <span className={`block shrink-0 font-extrabold text-[#FF4F45] ${compact ? "text-base" : "text-lg"}`}>RM{product.price}</span>
        </div>
        <p className={`line-clamp-1 ${compact ? "mt-2 text-xs" : "mb-3 text-sm"} text-panda-muted`}>
          <LocationLabel value={product.location} />
        </p>
        <div className={`flex items-center justify-between gap-2 text-panda-muted ${compact ? "mt-2 text-[11px]" : "text-xs"}`}>
          <span className="line-clamp-1"><CategoryLabel value={product.category} /></span>
          <span>{formatDate(product.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
