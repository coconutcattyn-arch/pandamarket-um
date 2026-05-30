import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-5xl safe-bottom px-4 py-4 sm:px-6">{children}</main>;
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
        active
          ? "border-panda-lime bg-panda-lime text-panda-ink shadow-sm"
          : "border-panda-line bg-white text-panda-ink"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionText
}: {
  eyebrow?: string;
  title: string;
  actionHref?: string;
  actionText?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-panda-leaf">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-panda-ink">{title}</h2>
      </div>
      {actionHref && actionText ? (
        <Link href={actionHref} className="shrink-0 text-sm font-semibold text-panda-leaf">
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-panda-ink">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-[1.15rem] border border-panda-line bg-white px-4 py-3 text-base text-panda-ink outline-none transition placeholder:text-panda-muted/70 focus:border-panda-lime focus:ring-4 focus:ring-panda-mint";
