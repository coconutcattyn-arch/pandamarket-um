"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultSchool } from "./constants";
import { getUploadContentType, imageUploadFailMessage, validateProductImageFiles } from "./image-utils";
import { ensureUserProfile } from "./profile-helpers";
import { createSupabaseServerClient } from "./supabase-server";
import type { ContactMethodKey, ProductStatusKey } from "./types";

const createProductTimeoutMs = 20_000;

export type ProductActionState = {
  error?: string;
};

export type ProductEditActionState = {
  error?: string;
};

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getRequiredId(
  supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>,
  table: "schools" | "categories" | "locations",
  slug: string
) {
  const { data, error } = await supabase.from(table).select("id").eq("slug", slug).single();

  if (error || !data?.id) {
    console.error("Failed to select required id", { table, slug, error, data });
    throw new Error(`Cannot find ${table} row for slug: ${slug}`);
  }

  return data.id as string;
}

async function getCurrentActionUser(supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Failed to get current action user", error);
    return null;
  }

  return user;
}

async function ensureOwnProduct(
  supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("products")
    .select("id, seller_id")
    .eq("id", productId)
    .single();

  if (error || !data) {
    console.error("Failed to select product ownership", { productId, userId, error });
    throw new Error("找不到商品。");
  }

  if (data.seller_id !== userId) {
    throw new Error("只能操作自己发布的商品。");
  }
}

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function safeFileName(fileName: string) {
  const cleaned = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return cleaned || "product-image.jpg";
}

async function uploadProductImages(
  supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  title: string,
  files: File[],
  startSortOrder = 1
) {
  if (files.length === 0) {
    return;
  }

  const uploadedImages = [];

  for (const [index, file] of files.entries()) {
    const path = `products/${productId}/${Date.now()}-${index + 1}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: getUploadContentType(file),
      upsert: false
    });

    if (uploadError) {
      console.error("Failed to upload product image", {
        productId,
        path,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        error: uploadError
      });
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    uploadedImages.push({
      product_id: productId,
      image_url: data.publicUrl,
      alt: title,
      sort_order: startSortOrder + index
    });
  }

  const { error: imageRowsError } = await supabase.from("product_images").insert(uploadedImages);

  if (imageRowsError) {
    console.error("Failed to insert product image rows", { productId, uploadedImages, error: imageRowsError });
    throw new Error(imageRowsError.message);
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function storagePathFromPublicUrl(url: string) {
  try {
    const marker = "/storage/v1/object/public/product-images/";
    const markerIndex = url.indexOf(marker);

    if (markerIndex < 0) {
      return "";
    }

    return decodeURIComponent(url.slice(markerIndex + marker.length));
  } catch (error) {
    console.error("Failed to parse product image storage path", { url, error });
    return "";
  }
}

async function deleteProductImages(
  supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  imageIds: string[]
) {
  if (imageIds.length === 0) {
    return "";
  }

  const { data: images, error: selectError } = await supabase
    .from("product_images")
    .select("id, image_url")
    .eq("product_id", productId)
    .in("id", imageIds);

  if (selectError) {
    console.error("Failed to select images before delete", { productId, imageIds, error: selectError });
    return selectError.message;
  }

  const storagePaths = (images ?? [])
    .map((image) => storagePathFromPublicUrl(image.image_url))
    .filter((path): path is string => path.length > 0);

  let storageWarning = "";

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage.from("product-images").remove(storagePaths);

    if (storageError) {
      console.error("Failed to delete product images from storage", { productId, storagePaths, error: storageError });
      storageWarning = "部分图片文件删除失败，但商品信息已保存。";
    }
  }

  const { error: deleteRowsError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .in("id", imageIds);

  if (deleteRowsError) {
    console.error("Failed to delete product image rows", { productId, imageIds, error: deleteRowsError });
    return deleteRowsError.message;
  }

  return storageWarning;
}

async function createProductWorkflow({
  supabase,
  userId,
  title,
  description,
  price,
  status,
  categorySlug,
  locationSlug,
  condition,
  imageFiles,
  formData
}: {
  supabase: NonNullable<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  title: string;
  description: string;
  price: number;
  status: ProductStatusKey;
  categorySlug: string;
  locationSlug: string;
  condition: string;
  imageFiles: File[];
  formData: FormData;
}) {
  const [schoolId, categoryId, locationId] = await Promise.all([
    getRequiredId(supabase, "schools", defaultSchool.slug),
    getRequiredId(supabase, "categories", categorySlug),
    getRequiredId(supabase, "locations", locationSlug)
  ]);

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      seller_id: userId,
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
    console.error("Failed to insert product", { productError, product });
    return { error: productError?.message ?? "商品发布失败。" };
  }

  const productId = product.id as string;

  try {
    await uploadProductImages(supabase, productId, title, imageFiles);
  } catch (error) {
    console.error("Product image upload step failed", { productId, error });
    return { error: imageUploadFailMessage };
  }

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
      console.error("Failed to insert product contacts", { productId, contactRows, error: contactsError });
      return { error: contactsError.message };
    }
  }

  return { productId };
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase server client is not configured for product creation");
    return { error: "请先配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。" };
  }

  const user = await getCurrentActionUser(supabase);

  if (!user) {
    return { error: "请先登录" };
  }

  const profileResult = await ensureUserProfile(supabase, user);

  if (profileResult.error) {
    return { error: profileResult.error };
  }

  const title = textValue(formData, "title");
  const description = textValue(formData, "description");
  const price = Number(textValue(formData, "price") || 0);
  const status = textValue(formData, "status") as ProductStatusKey;
  const categorySlug = textValue(formData, "category");
  const locationSlug = textValue(formData, "location");
  const condition = textValue(formData, "condition") || "成色未填写";
  const imageFiles = getImageFiles(formData);
  const imageError = validateProductImageFiles(imageFiles);

  if (!title || !description || !categorySlug || !locationSlug) {
    return { error: "请填写商品标题、描述、分类和交易地点。" };
  }

  if (imageError) {
    return { error: imageError };
  }

  let result: { productId?: string; error?: string };

  try {
    result = await withTimeout(
      createProductWorkflow({
        supabase,
        userId: user.id,
        title,
        description,
        price,
        status,
        categorySlug,
        locationSlug,
        condition,
        imageFiles,
        formData
      }),
      createProductTimeoutMs,
      "发布超时，请检查网络后重试。"
    );
  } catch (error) {
    console.error("Create product action failed", error);
    return { error: error instanceof Error ? error.message : "商品发布失败，请稍后再试。" };
  }

  if (result.error || !result.productId) {
    return { error: result.error ?? "商品发布失败，请稍后再试。" };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${result.productId}`);
  redirect(`/products/${result.productId}`);
}

