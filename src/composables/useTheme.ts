// src/composables/useTheme.ts
import { ref } from "vue"

export type Theme = "light" | "dark";

export function useTheme() {
const saved = localStorage.getItem("theme") as Theme | null;
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const theme = ref<Theme>(saved || prefersDark);
document.documentElement.dataset.theme = theme.value;

const toggle = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
  document.documentElement.dataset.theme = theme.value;
}

  return { theme, toggle };
}
