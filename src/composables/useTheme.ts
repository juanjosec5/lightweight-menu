// src/composables/useTheme.ts
import { ref, onMounted, computed, onBeforeUnmount } from "vue"

export type Theme = "light" | "dark" | "system"

export function useTheme() {
  const theme = ref<Theme>("system")
  let mql: MediaQueryList | null = null

  const apply = (t: Theme) => {
    const root = document.documentElement
    if (t === "system") {
      root.removeAttribute("data-theme")
      localStorage.removeItem("theme")
    } else {
      root.setAttribute("data-theme", t)
      localStorage.setItem("theme", t)
    }
    theme.value = t
  }

  const prefersDark = computed(() =>
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
      : false
  )

  const effective = computed<Exclude<Theme, "system">>(() =>
    theme.value === "system" ? (prefersDark.value ? "dark" : "light") : theme.value
  )

  const isDark = computed(() => effective.value === "dark")

  onMounted(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "system"
    apply(saved)
    // keep in sync if OS theme changes while on "system"
    mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme.value === "system") {
        const root = document.documentElement
        if (mql!.matches) root.removeAttribute("data-theme") // media query takes over
        else root.removeAttribute("data-theme")
      }
    }
    mql.addEventListener?.("change", handler)
    onBeforeUnmount(() => mql?.removeEventListener?.("change", handler))
  })

  const toggle = () => apply(isDark.value ? "light" : "dark")

  return { theme, effective, isDark, apply, toggle }
}
