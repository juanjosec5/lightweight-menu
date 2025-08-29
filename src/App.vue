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
  const selectedMenu = computed(
    () => data.value?.menus.find((m) => m.id === selectedMenuId.value) || null
  );

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

  watch(data, (menu) => {
    if (!menu) return;

    nextTick(() => {
      observer.observe(headerRef.value!);
      selectedMenuId.value = data.value?.menus[0]?.id || null;
    });
  });
</script>

<template>
  <main class="wrap">
    <div :class="['toolbar', { 'shadow-light': !theme, 'shadow-dark': theme }]">
      <!-- Added this span to move the toggle to the right -->
      <!-- <div class="toolbar-logo-wrapper" v-if="data?.restaurant.logo">
        <img
          :src="data?.restaurant?.logo"
          :alt="`${data.restaurant.name} logo`"
        />
      </div> -->
      <h1 class="toolbar-title">{{ toolbarTitle }}</h1>
      <button
        v-if="data?.restaurant.theme !== 'dark'"
        :aria-label="`toggle to ${theme ? 'light' : 'dark'} theme`"
        class="toolbar-button theme-toggle"
        @click="toggle"
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

      <template v-if="(data?.menus.length || 0) > 1">
        <nav class="menus-nav">
          <button
            :class="[
              'menus-nav__button',
              { 'menus-nav__button--active': m.id === selectedMenuId },
            ]"
            v-for="m in data?.menus"
            @click="selectedMenuId = m.id"
          >
            {{ m.label }}
          </button>
        </nav>
      </template>

      <template v-if="selectedMenu">
        <div class="category-wrapper">
          <menu-category
            v-for="cat in selectedMenu.categories"
            :key="cat.id"
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
    gap: 1rem;
    place-content: center;

    &__button {
      border: 2px solid var(--muted);
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: .9rem;
      color: var(--bg);

      &--active {
        background-color: var(--action);
      }
    }
  }

  .toolbar {
    display: flex;
    z-index: 10;
    place-content: center;
    place-items: center;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0.75rem;
    width: calc(100% - 0.75rem * 2);
    background: var(--fg);
    transition: background-color 0.5s ease-in-out;
    height: calc(var(--toolbar-h) - 1.5rem);

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
    gap: 1rem;
    padding-top: calc(var(--toolbar-h) + 1rem);
  }

  .hdr h1 {
    margin: 0;
  }

  .sub {
    margin: 0.25rem 0;
    color: var(--bg);
  }

  .desc {
    margin: 0.25rem 0 1rem;
    color: var(--bg);
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
