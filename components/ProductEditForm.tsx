"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, inputClass } from "@/components/ui";
import { categories, getContactMethodLabel, locations, productStatus } from "@/lib/data";
import { updateProductAction, type ProductEditActionState } from "@/lib/product-actions";
import type { Product } from "@/lib/types";

const initialState: ProductEditActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "保存中..." : "保存修改"}
    </button>
  );
}

function contactValue(product: Product, method: "wechat" | "whatsapp" | "telegram") {
  return product.productContacts.find((contact) => contact.method === method)?.value ?? "";
}

export function ProductEditForm({ product }: { product: Product }) {
  const [state, formAction] = useFormState(updateProductAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft sm:p-8">
      <input name="productId" type="hidden" value={product.id} />

      <Field label="标题">
        <input className={inputClass} name="title" defaultValue={product.title} required />
      </Field>

      <Field label="价格（RM）">
        <input className={inputClass} name="price" defaultValue={product.price} type="number" min="0" step="0.01" required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="商品分类">
          <select className={inputClass} name="category" defaultValue={product.category} required>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>{category.label}</option>
            ))}
          </select>
        </Field>
        <Field label="交易地点">
          <select className={inputClass} name="location" defaultValue={product.location} required>
            {locations.map((location) => (
              <option key={location.key} value={location.key}>{location.label}</option>
            ))}
          </select>
        </Field>
        <Field label="商品状态">
          <select className={inputClass} name="status" defaultValue={product.status} required>
            {productStatus.map((status) => (
              <option key={status.key} value={status.key}>{status.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="商品描述">
        <textarea className={`${inputClass} min-h-32 resize-none rounded-[1.4rem]`} name="description" defaultValue={product.description} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        {(["wechat", "whatsapp", "telegram"] as const).map((method) => (
          <Field key={method} label={getContactMethodLabel(method)}>
            <input className={inputClass} name={method} defaultValue={contactValue(product, method)} placeholder="选填" />
          </Field>
        ))}
      </div>

      {state.error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
