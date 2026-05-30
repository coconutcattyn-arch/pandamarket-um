import Link from "next/link";
import { signOutAction } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/supabase-server";

export async function Header({ title = "PandaMarket" }: { title?: string }) {
  const user = await getCurrentUser();
  const publishHref = user ? "/publish" : "/login?next=/publish";

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-panda-line/70 glass px-4 py-3 sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-panda-lime text-sm font-bold text-panda-ink shadow-sm">
            PM
          </span>
          <span>
            <span className="block text-sm font-semibold leading-tight text-panda-ink">{title}</span>
            <span className="block text-xs text-panda-muted">UM校园交易社区</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/my-products" className="rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink">
                我的商品
              </Link>
              <form action={signOutAction}>
                <button className="rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink" type="submit">
                  退出登录
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-full border border-panda-line bg-white px-4 py-2 text-sm font-semibold text-panda-ink">
              登录
            </Link>
          )}
          <Link
            href={publishHref}
            className="rounded-full bg-panda-lime px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
          >
            发布商品
          </Link>
        </div>
      </div>
    </header>
  );
}
