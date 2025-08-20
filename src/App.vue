<script setup lang="ts">
  import { ref } from "vue";
  import { useMenu } from "@/composables/useMenu";
  import MenuCategory from "@/components/MenuCategory.vue";

  const KNOWN_MENUS = ["oda-bogota", "g-lounge"];
  const DEFAULT_MENU = "oda-bogota"; // 👈 change if you prefer another default

  // Read & normalize ?menu=
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("menu") || "").trim();
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const normalized = raw ? slugify(raw) : "";

  // decide how to proceed
  const isKnown = normalized ? KNOWN_MENUS.includes(normalized) : false;
  const isMissingParam = raw.length === 0;
  const invalidMenu = ref(!isMissingParam && !isKnown);

  // if no param -> use default; if unknown -> leave empty so we don't fetch
  const menuId = ref(isMissingParam ? DEFAULT_MENU : isKnown ? normalized : "");

  // reflect normalized back once (eg: ?menu=G%20Lounge -> ?menu=g-lounge)
// inside <script setup> of App.vue, where you reflect the normalized param:
if (raw && normalized && normalized !== raw) {
  const url = new URL(window.location.href)
  // Force pathname to the app base ("/" in dev, "/lightweight-menu/" in prod)
  url.pathname = import.meta.env.BASE_URL
  url.searchParams.set("menu", normalized)
  window.history.replaceState({}, "", url.toString())
}

  // only useMenu if we have something to fetch
  const { data, loading, error, reload } = useMenu(menuId);
</script>

<template>
  <main class="wrap">
    <!-- Unknown param -->
    <section v-if="invalidMenu" class="error">
      <h2>El menú solicitado no existe</h2>
      <p>Verifica la URL o usa uno de estos IDs válidos:</p>
      <ul>
        <li v-for="m in ['oda-bogota', 'g-lounge']" :key="m">
          <a :href="`?menu=${m}`">{{ m }}</a>
        </li>
      </ul>
    </section>

    <!-- Normal render -->
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

