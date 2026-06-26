"use client";

import { useI18n } from "@/components/I18nProvider";
import { deleteProductAction } from "@/lib/product-actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const { t } = useI18n();

  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm(t("delete.confirm"))) {
          event.preventDefault();
        }
      }}
    >
      <input name="productId" type="hidden" value={productId} />
      <button className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-100" type="submit">
        {t("common.delete")}
      </button>
    </form>
  );
}
