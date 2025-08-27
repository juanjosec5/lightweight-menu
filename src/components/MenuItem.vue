<script setup lang="ts">
  import { formatPrice } from "@/utils/formatPrice";
  import { Flame, Leaf } from "lucide-vue-next";
  import { Link } from "lucide-vue-next";

  const props = defineProps<{
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
    menuId?: string;
  }>();

  const LABEL_MAP: Record<string, any> = {
    spicy: { icon: Flame, class: "spicy" },
    vegetarian: { icon: Leaf, class: "vegetarian" },
  };

  const buildShareUrl = (itemId: string) => {
    if (!props.menuId) return window.location.href;

    const url = new URL(window.location.href);
    url.searchParams.set("menu", props.menuId);
    url.hash = itemId;
    return url.toString();
  };

  const onShareClick = async (e: MouseEvent) => {
    e.stopPropagation(); // don’t trigger parent click handlers
    const link = buildShareUrl(props.item.id);

    // Update the current tab’s hash without stacking history
    history.replaceState({}, "", `#${props.item.id}`);

    try {
      if (navigator.share) {
        await navigator.share({ title: props.item.name, url: link });
        return;
      }
    } catch {
      // fall through to clipboard if user cancels share or it fails
    }

    try {
      await navigator.clipboard.writeText(link);
      // TODO: show a toast if you have one
    } catch {
      // Last-resort fallback
      prompt("Copia el enlace:", link);
    }
  };
</script>

<template>
  <article class="item" :id="item.id">
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
    <button  @click.prevent="onShareClick" class="share-button" :aria-label="`Share link to ${item.name}`">
      <component :is="Link" :size="20"></component>
    </button>
    <img
      v-if="item.image?.src"
      :src="item.image.src"
      :alt="item.image.alt || item.name"
      loading="lazy"
    />
  </article>
</template>

<style scoped lang="scss">
  .share-button {
    height: fit-content;
    position: absolute;
    right: 0;
    color: var(--bg)
  }
  .spicy {
    color: red;
  }
  .vegetarian {
    color: green;
  }

  .item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    padding-block: 0 1rem;
    margin-block: 0 2rem;
    border-bottom: 1px solid var(--bg);
    scroll-margin-top: calc(var(--toolbar-h) + 3.25rem);

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
    padding-right: 3rem;
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
