<script setup lang="ts">
  import { ref } from "vue";
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

  withDefaults(
    defineProps<{
      category: Category;
      currency: string;
      locale: string;
      reverse?: boolean;
    }>(),
    { reverse: false }
  );

  const expanded = ref(false);
  const bodyEl = ref<HTMLElement | null>(null);
  const btnEl = ref<HTMLElement | null>(null);
  const isAnimating = ref(false);

  function openBody() {
    const el = bodyEl.value;

    if (!el) return;

    isAnimating.value = true;
    el.style.marginTop = "1.5rem";
    el.style.maxHeight = el.scrollHeight + "px";
    // Allow natural growth after it opens
    el.addEventListener("transitionend", onAfterOpen, { once: true });

    btnEl.value?.focus();
  }

  function onAfterOpen() {
    const el = bodyEl.value;

    if (!el) return;

    el.style.maxHeight = "none";
    isAnimating.value = false;

    btnEl.value?.focus();
  }

  function closeBody() {
    const el = bodyEl.value;
    if (!el) return;
    isAnimating.value = true;
    // If currently 'none', fix to current px so we can animate down
    if (el.style.maxHeight === "none") {
      el.style.maxHeight = el.scrollHeight + "px";
    }
    // Force reflow to ensure transition kicks in
    void el.offsetHeight;
    el.style.marginTop = "0";
    el.style.maxHeight = "0px";
    el.addEventListener(
      "transitionend",
      () => {
        isAnimating.value = false;
      },
      { once: true }
    );
    btnEl.value?.focus();
  }

  function toggleContent() {
    if (isAnimating.value) return;

    expanded.value = !expanded.value;
    expanded.value ? openBody() : closeBody();
  }
</script>

<template>
  <section :id="category.id" :class="['cat', { 'cat--reverse': reverse }]">
    <div class="cat-content">
      <button
        @click="toggleContent"
        class="cat__title"
        :aria-label="`Mostrar menu de ${category.label}`"
        :aria-expanded="expanded"
        :disabled="isAnimating"
        ref="btnEl"
      >
        <span :class="['arrow', { 'arrow--expanded': expanded }]">&#8595;</span>
        <h3 class="cat__title-text">
          {{ category.label }}
        </h3>
      </button>
      <div class="cat-body" ref="bodyEl">
        <!-- Flat items -->
        <div v-if="category.items?.length" class="cat-items">
          <menu-item
            v-for="it in category.items"
            :key="it.id"
            :item="it"
            :currency="currency"
            :locale="locale"
          />
        </div>

        <!-- Grouped sections -->
        <div v-if="category.sections?.length" class="cat-sections">
          <div
            v-for="sec in category.sections"
            :key="sec.id"
            class="cat-section"
          >
            <h4 class="section__title">{{ sec.label }}</h4>
            <menu-item
              v-for="it in sec.items"
              :key="it.id"
              :item="it"
              :currency="currency"
              :locale="locale"
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

    &-content {
      position: relative;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease, margin-top 0.5s ease;
    }
  }

  .cat__title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background: transparent;
    border: 2px solid var(--bg);
    color: var(--bg);
    padding: 0.75rem;
    border-radius: .25rem;
    text-align: left;

    &-text {
      margin: 0;
      font-size: 1.45rem;
    }

    &:hover {
      background-color: var(--action);
    }

    &:active {
      background-color: var(--action);
    }

    &:focus {
      outline: 3px solid var(--bg);
      background-color: var(--action);
      outline-offset: 2px;
    }
  }

  .muted {
    color: #777;
    font-style: italic;
  }

  .section__title {
    text-align: left;
    font-size: 1.25rem;
    margin-block: 0.25rem;
    color: #464646;
  }
</style>
