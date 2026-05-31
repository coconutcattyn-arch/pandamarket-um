"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页", icon: "⌂" },
  { href: "/products", label: "商品", icon: "□" },
  { href: "/publish", label: "发布", icon: "+" },
  { href: "/my-products", label: "我的", icon: "○" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-panda-line/80 bg-[#FFFDF7]/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-5xl grid-cols-4 px-3 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex flex-col items-center gap-1 rounded-2xl py-1.5 text-xs font-medium transition active:bg-panda-paper ${
                active ? "text-panda-ink" : "text-panda-muted"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-base shadow-sm transition ${
                  active
                    ? "border-panda-lime bg-panda-lime text-panda-ink"
                    : "border-panda-line bg-white text-panda-ink"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

