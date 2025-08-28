// src/composables/useMenu.ts
import { ref, onBeforeMount, watch, type Ref } from "vue";

export type MenuJSON = any;

function buildAssetUrl(pathname: string) {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);

  return new URL(pathname.replace(/^\/+/, ""), base).toString();
}

export function useMenu(idRef: string) {
  const data = ref<MenuJSON | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  onBeforeMount(async () => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const id = idRef.trim();

      if (!id) throw new Error("Missing menu id");

      const url = buildAssetUrl(`menus/${id}.json`);
      const res = await fetch(url, { cache: "no-cache" });

      if (!res.ok)
        throw new Error(`Menu "${id}" not found (HTTP ${res.status})`);

      data.value = await res.json();
      document.title = `Menu ${data.value?.restaurant.name}`;
    } catch (e: any) {
      error.value = e?.message ?? "Failed to load menu";
    } finally {
      loading.value = false;
    }
  });

  return { data, loading, error };
}
