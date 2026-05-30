import Image from "next/image";
import Link from "next/link";
import { formatProductDate, getCategoryLabel, getLocationLabel, getPrimaryProductImage } from "@/lib/data";
import type { Product } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({ product }: { product: Product }) {
  const image = getPrimaryProductImage(product);

  return (
    <Link
      href={`/products/${product.id}`}
      prefetch
      className="group block overflow-hidden rounded-[1.6rem] border border-panda-line bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-[#E9D79C]"
    >
      <div className="relative aspect-[4/3] bg-[#FFF8E1]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          quality={68}
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={product.status} />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-panda-ink">{product.title}</h3>
          <span className="shrink-0 text-lg font-semibold text-panda-ink">RM{product.price}</span>
        </div>
        <p className="mb-3 text-sm text-panda-muted">{getLocationLabel(product.location)}</p>
        <div className="flex items-center justify-between text-xs text-panda-muted">
          <span>{getCategoryLabel(product.category)}</span>
          <span>{formatProductDate(product.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
