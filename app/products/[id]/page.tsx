import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSellerSheet } from "@/components/ContactSellerSheet";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { Header } from "@/components/Header";
import { CategoryLabel, ContactMethodLabel, DateLabel, LocationLabel, ReportReasonLabel, T, UserTypeLabel } from "@/components/I18nProvider";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { StatusBadge } from "@/components/StatusBadge";
import { PageShell, primaryButtonClass, secondaryButtonClass } from "@/components/ui";
import {
  defaultUserType,
  getProducts,
  getUserById,
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
      <article className="overflow-hidden rounded-[1.7rem] border border-white bg-white/94 shadow-[0_18px_46px_rgba(84,59,18,0.1)]">
        <ProductImageCarousel images={galleryImages} statusBadge={<StatusBadge status={product.status} />} />
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#FF5A4F]"><CategoryLabel value={product.category} /></p>
              <h1 className="text-3xl font-black tracking-tight text-panda-ink">{product.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#FF4F45]">RM{product.price}</p>
              {product.originalPrice ? (
                <p className="text-sm text-panda-muted line-through">RM{product.originalPrice}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { key: "condition", label: <T k="detail.condition" />, value: product.condition },
              { key: "location", label: <T k="detail.location" />, value: <LocationLabel value={product.location} /> },
              { key: "seller", label: <T k="detail.seller" />, value: seller?.name ?? <T k="common.unknownUser" /> },
              { key: "userType", label: <T k="detail.userType" />, value: <UserTypeLabel value={seller?.type ?? defaultUserType} /> },
              { key: "postedAt", label: <T k="detail.postedAt" />, value: <DateLabel value={product.createdAt} /> }
            ].map((item) => (
              <div key={item.key} className="rounded-[1.2rem] border border-panda-line/60 bg-[#FFF8EC] p-4">
                <p className="text-xs text-panda-muted">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-panda-ink">{item.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-7">
            <h2 className="mb-3 text-xl font-black text-panda-ink"><T k="detail.description" /></h2>
            <p className="leading-7 text-panda-muted">{product.description}</p>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-xl font-black text-panda-ink"><T k="detail.contacts" /></h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {productContacts.map((contact) => (
                <div key={`${contact.method}-${contact.value}`} className="rounded-[1.2rem] border border-panda-line/70 bg-white p-4 shadow-sm">
                  <p className="text-xs text-panda-muted"><ContactMethodLabel value={contact.method} /></p>
                  <p className="mt-1 break-all text-sm font-semibold text-panda-ink">{contact.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-panda-muted"><T k="detail.contactNote" /></p>
          </section>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#FFF0E8] px-3 py-1.5 text-sm font-bold text-[#FF5A4F]">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <ContactSellerSheet productTitle={product.title} contacts={productContacts} />
            </div>
            <button className={secondaryButtonClass}>
              <T k="common.saved" />
            </button>
            <Link href="/products" prefetch className={`${primaryButtonClass} text-center`}>
              <T k="common.backToList" />
            </Link>
          </div>
          {isSeller ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href={`/products/${product.id}/edit`}
                prefetch
                className={`${primaryButtonClass} text-center`}
              >
                <T k="common.edit" />
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          ) : null}
          <details className="mt-5 rounded-[1.2rem] border border-panda-line/70 bg-[#FFF8EC] p-4">
            <summary className="cursor-pointer text-sm font-semibold text-panda-ink"><T k="detail.report" /></summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {reportReasons.map((reason) => (
                <span key={reason.key} className="rounded-full border border-panda-line bg-white px-3 py-1.5 text-sm text-panda-muted">
                  <ReportReasonLabel value={reason.key} />
                </span>
              ))}
            </div>
          </details>
        </div>
      </article>
    </PageShell>
  );
}
