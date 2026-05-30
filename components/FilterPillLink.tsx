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
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-panda-lime bg-panda-lime text-panda-ink shadow-sm"
          : "border-panda-line bg-white text-panda-ink hover:border-panda-lime hover:bg-panda-paper"
      }`}
    >
      {children}
    </Link>
  );
}

