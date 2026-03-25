<script lang="ts">
import type { Label } from '@/types/menu'

type LabelMeta = { icon: [string, string]; class: string; text: string }

// Module-level constant — shared across all MenuItem instances
const LABEL_MAP: Record<Label, LabelMeta> = {
  spicy:           { icon: ['fas', 'fire'], class: 'spicy',      text: 'Picante' },
  vegetarian:      { icon: ['fas', 'leaf'], class: 'vegetarian', text: 'Vegetariano' },
  vegan:           { icon: ['fas', 'leaf'], class: 'vegetarian', text: 'Vegano' },
  'contains-fish': { icon: ['fas', 'fish'], class: 'fish',       text: 'Contiene pescado' },
  'gluten-free':   { icon: ['fas', 'leaf'], class: 'vegetarian', text: 'Sin gluten' },
  'contains-nuts': { icon: ['fas', 'fire'], class: 'spicy',      text: 'Contiene nueces' },
  'dairy-free':    { icon: ['fas', 'leaf'], class: 'vegetarian', text: 'Sin lácteos' },
}
</script>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { formatPrice } from '@/utils/formatPrice'
import type { Item } from '@/types/menu'

const props = defineProps<{
  item: Item
  currency: string
  locale: string
  canLoadThumbs?: boolean
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const showModal = ref(false)

const iconLabels = computed(() =>
  props.item.item_labels
    .map(l => l.label)
    .filter(l => l in LABEL_MAP)
    .map(l => ({ key: l, ...LABEL_MAP[l] }))
)

const descParsed = computed(() => {
  const d = props.item.description
  if (!d) return null
  if (d.startsWith('[')) {
    try { return { type: 'list' as const, items: JSON.parse(d) as string[] } } catch {}
  }
  return { type: 'text' as const, text: d }
})

function openDialog() {
  const dlg = dialogRef.value
  if (!dlg) return
  typeof dlg.showModal === 'function' ? dlg.showModal() : dlg.setAttribute('open', '')
  showModal.value = true
  document.documentElement.classList.add('no-scroll')
}

function closeDialog() {
  const dlg = dialogRef.value
  if (dlg?.open) dlg.close()
  showModal.value = false
  document.documentElement.classList.remove('no-scroll')
}

onBeforeUnmount(() => {
  document.documentElement.classList.remove('no-scroll')
})
</script>

<template>
  <article class="item" :id="item.id">

    <!-- Full-width title row -->
    <h4 class="item__title">
      {{ item.name }}
      <span v-if="iconLabels.length" class="item__labels">
        <font-awesome-icon
          v-for="l in iconLabels"
          :key="l.key"
          :icon="l.icon"
          :class="l.class"
          :title="l.text"
        />
      </span>
    </h4>

    <!-- Three-column row: thumbnail | description | price -->
    <div class="item__content">
      <button
        v-if="item.thumbnail_url || item.image_url"
        type="button"
        class="item__thumb"
        :aria-label="`Ver imagen de ${item.name}`"
        @click="openDialog"
      >
        <img
          v-if="canLoadThumbs"
          :src="item.thumbnail_url ?? item.image_url!"
          :alt="item.name"
          loading="lazy"
        />
      </button>

      <template v-if="descParsed">
        <p v-if="descParsed.type === 'text'" class="item__desc">{{ descParsed.text }}</p>
        <ul v-else class="item__desc item__desc--list">
          <li v-for="(line, i) in descParsed.items" :key="i">{{ line }}</li>
        </ul>
      </template>

      <div v-if="item.price_options?.length" class="item__prices">
        <span v-for="opt in item.price_options" :key="opt.label" class="item__price-option">
          <span class="item__price-label">{{ opt.label }}</span>
          <strong class="item__price">{{ formatPrice(opt.price, currency, locale) }}</strong>
        </span>
      </div>
      <strong v-else-if="item.price != null" class="item__price">
        {{ formatPrice(item.price, currency, locale) }}
      </strong>
    </div>

    <dialog ref="dialogRef" class="img-dialog" @close="closeDialog">
      <button class="img-dialog__close" aria-label="Cerrar" @click="closeDialog">
        <font-awesome-icon :icon="['fas', 'close']" />
      </button>
      <img
        v-if="showModal && item.image_url"
        class="img-dialog__img"
        :src="item.image_url"
        :alt="item.name"
      />
      <p class="img-dialog__caption">{{ item.name }}</p>
    </dialog>
  </article>
</template>

<style scoped lang="scss">
.item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--muted);
  scroll-margin-top: calc(var(--toolbar-h) + 3.25rem);
  background: var(--card, transparent);
}

.item__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: left;
}

.item__labels {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

/* Three-column content row */
.item__content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.item__thumb {
  border: 0;
  background: transparent;
  border-radius: var(--radius);
  overflow: hidden;
  padding: 0;
  cursor: zoom-in;
  flex-shrink: 0;
  width: 72px;
  height: 72px;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    display: block;
  }
}

.item__desc {
  flex: 1;
  margin: 0;
  color: var(--muted);
  text-align: left;
  font-size: 0.9rem;
}

.item__desc--list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

/* Price always pushed to the right:
   - when description is present, flex: 1 on desc fills space and price sits at end
   - when description is absent, margin-left: auto pushes price to the right */
.item__price {
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;
  color: var(--price, var(--bg));
}

.item__prices {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  flex-shrink: 0;
}

.item__price-option {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.item__price-label {
  font-size: 0.72rem;
  color: var(--muted);
  white-space: nowrap;
}

// Label icon colors
.spicy      { color: red; }
.vegetarian { color: green; }
.fish       { color: lightseagreen; }

// Dialog
.img-dialog {
  border: none;
  border-radius: 0.75rem;
  z-index: 100;

  &[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 780px;
    gap: 0.5rem;
    position: fixed;
    inset: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  }

  &__close {
    align-self: flex-end;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
  }

  &__img {
    object-fit: contain;
    width: 100%;
  }

  &__caption {
    color: white;
    font-size: 0.875rem;
  }
}
</style>
