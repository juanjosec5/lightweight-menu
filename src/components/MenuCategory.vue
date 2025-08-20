<script setup lang="ts">
  import MenuItem from "./MenuItem.vue";

  type Item = {
    id: string;
    name: string;
    ingredients: string[];
    description?: string;
    image?: { src: string; alt?: string };
    price: number;
  };
  type Section = { id: string; label: string; items: Item[] };
  type Category = {
    id: string;
    label: string;
    items?: Item[];
    sections?: Section[];
    image?: string;
  };

withDefaults(defineProps<{
  category: Category
  currency: string
  locale: string
  reverse?: boolean
}>(), { reverse: false })
</script>

<template>
  <section :id="category.id" :class="['cat', { 'cat--reverse': reverse }]">
    <div class="cat-content">
      <h3 class="cat__title">{{ category.label }}</h3>

      <!-- Flat items -->
      <div v-if="category.items?.length" class="cat-items">
        <menu-item v-for="it in category.items" :key="it.id" :item="it" :currency="currency" :locale="locale" />
      </div>

      <!-- Grouped sections -->
      <div v-if="category.sections?.length" class="cat-sections">
        <div v-for="sec in category.sections" :key="sec.id" class="cat-section">
          <h4 class="section__title">{{ sec.label }}</h4>
          <menu-item v-for="it in sec.items" :key="it.id" :item="it" :currency="currency" :locale="locale" />
        </div>
      </div>

      <p v-if="!category.items?.length && !category.sections?.length" class="muted">Sin ítems por ahora.</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .cat {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-block: 4rem 0;

    &-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  .cat__title {
    margin: 16px 0 8px;
    font-size: 1.5rem;
  }

  .muted {
    color: #777;
    font-style: italic;
  }

  .section__title {
    text-align: left;
    font-size: 1.25rem;
    margin-block: rem .25rem;
    color: #464646;
  }
</style>
