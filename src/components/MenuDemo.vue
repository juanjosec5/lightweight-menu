<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MenuCategory from './MenuCategory.vue'
import type { Menu, Category, Item } from '@/types/menu'

// ── Demo data ──────────────────────────────────────────────────────────
const makeItem = (id: string, name: string, price: number, description: string | null = null, labels: Item['item_labels'] = []): Item => ({
  id, slug: id, name, price, description, is_available: true,
  image_url: null, thumbnail_url: null, sort_order: 0, item_labels: labels,
})

const makeCategory = (id: string, label: string, items: Item[]): Category => ({
  id, slug: id, label, availability_note: null, sort_order: 0, is_active: true, items,
})

const DEMO_MENUS: Menu[] = [
  {
    id: 'almuerzo', slug: 'almuerzo', label: 'Almuerzo', sort_order: 0, is_active: true,
    categories: [
      makeCategory('entradas', 'Entradas', [
        makeItem('p1', 'Patacones con hogao', 12000, 'Patacones fritos con salsa de hogao casero'),
        makeItem('p2', 'Arepa de choclo con queso', 9500, 'Arepa dulce de choclo con queso campesino'),
        makeItem('p3', 'Ceviche de camarón', 18000, 'Camarones frescos con limón, cebolla y cilantro', [{ label: 'contains-fish' }]),
      ]),
      makeCategory('principales', 'Platos Principales', [
        makeItem('p4', 'Bandeja paisa', 38000, 'Frijoles, chicharrón, huevo, chorizo, morcilla, arroz y aguacate'),
        makeItem('p5', 'Sancocho de gallina', 28000, 'Caldo tradicional con gallina criolla, yuca y papa'),
        makeItem('p6', 'Cazuela de mariscos', 42000, 'Mix de mariscos en salsa de coco y ají', [{ label: 'contains-fish' }]),
        makeItem('p7', 'Arroz con pollo', 24000, 'Arroz al azafrán con pollo desmechado y vegetales'),
      ]),
      makeCategory('postres', 'Postres', [
        makeItem('p8', 'Tres leches', 12000, 'Bizcocho esponjoso bañado en tres tipos de leche'),
        makeItem('p9', 'Arroz con leche', 8000, 'Cremoso arroz con leche y canela'),
      ]),
    ],
  },
  {
    id: 'bebidas', slug: 'bebidas', label: 'Bebidas', sort_order: 1, is_active: true,
    categories: [
      makeCategory('jugos', 'Jugos Naturales', [
        makeItem('b1', 'Maracuyá', 7000, 'En agua o en leche'),
        makeItem('b2', 'Mango', 7000, 'Mango maduro de temporada'),
        makeItem('b3', 'Lulo', 7000, 'Refrescante jugo de lulo'),
      ]),
      makeCategory('calientes', 'Bebidas Calientes', [
        makeItem('b4', 'Tinto', 3500, 'Café negro colombiano'),
        makeItem('b5', 'Café con leche', 5000, 'Tinto con leche al gusto'),
        makeItem('b6', 'Chocolate santafereño', 5500, 'Chocolate con queso y pan de bono'),
      ]),
    ],
  },
]

// ── Tab state ──────────────────────────────────────────────────────────
const selectedMenuId = ref<string>('almuerzo')

const selectedMenu = computed(() =>
  DEMO_MENUS.find(m => m.id === selectedMenuId.value) ?? DEMO_MENUS[0]
)

// ── Demo branding (applied locally, restored on unmount) ───────────────
const DEMO_VARS: Record<string, string> = {
  '--fg': '#FFF8F0',
  '--bg': '#1a1a2e',
  '--action': '#e8b86d',
  '--muted': '#9e9e9e',
  '--radius': '8px',
}
const VAR_KEYS = Object.keys(DEMO_VARS)

onMounted(() => {
  const root = document.documentElement
  root.setAttribute('data-theme', 'light')
  VAR_KEYS.forEach(k => root.style.setProperty(k, DEMO_VARS[k]))
})

onBeforeUnmount(() => {
  const root = document.documentElement
  root.removeAttribute('data-theme')
  VAR_KEYS.forEach(k => root.style.removeProperty(k))
  // Also clear extended tokens
  ;['--price', '--card', '--category', '--tab'].forEach(k => root.style.removeProperty(k))
})
</script>

<template>
  <div class="demo-shell">
    <!-- Menu tabs -->
    <nav class="demo-tabs" role="tablist">
      <p class="demo-tabs__heading">Nuestros Menús</p>
      <button
        v-for="m in DEMO_MENUS"
        :key="m.id"
        type="button"
        role="tab"
        :aria-selected="m.id === selectedMenuId"
        :class="['demo-tab', { 'demo-tab--active': m.id === selectedMenuId }]"
        @click="selectedMenuId = m.id"
      >
        {{ m.label }}
      </button>
    </nav>

    <!-- Categories -->
    <div class="demo-categories">
      <MenuCategory
        v-for="cat in selectedMenu.categories"
        :key="`${selectedMenuId}-${cat.id}`"
        :category="cat"
        currency="COP"
        locale="es-CO"
        :active-item-id="null"
        search-query=""
      />
    </div>

    <p class="demo-badge">✦ Menú de demostración — los datos son ficticios</p>
  </div>
</template>

<style scoped>
.demo-shell {
  background: var(--fg);
  color: var(--bg);
  border-radius: 1rem;
  padding: 1.5rem 1rem 1rem;
  max-width: 480px;
  margin: 0 auto;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--muted);
}

.demo-tabs__heading {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.demo-tab {
  border: 2px solid var(--muted);
  padding: 0.65rem;
  border-radius: var(--radius);
  font-size: 0.95rem;
  color: var(--bg);
  background: transparent;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;

  &--active {
    background-color: var(--tab, var(--action));
  }
}

.demo-categories {
  flex: 1;
}

.demo-badge {
  text-align: center;
  font-size: 0.7rem;
  color: var(--muted);
  margin: 0.5rem 0 0;
  letter-spacing: 0.04em;
}
</style>
