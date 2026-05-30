export const schools = [
  {
    id: "school_um",
    slug: "um",
    name: "University of Malaya",
    shortName: "UM"
  }
] as const;

export const defaultSchool = schools[0];

export const userTypes = [
  { key: "regular", label: "普通用户" },
  { key: "um_verified", label: "UM认证用户" }
] as const;

export const defaultUserType = userTypes[0].key;

export const contactMethods = [
  { key: "wechat", label: "微信" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" }
] as const;

export const categories = [
  { key: "kitchen", label: "厨房用品" },
  { key: "electronics", label: "电子产品" },
  { key: "furniture", label: "家具" },
  { key: "appliances", label: "家电" },
  { key: "books", label: "书籍教材" },
  { key: "fashion", label: "服饰鞋包" },
  { key: "sports", label: "运动户外" },
  { key: "beauty", label: "美妆个护" },
  { key: "free", label: "免费赠送" },
  { key: "graduation_sale", label: "毕业季急出" },
  { key: "other", label: "其他" }
] as const;

export const locations = [
  { key: "um_library", label: "UM Library" },
  { key: "he_she_coffee", label: "He & She Coffee" },
  { key: "kl_gateway", label: "KL Gateway" },
  { key: "southlink", label: "Southlink" },
  { key: "southview", label: "Southview" },
  { key: "novum", label: "Novum" },
  { key: "pantai_hillpark", label: "Pantai Hillpark" },
  { key: "petaling_jaya", label: "Petaling Jaya" }
] as const;

export const homeLocationTags = [
  { key: "near_um", label: "UM附近" },
  ...locations
] as const;

export const productStatus = [
  { key: "available", label: "在售" },
  { key: "reserved", label: "预定中" },
  { key: "sold", label: "已售" },
  { key: "inactive", label: "已下架" }
] as const;

export const defaultProductStatus = productStatus[0].key;

export const reportReasons = [
  { key: "scam", label: "诈骗" },
  { key: "duplicate", label: "重复发布" },
  { key: "prohibited", label: "违禁商品" },
  { key: "false_info", label: "虚假信息" },
  { key: "other", label: "其他" }
] as const;
