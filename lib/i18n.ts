import type {
  ContactMethodKey,
  ProductCategoryKey,
  ProductLocationKey,
  ProductStatusKey,
  UserTypeKey
} from "@/lib/types";

export type Language = "zh" | "en";

export const defaultLanguage: Language = "zh";
export const languageStorageKey = "pandamarket-language";

export const translations = {
  "brand.subtitle": { zh: "UM校园交易社区", en: "UM Campus Marketplace" },
  "common.login": { zh: "登录", en: "Log in" },
  "common.register": { zh: "注册", en: "Sign up" },
  "common.publish": { zh: "发布", en: "Sell" },
  "common.publishProduct": { zh: "发布商品", en: "Post Listing" },
  "common.myProducts": { zh: "我的商品", en: "My Listings" },
  "common.logout": { zh: "退出登录", en: "Log out" },
  "common.search": { zh: "搜索", en: "Search" },
  "common.saved": { zh: "收藏", en: "Saved" },
  "common.profile": { zh: "我的", en: "Profile" },
  "common.home": { zh: "首页", en: "Home" },
  "common.products": { zh: "商品", en: "Browse" },
  "common.backToList": { zh: "返回列表", en: "Back to Listings" },
  "common.edit": { zh: "编辑", en: "Edit" },
  "common.delete": { zh: "删除", en: "Delete" },
  "common.saveChanges": { zh: "保存修改", en: "Save Changes" },
  "common.saving": { zh: "保存中...", en: "Saving..." },
  "common.posting": { zh: "发布中...", en: "Posting..." },
  "common.viewAll": { zh: "查看全部", en: "See all" },
  "common.explore": { zh: "去看看", en: "Explore" },
  "common.itemCount": { zh: "件", en: "items" },
  "common.optional": { zh: "选填", en: "Optional" },
  "common.currentSelected": { zh: "当前已选", en: "Selected" },
  "common.noMatchingProducts": { zh: "暂无符合条件的商品", en: "No matching listings yet" },
  "common.unknownUser": { zh: "未知用户", en: "Unknown User" },
  "nav.location": { zh: "Universiti Malaya", en: "Universiti Malaya" },
  "home.eyebrow": { zh: "校园市场", en: "Campus Marketplace" },
  "home.heroTitle1": { zh: "Find. Buy. Sell.", en: "Find. Buy. Sell." },
  "home.heroTitle2": { zh: "校园二手更轻松", en: "Campus second-hand made easy" },
  "home.heroBody": { zh: "为 UM 同学整理的干净交易社区。", en: "A cleaner marketplace for UM students." },
  "home.searchPlaceholder": { zh: "搜索二手商品", en: "Search textbooks, electronics, furniture..." },
  "home.allCategories": { zh: "全部类别", en: "All Categories" },
  "home.allCategoryShort": { zh: "全部", en: "All" },
  "home.allLocations": { zh: "全部位置", en: "All Locations" },
  "home.latestTitle": { zh: "最新发布", en: "Recently Added" },
  "home.freeTitle": { zh: "免费赠送专区", en: "Free Finds" },
  "home.graduationTitle": { zh: "毕业季急出专区", en: "Graduation Sale" },
  "products.title": { zh: "发现 UM 好物", en: "Browse UM Listings" },
  "products.countSuffix": { zh: "件", en: "listings" },
  "products.category": { zh: "物品类别", en: "Category" },
  "products.location": { zh: "位置", en: "Location" },
  "products.status": { zh: "商品状态", en: "Status" },
  "products.allStatus": { zh: "全部状态", en: "All Status" },
  "products.searchPlaceholder": { zh: "搜索关键词，例如：电饭煲、教材、桌子", en: "Search rice cooker, textbooks, desk..." },
  "products.listTitleSuffix": { zh: "件 UM 闲置", en: "UM Listings" },
  "products.listTitle": { zh: "{count} 件 UM 闲置", en: "{count} UM Listings" },
  "sort.latest": { zh: "最新发布", en: "Newest First" },
  "sort.oldest": { zh: "最早发布", en: "Oldest First" },
  "sort.price": { zh: "价格排序", en: "Price" },
  "sort.priceAsc": { zh: "价格从低到高", en: "Price: Low to High" },
  "sort.priceDesc": { zh: "价格从高到低", en: "Price: High to Low" },
  "login.eyebrow": { zh: "欢迎回来", en: "Welcome Back" },
  "login.title": { zh: "登录 PandaMarket", en: "Log in to PandaMarket" },
  "login.hero": { zh: "回到 UM 校园交易社区，继续发现附近好物。", en: "Return to the UM campus marketplace and keep browsing nearby finds." },
  "login.note": { zh: "第一阶段面向 UM 中国留学生验证，后续可扩展学校邮箱认证。", en: "This alpha starts with basic accounts and can later expand to university email verification." },
  "login.email": { zh: "邮箱", en: "Email" },
  "login.password": { zh: "密码", en: "Password" },
  "login.emailPlaceholder": { zh: "例如：name@email.com", en: "name@email.com" },
  "login.passwordPlaceholder": { zh: "请输入密码", en: "Enter your password" },
  "login.createAccount": { zh: "创建账号", en: "Create account" },
  "login.forgotPassword": { zh: "找回密码", en: "Forgot password" },
  "login.registered": { zh: "注册成功，请登录。", en: "Registration successful. Please log in." },
  "register.eyebrow": { zh: "加入 PandaMarket", en: "Join PandaMarket" },
  "register.title": { zh: "创建账号", en: "Create Account" },
  "register.hero": { zh: "用一个账号发布、管理和收藏 UM 附近的闲置好物。", en: "Use one account to post, manage, and save UM nearby listings." },
  "register.note": { zh: "先用基础账号完成原型验证，未来支持学校邮箱认证和 UM 认证用户标识。", en: "We start with simple accounts and can later support university email verification." },
  "register.displayName": { zh: "昵称", en: "Display Name" },
  "register.displayNamePlaceholder": { zh: "例如：小林", en: "e.g. Alex" },
  "register.passwordPlaceholder": { zh: "至少 8 位字符", en: "At least 8 characters" },
  "register.hasAccount": { zh: "已有账号？", en: "Already have an account?" },
  "register.goLogin": { zh: "去登录", en: "Log in" },
  "publish.eyebrow": { zh: "发布商品", en: "Create Listing" },
  "publish.title": { zh: "把闲置交给附近需要的人。", en: "List your item for someone nearby." },
  "publish.note": { zh: "填写核心信息即可发布。平台只做信息展示和匹配，交易请在线下自行完成。", en: "Add the essentials and post. PandaMarket helps with discovery; trades happen offline." },
  "form.photos": { zh: "商品图片", en: "Add Photos" },
  "form.photosHelp": { zh: "支持从相册选择 1-5 张 jpg、jpeg、png、webp 图片。已选择 {count} 张，暂不上传也可以发布。", en: "Choose 1-5 jpg, jpeg, png, or webp photos. {count} selected. You can post without photos." },
  "form.noPhotos": { zh: "未选择图片时会使用默认商品图。", en: "A fallback image will be used if no photo is selected." },
  "form.title": { zh: "标题", en: "Title" },
  "form.titlePlaceholder": { zh: "例如：小型电饭煲 1.6L", en: "e.g. Mini rice cooker 1.6L" },
  "form.price": { zh: "价格（RM）", en: "Price (RM)" },
  "form.pricePlaceholder": { zh: "0 表示免费赠送", en: "Use 0 for free items" },
  "form.status": { zh: "商品状态", en: "Status" },
  "form.category": { zh: "商品分类", en: "Category" },
  "form.location": { zh: "交易地点", en: "Meetup Location" },
  "form.description": { zh: "商品描述", en: "Description" },
  "form.descriptionPlaceholder": { zh: "说明成色、购买时间、交接方式等，帮助买家快速判断。", en: "Describe condition, purchase time, meetup details, and anything buyers should know." },
  "form.condition": { zh: "成色", en: "Condition" },
  "form.conditionPlaceholder": { zh: "例如：九成新、功能正常、全新未拆", en: "e.g. Like new, works well, unopened" },
  "form.wechat": { zh: "微信", en: "WeChat" },
  "form.whatsapp": { zh: "WhatsApp", en: "WhatsApp" },
  "form.telegram": { zh: "Telegram", en: "Telegram" },
  "form.currentImages": { zh: "当前商品还没有上传图片。", en: "This listing has no uploaded photos yet." },
  "form.maxImages": { zh: "最多保留 5 张图片，当前保存后共 {count} 张。", en: "Keep up to 5 photos. This listing will have {count} after saving." },
  "edit.eyebrow": { zh: "编辑商品", en: "Edit Listing" },
  "edit.title": { zh: "编辑商品信息", en: "Edit Listing Details" },
  "edit.note": { zh: "可以修改商品文字信息、联系方式，也可以删除旧图片或新增图片。", en: "Update details, contacts, remove old photos, or add new photos." },
  "edit.back": { zh: "返回商品详情", en: "Back to Listing" },
  "edit.deleteImage": { zh: "删除图片", en: "Remove Photo" },
  "edit.undoDelete": { zh: "撤销删除", en: "Undo Remove" },
  "my.eyebrow": { zh: "我的发布", en: "My Listings" },
  "my.titleSuffix": { zh: "发布的商品", en: "'s listings" },
  "my.note": { zh: "这里会显示你通过当前账号发布的商品。", en: "Listings posted from your current account appear here." },
  "my.countTitle": { zh: "{count} 件商品", en: "{count} listings" },
  "my.emptyTitle": { zh: "你还没有发布商品", en: "No listings yet" },
  "my.emptyAction": { zh: "去发布第一件商品", en: "Post Your First Item" },
  "favorites.eyebrow": { zh: "收藏", en: "Saved" },
  "favorites.title": { zh: "先存下，再慢慢看", en: "Save now, decide later" },
  "favorites.note": { zh: "当前使用统一 mock 收藏数据，后续接入 Supabase 后可关联到登录用户。", en: "Saved listings currently use mock data and can later connect to each user." },
  "favorites.countTitle": { zh: "{count} 件收藏", en: "{count} saved listings" },
  "detail.category": { zh: "分类", en: "Category" },
  "detail.condition": { zh: "成色", en: "Condition" },
  "detail.location": { zh: "地点", en: "Location" },
  "detail.seller": { zh: "卖家", en: "Seller" },
  "detail.userType": { zh: "用户类型", en: "User Type" },
  "detail.postedAt": { zh: "发布时间", en: "Posted" },
  "detail.description": { zh: "商品说明", en: "Description" },
  "detail.contacts": { zh: "联系方式", en: "Contact" },
  "detail.contactNote": { zh: "平台暂不提供聊天系统，请自行确认交易细节并线下完成交易。", en: "PandaMarket does not provide in-app chat yet. Please confirm details and trade offline." },
  "detail.report": { zh: "举报商品", en: "Report Listing" },
  "contact.button": { zh: "联系卖家", en: "Contact Seller" },
  "contact.title": { zh: "联系卖家", en: "Contact Seller" },
  "contact.empty": { zh: "卖家暂未填写联系方式", en: "The seller has not added contact details yet." },
  "contact.copyWechat": { zh: "已复制微信号", en: "WeChat copied" },
  "contact.copyWhatsapp": { zh: "已复制 WhatsApp", en: "WhatsApp copied" },
  "contact.copyGeneric": { zh: "已复制联系方式", en: "Contact copied" },
  "contact.copyFailed": { zh: "复制失败，请手动复制", en: "Copy failed. Please copy manually." },
  "contact.inquiryLabel": { zh: "默认咨询话术", en: "Suggested Message" },
  "contact.inquiryText": { zh: "你好，我在 PandaMarket 看到你的商品「{title}」，请问还在吗？", en: "Hi, I saw your listing \"{title}\" on PandaMarket. Is it still available?" },
  "contact.copyInquiry": { zh: "已复制咨询话术", en: "Message copied" },
  "contact.openWhatsapp": { zh: "打开 WhatsApp", en: "Open WhatsApp" },
  "contact.safety": { zh: "建议在 UM 校园或公共区域当面交易，请勿提前转账，注意核对商品状态。", en: "Meet on campus or in public areas. Do not transfer money in advance and check the item carefully." },
  "safety.title": { zh: "安全提醒", en: "Safety Tips" },
  "delete.confirm": { zh: "确定要删除这个商品吗？删除后无法恢复。", en: "Delete this listing? This cannot be undone." },
  "error.missingConfig": { zh: "请先配置 Supabase 环境变量。", en: "Please configure Supabase environment variables first." },
  "error.missingLoginFields": { zh: "请填写邮箱和密码。", en: "Please enter email and password." },
  "error.missingRegisterFields": { zh: "请填写昵称、邮箱和密码。", en: "Please enter display name, email, and password." },
  "image.readFailed": { zh: "读取图片失败，请重新选择图片。", en: "Failed to read images. Please choose again." },
  "image.publishPreviewFailed": { zh: "发布图片预览失败", en: "Failed to preview publish image" },
  "image.editPreviewFailed": { zh: "编辑图片预览失败", en: "Failed to preview edit image" }
  ,
  "category.kitchen": { zh: "厨房用品", en: "Kitchen" },
  "category.electronics": { zh: "电子产品", en: "Electronics" },
  "category.furniture": { zh: "家具", en: "Furniture" },
  "category.appliances": { zh: "家电", en: "Appliances" },
  "category.books": { zh: "书籍教材", en: "Books" },
  "category.fashion": { zh: "服饰鞋包", en: "Fashion" },
  "category.sports": { zh: "运动户外", en: "Sports" },
  "category.beauty": { zh: "美妆个护", en: "Beauty" },
  "category.free": { zh: "免费赠送", en: "Free" },
  "category.graduation_sale": { zh: "毕业季急出", en: "Graduation Sale" },
  "category.other": { zh: "其他", en: "Other" },
  "status.available": { zh: "在售", en: "Active" },
  "status.reserved": { zh: "预定中", en: "Reserved" },
  "status.sold": { zh: "已售", en: "Sold" },
  "status.inactive": { zh: "已下架", en: "Inactive" }
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, language: Language, values?: Record<string, string | number>) {
  let text: string = translations[key]?.[language] ?? translations[key]?.zh ?? key;

  if (values) {
    Object.entries(values).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
  }

  return text;
}

