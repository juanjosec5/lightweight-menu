<script setup lang="ts">
  import { useMenu } from "@/composables/useMenu";
  import { useMenuFromUrl } from "@/composables/useMenuFromUrl";
  import { useTheme } from "@/composables/useTheme";
  import MenuCategory from "@/components/MenuCategory.vue";
  import { Sun, Moon, ArrowBigUpDash } from "lucide-vue-next";

  const KNOWN_MENUS = [
    "oda-bogota",
    "g-lounge",
    "coma-taco",
    "hummel",
    "greta",
    "wings-walker",
  ];
  const { menuId, invalidMenu, isMissingParam } = useMenuFromUrl(KNOWN_MENUS);
  const { data, loading, error, reload } = useMenu(menuId);
  const { isDark, toggle } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
</script>

<template>
  <main class="wrap">
    <div
      :class="['toolbar', { 'shadow-light': !isDark, 'shadow-dark': isDark }]"
    >
      <button
        class="toolbar-button"
        @click="scrollToTop"
        aria-label="scroll to the top"
      >
        <component :is="ArrowBigUpDash" />
      </button>
      <button
        :aria-label="`toggle to ${isDark ? 'light' : 'dark'} theme`"
        class="toolbar-button theme-toggle"
        @click="toggle"
      >
        <component :is="isDark ? Sun : Moon" :size="24" />
      </button>
    </div>
    <section v-if="isMissingParam" class="welcome">
      <h2>Bienvenido</h2>
      <p>Por favor, selecciona un menú para empezar:</p>
      <ul>
        <li v-for="m in KNOWN_MENUS" :key="m">
          <a :href="`?menu=${m}`">{{ m }}</a>
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
      <header v-if="data" class="hdr">
        <h1>{{ data.restaurant.name }}</h1>
        <p v-if="data.restaurant.subtitle" class="sub">
          {{ data.restaurant.subtitle }}
        </p>
        <p v-if="data.restaurant.description" class="desc">
          {{ data.restaurant.description }}
        </p>
      </header>

      <button v-if="error" @click="reload">Reintentar</button>
      <p v-if="loading">Cargando…</p>
      <p v-if="error">Error: {{ error }}</p>

      <template v-if="data">
        <div class="category-wrapper">
          <menu-category
            v-for="cat in data.categories"
            :key="cat.id"
            :category="cat"
            :currency="data.restaurant.currency"
            :locale="data.restaurant.locale"
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
  .toolbar {
    display: flex;
    z-index: 10;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0.75rem;
    width: calc(100% - 0.75rem * 2);
    background: var(--fg);
    transition: background-color 0.5s ease-in-out;

    &-button {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      color: var(--bg);

      &:active {
        background-color: var(--action);
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
  }

  .wrap {
    max-width: 780px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 5rem;
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

