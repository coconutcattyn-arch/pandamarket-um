import Image from "next/image";
import Link from "next/link";

export function BrandLockup({ priority = false }: { priority?: boolean }) {
  return (
    <Link href="/" prefetch className="block min-w-0 overflow-hidden">
      <span className="relative block h-[72px] w-[min(62vw,250px)] overflow-hidden sm:h-[88px] sm:w-[330px]">
        <Image
          src="/brand/pandamarket-title.png"
          alt="PandaMarket"
          fill
          priority={priority}
          sizes="(min-width: 640px) 330px, 66vw"
          className="object-contain object-left"
          style={{ transform: "scale(1.28)", transformOrigin: "left center" }}
        />
      </span>
      <span className="-mt-1 block pl-1 text-xs font-medium tracking-wide text-[#8A7A5C] sm:text-sm">
        UM校园交易社区
      </span>
    </Link>
  );
}
