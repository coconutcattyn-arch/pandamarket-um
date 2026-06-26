"use client";

import { useI18n } from "@/components/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

export function LocalizedSearchInput({
  name,
  defaultValue,
  placeholderKey,
  className
}: {
  name: string;
  defaultValue?: string;
  placeholderKey: TranslationKey;
  className: string;
}) {
  const { t } = useI18n();

  return (
    <input
      className={className}
      name={name}
      defaultValue={defaultValue}
      placeholder={t(placeholderKey)}
    />
  );
}

export function LocalizedTextInput({
  name,
  defaultValue,
  placeholderKey,
  className,
  type = "text",
  required = false,
  min,
  step
}: {
  name: string;
  defaultValue?: string | number;
  placeholderKey: TranslationKey;
  className: string;
  type?: string;
  required?: boolean;
  min?: string | number;
  step?: string | number;
}) {
  const { t } = useI18n();

  return (
    <input
      className={className}
      name={name}
      defaultValue={defaultValue}
      placeholder={t(placeholderKey)}
      type={type}
      required={required}
      min={min}
      step={step}
    />
  );
}
