// src/composables/useMenuFromUrl.ts
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const readMenuParam = () => {
  const params = new URLSearchParams(window.location.search);
  return (params.get("menu") || "").trim();
};

export function useMenuFromUrl(knownMenus: string[]) {
  const rawMenuParam = ref<string>("");

  const syncFromUrl = () => {
    const raw = readMenuParam();
    rawMenuParam.value = raw;

    // normalize the URL once if user provided non-slug value
    const normalized = raw ? slugify(raw) : "";
    if (raw && normalized && normalized !== raw) {
      const url = new URL(window.location.href);
      url.pathname = import.meta.env.BASE_URL;
      url.searchParams.set("menu", normalized);
      window.history.replaceState({}, "", url.toString());
      rawMenuParam.value = normalized; // keep state aligned with URL
    }
  };

  const menuId = computed(() => {
    const raw = rawMenuParam.value;
    if (!raw) return "";
    const normalized = slugify(raw);
    return knownMenus.includes(normalized) ? normalized : "";
  });

  const isMissingParam = computed(() => rawMenuParam.value.length === 0);
  const invalidMenu = computed(() => !isMissingParam.value && menuId.value === "");

  // Optional helper to navigate within the SPA without reloading
  const setMenuId = (next: string, opts?: { replace?: boolean }) => {
    const normalized = slugify(next);
    const url = new URL(window.location.href);

    url.pathname = import.meta.env.BASE_URL;
    url.searchParams.set("menu", normalized);

    if (opts?.replace) window.history.replaceState({}, "", url.toString());
    else window.history.pushState({}, "", url.toString());

    rawMenuParam.value = normalized;
  };

  onMounted(() => {
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("popstate", syncFromUrl);
  });

  return {
    menuId,          // computed<string>
    invalidMenu,     // computed<boolean>
    isMissingParam,  // computed<boolean>
    setMenuId,       // optional helper
  };
}