export const categoryLabels: Record<ProductCategoryKey, Record<Language, string>> = {
  kitchen: { zh: "厨房用品", en: "Kitchen" },
  electronics: { zh: "电子产品", en: "Electronics" },
  furniture: { zh: "家具", en: "Furniture" },
  appliances: { zh: "家电", en: "Appliances" },
  books: { zh: "书籍教材", en: "Books" },
  fashion: { zh: "服饰鞋包", en: "Fashion" },
  sports: { zh: "运动户外", en: "Sports" },
  beauty: { zh: "美妆个护", en: "Beauty" },
  free: { zh: "免费赠送", en: "Free" },
  graduation_sale: { zh: "毕业季急出", en: "Graduation Sale" },
  other: { zh: "其他", en: "Other" }
};

export const statusLabels: Record<ProductStatusKey, Record<Language, string>> = {
  available: { zh: "在售", en: "Active" },
  reserved: { zh: "预定中", en: "Reserved" },
  sold: { zh: "已售", en: "Sold" },
  inactive: { zh: "已下架", en: "Inactive" }
};

export const userTypeLabels: Record<UserTypeKey, Record<Language, string>> = {
  regular: { zh: "普通用户", en: "Regular User" },
  um_verified: { zh: "UM认证用户", en: "Verified Student" }
};

export const contactMethodLabels: Record<ContactMethodKey, Record<Language, string>> = {
  wechat: { zh: "微信", en: "WeChat" },
  whatsapp: { zh: "WhatsApp", en: "WhatsApp" },
  telegram: { zh: "Telegram", en: "Telegram" }
};

export const locationGroupLabels: Record<string, Record<Language, string>> = {
  kl: { zh: "KL区", en: "KL Area" },
  pj: { zh: "PJ区", en: "PJ Area" },
  university: { zh: "University区", en: "University Area" },
  vivo: { zh: "Vivo区", en: "Vivo Area" },
  cubic: { zh: "Cubic区", en: "Cubic Area" }
};

export const reportReasonLabels: Record<string, Record<Language, string>> = {
  scam: { zh: "诈骗", en: "Scam" },
  duplicate: { zh: "重复发布", en: "Duplicate" },
  prohibited: { zh: "违禁商品", en: "Prohibited item" },
  false_info: { zh: "虚假信息", en: "False information" },
  other: { zh: "其他", en: "Other" }
};
