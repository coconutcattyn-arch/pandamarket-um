import Link from "next/link";

const items = [
  { href: "/", label: "首页", icon: "⌂" },
  { href: "/products", label: "商品", icon: "□" },
  { href: "/publish", label: "发布", icon: "+" },
  { href: "/login", label: "我的", icon: "○" }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-panda-line/80 glass">
      <div className="mx-auto grid max-w-5xl grid-cols-4 px-3 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-2xl py-1.5 text-xs font-medium text-panda-muted">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-panda-line bg-white text-base text-panda-ink shadow-sm">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