export async function updateProductAction(
  _previousState: ProductEditActionState,
  formData: FormData
): Promise<ProductEditActionState> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "请先配置 Supabase 环境变量。" };
  }

  const user = await getCurrentActionUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const productId = textValue(formData, "productId");
  const title = textValue(formData, "title");
  const description = textValue(formData, "description");
  const price = Number(textValue(formData, "price") || 0);
  const status = textValue(formData, "status") as ProductStatusKey;
  const categorySlug = textValue(formData, "category");
  const locationSlug = textValue(formData, "location");
  const deleteImageIds = formData
    .getAll("deleteImageIds")
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const imageFiles = getImageFiles(formData);

  if (!productId || !title || !description || !categorySlug || !locationSlug) {
    return { error: "请填写完整商品信息。" };
  }

  const imageValidationError = validateProductImageFiles(imageFiles);
  if (imageValidationError) {
    return { error: imageValidationError };
  }

  let imageWarning = "";

  try {
    await ensureOwnProduct(supabase, productId, user.id);

    const { data: existingImages, error: existingImagesError } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId);

    if (existingImagesError) {
      console.error("Failed to select existing product images", { productId, error: existingImagesError });
      return { error: existingImagesError.message };
    }

    const remainingImageCount = (existingImages ?? []).filter((image) => !deleteImageIds.includes(image.id)).length;

    if (remainingImageCount + imageFiles.length > 5) {
      return { error: "最多只能保留 5 张图片。" };
    }

    const [categoryId, locationId] = await Promise.all([
      getRequiredId(supabase, "categories", categorySlug),
      getRequiredId(supabase, "locations", locationSlug)
    ]);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        title,
        price: Number.isFinite(price) ? price : 0,
        description,
        category_id: categoryId,
        location_id: locationId,
        status
      })
      .eq("id", productId)
      .eq("seller_id", user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    const { error: deleteContactsError } = await supabase
      .from("product_contacts")
      .delete()
      .eq("product_id", productId);

    if (deleteContactsError) {
      return { error: deleteContactsError.message };
    }

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

    imageWarning = await deleteProductImages(supabase, productId, deleteImageIds);

    try {
      await uploadProductImages(supabase, productId, title, imageFiles, remainingImageCount + 1);
    } catch (error) {
      console.error("Product edit image upload step failed", { productId, error });
      return { error: imageUploadFailMessage };
    }
  } catch (error) {
    console.error("Update product action failed", { productId, error });
    return { error: error instanceof Error ? error.message : "商品更新失败，请稍后再试。" };
  }

  if (imageWarning) {
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/my-products");
    revalidatePath(`/products/${productId}`);
    return { error: imageWarning };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/my-products");
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}

export async function deleteProductAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/my-products");
  }

  const user = await getCurrentActionUser(supabase);

  if (!user) {
    redirect("/login?next=/my-products");
  }

  const productId = textValue(formData, "productId");

  if (!productId) {
    redirect("/my-products");
  }

  await ensureOwnProduct(supabase, productId, user.id);

  await supabase.from("product_contacts").delete().eq("product_id", productId);
  await supabase.from("product_images").delete().eq("product_id", productId);
  await supabase.from("products").delete().eq("id", productId).eq("seller_id", user.id);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/my-products");
  redirect("/my-products");
}
