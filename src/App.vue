<script setup lang="ts">
  import { ref } from "vue";
  import { useMenu } from "@/composables/useMenu";
  import { useMenuFromUrl } from "@/composables/useMenuFromUrl";
  import MenuCategory from "@/components/MenuCategory.vue";

  const KNOWN_MENUS = ["oda-bogota", "g-lounge", "coma-taco", "hummel", "greta", "wings-walker"];
  const { menuId, invalidMenu, isMissingParam } = useMenuFromUrl(KNOWN_MENUS);
  const { data, loading, error, reload } = useMenu(menuId);

  const menus = ref<string[]>([
    "oda-bogota",
    "g-lounge",
    "coma-taco",
    "hummel",
    "greta",
    "wings-walker",
  ]);
</script>

<template>
  <main class="wrap">
    <section v-if="isMissingParam" class="welcome">
      <h2>Bienvenido</h2>
      <p>Por favor, selecciona un menú para empezar:</p>
      <ul>
        <li v-for="m in menus" :key="m">
          <a :href="`?menu=${m}`">{{ m }}</a>
        </li>
      </ul>
    </section>

    <section v-else-if="invalidMenu" class="error">
      <h2>El menú solicitado no existe</h2>
      <p>Verifica la URL o usa uno de estos IDs válidos:</p>
      <ul>
        <li v-for="m in menus" :key="m">
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
        <small class="muted">
          Última actualización:
          {{
            new Date(data.restaurant.updatedAt).toLocaleDateString(
              data.restaurant.locale
            )
          }}
        </small>
      </header>

      <button v-if="error" @click="reload">Reintentar</button>
      <p v-if="loading">Cargando…</p>
      <p v-if="error">Error: {{ error }}</p>

      <template v-if="data">
        <menu-category
          v-for="cat in data.categories"
          :key="cat.id"
          :category="cat"
          :currency="data.restaurant.currency"
          :locale="data.restaurant.locale"
        />
      </template>
    </template>
  </main>
</template>

<style scoped>
  .wrap {
    max-width: 780px;
    margin: auto;
  }

  .hdr h1 {
    margin: 0;
  }

  .sub {
    margin: 0.25rem 0;
    color: #444;
  }

  .desc {
    margin: 0.25rem 0 1rem;
    color: #555;
  }

  .muted {
    color: #777;
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

