import {
  categories,
  contactMethods,
  defaultProductStatus,
  defaultSchool,
  defaultUserType,
  homeLocationTags,
  locations,
  productStatus,
  reportReasons,
  schools,
  userTypes
} from "./constants";
import { currentUserId, favoriteProductIdsByUserId, products, users } from "./mock-data";
import type { ContactMethodKey, Product, ProductCategoryKey, ProductLocationKey, ProductStatusKey, UserTypeKey } from "./types";

export {
  categories,
  contactMethods,
  currentUserId,
  defaultProductStatus,
  defaultSchool,
  defaultUserType,
  homeLocationTags,
  locations,
  productStatus,
  reportReasons,
  schools,
  userTypes
};

function getLabel<T extends { key: string; label: string }>(items: readonly T[], key: string) {
  return items.find((item) => item.key === key)?.label ?? key;
}

export function getProducts() {
  return products;
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getLatestProducts(limit = 4) {
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 3) {
  return [...products].sort((a, b) => b.views + b.likes - (a.views + a.likes)).slice(0, limit);
}

export function getFavoriteProducts(userId: string) {
  const favoriteIds = favoriteProductIdsByUserId[userId] ?? [];
  return products.filter((product) => favoriteIds.includes(product.id));
}

export function getMyProducts(userId: string) {
  return products.filter((product) => product.sellerId === userId);
}

export function getFreeProducts() {
  return products.filter((product) => product.category === "free");
}

export function getGraduationProducts() {
  return products.filter((product) => product.category === "graduation_sale");
}

export function getUsers() {
  return users;
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function getCategoryLabel(category: ProductCategoryKey) {
  return getLabel(categories, category);
}

export function getLocationLabel(location: ProductLocationKey) {
  return getLabel(locations, location);
}

export function getProductStatusLabel(status: ProductStatusKey) {
  return getLabel(productStatus, status);
}

export function getUserTypeLabel(type: UserTypeKey) {
  return getLabel(userTypes, type);
}

export function getContactMethodLabel(method: ContactMethodKey) {
  return getLabel(contactMethods, method);
}

export function getPrimaryProductImage(product: Product) {
  return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
}

export function formatProductDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
