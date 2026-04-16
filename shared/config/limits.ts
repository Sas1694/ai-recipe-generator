export const MAX_IMAGE_SIZE_MB = 4;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const SUPPORTED_FORMATS_LABEL = SUPPORTED_MIME_TYPES.map((t) =>
  t.replace("image/", "").toUpperCase()
).join(", ");
