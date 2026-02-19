<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { formatPrice } from "@/utils/formatPrice";
import { Flame, Leaf, Fish, Link, X, Shrimp } from "lucide-vue-next";
import type { Item } from "@/types/menu";

type PriceMap = Record<string, number | string>;
type Price = number | PriceMap;

const props = defineProps<{
  item: Item & { price: Price }; // keep union locally for now
  currency: string;
  locale: string;
  menuId?: string;
  canLoadThumbs?: boolean;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const showModal = ref(false);

const ingredientsList = computed(() => {
  if (!props.item?.ingredientsType) return [];
  const lines = props.item.ingredients ?? [];
  return lines.map((line) => {
    const i = line.indexOf(":");
    if (i === -1) return { label: "", value: line.trim() };
    return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  });
});

const LABEL_MAP: Record<string, { icon: any; class: string }> = {
  spicy: { icon: Flame, class: "spicy" },
  vegetarian: { icon: Leaf, class: "vegetarian" },
  fish: { icon: Fish, class: "fish" },
  shrimp: { icon: Shrimp, class: "shrimp" },
};

const ICON_LABELS = new Set(Object.keys(LABEL_MAP));

const iconLabels = computed(() =>
  (props.item.labels ?? [])
    .filter((l): l is string => typeof l === "string")
    .filter((l) => ICON_LABELS.has(l))
);

// --- price helpers ---
const isPriceObject = computed(() => {
  const p = props.item.price;
  return typeof p === "object" && p !== null && !Array.isArray(p);
});

const priceLines = computed(() => {
  if (!isPriceObject.value) return [];
  const p = props.item.price as PriceMap;

  return Object.entries(p).map(([label, val]) => ({
    label,
    value:
      typeof val === "number"
        ? formatPrice(val, props.currency, props.locale)
        : String(val),
  }));
});

const buildShareUrl = (itemId: string) => {
  if (!props.menuId) return window.location.href;

  const url = new URL(window.location.href);
  url.searchParams.set("menu", props.menuId);
  url.hash = itemId;
  return url.toString();
};

const onShareClick = async (e: MouseEvent) => {
  e.stopPropagation();

  const link = buildShareUrl(props.item.id);
  history.replaceState({}, "", link);

  try {
    if (navigator.share) {
      await navigator.share({ title: props.item.name, url: link });
      return;
    }
  } catch {
    // ignore share cancellation/errors and fall back
  }

  try {
    await navigator.clipboard.writeText(link);
  } catch {
    prompt("Copia el enlace:", link);
  }
};

const openDialog = () => {
  const dlg = dialogRef.value;
  if (!dlg) return;

  // use native dialog API when available for proper modal behavior
  if (typeof dlg.showModal === "function") {
    dlg.showModal();
  } else {
    // fallback: at least keep state consistent
    dlg.setAttribute("open", "");
  }

  showModal.value = true;
};

const closeDialog = () => {
  const dlg = dialogRef.value;
  if (dlg?.open) dlg.close();
  showModal.value = false;
};

watch(showModal, (val) => {
  document.documentElement.classList.toggle("no-scroll", val);
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove("no-scroll");
});
</script>

<template>
  <article class="item" :id="item.id">
    <div class="item__body">
      <span class="item__header">
        <h4 class="item__title">{{ item.name }}</h4>

        <ul v-if="iconLabels.length" class="mi-labels">
          <li v-for="b in iconLabels" :key="b" class="badge">
            <component :is="LABEL_MAP[b].icon" :class="LABEL_MAP[b].class" :size="20" />
          </li>
        </ul>
      </span>

      <ul v-if="item.ingredientsType" class="item__ingredients-list">
        <li v-for="(it, index) in ingredientsList" :key="index">
          <p><strong v-if="it.label">{{ it.label }}:</strong> {{ it.value }}</p>
        </li>
      </ul>

      <p v-else-if="item.ingredients?.length" class="item__ingredients">
        {{ item.ingredients.join(", ") }}
      </p>

      <p v-if="item.description" class="item__desc">{{ item.description }}</p>

      <!-- single price -->
      <strong v-if="!isPriceObject" class="item__price">
        {{ formatPrice(item.price as number, currency, locale) }}
      </strong>

      <!-- multiple options -->
      <div v-else class="item__price-multi">
        <p v-for="line in priceLines" :key="line.label" class="item__price-row">
          <span class="opt">{{ line.label }}</span>
          <span class="val">{{ line.value }}</span>
        </p>
      </div>
    </div>

    <button
      @click.prevent="onShareClick"
      class="share-button"
      type="button"
      :aria-label="`Share link to ${item.name}`"
    >
      <component :is="Link" :size="20" />
    </button>

    <button
      v-if="item.imageThumbnail?.src"
      type="button"
      class="thumb"
      :aria-label="`Ver imagen de ${item.name}`"
      @click="openDialog"
    >
      <img
        v-if="canLoadThumbs"
        :src="item.imageThumbnail.src"
        :alt="item.imageThumbnail.alt || item.name"
        loading="lazy"
      />
    </button>

    <dialog ref="dialogRef" class="img-dialog" @close="showModal = false">
      <form method="dialog">
        <button class="img-dialog__close" aria-label="Cerrar" @click.prevent="closeDialog">
          <component class="img-dialog__close-button" :is="X" :size="28" />
        </button>
      </form>

      <div class="img-dialog__img-wrapper">
        <img
          v-if="showModal && item.image?.src"
          class="img-dialog__img"
          :src="item.image.src"
          :alt="item.image.alt || item.name"
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
  }
}

.item__header {
  display: flex;
  align-items: center;
  place-content: flex-start;
  gap: 8px;
  margin: 0 0 1.5rem 0;
  width: calc(100% - 56px);

  ul {
    list-style: none;
    padding-left: 0;
  }
}

.item__ingredients-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  place-items: flex-start;
  margin: 0;
  padding: 0;
  gap: .5rem;

  li:last-child {
    margin-bottom: .5rem;
  }

  p {
    margin: 0;
  }
}

.item__title {
  text-align: left;
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

/* multi-price block */
.item__price-multi {
  display: grid;
  gap: 0.25rem;
  align-self: flex-end;
  text-align: right;
}

.item__price-row {
  margin: 0;
}

.item__price-row .opt {
  font-weight: 600;
  margin-right: .5rem;
}

.item__price-row .val {
  white-space: nowrap;
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
