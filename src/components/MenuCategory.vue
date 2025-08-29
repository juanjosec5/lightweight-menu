<script setup lang="ts">
  import { ref, computed, onMounted, watch } from "vue";
  import MenuItem from "./MenuItem.vue";
  import { Leaf, Flame, Fish, Shrimp } from "lucide-vue-next";
  import type { Category, Label } from "@/types/menu";

  const props = withDefaults(
    defineProps<{
      category: Category;
      currency: string;
      locale: string;
      reverse?: boolean;
      menuId?: string;
      activeItemId?: string | null;
    }>(),
    { reverse: false }
  );

  const LABELS_MAP = {
    spicy: { icon: Flame, text: `${props.locale === 'en-US' ? 'spicy' : 'picante'}`, class: "spicy" },
    vegetarian: { icon: Leaf, text: `${props.locale === 'en-US' ? 'vegetarian' : 'vegetariano'}`, class: "vegetarian" },
    fish: { icon: Fish, text: `${props.locale === 'en-US' ? 'fish' : 'pescado'}`, class: "fish" },
    shrimp: { icon: Shrimp, text: `${props.locale === 'en-US' ? 'shrimp' : 'camarón'}`, class: "shrimp" },
  };

  const expanded = ref(false);
  const canLoadThumbs = ref(false);
  const bodyEl = ref<HTMLElement | null>(null);
  const btnEl = ref<HTMLElement | null>(null);
  const isAnimating = ref(false);

  const hasItem = (id: string | null | undefined): boolean => {
    if (!id) return false;

    if (props.category.items?.some((it) => it.id === id)) {
      return true;
    }

    if (
      props.category.sections?.some((sec) =>
        sec.items.some((it) => it.id === id)
      )
    ) {
      return true;
    }

    return false;
  };

  const ensureOpenAndScrollTo = (id: string) => {
    const scroll = () => {
      const node = document.getElementById(id);
      if (!node) return;
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      node.classList.add("highlight");
      setTimeout(() => node.classList.remove("highlight"), 2000);
    };

    if (!expanded.value) {
      expanded.value = true;
      openBody(() => {
        // one extra frame ensures layout is settled
        requestAnimationFrame(scroll);
      });
    } else {
      canLoadThumbs.value = true ;
      requestAnimationFrame(scroll);
    }
  };

  const categoryLabels = computed(() => {
    const set = new Set<Label>();

    props.category.items?.forEach((it) =>
      it.labels?.forEach((l) => set.add(l))
    );

    props.category.sections?.forEach((sec) =>
      sec.items.forEach((it) => it.labels?.forEach((l) => set.add(l)))
    );
    return [...set].map((l) => LABELS_MAP[l]).filter(Boolean);
  });

  const openBody = (after?: () => void) => {
    const el = bodyEl.value;
    if (!el) return;
    isAnimating.value = true;
    el.style.maxHeight = el.scrollHeight + "px";
    el.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName !== "max-height") return;
        el.style.maxHeight = "none";
        isAnimating.value = false;
        canLoadThumbs.value = true;
        // run after the panel is fully open
        requestAnimationFrame(() => after?.());
      },
      { once: true }
    );
  };

  const closeBody = () => {
    const el = bodyEl.value;
    if (!el) return;
    isAnimating.value = true;
    // If currently 'none', fix to current px so we can animate down
    if (el.style.maxHeight === "none") {
      el.style.maxHeight = el.scrollHeight + "px";
    }
    // Force reflow to ensure transition kicks in
    void el.offsetHeight;
    el.style.maxHeight = "0px";
    el.addEventListener(
      "transitionend",
      () => {
        isAnimating.value = false;
      },
      { once: true }
    );
    btnEl.value?.focus();
  };

  const toggleContent = () => {
    if (isAnimating.value) return;

    expanded.value = !expanded.value;
    expanded.value ? openBody() : closeBody();
  };

  onMounted(() => {
    if (hasItem(props.activeItemId)) {
      ensureOpenAndScrollTo(props.activeItemId as string);
    }
  });

  watch(
    () => props.activeItemId,
    (newId) => {
      if (hasItem(newId)) {
        ensureOpenAndScrollTo(newId as string);
      }
    }
  );
