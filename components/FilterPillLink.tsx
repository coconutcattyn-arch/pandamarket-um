import Link from "next/link";
import type { ReactNode } from "react";

export function FilterPillLink({
  href,
  active = false,
  children
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch
      className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-[#FF5A4F] bg-[#FF5A4F] text-white shadow-[0_10px_22px_rgba(255,90,79,0.2)]"
          : "border-panda-line/80 bg-white/90 text-panda-ink shadow-sm hover:border-[#FFD1B8] hover:bg-[#FFF7EF]"
      }`}
    >
      {children}
    </Link>
  );
}
