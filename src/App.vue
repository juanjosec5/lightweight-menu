<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useTheme } from '@/composables/useTheme'
import MenuCategory from '@/components/MenuCategory.vue'
import { getGtag } from '@/utils/gtag'
import { supabase } from '@/lib/supabase'
import type { MenuData, Platform } from '@/types/menu'

// ── URL param ──────────────────────────────────────────────────────────
const slug = ref<string | null>(new URLSearchParams(location.search).get('menu'))

// ── Directory (shown when no slug) ─────────────────────────────────────
type RestaurantEntry = { name: string; slug: string; logo_url: string | null; subtitle: string | null }
const directory = ref<RestaurantEntry[]>([])

async function loadDirectory() {
  const { data: rows } = await supabase
    .from('restaurants')
    .select('name, slug, logo_url, subtitle')
    .eq('is_published', true)
    .order('name')
  if (rows) directory.value = rows as RestaurantEntry[]
}

function goToMenu(s: string) {
  location.href = `?menu=${s}`
}

// ── Data ───────────────────────────────────────────────────────────────
const { data, loading, error } = useMenu(slug)
const { theme, toggle } = useTheme()

// ── Menu tab selection ─────────────────────────────────────────────────
const selectedMenuId = ref<string | null>(null)
const activeItemId = ref<string | null>(location.hash.replace(/^#/, '') || null)
const lastTrackedKey = ref<string | null>(null)

const activeMenus = computed(() => data.value?.menus.filter(m => m.is_active) ?? [])
const searchQuery = ref('')

const selectedMenu = computed(() => {
  const all = activeMenus.value
  return all.find(m => m.id === selectedMenuId.value) ?? all[0] ?? null
})

// ── Logo / header ref ─────────────────────────────────────────────────
const headerRef = ref<HTMLElement | null>(null)
const toolbarLogo = ref<string | null>(null)
let observer: IntersectionObserver | null = null

// ── Branding ──────────────────────────────────────────────────────────
function applyBranding(d: MenuData | null) {
  const root = document.documentElement
  if (!d) {
    root.removeAttribute('data-theme')
    ;['--fg', '--bg', '--action', '--muted'].forEach(k => root.style.removeProperty(k))
    return
  }

  if (d.theme) root.setAttribute('data-theme', d.theme)
  else root.removeAttribute('data-theme')

  if (d.colors) {
    root.style.setProperty('--fg', d.colors.fg)
    root.style.setProperty('--bg', d.colors.bg)
    root.style.setProperty('--action', d.colors.action)
    root.style.setProperty('--muted', d.colors.muted)
  } else {
    ;['--fg', '--bg', '--action', '--muted'].forEach(k => root.style.removeProperty(k))
  }

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--fg').trim()
}

watch(data, async (d) => {
  applyBranding(d)
  if (!d) return
  if (!selectedMenuId.value) selectedMenuId.value = activeMenus.value[0]?.id ?? null

  await nextTick()

  if (observer && headerRef.value) observer.observe(headerRef.value)

  // auto-select the right menu tab for hash-linked item
  if (activeItemId.value) {
    for (const m of activeMenus.value) {
      const found = m.categories.some(c => c.items.some(i => i.id === activeItemId.value))
      if (found) { selectedMenuId.value = m.id; break }
    }
  }

  // track menu_rendered once per slug+menu combination
  const key = `${d.slug}|${selectedMenuId.value}`
  if (lastTrackedKey.value !== key) {
    lastTrackedKey.value = key
    getGtag()?.('event', 'menu_rendered', {
      restaurant_slug: d.slug,
      restaurant_name: d.name,
      selected_menu_id: selectedMenuId.value,
    })
  }
}, { immediate: true })

// ── Locations ─────────────────────────────────────────────────────────
const locationLabel = (loc: MenuData['restaurant_locations'][number]) =>
  [loc.address, loc.city].filter(Boolean).join(', ')

const locationMapUrl = (loc: MenuData['restaurant_locations'][number]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel(loc))}`

// ── Social link icons ─────────────────────────────────────────────────
const SOCIAL_ICONS: Record<Platform, [string, string] | null> = {
  instagram: ['fab', 'instagram'],
  facebook:  ['fab', 'facebook'],
  tiktok:    ['fab', 'tiktok'],
  website:   null,
  custom:    null,
}

// ── Hash navigation ───────────────────────────────────────────────────
function onHashChange() {
  activeItemId.value = location.hash.replace(/^#/, '') || null
}

onMounted(() => {
  if (!slug.value) loadDirectory()
  window.addEventListener('hashchange', onHashChange)

  observer = new IntersectionObserver(
    ([entry]) => { toolbarLogo.value = entry.isIntersecting ? null : (data.value?.logo_url ?? null) },
    { threshold: 0, rootMargin: '-50px 0px 0px 0px' }
  )
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange)
  observer?.disconnect()
})
</script>

<template>
  <!-- Toolbar -->
  <div :class="['toolbar', theme === 'dark' ? 'shadow-dark' : 'shadow-light']">
    <img v-if="toolbarLogo" :src="toolbarLogo" :alt="data?.name" />
    <button
      v-if="!data?.theme"
      class="toolbar-button theme-toggle"
      type="button"
      :aria-label="`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`"
      @click="toggle"
    >
      <font-awesome-icon :icon="theme === 'dark' ? ['fas', 'sun'] : ['fas', 'moon']" />
    </button>
  </div>

  <main class="wrap">
    <!-- Loading -->
    <p v-if="loading" class="state-msg">Cargando…</p>

    <!-- No menu param — directory -->
    <section v-else-if="!slug" class="directory">
      <h2 class="directory__title">Menús disponibles</h2>
      <ul class="directory__list">
        <li v-for="r in directory" :key="r.slug">
          <button type="button" class="directory__item" @click="goToMenu(r.slug)">
            <img v-if="r.logo_url" :src="r.logo_url" :alt="r.name" class="directory__logo" />
            <span v-else class="directory__initials">{{ r.name.charAt(0) }}</span>
            <span class="directory__info">
              <strong class="directory__name">{{ r.name }}</strong>
              <span v-if="r.subtitle" class="directory__sub">{{ r.subtitle }}</span>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <!-- Error -->
    <section v-else-if="error" class="error">
      <h2>{{ error }}</h2>
      <p>Verifica que la URL sea correcta.</p>
    </section>

    <!-- Menu content -->
    <template v-else-if="data">
      <!-- Restaurant header -->
      <header ref="headerRef" class="hdr">
        <img
          v-if="data.logo_url"
          class="logo-image"
          :src="data.logo_url"
          :alt="`${data.name} logo`"
          loading="eager"
          fetchpriority="high"
        />
        <h1 v-else>{{ data.name }}</h1>
        <p v-if="data.subtitle" class="sub">{{ data.subtitle }}</p>
        <p v-if="data.description" class="desc">{{ data.description }}</p>
      </header>

      <!-- Social links -->
      <nav v-if="data.social_links.length" class="social-links" aria-label="Redes sociales">
        <ul>
          <li v-for="link in data.social_links" :key="link.id">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon v-if="SOCIAL_ICONS[link.platform]" :icon="SOCIAL_ICONS[link.platform]!" />
              <span v-else>{{ link.platform }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Locations -->
      <div v-if="data.restaurant_locations.length" class="locations">
        <a
          v-for="loc in data.restaurant_locations"
          :key="loc.id"
          class="location-link"
          target="_blank"
          rel="noopener noreferrer"
          :href="locationMapUrl(loc)"
        >
          {{ locationLabel(loc) }}
          <font-awesome-icon :icon="['fas', 'location-dot']" />
        </a>
      </div>

      <!-- Menu tabs -->
      <nav v-if="activeMenus.length > 1" class="menus-nav" role="tablist" aria-label="Menús del restaurante">
        <p class="menus-nav__heading">Nuestros Menús</p>
        <button
          v-for="m in activeMenus"
          :key="m.id"
          type="button"
          role="tab"
          :aria-selected="m.id === selectedMenuId"
          :class="['menus-nav__button', { 'menus-nav__button--active': m.id === selectedMenuId }]"
          @click="selectedMenuId = m.id"
        >
          {{ m.label }}
        </button>
      </nav>

      <!-- Search -->
      <div v-if="selectedMenu" class="search-bar">
        <input
          v-model="searchQuery"
          class="search-input"
          type="search"
          placeholder="Buscar en el menú…"
          aria-label="Buscar en el menú"
        />
      </div>

      <!-- Categories -->
      <div v-if="selectedMenu" class="category-wrapper">
        <MenuCategory
          v-for="cat in selectedMenu.categories.filter(c => c.is_active)"
          :key="`${selectedMenuId}-${cat.id}`"
          :category="cat"
          :currency="data.currency"
          :locale="data.locale"
          :active-item-id="activeItemId"
          :search-query="searchQuery"
        />
      </div>

      <!-- Footer -->
      <small class="updated-at">
        Última actualización:
        {{ new Date(data.updated_at).toLocaleDateString(data.locale) }}
      </small>
    </template>
  </main>
</template>

<style scoped lang="scss">
.toolbar {
  position: fixed;
  display: flex;
  z-index: 10;
  place-content: center;
  place-items: center;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0.75rem;
  background: var(--fg);
  transition: background-color 0.5s ease-in-out;
  height: var(--toolbar-h);

  img { height: 100%; }
}

.toolbar-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: var(--bg);
  transition: background-color 0.3s ease;
  position: absolute;
  right: 0.75rem;

  &:active { background-color: var(--action); }
  &:focus { outline: 3px solid var(--bg); background-color: var(--action); outline-offset: 2px; }
}

.shadow-light {
  box-shadow: -1px 4px 9px 0px rgba(92, 92, 92, 0.75);
}
.shadow-dark {
  box-shadow: -1px 4px 9px 0px rgba(31, 31, 31, 0.75);
}

.wrap {
  max-width: 780px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: calc(var(--toolbar-h) + 1rem);
}

.hdr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  h1 { margin: 0; }
}

.sub { margin: 0.25rem 0; color: var(--bg); }
.desc { margin: 0; color: var(--bg); word-wrap: break-word; max-width: 100%; }

.logo-image {
  max-width: 240px;
  max-height: 150px;
  width: auto;
  height: auto;
}

.social-links {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: var(--bg);
    font-size: 1.35rem;
    transition: color 0.2s ease;

    &:hover { color: var(--action); }
  }
}

.locations {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.location-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
  color: var(--bg);
  font-weight: 600;
  width: fit-content;
  margin: 0 auto;

  &:hover { color: var(--action); }
}

.menus-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--muted);

  &__heading { margin: 0; }

  &__button {
    border: 2px solid var(--muted);
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: var(--bg);
    width: 100%;
    transition: background-color 0.3s ease-in-out;

    &--active { background-color: var(--action); }
  }
}

.search-bar {
  padding: 0 0.25rem;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 1rem;
  border-radius: 99px;
  border: 1px solid var(--muted);
  background: transparent;
  color: var(--bg);
  font-size: 0.9rem;
  outline: none;

  &::placeholder { color: var(--muted); }
  &:focus { border-color: var(--bg); }
}

.state-msg { text-align: center; margin-top: 2rem; }

.welcome, .error {
  text-align: center;
  margin-top: 2rem;
}

.directory {
  margin-top: 2rem;

  &__title {
    text-align: center;
    margin: 0 0 1.5rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--muted);
    border-radius: 0.5rem;
    background: transparent;
    color: var(--bg);
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover { background-color: color-mix(in srgb, var(--muted) 20%, transparent); }
    &:active { background-color: color-mix(in srgb, var(--muted) 40%, transparent); }
  }

  &__logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 4px;
    flex-shrink: 0;
  }

  &__initials {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    background: var(--muted);
    color: var(--fg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  &__name {
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__sub {
    font-size: 0.8rem;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.updated-at {
  color: var(--muted);
  text-align: center;
  padding: 1rem 0 2rem;
}
</style>
