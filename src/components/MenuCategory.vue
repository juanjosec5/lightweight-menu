<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import MenuItem from './MenuItem.vue'
import { getGtag } from '@/utils/gtag'
import type { Category } from '@/types/menu'

const props = defineProps<{
  category: Category
  currency: string
  locale: string
  activeItemId?: string | null
}>()

const expanded = ref(false)
const canLoadThumbs = ref(false)
const bodyEl = ref<HTMLElement | null>(null)
const btnEl = ref<HTMLElement | null>(null)
const isAnimating = ref(false)

const visibleItems = computed(() => props.category.items.filter(it => it.is_available))

const openCount = ref(0)

const itemIds = computed(() => new Set(props.category.items.map(it => it.id)))
const hasItem = (id: string | null | undefined) => !!id && itemIds.value.has(id)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

function openBody(after?: () => void) {
  const el = bodyEl.value
  if (!el) return
  isAnimating.value = true
  el.style.maxHeight = el.scrollHeight + 'px'

  if (prefersReducedMotion()) {
    el.style.maxHeight = 'none'
    isAnimating.value = false
    canLoadThumbs.value = true
    requestAnimationFrame(() => after?.())
    return
  }

  el.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'max-height') return
    el.style.maxHeight = 'none'
    isAnimating.value = false
    canLoadThumbs.value = true
    requestAnimationFrame(() => after?.())
  }, { once: true })
}

function closeBody() {
  const el = bodyEl.value
  if (!el) return
  isAnimating.value = true

  if (el.style.maxHeight === 'none') el.style.maxHeight = el.scrollHeight + 'px'
  void el.offsetHeight
  el.style.maxHeight = '0px'

  if (prefersReducedMotion()) {
    isAnimating.value = false
    btnEl.value?.focus()
    return
  }

  el.addEventListener('transitionend', () => {
    isAnimating.value = false
  }, { once: true })

  btnEl.value?.focus()
}

function toggleContent() {
  if (isAnimating.value) return
  expanded.value = !expanded.value
  expanded.value ? openBody() : closeBody()
}

async function ensureOpenAndScrollTo(id: string) {
  const scroll = () => {
    const node = document.getElementById(id)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    node.classList.add('highlight')
    setTimeout(() => node.classList.remove('highlight'), 2000)
  }

  if (!expanded.value) {
    expanded.value = true
    openBody(async () => {
      await nextTick()
      requestAnimationFrame(scroll)
    })
  } else {
    canLoadThumbs.value = true
    await nextTick()
    requestAnimationFrame(scroll)
  }
}

onMounted(() => {
  if (hasItem(props.activeItemId)) ensureOpenAndScrollTo(props.activeItemId!)
})

watch(() => props.activeItemId, (id) => {
  if (hasItem(id)) ensureOpenAndScrollTo(id!)
})

// track category_opened — max 3 times per category per session
watch(expanded, (isOpen, wasOpen) => {
  if (!wasOpen && isOpen && openCount.value < 3) {
    openCount.value++
    getGtag()?.('event', 'category_opened', {
      category_id: props.category.id,
      category_label: props.category.label,
    })
  }
})
</script>

<template>
  <section :id="category.id" class="cat">
    <div class="cat-content">
      <div class="cat-header">
        <button
          ref="btnEl"
          class="cat__title"
          :aria-label="`Mostrar ${category.label}`"
          :aria-expanded="expanded"
          :disabled="isAnimating"
          @click="toggleContent"
        >
          <h3 class="cat__title-text">{{ category.label }}</h3>
          <span :class="['arrow', { 'arrow--expanded': expanded }]">&#8595;</span>
        </button>
        <p v-if="category.availability_note" class="cat__note">{{ category.availability_note }}</p>
      </div>

      <div ref="bodyEl" class="cat-body">
        <div v-if="visibleItems.length" class="cat-items">
          <MenuItem
            v-for="item in visibleItems"
            :key="item.id"
            :item="item"
            :currency="currency"
            :locale="locale"
            :can-load-thumbs="canLoadThumbs"
          />
        </div>
        <p v-else class="muted">Sin ítems disponibles.</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cat {
  margin-bottom: 1rem;

  &-content {
    position: relative;
  }

  &-header {
    position: sticky;
    top: var(--toolbar-h);
    z-index: 3;
    background: var(--fg);
    padding-block: 0.25rem;
    transition: background-color 0.5s ease-in-out;
  }

  &-items {
    margin-top: 2rem;
  }

  &-body {
    display: flex;
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease;
  }
}

.cat__title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 2px solid var(--muted);
  color: var(--bg);
  padding: 0.75rem;
  border-radius: 0.25rem;
  text-align: left;

  &-text {
    width: calc(100% - 2rem);
    margin: 0;
    white-space: break-spaces;
    font-size: 1.25rem;
    font-weight: 600;
  }

  &:active { background-color: var(--muted); color: var(--fg); }
  &:focus { outline: 3px solid var(--bg); outline-offset: 2px; }
}

.cat__note {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0.25rem 0.75rem 0;
  text-align: left;
}

.arrow {
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: transform 0.5s ease;

  &--expanded { transform: rotate(180deg); }
}

.muted {
  color: var(--muted);
  font-style: italic;
  margin-top: 1.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .arrow, .cat-body { transition: none; }
}
</style>
