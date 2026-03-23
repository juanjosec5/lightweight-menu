<script setup lang="ts">
import type { Category } from '@/types/menu'

defineProps<{
  categories: Category[]
}>()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <nav class="cat-nav" aria-label="Ir a categoría">
    <ul class="cat-nav__list">
      <li v-for="cat in categories" :key="cat.id">
        <button type="button" class="cat-nav__pill" @click="scrollTo(cat.id)">
          {{ cat.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.cat-nav {
  position: sticky;
  top: var(--toolbar-h);
  z-index: 4;
  background: var(--fg);
  padding: 0.5rem 0;
  transition: background-color 0.5s ease-in-out;

  &__list {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &__pill {
    white-space: nowrap;
    padding: 0.3rem 0.85rem;
    border-radius: 99px;
    border: 1px solid var(--muted);
    background: transparent;
    color: var(--bg);
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background: var(--action);
      color: var(--fg);
      border-color: var(--action);
    }
  }
}
</style>
