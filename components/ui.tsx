import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "@/components/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-5xl safe-bottom px-4 py-3 sm:px-6 sm:py-4">{children}</main>;
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${
        active
          ? "border-[#FF5A4F] bg-[#FF5A4F] text-white shadow-[0_10px_22px_rgba(255,90,79,0.2)]"
          : "border-panda-line/80 bg-white/90 text-panda-ink shadow-sm"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  titleKey,
  titleValues,
  actionHref,
  actionText,
  actionTextKey
}: {
  eyebrow?: string;
  title?: string;
  titleKey?: TranslationKey;
  titleValues?: Record<string, string | number>;
  actionHref?: string;
  actionText?: string;
  actionTextKey?: TranslationKey;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#FF5A4F]">{eyebrow}</p> : null}
        <h2 className="text-xl font-black tracking-tight text-panda-ink sm:text-2xl">
          {titleKey ? <T k={titleKey} values={titleValues} /> : title}
        </h2>
      </div>
      {actionHref && (actionText || actionTextKey) ? (
        <Link href={actionHref} className="shrink-0 text-sm font-bold text-[#FF5A4F]">
          {actionTextKey ? <T k={actionTextKey} /> : actionText}
        </Link>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  children
}: {
  label: ReactNode;
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
  "w-full rounded-[1.15rem] border border-panda-line/80 bg-white px-4 py-3 text-base text-panda-ink shadow-sm outline-none transition placeholder:text-panda-muted/65 focus:border-[#FF8A45] focus:ring-4 focus:ring-[#FFE2C7]";

export const primaryButtonClass =
  "rounded-full bg-[#FF5A4F] px-5 py-3.5 font-bold text-white shadow-[0_12px_26px_rgba(255,90,79,0.24)] transition hover:bg-[#F04D43] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";

export const secondaryButtonClass =
  "rounded-full border border-panda-line/80 bg-white px-5 py-3.5 font-bold text-panda-ink shadow-sm transition hover:border-[#FFD1B8] hover:bg-[#FFF7EF] active:scale-[0.99]";