</script>

<template>
  <section :id="category.id" :class="['cat', { 'cat--reverse': reverse }]">
    <div class="cat-content">
      <div class="cat-header">
        <button
          @click="toggleContent"
          class="cat__title"
          :aria-label="`Mostrar menu de ${category.label}`"
          :aria-expanded="expanded"
          :disabled="isAnimating"
          ref="btnEl"
        >
          <span :class="['arrow', { 'arrow--expanded': expanded }]"
            >&#8595;</span
          >
          <h3 class="cat__title-text">
            {{ category.label }}
          </h3>
        </button>
      </div>
      <div class="cat-body" ref="bodyEl">
        <!-- Flat items -->

        <ul class="labels-list" v-if="categoryLabels.length">
          <li v-for="l in categoryLabels" :key="l.class">
            <span class="badge">
              <component :is="l.icon" :class="l.class" :size="20" />
              {{ l.text }}
            </span>
          </li>
        </ul>
        <div v-if="category.items?.length" class="cat-items">
          <menu-item
            v-for="it in category.items"
            :key="it.id"
            :item="it"
            :currency="currency"
            :locale="locale"
            :menu-id="menuId"
            :can-load-thumbs="canLoadThumbs"
          />
        </div>
        <!-- Grouped sections -->
        <div v-if="category.sections?.length" class="cat-sections">
          <div
            v-for="sec in category.sections"
            :key="sec.id"
            class="cat-section"
          >
            <span class="section__title-wrapper">
              <h4 class="section__title">{{ sec.label }}</h4>
            </span>
            <menu-item
              v-for="it in sec.items"
              :key="it.id"
              :item="it"
              :currency="currency"
              :locale="locale"
              :menu-id="menuId"
              :can-load-thumbs="canLoadThumbs"
            />
          </div>
        </div>

        <p
          v-if="!category.items?.length && !category.sections?.length"
          class="muted"
        >
          Sin ítems por ahora.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  @use "sass:color";

  .labels-list {
    list-style: none;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    padding: 0;
    margin: 0;
    margin-top: 1rem;

    & + div.cat-items {
      margin-top: 0;
    }
  }

  .spicy {
    color: red;
  }

  .vegetarian {
    color: green;
  }

  .fish {
    color: lightseagreen;
  }

  .shrimp {
    color: lightcoral;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .arrow {
    font-size: 1.5rem;
    position: absolute;
    top: 0.8rem;
    right: 2rem;
    cursor: pointer;
    transition: transform 0.5s ease;

    &--expanded {
      transform: rotate(180deg);
      transition: transform 0.5s ease;
    }
  }

  .cat {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 1rem;

    &-header {
      position: sticky;
      top: var(--toolbar-h); /* sits right below your fixed toolbar */
      z-index: 3; /* above body content, below toolbar if toolbar has higher z */
      background: var(--fg); /* avoid text/content bleeding under it */
      /* optional spacing so it doesn’t jump when sticking */
      padding-block: 0.25rem;
      transition: background-color 0.5s ease-in-out;
    }

    &-items {
      margin-top: 2rem;
    }

    &-content {
      position: relative;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: 0;
      margin-top: 0;
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
      margin: 0;
      font-size: 1.45rem;
    }

    &:active {
      background-color: var(--action);
    }

    &:focus {
      outline: 3px solid var(--bg);
      outline-offset: 2px;
    }
  }

  .muted {
    color: #777;
    font-style: italic;
  }

  .section__title-wrapper {
    display: flex;
    position: relative;
  }

  .section__title {
    text-align: left;
    font-size: 1.25rem;
    margin-block: 2.5rem 2rem;
    color: var(--bg);
  }

  @media (prefers-reduced-motion: reduce) {
    .arrow,
    .cat-body {
      transition: none;
    }
  }
</style>
