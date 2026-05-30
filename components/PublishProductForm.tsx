"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, inputClass } from "@/components/ui";
import { categories, defaultProductStatus, locations, productStatus } from "@/lib/data";
import { createProductAction, type ProductActionState } from "@/lib/product-actions";

const initialState: ProductActionState = {};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending || disabled}
    >
      {pending ? "发布中..." : "发布商品"}
    </button>
  );
}

export function PublishProductForm() {
  const [state, formAction] = useFormState(createProductAction, initialState);
  const [selectedImageCount, setSelectedImageCount] = useState(0);
  const [imageError, setImageError] = useState("");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setSelectedImageCount(files.length);

    if (files.length > 5) {
      setImageError("最多上传 5 张图片，请重新选择。");
      return;
    }

    setImageError("");
  }

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft sm:p-8">
      <Field label="商品图片">
        <div className="grid gap-3 rounded-[1.4rem] border border-dashed border-panda-line bg-panda-paper p-5 text-sm text-panda-muted">
          <input
            className="block w-full text-sm text-panda-muted file:mr-4 file:rounded-full file:border-0 file:bg-panda-lime file:px-4 file:py-2 file:font-semibold file:text-panda-ink"
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
          />
          <span>
            支持从相册选择 1-5 张 jpg、jpeg、png、webp 图片。已选择 {selectedImageCount} 张，暂不上传也可以发布。
          </span>
          {imageError ? <span className="font-medium text-red-700">{imageError}</span> : null}
        </div>
      </Field>

      <Field label="标题">
        <input className={inputClass} name="title" placeholder="例如：小型电饭煲 1.6L" required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="价格（RM）">
          <input className={inputClass} name="price" placeholder="0 表示免费赠送" type="number" min="0" step="0.01" required />
        </Field>
        <Field label="商品状态">
          <select className={inputClass} name="status" defaultValue={defaultProductStatus}>
            {productStatus.map((status) => (
              <option key={status.key} value={status.key}>{status.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="商品分类">
          <select className={inputClass} name="category" required>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>{category.label}</option>
            ))}
          </select>
        </Field>
        <Field label="交易地点">
          <select className={inputClass} name="location" required>
            {locations.map((location) => (
              <option key={location.key} value={location.key}>{location.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="商品描述">
        <textarea
          className={`${inputClass} min-h-32 resize-none rounded-[1.4rem]`}
          name="description"
          placeholder="说明成色、购买时间、交接方式等，帮助买家快速判断。"
          required
        />
      </Field>

      <Field label="成色">
        <input className={inputClass} name="condition" placeholder="例如：九成新、功能正常、全新未拆" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="微信">
          <input className={inputClass} name="wechat" placeholder="选填" />
        </Field>
        <Field label="WhatsApp">
          <input className={inputClass} name="whatsapp" placeholder="选填" />
        </Field>
        <Field label="Telegram">
          <input className={inputClass} name="telegram" placeholder="选填" />
        </Field>
      </div>

      {state.error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton disabled={Boolean(imageError)} />
    </form>
  );
}
