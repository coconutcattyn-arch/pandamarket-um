"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultSchool } from "./constants";
import { supabase } from "./supabase";
import type { ContactMethodKey, ProductStatusKey } from "./types";

const testSellerId = process.env.PANDA_TEST_SELLER_ID;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export type ProductActionState = {
  error?: string;
};

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getRequiredId(table: "schools" | "categories" | "locations", slug: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.from(table).select("id").eq("slug", slug).single();

  if (error || !data?.id) {
    throw new Error(`Cannot find ${table} row for slug: ${slug}`);
  }

  return data.id as string;
}

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function validateImageFiles(files: File[]) {
  if (files.length > 5) {
    return "最多只能上传 5 张图片。";
  }

  const invalidFile = files.find((file) => !allowedImageTypes.includes(file.type));

  if (invalidFile) {
    return "图片格式仅支持 jpg、jpeg、png、webp。";
  }

  return null;
}

function safeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

async function uploadProductImages(productId: string, title: string, files: File[]) {
  if (!supabase || files.length === 0) {
    return;
  }

  const uploadedImages = [];

  for (const [index, file] of files.entries()) {
    const path = `products/${productId}/${Date.now()}-${index + 1}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    uploadedImages.push({
      product_id: productId,
      image_url: data.publicUrl,
      alt: title,
      sort_order: index + 1
    });
  }

  const { error: imageRowsError } = await supabase.from("product_images").insert(uploadedImages);

  if (imageRowsError) {
    throw new Error(imageRowsError.message);
  }
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  let productId: string | null = null;

  if (!supabase) {
    return { error: "请先配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。" };
  }

  if (!testSellerId) {
    return { error: "请先在 .env.local 中配置 PANDA_TEST_SELLER_ID。" };
  }

  const title = textValue(formData, "title");
  const description = textValue(formData, "description");
  const price = Number(textValue(formData, "price") || 0);
  const status = textValue(formData, "status") as ProductStatusKey;
  const categorySlug = textValue(formData, "category");
  const locationSlug = textValue(formData, "location");
  const condition = textValue(formData, "condition") || "成色未填写";
  const imageFiles = getImageFiles(formData);
  const imageError = validateImageFiles(imageFiles);

  if (!title || !description || !categorySlug || !locationSlug) {
    return { error: "请填写商品标题、描述、分类和交易地点。" };
  }

  if (imageError) {
    return { error: imageError };
  }

  try {
    const [schoolId, categoryId, locationId] = await Promise.all([
      getRequiredId("schools", defaultSchool.slug),
      getRequiredId("categories", categorySlug),
      getRequiredId("locations", locationSlug)
    ]);

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: testSellerId,
        school_id: schoolId,
        category_id: categoryId,
        location_id: locationId,
        title,
        price: Number.isFinite(price) ? price : 0,
        description,
        condition,
        status,
        tags: []
      })
      .select("id")
      .single();

    if (productError || !product?.id) {
      return { error: productError?.message ?? "商品发布失败。" };
    }

    productId = product.id as string;
    await uploadProductImages(productId, title, imageFiles);

    const contactRows = [
      { method: "wechat", value: textValue(formData, "wechat") },
      { method: "whatsapp", value: textValue(formData, "whatsapp") },
      { method: "telegram", value: textValue(formData, "telegram") }
    ].filter((contact) => contact.value.length > 0);

    if (contactRows.length > 0) {
      const { error: contactsError } = await supabase.from("product_contacts").insert(
        contactRows.map((contact) => ({
          product_id: productId,
          method: contact.method as ContactMethodKey,
          value: contact.value
        }))
      );

      if (contactsError) {
        return { error: contactsError.message };
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "商品发布失败，请稍后再试。" };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}
