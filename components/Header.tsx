import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BrandLockup } from "@/components/BrandLockup";
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
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-panda-line/70 bg-[#FFFDF7]/88 px-4 pb-2.5 pt-2 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <BrandLockup />
        <span className="sr-only">{title}</span>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/my-products" prefetch className="hidden rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink sm:inline-flex">
                我的商品
              </Link>
              <form action={signOutAction}>
                <button className="hidden rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink sm:inline-flex" type="submit">
                  退出登录
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" prefetch className="hidden rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink sm:inline-flex">
              登录
            </Link>
          )}
          <Link
            href={publishHref}
            prefetch
            className="shrink-0 rounded-full bg-panda-lime px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
          >
            发布商品
          </Link>
        </div>
      </div>
    </header>
  );
}
