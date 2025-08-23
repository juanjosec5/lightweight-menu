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

  const toggleContent = (id: string) => {
    expanded.value = !expanded.value;
    const el = document.getElementById(id);
    
    if (el && el.querySelector('.cat-items')) {
      const content = el.querySelector(".cat-items");
      console.log(content);
      
      if (content && content instanceof HTMLElement) {
        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
          content.style.marginTop = "0";
          content.style.maxHeight = "0px";
        } else {
          content.style.marginTop = "1.5rem";
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    } else if(el && el.querySelector('.cat-section')) {
      const content = el.querySelector(".cat-section");
      console.log(content);
      if (content && content instanceof HTMLElement) {
        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
          content.style.marginTop = "0";
          content.style.maxHeight = "0px";
        } else {
          
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    }
  };
</script>

<template>
  <section :id="category.id" :class="['cat', { 'cat--reverse': reverse }]">
    <div class="cat-content">
      <span :class="[ 'arrow', { 'arrow--expanded': expanded }]">&#8595;</span>
      <h3 @click="toggleContent(category.id)" class="cat__title">
        {{ category.label }}
      </h3>

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
        <div v-for="sec in category.sections" :key="sec.id" class="cat-section">
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
  </section>
</template>

<style scoped lang="scss">
  .arrow {
    font-size: 2rem;
    position: absolute;
    top: 0;
    right: 2rem;
    cursor: pointer;
    transition: transform 0.5s ease;

    &--expanded {
      transform: rotate(180deg);
      transition: transform 0.3s ease;
    }
  }

  .cat {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 1rem;

    &-content {
      position: relative
    }

    &-items,
    &-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.6s ease, margin-top 0.6s ease;
    }
  }

  .cat__title {
    margin: 0;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 0.5rem 0;
    border: 2px solid black;

    &:hover {
      background-color: darken(#faf9f6, 10%);
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
