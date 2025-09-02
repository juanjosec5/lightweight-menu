<script setup lang="ts">
  import {
    watch,
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
  } from "vue";
  import { useMenu } from "@/composables/useMenu";
  import { useMenuFromUrl } from "@/composables/useMenuFromUrl";
  import { useTheme } from "@/composables/useTheme";
  import MenuCategory from "@/components/MenuCategory.vue";
  import { Sun, Moon } from "lucide-vue-next";

  const menus = import.meta.glob("../public/menus/*.json");

  const prettifyName = (name: string) =>
    name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  const KNOWN_MENUS = Object.keys(menus).map((m) =>
    m.split("/").pop()?.replace(".json", "")
  ) as string[];

  const { menuId, invalidMenu, isMissingParam } = useMenuFromUrl(KNOWN_MENUS);
  const { data, loading, error } = useMenu(menuId);
  const { theme, toggle } = useTheme();

  const selectedMenuId = ref<string | null>(null);
  const selectedMenu = computed(() => {
    const all = data.value?.menus ?? [];
    return (
      all.find((m: any) => m.id === selectedMenuId.value) ?? all[0] ?? null
    );
  });

  const activeItemId = ref<string | null>(null);
  const headerRef = ref<HTMLElement | null>(null);
  const toolbarTitle = ref("");

  const updateActiveFromHash = () => {
    activeItemId.value = (window.location.hash || "").replace(/^#/, "");
  };

  const logoUrl = computed(() => {
    const r = data.value?.restaurant;
    if (!r) return null;
    if (!r.logo) return null;
    // Append updatedAt as a query param to force reload if logo changes
    const v = encodeURIComponent(r.updatedAt || "");

    return `${r.logo}${r.logo.includes("?") ? "&" : "?"}v=${v}`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          toolbarTitle.value = data.value?.restaurant?.name || "";
        } else {
          toolbarTitle.value = "";
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "-64px 0px 0px 0px",
    }
  );

  const menuHasItem = (menu: any, id: string): boolean => {
    if (!menu || !id) return false;

    for (const cat of menu.categories ?? []) {
      if (cat.items?.some((it: any) => it.id === id)) return true;

      if (
        cat.sections?.some((sec: any) =>
          sec.items?.some((it: any) => it.id === id)
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Find which menu contains the item id
  const findMenuIdForItem = (id: string): string | null => {
    const all = data.value?.menus ?? [];
    for (const m of all) {
      if (menuHasItem(m, id)) return m.id;
    }
    return null;
  };

  onMounted(() => {
    updateActiveFromHash();
    window.addEventListener("hashchange", updateActiveFromHash);

    const onPageShow = (e: PageTransitionEvent) => {
      if (!window.location.hash) return;

      if (e.persisted) {
        setTimeout(() => updateActiveFromHash(), 0);
      }
    };
    window.addEventListener("pageshow", onPageShow);

    onBeforeUnmount(() => {
      window.removeEventListener("hashchange", updateActiveFromHash);
      window.removeEventListener("pageshow", onPageShow);
      observer?.disconnect();
    });
  });

  watch(data, async (menu) => {
    if (!menu) return;

    // default selection (first menu) if not set yet
    if (!selectedMenuId.value) {
      selectedMenuId.value = menu.menus?.[0]?.id ?? null;
    }

    await nextTick();
    if (headerRef.value) observer.observe(headerRef.value);

    // if there’s a hash item, switch to the menu that contains it
    if (activeItemId.value) {
      const hit = findMenuIdForItem(activeItemId.value);
      if (hit && hit !== selectedMenuId.value) {
        selectedMenuId.value = hit;
        // wait for categories of the new menu to render
        await nextTick();
      }
    }
  });

  watch(activeItemId, async (id) => {
    if (!id || !data.value?.menus?.length) return;
    // if current selected menu already has it, do nothing
    if (selectedMenu.value && menuHasItem(selectedMenu.value, id)) return;

    const hit = findMenuIdForItem(id);
    if (hit && hit !== selectedMenuId.value) {
      selectedMenuId.value = hit;
      await nextTick();
    }
  });
</script>

<template>
  <main class="wrap">
    <div :class="['toolbar', { 'shadow-light': !theme, 'shadow-dark': theme }]">
      <h1 class="toolbar-title">{{ toolbarTitle }}</h1>
      <button
        v-if="data?.restaurant.theme !== 'dark'"
        :aria-label="`toggle to ${theme ? 'light' : 'dark'} theme`"
        class="toolbar-button theme-toggle"
        @click="toggle"
        type="button"
      >
        <component :is="theme ? Sun : Moon" :size="24" />
      </button>
    </div>

    <section v-if="isMissingParam" class="welcome">
      <h2>Bienvenido</h2>
      <p>Por favor, selecciona un menú para empezar:</p>
      <ul>
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
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="data.restaurant.name + ' logo'"
          width="120"
          height="120"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <h1>{{ data.restaurant.name }}</h1>
        <p v-if="data.restaurant.subtitle" class="sub">
          {{ data.restaurant.subtitle }}
        </p>
        <p v-if="data.restaurant.description" class="desc">
          {{ data.restaurant.description }}
        </p>
      </header>

      <p v-if="loading">Cargando…</p>
      <p v-if="error">Error: {{ error }}</p>

      <template v-if="(data?.menus?.length ?? 0) > 1">
        <nav class="menus-nav" role="tablist" aria-label="Restaurant Menus">
          <p class="menus-nav__heading">Our menus:</p>
          <button
            v-for="m in data?.menus"
            :key="m.id"
            type="button"
            role="tab"
            :aria-selected="m.id === selectedMenuId"
            :class="[
              'menus-nav__button',
              { 'menus-nav__button--active': m.id === selectedMenuId },
            ]"
            @click="selectedMenuId = m.id"
          >
            {{ m.label }}
          </button>
        </nav>
      </template>

      <template v-if="selectedMenu && selectedMenu.categories?.length">
        <div class="category-wrapper">
          <menu-category
            v-for="cat in selectedMenu.categories"
            :key="`${selectedMenuId}-${cat.id}`"
            :category="cat"
            :currency="data!.restaurant.currency"
            :locale="data!.restaurant.locale"
            :active-item-id="activeItemId"
            :menu-id="data!.restaurant.id"
          />
        </div>
      </template>
    </template>

    <small v-if="data" class="muted">
      Última actualización:
      {{
        new Date(data.restaurant.updatedAt).toLocaleDateString(
          data.restaurant.locale
        )
      }}
    </small>
  </main>
</template>

<style scoped lang="scss">
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

    &-logo-wrapper {
      display: flex;
      place-items: center;
      height: 100%;
      width: 50px;
      position: absolute;
      top: 0;
      left: 1rem;
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
    gap: 2rem;
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
    color: #a00;
  }

  .error ul {
    list-style: none;
    padding: 0;
  }

  .error a {
    text-decoration: underline;
  }
</style>
