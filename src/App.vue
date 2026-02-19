<script setup lang="ts">
import { watch, ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useMenu } from "@/composables/useMenu";
import { useMenuFromUrl } from "@/composables/useMenuFromUrl";
import { useTheme } from "@/composables/useTheme";
import MenuCategory from "@/components/MenuCategory.vue";
import { Sun, Moon } from "lucide-vue-next";
import type { RestaurantMenu, BrandColors } from "@/types/menu";

const menus = import.meta.glob("../public/menus/*.json");

const prettifyName = (name: string) =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();

const KNOWN_MENUS = Object.keys(menus).map((m) =>
  m.split("/").pop()?.replace(".json", "")
) as string[];

const { menuId, invalidMenu, isMissingParam } = useMenuFromUrl(KNOWN_MENUS);
const { data, loading, error } = useMenu(menuId);
const { theme, toggle } = useTheme();

const SOCIAL_MEDIA_ICONS: Record<string, string> = {
  facebook: "fa-brands fa-facebook-f fa-lg",
  instagram: "fa-brands fa-instagram fa-lg",
  twitter: "fa-brands fa-twitter fa-lg",
  tiktok: "fa-brands fa-tiktok fa-lg",
  whatsapp: "fa-brands fa-whatsapp fa-lg",
  youtube: "fa-brands fa-youtube fa-lg",
};

const selectedMenuId = ref<string | null>(null);
const activeItemId = ref<string | null>(null);
const headerRef = ref<HTMLElement | null>(null);

const selectedMenu = computed(() => {
  const all = data.value?.menus ?? [];
  return all.find((m) => m.id === selectedMenuId.value) ?? all[0] ?? null;
});

const logoUrl = computed(() => {
  const r = data.value?.restaurant;
  if (!r?.logo) return null;
  const v = encodeURIComponent(r.updatedAt); // updatedAt should be required per schema
  return `${r.logo}${r.logo.includes("?") ? "&" : "?"}v=${v}`;
});

const toolbarLogoSrc = ref<string | null>(null);

const updateActiveFromHash = () => {
  activeItemId.value = (window.location.hash || "").replace(/^#/, "") || null;
};

type GtagFn = (command: "event", eventName: string, params: Record<string, unknown>) => void;

const getGtag = (): GtagFn | null => {
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
};

const lastMenuRenderEventKey = ref<string | null>(null);

const trackMenuRendered = (payload: {
  menu_file_id: string;
  restaurant_id: string;
  selected_menu_id: string;
}) => {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "menu_rendered", payload);
};

function applyBranding(opts?: { theme?: "dark" | "light"; colors?: BrandColors }) {
  const root = document.documentElement;

  if (opts?.theme) root.setAttribute("data-theme", opts.theme);
  else root.removeAttribute("data-theme");

  const map: Record<string, string | undefined> = {
    "--fg": opts?.colors?.fg,
    "--bg": opts?.colors?.bg,
    "--action": opts?.colors?.action,
    "--muted": opts?.colors?.muted,
  };

  Object.entries(map).forEach(([k, v]) => {
    if (v) root.style.setProperty(k, v);
    else root.style.removeProperty(k);
  });

  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = getComputedStyle(root).getPropertyValue("--fg").trim();
}

const itemToMenuId = computed(() => {
  const map = new Map<string, string>();
  const all = data.value?.menus ?? [];

  for (const m of all) {
    for (const cat of m.categories ?? []) {
      for (const it of cat.items ?? []) map.set(it.id, m.id);
      for (const sec of cat.sections ?? []) {
        for (const it of sec.items ?? []) map.set(it.id, m.id);
      }
    }
  }

  return map;
});

const findMenuIdForItem = (id: string) => itemToMenuId.value.get(id) ?? null;

let observer: IntersectionObserver | null = null;
let onPageShow: ((e: PageTransitionEvent) => void) | null = null;
let observingHeader = false;

onMounted(() => {
  updateActiveFromHash();
  window.addEventListener("hashchange", updateActiveFromHash);

  onPageShow = (e) => {
    if (!window.location.hash) return;
    if (e.persisted) setTimeout(updateActiveFromHash, 0);
  };
  window.addEventListener("pageshow", onPageShow);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        toolbarLogoSrc.value = entry.isIntersecting ? null : logoUrl.value;
      }
    },
    { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
  );
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", updateActiveFromHash);
  if (onPageShow) window.removeEventListener("pageshow", onPageShow);
  observer?.disconnect();
});

// reset when menu file id changes
watch(
  () => menuId.value,
  () => {
    selectedMenuId.value = null;
    lastMenuRenderEventKey.value = null;
    observingHeader = false;
  }
);

