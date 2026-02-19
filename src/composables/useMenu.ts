// src/composables/useMenu.ts
import { ref, watch, unref, type MaybeRef, onBeforeUnmount } from "vue";
import type { RestaurantMenu } from "@/types/menu";

function buildAssetUrl(pathname: string) {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  return new URL(pathname.replace(/^\/+/, ""), base).toString();
}

const toErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Failed to load menu";

export function useMenu(menuId: MaybeRef<string>) {
  const data = ref<RestaurantMenu | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  let controller: AbortController | null = null;

  const load = async (id: string) => {
    controller?.abort();
    controller = new AbortController();

    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const url = buildAssetUrl(`menus/${id}.json`);
      const res = await fetch(url, { cache: "no-cache", signal: controller.signal });

      if (!res.ok) throw new Error(`Menu "${id}" not found (HTTP ${res.status})`);

      const parsed = (await res.json()) as RestaurantMenu;

      // minimal safety checks (optional but recommended)
      if (!parsed?.restaurant?.name) throw new Error("Invalid menu JSON: missing restaurant.name");
      if (!Array.isArray(parsed.menus)) throw new Error("Invalid menu JSON: missing menus[]");

      data.value = parsed;
      document.title = `Menu ${parsed.restaurant.name}`;
    } catch (e: unknown) {
      // ignore aborts to avoid flashing errors during fast navigation
      if ((e as any)?.name === "AbortError") return;
      error.value = toErrorMessage(e);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => (unref(menuId) ?? "").trim(),
    async (id) => {
      if (!id) {
        data.value = null;
        loading.value = false;
        error.value = "Missing menu id";
        return;
      }
      await load(id);
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    controller?.abort();
  });

  return { data, loading, error, reload: () => load((unref(menuId) ?? "").trim()) };
}
