// composables/useMenuFromUrl.ts
import { computed } from "vue";

export function useMenuFromUrl(knownMenus: string[]) {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("menu") || "").trim();

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const normalized = raw ? slugify(raw) : "";

  const isKnown = normalized ? knownMenus.includes(normalized) : false;
  const isMissingParam = raw.length === 0;
  const menuId = isMissingParam ? "" : isKnown ? normalized : "";
  const invalidMenu = !isMissingParam && !isKnown;

  if (raw && normalized && normalized !== raw) {
    const url = new URL(window.location.href);

    url.pathname = import.meta.env.BASE_URL;
    url.searchParams.set("menu", normalized);
    window.history.replaceState({}, "", url.toString());
  }

  return {
    menuId: menuId,
    invalidMenu: invalidMenu,
    isMissingParam: isMissingParam,
  };
}
