<script setup lang="ts">
  import { formatPrice } from "@/utils/formatPrice";

  defineProps<{
    item: {
      id: string;
      name: string;
      ingredients: string[];
      description?: string;
      image?: { src: string; alt?: string };
      price: number;
    };
    currency: string;
    locale: string;
  }>();
</script>

<template>
  <article class="item">
    <div class="item__body">
      <h4 class="item__title">{{ item.name }}</h4>
      <p class="item__ingredients">{{ item.ingredients.join(", ") }}</p>
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
  .item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #a3a3a3;

    &__body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      /* justify-content: center; */
    }
  }


  .item__title {
    margin: 0 0 4px;
    font-weight: 600;
  }
  .item__ingredients,
  .item__desc {
    margin: 0 0 6px;
    color: #555;
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
