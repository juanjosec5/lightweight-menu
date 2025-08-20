// src/composables/useMenu.ts
import { ref, onBeforeMount, watch, type Ref } from "vue"

export type MenuJSON = any

function buildAssetUrl(pathname: string) {
  // import.meta.env.BASE_URL is "/" in dev, "/lightweight-menu/" in prod
  const base = new URL(import.meta.env.BASE_URL, window.location.origin) // e.g. http://localhost:5173/lightweight-menu/
  return new URL(pathname.replace(/^\/+/, ""), base).toString()
}

export function useMenu(idRef: Ref<string>) {
  const data = ref<MenuJSON | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    data.value = null
    try {
      const id = idRef.value?.trim()
      if (!id) throw new Error("Missing menu id")
      const url = buildAssetUrl(`menus/${id}.json`)
      const res = await fetch(url, { cache: "no-cache" })
      if (!res.ok) throw new Error(`Menu "${id}" not found (HTTP ${res.status})`)
      data.value = await res.json()
    } catch (e: any) {
      error.value = e?.message ?? "Failed to load menu"
    } finally {
      loading.value = false
    }
  }

  onBeforeMount(load)
  watch(idRef, () => { void load() })

  return { data, loading, error, reload: load }
}
