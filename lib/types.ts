import type { categories, contactMethods, locations, productStatus, userTypes } from "./constants";

export type SchoolId = string;
export type SchoolSlug = string;
export type UserTypeKey = (typeof userTypes)[number]["key"];
export type ContactMethodKey = (typeof contactMethods)[number]["key"];
export type ProductCategoryKey = (typeof categories)[number]["key"];
export type ProductLocationKey = (typeof locations)[number]["key"];
export type ProductStatusKey = (typeof productStatus)[number]["key"];

export type Contact = {
  method: ContactMethodKey;
  value: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type User = {
  id: string;
  name: string;
  type: UserTypeKey;
  schoolId: SchoolId;
  schoolSlug: SchoolSlug;
  avatarInitial: string;
  userContacts: Contact[];
  createdAt: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: ProductCategoryKey;
  status: ProductStatusKey;
  location: ProductLocationKey;
  schoolId: SchoolId;
  schoolSlug: SchoolSlug;
  images: ProductImage[];
  sellerId: string;
  productContacts: Contact[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  description: string;
  condition: string;
  tags: string[];
};
