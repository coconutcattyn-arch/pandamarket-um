import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BrandLockup } from "@/components/BrandLockup";
import { LanguageToggle, T } from "@/components/I18nProvider";
import { signOutAction } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/supabase-server";

export async function Header({
  title = "PandaMarket",
  currentUser
}: {
  title?: string;
  currentUser?: User | null;
}) {
  const user = currentUser === undefined ? await getCurrentUser() : currentUser;
  const publishHref = user ? "/publish" : "/login?next=/publish";

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-white/70 bg-[#FFFDF7]/86 px-4 py-2 shadow-[0_10px_30px_rgba(95,69,20,0.06)] backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <BrandLockup />
        <span className="sr-only">{title}</span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <>
              <Link href="/my-products" prefetch className="hidden rounded-full border border-panda-line/80 bg-white/90 px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm sm:inline-flex">
                <T k="common.myProducts" />
              </Link>
              <form action={signOutAction}>
                <button className="hidden rounded-full border border-panda-line/80 bg-white/90 px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm sm:inline-flex" type="submit">
                  <T k="common.logout" />
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" prefetch className="hidden rounded-full border border-panda-line/80 bg-white/90 px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm sm:inline-flex">
              <T k="common.login" />
            </Link>
          )}
          <Link
            href={publishHref}
            prefetch
            className="shrink-0 rounded-full bg-[#FF5A4F] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,79,0.24)] transition hover:bg-[#F04D43]"
          >
            <T k="common.publishProduct" />
          </Link>
        </div>
      </div>
    </header>
  );
}
