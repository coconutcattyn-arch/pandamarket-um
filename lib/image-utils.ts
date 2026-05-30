export const maxProductImageCount = 5;
export const maxProductImageSize = 8 * 1024 * 1024;
export const allowedProductImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const allowedProductImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
export const blockedProductImageExtensions = [".heic", ".heif"];

export const heicImageMessage = "当前暂不支持 HEIC/HEIF 图片，请在相册中选择截图，或转换为 JPG/PNG 后上传。";
export const imageSizeMessage = "单张图片不能超过 8MB，请压缩或更换图片。";
export const imageTypeMessage = "图片格式仅支持 JPG、PNG、WEBP。";
export const imageUploadFailMessage = "图片上传失败，请更换图片后重试。";

export function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

export function isHeicLikeFile(file: Pick<File, "name" | "type">) {
  const extension = getFileExtension(file.name);
  const mime = file.type.toLowerCase();

  return mime.includes("heic") || mime.includes("heif") || blockedProductImageExtensions.includes(extension);
}

export function isAllowedProductImage(file: Pick<File, "name" | "type">) {
  const extension = getFileExtension(file.name);
  const mime = file.type.toLowerCase();

  return allowedProductImageTypes.includes(mime) || allowedProductImageExtensions.includes(extension);
}

export function getUploadContentType(file: Pick<File, "name" | "type">) {
  const mime = file.type.toLowerCase();

  if (allowedProductImageTypes.includes(mime)) {
    return mime;
  }

  const extension = getFileExtension(file.name);

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

export function validateProductImageFiles(files: File[], options?: { maxCount?: number }) {
  const maxCount = options?.maxCount ?? maxProductImageCount;

  if (files.length > maxCount) {
    return `最多只能上传 ${maxCount} 张图片。`;
  }

  for (const file of files) {
    if (isHeicLikeFile(file)) {
      return heicImageMessage;
    }

    if (!isAllowedProductImage(file)) {
      return imageTypeMessage;
    }

    if (file.size > maxProductImageSize) {
      return imageSizeMessage;
    }
  }

  return "";
}

