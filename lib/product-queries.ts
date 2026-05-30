import { defaultSchool } from "./constants";
import { getProductById as getMockProductById, getProducts as getMockProducts } from "./data";
import { supabase } from "./supabase";
import type { ContactMethodKey, Product, ProductCategoryKey, ProductLocationKey, ProductStatusKey } from "./types";

type ProductRow = {
  id: string;
  seller_id: string;
  school_id: string;
  title: string;
  price: number | string;
  original_price: number | string | null;
  description: string;
  condition: string | null;
  status: string;
  views_count: number | null;
  favorites_count: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  categories: { slug: string } | Array<{ slug: string }> | null;
  locations: { slug: string } | Array<{ slug: string }> | null;
  product_images: Array<{
    id: string;
    image_url: string;
    alt: string | null;
    sort_order: number | null;
  }> | null;
  product_contacts: Array<{
    id: string;
    method: string;
    value: string;
  }> | null;
  schools: { slug: string } | Array<{ slug: string }> | null;
};

const productSelect = `
  id,
  seller_id,
  school_id,
  title,
  price,
  original_price,
  description,
  condition,
  status,
  views_count,
  favorites_count,
  tags,
  created_at,
  updated_at,
  schools(slug),
  categories(slug),
  locations(slug),
  product_images(id, image_url, alt, sort_order),
  product_contacts(id, method, value)
`;

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? value : Number(value);
}

function firstRelation<T>(relation: T | T[] | null | undefined) {
  return Array.isArray(relation) ? relation[0] : relation;
}

function mapProduct(row: ProductRow): Product {
  const images = [...(row.product_images ?? [])].sort((a, b) => (a.sort_order ?? 1) - (b.sort_order ?? 1));
  const category = firstRelation(row.categories);
  const location = firstRelation(row.locations);
  const school = firstRelation(row.schools);

  return {
    id: row.id,
    title: row.title,
    price: toNumber(row.price) ?? 0,
    originalPrice: toNumber(row.original_price),
    category: (category?.slug ?? "other") as ProductCategoryKey,
    status: row.status as ProductStatusKey,
    location: (location?.slug ?? "um_library") as ProductLocationKey,
    schoolId: row.school_id,
    schoolSlug: school?.slug ?? defaultSchool.slug,
    images:
      images.length > 0
        ? images.map((image, index) => ({
            id: image.id,
            url: image.image_url,
            alt: image.alt ?? row.title,
            sortOrder: image.sort_order ?? index + 1
          }))
        : [
            {
              id: `${row.id}-fallback-image`,
              url: "/images/product-books.svg",
              alt: row.title,
              sortOrder: 1
            }
          ],
    sellerId: row.seller_id,
    productContacts: (row.product_contacts ?? []).map((contact) => ({
      method: contact.method as ContactMethodKey,
      value: contact.value
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    views: row.views_count ?? 0,
    likes: row.favorites_count ?? 0,
    description: row.description,
    condition: row.condition ?? "成色未填写",
    tags: row.tags ?? []
  };
}

export async function getProductsFromSupabase() {
  if (!supabase) {
    return getMockProducts();
  }

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return getMockProducts();
  }

  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductByIdFromSupabase(id: string) {
  if (!supabase) {
    return getMockProductById(id);
  }

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return getMockProductById(id);
  }

  return mapProduct(data as unknown as ProductRow);
}

export async function getLatestProductsFromSupabase(limit = 4) {
  const products = await getProductsFromSupabase();

  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
