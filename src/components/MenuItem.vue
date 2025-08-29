<script setup lang="ts">
  import { ref, watch } from "vue";
  import { formatPrice } from "@/utils/formatPrice";
  import { Flame, Leaf, Fish, Link, X, Shrimp } from "lucide-vue-next";
  const props = defineProps<{
    item: {
      id: string;
      name: string;
      ingredients: string[];
      description?: string;
      image?: { src: string; alt?: string };
      price: number;
      labels?: string[];
      imageThumbnail?: { src: string; alt?: string };
    };
    currency: string;
    locale: string;
    menuId?: string;
    canLoadThumbs?: boolean;
  }>();

  const dialogRef = ref<HTMLDialogElement | null>(null);
  const showModal = ref(false);

  const LABEL_MAP: Record<string, any> = {
    spicy: { icon: Flame, class: "spicy" },
    vegetarian: { icon: Leaf, class: "vegetarian" },
    fish: { icon: Fish, class: "fish" },
    shrimp: { icon: Shrimp, class: "shrimp" },
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

  const toggleModal = () => {
    showModal.value = !showModal.value;
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showModal.value) {
      toggleModal();
    }
  };

  watch(showModal, (val) => {
    if (!dialogRef.value) return;

    if (val) {
      document.documentElement.classList.add("no-scroll");
    } else {
      document.documentElement.classList.remove("no-scroll");
    }
  });
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
    <button
      @click.prevent="onShareClick"
      class="share-button"
      :aria-label="`Share link to ${item.name}`"
    >
      <component :is="Link" :size="20"></component>
    </button>
    <button
      v-if="item.imageThumbnail?.src"
      type="button"
      class="thumb"
      :aria-label="`Ver imagen de ${item.name}`"
      @click="showModal = true"
    >
      <img
        v-if="canLoadThumbs"
        :src="item.imageThumbnail.src"
        :alt="item.imageThumbnail.alt || item.name"
        loading="lazy"
      />
    </button>
    <dialog
      ref="dialogRef"
      class="img-dialog"
      :open="showModal"
      @keydown="handleKeydown"
    >
      <form method="dialog">
        <button
          class="img-dialog__close"
          aria-label="Cerrar"
          @click="showModal = false"
        >
          <component
            class="img-dialog__close-button"
            :is="X"
            :size="28"
          ></component>
        </button>
      </form>
      <div class="img-dialog__img-wrapper">
        <img
          v-show="showModal"
          class="img-dialog__img"
          :src="item.image?.src"
          :alt="item.image?.alt || item.name"
        />
      </div>
      <p class="img-dialog__caption">{{ item.image?.alt || item.name }}</p>
    </dialog>
  </article>
</template>

<style scoped lang="scss">
  .mi-labels {
    display: flex;
    gap: 0.5rem;
    margin: 0;
  }
  .share-button {
    height: fit-content;
    position: absolute;
    right: 0;
    color: var(--bg);
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

  .item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    padding-block: 0 1rem;
    margin-block: 0 2rem;
    border-bottom: 1px solid var(--muted);
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
    place-content: flex-start;
    gap: 8px;
    margin: 0;
    width: 100%;
    margin-bottom: 1.5rem;

    ul {
      list-style: none;
      padding-left: 0;
    }
  }

  .item__title {
    margin: 0;
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

  .thumb {
    display: flex;
    border: 0;
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
    cursor: zoom-in;
    height: 80px;
    width: 80px;

    img {
      object-fit: none;
      width: 100%;
      height: 100%;
    }
  }

  .img-dialog {
    border: none;
    border-radius: 0.75rem;
    z-index: 100;
  }

  .img-dialog[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 780px;
    gap: 0.5rem;
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);

    form {
      align-self: flex-end;
    }
  }

  .img-dialog__img {
    object-fit: contain;
    width: 100%;
  }

  .img-dialog__close {
    border: none;
    background: transparent;
    font-size: 1.5rem;
    cursor: pointer;

    &-button {
      color: var(--bg);
    }
  }
</style>
