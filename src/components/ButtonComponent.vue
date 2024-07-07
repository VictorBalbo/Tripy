<script setup lang="ts">
defineProps<{
  type: 'primary' | 'secondary'
}>()
</script>
<template>
  <article class="button" :class="type">
    <slot />
  </article>
</template>
<style scoped>
.button {
  width: fit-content;
  padding: var(--small-spacing);
  border-radius: var(--small-spacing);
  cursor: pointer;
  transition: var(--default-transition);
  font-size: 0.875rem;
}

.primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.primary:hover {
  background-color: var(--color-primary-light);
}
.primary:active {
  background-color: var(--color-primary-active);
}

.secondary {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-text);
}
</style>
