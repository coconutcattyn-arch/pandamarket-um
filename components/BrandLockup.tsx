import Link from "next/link";
import { T } from "@/components/I18nProvider";

export function BrandLockup({ priority = false }: { priority?: boolean }) {
  void priority;

  return (
    <Link href="/" prefetch className="flex min-w-0 items-center gap-2.5 py-1">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.9rem] bg-gradient-to-br from-[#B71422] to-[#DB3237] text-lg font-black text-white shadow-[0_10px_22px_rgba(183,20,34,0.24)]">
        P
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[1.35rem] font-black leading-none tracking-tight text-[#B71422] sm:text-[1.55rem]">
          PandaMarket
        </span>
        <span className="mt-1 block truncate text-[11px] font-semibold tracking-wide text-[#5B403E]/75 sm:text-xs">
          <T k="brand.subtitle" />
        </span>
      </span>
    </Link>
  );
}
