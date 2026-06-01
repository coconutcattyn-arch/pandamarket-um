"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { LocationPicker } from "@/components/LocationPicker";
import { Field, inputClass } from "@/components/ui";
import { categories, getContactMethodLabel, productStatus } from "@/lib/data";
import { validateProductImageFiles } from "@/lib/image-utils";
import { updateProductAction, type ProductEditActionState } from "@/lib/product-actions";
import type { Product } from "@/lib/types";

const initialState: ProductEditActionState = {};

type SelectedImagePreview = {
  id: string;
  name: string;
  url?: string;
};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-full bg-panda-lime px-5 py-3.5 font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending || disabled}
      type="submit"
    >
      {pending ? "保存中..." : "保存修改"}
    </button>
  );
}

function contactValue(product: Product, method: "wechat" | "whatsapp" | "telegram") {
  return product.productContacts.find((contact) => contact.method === method)?.value ?? "";
}

function isFallbackImage(productId: string, imageId: string) {
  return imageId === `${productId}-fallback-image`;
}

export function ProductEditForm({ product }: { product: Product }) {
  const [state, formAction] = useFormState(updateProductAction, initialState);
  const existingImages = useMemo(
    () => product.images.filter((image) => !isFallbackImage(product.id, image.id)),
    [product.id, product.images]
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImageCount, setNewImageCount] = useState(0);
  const [imageError, setImageError] = useState("");
  const [previews, setPreviews] = useState<SelectedImagePreview[]>([]);

  const remainingExistingCount = existingImages.filter((image) => !removedImageIds.includes(image.id)).length;
  const totalImageCount = remainingExistingCount + newImageCount;

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  function toggleRemoveImage(imageId: string) {
    setRemovedImageIds((current) =>
      current.includes(imageId) ? current.filter((id) => id !== imageId) : [...current, imageId]
    );
    setImageError("");
  }

  function handleNewImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = Array.from(event.target.files ?? []);
      const availableSlots = 5 - remainingExistingCount;
      setNewImageCount(files.length);
      setPreviews((currentPreviews) => {
        currentPreviews.forEach((preview) => {
          if (preview.url) {
            URL.revokeObjectURL(preview.url);
          }
        });

        return [];
      });

      const validationError = validateProductImageFiles(files, { maxCount: Math.max(availableSlots, 0) });
      if (validationError) {
        setImageError(validationError);
        return;
      }

      const nextPreviews = files.map((file, index) => {
        try {
          return {
            id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
            name: file.name,
            url: URL.createObjectURL(file)
          };
        } catch (error) {
          console.error("Failed to create edit image preview", { fileName: file.name, error });
          return {
            id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
            name: file.name
          };
        }
      });

      setPreviews(nextPreviews);
      setImageError("");
    } catch (error) {
      console.error("Failed to read edit images", error);
      setImageError("读取图片失败，请重新选择图片。");
    }
  }

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-[2rem] border border-panda-line bg-white p-5 shadow-soft sm:p-8">
      <input name="productId" type="hidden" value={product.id} />
      {removedImageIds.map((imageId) => (
        <input key={imageId} name="deleteImageIds" type="hidden" value={imageId} />
      ))}

      <Field label="商品图片">
        <div className="space-y-4 rounded-[1.4rem] border border-dashed border-panda-line bg-panda-paper p-5 text-sm text-panda-muted">
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {existingImages.map((image) => {
                const removed = removedImageIds.includes(image.id);

                return (
                  <div key={image.id} className={`overflow-hidden rounded-2xl border bg-white ${removed ? "border-red-200 opacity-55" : "border-panda-line"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={image.alt} className="aspect-square w-full object-cover" />
                    <button
                      className="w-full px-3 py-2 text-xs font-semibold text-panda-ink transition hover:bg-panda-paper"
                      type="button"
                      onClick={() => toggleRemoveImage(image.id)}
                    >
                      {removed ? "撤销删除" : "删除图片"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>当前商品还没有上传图片。</p>
          )}

          <input
            className="block w-full text-sm text-panda-muted file:mr-4 file:rounded-full file:border-0 file:bg-panda-lime file:px-4 file:py-2 file:font-semibold file:text-panda-ink"
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleNewImagesChange}
          />
          <p>最多保留 5 张图片，当前保存后共 {totalImageCount} 张。</p>

          {previews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {previews.map((preview) => (
                <div key={preview.id} className="overflow-hidden rounded-2xl border border-panda-line bg-white">
                  {preview.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview.url} alt={preview.name} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square items-center justify-center px-2 text-center text-xs text-panda-muted">
                      {preview.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {imageError ? <p className="font-medium text-red-700">{imageError}</p> : null}
        </div>
      </Field>

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
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <LocationPicker defaultValue={product.location} />
        <Field label="商品状态">
          <select className={inputClass} name="status" defaultValue={product.status} required>
            {productStatus.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
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

      <SubmitButton disabled={Boolean(imageError)} />
    </form>
  );
}
