"use client";

import { deleteProductAction } from "@/lib/product-actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm("确定要删除这个商品吗？删除后无法恢复。")) {
          event.preventDefault();
        }
      }}
    >
      <input name="productId" type="hidden" value={productId} />
      <button className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700" type="submit">
        删除
      </button>
    </form>
  );
}
