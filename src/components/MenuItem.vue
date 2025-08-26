<script setup lang="ts">
  import { formatPrice } from "@/utils/formatPrice";
  import { Flame, Leaf } from "lucide-vue-next";

  defineProps<{
    item: {
      id: string;
      name: string;
      ingredients: string[];
      description?: string;
      image?: { src: string; alt?: string };
      price: number;
      labels?: string[];
    };
    currency: string;
    locale: string;
  }>();

  const LABEL_MAP: Record<string, any> = {
    spicy: { icon: Flame, class: "spicy" },
    vegetarian: { icon: Leaf, class: "vegetarian" },
  };
</script>

<template>
  <article class="item">
    <div class="item__body">
      <span class="item__header">
        <h4 class="item__title">{{ item.name }}</h4>
        <ul v-if="item.labels?.length" class="mi-labels">
          <li v-for="b in item.labels" :key="b" :class="`badge`">
            <component
              :is="LABEL_MAP[b].icon"
              :class="LABEL_MAP[b].class"
              size="20"
            ></component>
          </li>
        </ul>
      </span>
      <p v-if="item.ingredients?.length" class="item__ingredients">
        {{ item.ingredients.join(", ") }}
      </p>
      <p v-if="item.description" class="item__desc">{{ item.description }}</p>
      <strong class="item__price">{{
        formatPrice(item.price, currency, locale)
      }}</strong>
    </div>
    <img
      v-if="item.image?.src"
      :src="item.image.src"
      :alt="item.image.alt || item.name"
      loading="lazy"
    />
  </article>
</template>

<style scoped lang="scss">
  .spicy {
    color: red;
  }
  .vegetarian {
    color: green;
  }

  .item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--bg);

    &__body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      /* justify-content: center; */
    }
  }

  .item__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 4px;
    width: 100%;

    ul {
      list-style: none;
      padding-left: 0;
    }
  }

  .item__title {
    margin: 0 0 4px;
    font-weight: 600;
    font-size: 1.1rem;
  }
  .item__ingredients,
  .item__desc {
    margin: 0 0 6px;
    color: hsla(var(--bg), 0.7);
    text-align: left;
  }
  .item__price {
    white-space: nowrap;
    align-self: flex-end;
  }
  img {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 8px;
  }
</style>
