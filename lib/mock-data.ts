import { defaultSchool } from "./constants";
import type { Contact, Product, User } from "./types";

export const currentUserId = "user-lina";

const userContactsById: Record<string, Contact[]> = {
  "user-lina": [
    { method: "wechat", value: "LinaUM2026" },
    { method: "whatsapp", value: "+60 12-345 6789" }
  ],
  "user-jason": [{ method: "telegram", value: "@jason_um" }],
  "user-zhou": [
    { method: "wechat", value: "zhou_um" },
    { method: "whatsapp", value: "+60 17-888 2345" }
  ],
  "user-mia": [{ method: "wechat", value: "MiaFBE" }],
  "user-anning": [{ method: "whatsapp", value: "+60 11-222 8899" }],
  "user-yuki": [
    { method: "wechat", value: "yuki_um" },
    { method: "telegram", value: "@yuki_market" }
  ],
  "user-kevin": [{ method: "telegram", value: "@kevin_um" }],
  "user-summer": [{ method: "wechat", value: "summer_moveout" }],
  "user-chen": [{ method: "whatsapp", value: "+60 18-666 9001" }]
};

export const users: User[] = [
  {
    id: "user-lina",
    name: "Lina",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "L",
    userContacts: userContactsById["user-lina"],
    createdAt: "2026-05-01T02:15:00.000Z"
  },
  {
    id: "user-jason",
    name: "Jason",
    type: "regular",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "J",
    userContacts: userContactsById["user-jason"],
    createdAt: "2026-05-03T10:30:00.000Z"
  },
  {
    id: "user-zhou",
    name: "小周",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "周",
    userContacts: userContactsById["user-zhou"],
    createdAt: "2026-05-06T07:40:00.000Z"
  },
  {
    id: "user-mia",
    name: "Mia",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "M",
    userContacts: userContactsById["user-mia"],
    createdAt: "2026-05-07T03:10:00.000Z"
  },
  {
    id: "user-anning",
    name: "阿宁",
    type: "regular",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "宁",
    userContacts: userContactsById["user-anning"],
    createdAt: "2026-05-08T12:00:00.000Z"
  },
  {
    id: "user-yuki",
    name: "Yuki",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "Y",
    userContacts: userContactsById["user-yuki"],
    createdAt: "2026-05-10T08:25:00.000Z"
  },
  {
    id: "user-kevin",
    name: "Kevin",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "K",
    userContacts: userContactsById["user-kevin"],
    createdAt: "2026-05-12T05:15:00.000Z"
  },
  {
    id: "user-summer",
    name: "Summer",
    type: "regular",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "S",
    userContacts: userContactsById["user-summer"],
    createdAt: "2026-05-14T09:20:00.000Z"
  },
  {
    id: "user-chen",
    name: "Chen",
    type: "um_verified",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    avatarInitial: "C",
    userContacts: userContactsById["user-chen"],
    createdAt: "2026-05-15T11:45:00.000Z"
  }
];

function productImage(productId: string, url: string, alt: string) {
  return [{ id: `${productId}-image-1`, url, alt, sortOrder: 1 }];
}

