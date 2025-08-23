<script setup lang="ts">
  import { useMenu } from "@/composables/useMenu";
  import { useMenuFromUrl } from "@/composables/useMenuFromUrl";
  import { useTheme } from "@/composables/useTheme";
  import MenuCategory from "@/components/MenuCategory.vue";
  import { Sun, Moon } from "lucide-vue-next"

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
const { isDark, toggle } = useTheme()

</script>

<template>
  <main class="wrap">
  <button class="theme-toggle" @click="toggle">
    <component :is="isDark ? Sun : Moon" :size="24" />
  </button>
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

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: transparent;
  outline: none;
  border: none;

}

  .wrap {
    max-width: 780px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