// unified data watcher (branding + selection + observer + hash handling)
watch(
  data,
  async (menu) => {
    await nextTick();

    if (!menu?.restaurant) {
      applyBranding();
      return;
    }

    applyBranding({ theme: menu.restaurant.theme, colors: menu.restaurant.colors });

    if (!selectedMenuId.value) {
      selectedMenuId.value = menu.menus?.[0]?.id ?? null;
    }

    if (observer && headerRef.value && !observingHeader) {
      observer.observe(headerRef.value);
      observingHeader = true;
    }

    const id = activeItemId.value;
    if (id) {
      const hit = findMenuIdForItem(id);
      if (hit && hit !== selectedMenuId.value) {
        selectedMenuId.value = hit;
        await nextTick();
      }
    }
  },
  { immediate: true }
);

watch(activeItemId, async (id) => {
  if (!id || !selectedMenu.value) return;
  const hit = findMenuIdForItem(id);
  if (hit && hit !== selectedMenuId.value) {
    selectedMenuId.value = hit;
    await nextTick();
  }
});

const isReady = computed(() => {
  return (
    !loading.value &&
    !error.value &&
    !!data.value?.restaurant &&
    !!selectedMenu.value &&
    (selectedMenu.value.categories?.length ?? 0) > 0
  );
});

watch(
  [() => menuId.value, () => data.value?.restaurant.id ?? null, () => selectedMenuId.value, isReady],
  async ([menuFileId, restaurantId, selId, ready]) => {
    if (!ready || !menuFileId || !restaurantId || !selId) return;

    await nextTick();

    const key = `${menuFileId}|${restaurantId}|${selId}`;
    if (lastMenuRenderEventKey.value === key) return;
    lastMenuRenderEventKey.value = key;

    trackMenuRendered({
      menu_file_id: menuFileId,
      restaurant_id: restaurantId,
      selected_menu_id: selId,
    });
  },
  { flush: "post" }
);
</script>

<template>
  <main class="wrap">
    <div :class="['toolbar', { 'shadow-light': !theme, 'shadow-dark': theme }]">
      <img v-if="toolbarLogoSrc" :src="toolbarLogoSrc" :alt="`Logo for ${data?.restaurant?.name ?? 'restaurant'}`" />
      <!-- <h1 class="toolbar-title">{{ toolbarTitle }}</h1> -->
      <button v-if="!data?.restaurant.theme" :aria-label="`toggle to ${theme ? 'light' : 'dark'} theme`"
        class="toolbar-button theme-toggle" @click="toggle" type="button">
        <component :is="theme ? Sun : Moon" :size="24" />
      </button>
    </div>

    <section v-if="isMissingParam" class="welcome">
      <h2>Bienvenido</h2>
      <p>Por favor, selecciona un menú para empezar:</p>
      <ul class="main-menus">
        <li v-for="m in KNOWN_MENUS" :key="m">
          <a :href="`?menu=${m}`">{{ prettifyName(m) }}</a>
        </li>
      </ul>
    </section>

    <section v-else-if="invalidMenu" class="error">
      <h2>El menú solicitado no existe</h2>
      <p>Verifica la URL o usa uno de estos IDs válidos:</p>
      <ul>
        <li v-for="m in KNOWN_MENUS" :key="m">
          <a :href="`?menu=${m}`">{{ m }}</a>
        </li>
      </ul>
    </section>

    <template v-else>
      <header v-if="data" class="hdr" ref="headerRef">
        <img v-if="logoUrl" :src="logoUrl" :alt="data.restaurant.name + ' logo'" width="240" height="120"
          loading="eager" fetchpriority="high" decoding="async" />
        <h1 v-if="!logoUrl">{{ data.restaurant.name }}</h1>
        <p v-if="data.restaurant.subtitle" class="sub">
          {{ data.restaurant.subtitle }}
        </p>
        <p v-if="data.restaurant.description" class="desc">
          {{ data.restaurant.description }}
        </p>
      </header>

      <p v-if="loading">Cargando…</p>
      <p v-if="error">Error: {{ error }}</p>

      <template v-if="data?.socialMedia && data?.socialMedia.length > 0">
        <nav class="social-media-links">
          <ul>
            <li v-for="link in data?.socialMedia" :key="link.url">
              <a :href="link.url" target="_blank" rel="noopener noreferrer">
                <i :class="SOCIAL_MEDIA_ICONS[link.name] ?? 'fa-solid fa-link fa-lg'"></i>
              </a>
            </li>
          </ul>
        </nav>
      </template>

      <a v-if="data?.restaurant.address" :href="data.restaurant.address" class="location-link" target="_blank"
        rel="noopener noreferrer">{{ data?.restaurant?.locale === 'es-CO' ? 'Nuestra ubicación' : 'Our location' }} <i
          class="fa-solid fa-location-dot"></i></a>

      <template v-if="data?.additionalLinks">
        <nav class="additional-links" aria-label="Additional Links">
          <ul>
            <li v-for="link in data.additionalLinks" :key="link.url">
              <a :href="link.url" target="_blank" rel="noopener noreferrer">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>
      </template>

      <template v-if="(data?.menus?.length ?? 0) > 1">
        <nav class="menus-nav" role="tablist" aria-label="Restaurant Menus">
          <p class="menus-nav__heading">Our menus:</p>
          <button v-for="m in data?.menus" :key="m.id" type="button" role="tab" :aria-selected="m.id === selectedMenuId"
            :class="[
              'menus-nav__button',
              { 'menus-nav__button--active': m.id === selectedMenuId },
            ]" @click="selectedMenuId = m.id">
            {{ m.label }}
          </button>
        </nav>
      </template>

      <template v-if="selectedMenu && selectedMenu.categories?.length">
        <div class="category-wrapper">
          <menu-category v-for="cat in selectedMenu.categories" :key="`${selectedMenuId}-${cat.id}`" :category="cat"
            :currency="data!.restaurant.currency" :locale="data!.restaurant.locale" :active-item-id="activeItemId"
            :menu-id="data!.restaurant.id" />
        </div>
      </template>
    </template>

    <small v-if="data" class="muted">
      Última actualización:
      {{
        data.restaurant.updatedAt
          ? new Date(data.restaurant.updatedAt).toLocaleDateString(data.restaurant.locale)
          : ""
      }}
    </small>
  </main>
