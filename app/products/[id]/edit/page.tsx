import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductEditForm } from "@/components/ProductEditForm";
import { PageShell } from "@/components/ui";
import { getProductByIdFromSupabase } from "@/lib/product-queries";
import { getCurrentUser } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/products/${params.id}/edit`);
  }

  const product = await getProductByIdFromSupabase(params.id);

  if (!product) {
    notFound();
  }

  if (product.sellerId !== user.id) {
    redirect(`/products/${product.id}`);
  }

  return (
    <PageShell>
      <Header title="编辑商品" />
      <section className="rounded-[2rem] border border-panda-line bg-white p-6 text-panda-ink shadow-soft sm:p-8">
        <p className="mb-3 text-sm font-semibold text-panda-leaf">只可编辑自己发布的商品</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">编辑商品信息</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-panda-muted">
          可以修改商品文字信息、联系方式，也可以删除旧图片或新增图片。
        </p>
      </section>
      <ProductEditForm product={product} />
      <Link href={`/products/${product.id}`} className="mt-5 inline-flex text-sm font-semibold text-panda-leaf">
        返回商品详情
      </Link>
    </PageShell>
  );
}
