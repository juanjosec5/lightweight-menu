export const getQueryParam = (key: string, search = window.location.search) => {
  const params = new URLSearchParams(search);
  return params.get(key) || "";
};

/** Optional: normalize user input like `G Lounge` → `g-lounge` */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

/** Optional: whitelist to avoid 404s / traversal */
export const coerceMenuId = (
  raw: string,
  allowed: string[],
  fallback: string
) => {
  const id = slugify(raw);
  return allowed.includes(id) ? id : fallback;
};
