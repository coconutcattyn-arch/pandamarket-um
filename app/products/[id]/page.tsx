import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { Header } from "@/components/Header";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { StatusBadge } from "@/components/StatusBadge";
import { PageShell } from "@/components/ui";
import {
  defaultUserType,
  formatProductDate,
  getCategoryLabel,
  getContactMethodLabel,
  getLocationLabel,
  getProducts,
  getUserById,
  getUserTypeLabel,
  reportReasons
} from "@/lib/data";
import { getProductByIdFromSupabase } from "@/lib/product-queries";
import { getCurrentUser } from "@/lib/supabase-server";

export function generateStaticParams() {
  return getProducts().map((product) => ({ id: product.id }));
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductByIdFromSupabase(params.id);
  const currentUser = await getCurrentUser();

  if (!product) {
    notFound();
  }

  const seller = getUserById(product.sellerId);
  const galleryImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const productContacts = product.productContacts.length > 0 ? product.productContacts : seller?.userContacts ?? [];
  const isSeller = currentUser?.id === product.sellerId;

  return (
    <PageShell>
      <Header title="商品详情" currentUser={currentUser} />
      <article className="overflow-hidden rounded-[2rem] border border-panda-line bg-white shadow-soft">
        <ProductImageCarousel images={galleryImages} statusBadge={<StatusBadge status={product.status} />} />
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium text-panda-leaf">{getCategoryLabel(product.category)}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-panda-ink">{product.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-panda-ink">RM{product.price}</p>
              {product.originalPrice ? (
                <p className="text-sm text-panda-muted line-through">RM{product.originalPrice}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["成色", product.condition],
              ["地点", getLocationLabel(product.location)],
              ["卖家", seller?.name ?? "未知用户"],
              ["用户类型", getUserTypeLabel(seller?.type ?? defaultUserType)],
              ["发布时间", formatProductDate(product.createdAt)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] bg-panda-paper p-4">
                <p className="text-xs text-panda-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold text-panda-ink">{value}</p>
              </div>
            ))}
          </div>

          <section className="mt-7">
            <h2 className="mb-3 text-xl font-semibold text-panda-ink">商品说明</h2>
            <p className="leading-7 text-panda-muted">{product.description}</p>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-xl font-semibold text-panda-ink">联系方式</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {productContacts.map((contact) => (
                <div key={`${contact.method}-${contact.value}`} className="rounded-[1.2rem] border border-panda-line bg-white p-4">
                  <p className="text-xs text-panda-muted">{getContactMethodLabel(contact.method)}</p>
                  <p className="mt-1 break-all text-sm font-semibold text-panda-ink">{contact.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-panda-muted">平台暂不提供聊天系统，请自行确认交易细节并线下完成交易。</p>
          </section>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-panda-mint px-3 py-1.5 text-sm font-medium text-panda-leaf">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button className="rounded-full border border-panda-line bg-white px-5 py-3 font-semibold text-panda-ink">
              收藏
            </button>
            <Link href="/products" prefetch className="rounded-full bg-panda-lime px-5 py-3 text-center font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]">
              返回列表
            </Link>
          </div>
          {isSeller ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href={`/products/${product.id}/edit`}
                prefetch
                className="rounded-full bg-panda-lime px-5 py-3 text-center font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
              >
                编辑
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          ) : null}
          <details className="mt-5 rounded-[1.2rem] bg-panda-paper p-4">
            <summary className="cursor-pointer text-sm font-semibold text-panda-ink">举报商品</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {reportReasons.map((reason) => (
                <span key={reason.key} className="rounded-full border border-panda-line bg-white px-3 py-1.5 text-sm text-panda-muted">
                  {reason.label}
                </span>
              ))}
            </div>
          </details>
        </div>
      </article>
    </PageShell>
  );
}
