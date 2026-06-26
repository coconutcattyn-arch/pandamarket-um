"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

const items = [
  { href: "/", labelKey: "common.home", icon: "⌂" },
  { href: "/products", labelKey: "common.search", icon: "⌕" },
  { href: "/publish", labelKey: "common.publish", icon: "+" },
  { href: "/my-products", labelKey: "common.profile", icon: "◦" }
] satisfies Array<{ href: string; labelKey: TranslationKey; icon: string }>;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-[#FFFDF7]/88 shadow-[0_-12px_34px_rgba(84,59,18,0.08)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-5xl grid-cols-4 px-3 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          const primary = item.href === "/publish";

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex flex-col items-center gap-1 rounded-2xl py-1 text-xs font-semibold transition active:bg-panda-paper ${
                primary ? "text-[#FF4F45]" : active ? "text-panda-ink" : "text-panda-muted"
              }`}
            >
              <span
                className={`grid place-items-center rounded-full border text-base shadow-sm transition ${
                  primary
                    ? "h-11 w-11 -translate-y-3 border-[#FF5A4F] bg-gradient-to-br from-[#FF7B45] to-[#FF4F45] text-2xl text-white shadow-[0_12px_26px_rgba(255,90,79,0.28)]"
                    : active
                      ? "h-7 w-7 border-[#FF5A4F] bg-[#FFF0E8] text-[#FF4F45]"
                      : "h-7 w-7 border-panda-line bg-white text-panda-ink"
                }`}
              >
                {item.icon}
              </span>
              <T k={item.labelKey} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
