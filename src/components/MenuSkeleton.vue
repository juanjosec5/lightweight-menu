<template>
  <div class="skeleton-wrap" aria-hidden="true">
    <div class="skeleton-header">
      <div class="skeleton skeleton--logo" />
      <div class="skeleton skeleton--subtitle" />
    </div>
    <div v-for="i in 4" :key="i" class="skeleton-category">
      <div class="skeleton skeleton--cat-title" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position:  400px 0; }
}

.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1rem;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--muted) 30%, transparent) 25%,
    color-mix(in srgb, var(--muted) 55%, transparent) 50%,
    color-mix(in srgb, var(--muted) 30%, transparent) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;

  &--logo    { width: 120px; height: 48px; align-self: center; border-radius: 8px; }
  &--subtitle{ width: 160px; height: 14px; align-self: center; margin-top: 0.5rem; }
  &--cat-title { width: 100%; height: 52px; border-radius: 0.25rem; }
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.skeleton-category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
</style>