</template>

<style scoped lang="scss">
.main-menus {
  list-style: none;
  display: flex;
  flex-direction: column;
  place-items: flex-start;
  gap: 1rem;
}

.menus-nav {
  display: flex;
  box-sizing: border-box;
  gap: 1rem;
  flex-direction: column;
  place-content: center;
  padding-bottom: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--muted);

  &__heading {
    margin-bottom: 0;
  }

  &__button {
    border: 2px solid var(--muted);
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: var(--bg);
    width: 100%;
    transition: background-color 0.3s ease-in-out;

    &--active {
      background-color: var(--action);
    }
  }
}

.toolbar {
  position: fixed;
  display: flex;
  z-index: 10;
  place-content: center;
  place-items: center;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0.75rem;
  background: var(--fg);
  transition: background-color 0.5s ease-in-out;
  height: var(--toolbar-h);

  img {
    height: 100%;
  }

  &-title {
    margin: 0;
    font-size: 1.5rem;
  }

  &-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: var(--bg);
    transition: background-color 0.3s ease;

    &:active {
      background-color: var(--action);
    }

    &:focus {
      outline: 3px solid var(--bg);
      background-color: var(--action);
      outline-offset: 2px;
    }
  }

  &-inicio {
    font-weight: 600;
    background: transparent;
    color: var(--bg);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    text-align: center;
    transition: background-color 0.3s ease;

    &:active {
      background-color: var(--action);
    }

    &:focus {
      outline: 3px solid var(--bg);
      background-color: var(--action);
      outline-offset: 2px;
    }
  }
}

.shadow-light {
  box-shadow: -1px 4px 9px 0px rgba(92, 92, 92, 0.75);
  -webkit-box-shadow: -1px 4px 9px 0px rgba(92, 92, 92, 0.75);
  -moz-box-shadow: -1px 4px 9px 0px rgba(92, 92, 92, 0.75);
}

.shadow-dark {
  box-shadow: -1px 4px 9px 0px rgba(31, 31, 31, 0.75);
  -webkit-box-shadow: -1px 4px 9px 0px rgba(31, 31, 31, 0.75);
  -moz-box-shadow: -1px 4px 9px 0px rgba(31, 31, 31, 0.75);
}

.theme-toggle {
  top: 1rem;
  right: 1rem;
  outline: none;
  position: absolute;
  top: 0.75rem;
}

.wrap {
  max-width: 780px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: calc(var(--toolbar-h) + 1rem);
}

.hdr {
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
}

.hdr h1 {
  margin: 0;
}

.sub {
  margin: 0.25rem 0;
  color: var(--bg);
}

.desc {
  box-sizing: border-box;
  margin: 0.25rem 0 0;
  color: var(--bg);
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.muted {
  color: var(--bg);
}

.error {
  text-align: center;
  margin-top: 2rem;
  color: #a00000;
}

.error ul {
  list-style: none;
  padding: 0;
}

.error a {
  text-decoration: underline;
}

.social-media-links {
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 0;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: var(--bg);
    font-weight: 600;
    width: fit-content;

    i {
      transition: color 0.3s ease;
    }

    &:hover i {
      color: var(--action);
    }
  }
}

.additional-links {
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 auto;
    width: fit-content;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: var(--bg);
    font-weight: 600;
    width: fit-content;
    margin: 0 auto;

    i {
      margin-left: 0.25rem;
    }

    &:hover {
      color: var(--action);
    }
  }
}

.location-link {
  display: inline-block;
  text-decoration: none;
  color: var(--bg);
  font-weight: 600;
  width: fit-content;
  margin: 0 auto;

  i {
    margin-left: 0.25rem;
  }

  &:hover {
    color: var(--action);
  }
}
</style>