export const products: Product[] = [
  {
    id: "macbook-air-m1",
    title: "MacBook Air M1 8+256",
    price: 2350,
    originalPrice: 4199,
    category: "electronics",
    status: "available",
    location: "um_library",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("macbook-air-m1", "/images/product-laptop.svg", "MacBook Air M1"),
    sellerId: "user-lina",
    productContacts: userContactsById["user-lina"],
    createdAt: "2026-05-30T06:20:00.000Z",
    updatedAt: "2026-05-30T06:20:00.000Z",
    views: 238,
    likes: 32,
    condition: "九成新",
    tags: ["可小刀", "原盒", "适合上课"],
    description:
      "毕业出闲置，电池健康 88%，日常写论文、网课、轻量剪辑都很顺。可在 UM Library 当面验机。"
  },
  {
    id: "ikea-desk",
    title: "IKEA 白色书桌",
    price: 90,
    originalPrice: 189,
    category: "furniture",
    status: "reserved",
    location: "southlink",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("ikea-desk", "/images/product-desk.svg", "IKEA 白色书桌"),
    sellerId: "user-jason",
    productContacts: userContactsById["user-jason"],
    createdAt: "2026-05-29T13:05:00.000Z",
    updatedAt: "2026-05-29T13:30:00.000Z",
    views: 154,
    likes: 18,
    condition: "八成新",
    tags: ["自取", "桌面干净", "宿舍友好"],
    description:
      "桌面有轻微使用痕迹，不影响使用。尺寸适合公寓房间，Southlink 楼下交接。"
  },
  {
    id: "rice-cooker",
    title: "小型电饭煲 1.6L",
    price: 45,
    category: "appliances",
    status: "available",
    location: "pantai_hillpark",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("rice-cooker", "/images/product-cooker.svg", "小型电饭煲"),
    sellerId: "user-zhou",
    productContacts: userContactsById["user-zhou"],
    createdAt: "2026-05-28T08:00:00.000Z",
    updatedAt: "2026-05-28T08:00:00.000Z",
    views: 91,
    likes: 11,
    condition: "功能正常",
    tags: ["新生适用", "可煮粥", "已清洁"],
    description:
      "一个人做饭刚好，带蒸格和量杯。搬家急出，Pantai Hillpark 可交接。"
  },
  {
    id: "textbook-economics",
    title: "经济学教材套装",
    price: 35,
    category: "books",
    status: "available",
    location: "kl_gateway",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("textbook-economics", "/images/product-books.svg", "经济学教材套装"),
    sellerId: "user-mia",
    productContacts: userContactsById["user-mia"],
    createdAt: "2026-05-27T04:40:00.000Z",
    updatedAt: "2026-05-27T04:40:00.000Z",
    views: 76,
    likes: 9,
    condition: "有少量笔记",
    tags: ["FBE", "期末复习", "可单买"],
    description:
      "包含 Microeconomics 和 Macroeconomics，两本都有重点标注，适合商学院同学复习。"
  },
  {
    id: "kitchen-set",
    title: "厨房用品打包",
    price: 25,
    category: "kitchen",
    status: "sold",
    location: "southview",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("kitchen-set", "/images/product-kitchen.svg", "厨房用品打包"),
    sellerId: "user-anning",
    productContacts: userContactsById["user-anning"],
    createdAt: "2026-05-26T10:10:00.000Z",
    updatedAt: "2026-05-26T15:40:00.000Z",
    views: 112,
    likes: 15,
    condition: "正常使用痕迹",
    tags: ["锅铲", "盘子", "毕业季急出"],
    description:
      "适合刚搬进来的同学，包含基础餐具和小锅。该商品已售出，仅作为展示状态示例。"
  },
  {
    id: "skincare",
    title: "未拆封防晒和护手霜",
    price: 30,
    category: "beauty",
    status: "available",
    location: "he_she_coffee",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("skincare", "/images/product-skincare.svg", "未拆封防晒和护手霜"),
    sellerId: "user-yuki",
    productContacts: userContactsById["user-yuki"],
    createdAt: "2026-05-25T07:15:00.000Z",
    updatedAt: "2026-05-25T07:15:00.000Z",
    views: 64,
    likes: 8,
    condition: "全新未拆",
    tags: ["全新", "可看日期", "女生友好"],
    description:
      "囤多了出，全新未拆封，可现场看保质期。He & She Coffee 或 KL Gateway 交接。"
  },
  {
    id: "badminton-racket",
    title: "羽毛球拍 Yonex 入门款",
    price: 55,
    originalPrice: 129,
    category: "sports",
    status: "available",
    location: "petaling_jaya",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("badminton-racket", "/images/product-racket.svg", "羽毛球拍 Yonex 入门款"),
    sellerId: "user-kevin",
    productContacts: userContactsById["user-kevin"],
    createdAt: "2026-05-23T12:30:00.000Z",
    updatedAt: "2026-05-23T12:30:00.000Z",
    views: 83,
    likes: 13,
    condition: "轻微磨损",
    tags: ["运动户外", "可试拍", "近 PJ"],
    description:
      "适合刚开始打球的同学，线和手胶都还能用。Petaling Jaya 或 UM 附近可约。"
  },
  {
    id: "free-hangers",
    title: "衣架和收纳盒免费送",
    price: 0,
    category: "free",
    status: "available",
    location: "novum",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("free-hangers", "/images/product-free.svg", "衣架和收纳盒免费送"),
    sellerId: "user-summer",
    productContacts: userContactsById["user-summer"],
    createdAt: "2026-05-30T01:10:00.000Z",
    updatedAt: "2026-05-30T01:10:00.000Z",
    views: 121,
    likes: 25,
    condition: "可正常使用",
    tags: ["免费赠送", "自取", "搬家清理"],
    description:
      "搬家整理出来的衣架和两个收纳盒，免费送给需要的同学，Novum 楼下自取。"
  },
  {
    id: "graduate-bundle",
    title: "毕业季急出生活包",
    price: 120,
    originalPrice: 260,
    category: "graduation_sale",
    status: "inactive",
    location: "southview",
    schoolId: defaultSchool.id,
    schoolSlug: defaultSchool.slug,
    images: productImage("graduate-bundle", "/images/product-bundle.svg", "毕业季急出生活包"),
    sellerId: "user-chen",
    productContacts: userContactsById["user-chen"],
    createdAt: "2026-05-16T03:45:00.000Z",
    updatedAt: "2026-05-20T09:20:00.000Z",
    views: 209,
    likes: 37,
    condition: "打包出",
    tags: ["毕业季急出", "生活用品", "打包优先"],
    description:
      "包含台灯、插排、收纳、晾衣架等生活用品。当前已下架，用于展示商品状态。"
  }
];

export const favoriteProductIdsByUserId: Record<string, string[]> = {
  "user-lina": ["macbook-air-m1", "free-hangers", "textbook-economics"]
};
