"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { T, useI18n } from "@/components/I18nProvider";
import { LocationPicker } from "@/components/LocationPicker";
import { LocalizedTextInput } from "@/components/LocalizedInput";
import { Field, inputClass, primaryButtonClass } from "@/components/ui";
import { categories, defaultProductStatus, productStatus } from "@/lib/data";
import { validateProductImageFiles } from "@/lib/image-utils";
import { createProductAction, type ProductActionState } from "@/lib/product-actions";

const initialState: ProductActionState = {};

type SelectedImagePreview = {
  id: string;
  name: string;
  url?: string;
};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <button
      className={`w-full ${primaryButtonClass}`}
      disabled={pending || disabled}
    >
      {pending ? t("common.posting") : t("common.publishProduct")}
    </button>
  );
}

export function PublishProductForm() {
  const { t } = useI18n();
  const [state, formAction] = useFormState(createProductAction, initialState);
  const [selectedImageCount, setSelectedImageCount] = useState(0);
  const [imageError, setImageError] = useState("");
  const [previews, setPreviews] = useState<SelectedImagePreview[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = Array.from(event.target.files ?? []);
      setSelectedImageCount(files.length);
      setPreviews((currentPreviews) => {
        currentPreviews.forEach((preview) => {
          if (preview.url) {
            URL.revokeObjectURL(preview.url);
          }
        });

        return [];
      });

      const validationError = validateProductImageFiles(files);
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
          console.error(t("image.publishPreviewFailed"), { fileName: file.name, error });
          return {
            id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
            name: file.name
          };
        }
      });

      setPreviews(nextPreviews);
      setImageError("");
    } catch (error) {
      console.error("Failed to read selected images", error);
      setImageError(t("image.readFailed"));
    }
  }

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-[1.7rem] border border-white bg-white/94 p-5 shadow-[0_14px_36px_rgba(84,59,18,0.08)] sm:p-8">
      <Field label={<T k="form.photos" />}>
        <div className="grid gap-3 rounded-[1.35rem] border border-dashed border-[#FFD1B8] bg-[#FFF8EC] p-5 text-sm text-panda-muted">
          <input
            className="block w-full text-sm text-panda-muted file:mr-4 file:rounded-full file:border-0 file:bg-[#FF5A4F] file:px-4 file:py-2 file:font-semibold file:text-white"
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
          />
          <span>
            {t("form.photosHelp", { count: selectedImageCount })}
          </span>
          {selectedImageCount === 0 ? <span>{t("form.noPhotos")}</span> : null}
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {previews.map((preview) => (
                <div key={preview.id} className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
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
          {imageError ? <span className="font-medium text-red-700">{imageError}</span> : null}
        </div>
      </Field>

      <Field label={<T k="form.title" />}>
        <LocalizedTextInput className={inputClass} name="title" placeholderKey="form.titlePlaceholder" required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={<T k="form.price" />}>
          <LocalizedTextInput className={inputClass} name="price" placeholderKey="form.pricePlaceholder" type="number" min="0" step="0.01" required />
        </Field>
        <Field label={<T k="form.status" />}>
          <select className={inputClass} name="status" defaultValue={defaultProductStatus}>
            {productStatus.map((status) => (
              <option key={status.key} value={status.key}>{t(`status.${status.key}` as never)}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={<T k="form.category" />}>
          <select className={inputClass} name="category" required>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>{t(`category.${category.key}` as never)}</option>
            ))}
          </select>
        </Field>
        <LocationPicker />
      </div>

      <Field label={<T k="form.description" />}>
        <textarea
          className={`${inputClass} min-h-32 resize-none rounded-[1.4rem]`}
          name="description"
          placeholder={t("form.descriptionPlaceholder")}
          required
        />
      </Field>

      <Field label={<T k="form.condition" />}>
        <LocalizedTextInput className={inputClass} name="condition" placeholderKey="form.conditionPlaceholder" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label={<T k="form.wechat" />}>
          <input className={inputClass} name="wechat" placeholder={t("common.optional")} />
        </Field>
        <Field label={<T k="form.whatsapp" />}>
          <input className={inputClass} name="whatsapp" placeholder={t("common.optional")} />
        </Field>
        <Field label={<T k="form.telegram" />}>
          <input className={inputClass} name="telegram" placeholder={t("common.optional")} />
        </Field>
      </div>

      {state?.error ? (
        <p className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton disabled={Boolean(imageError)} />
    </form>
  );
}
