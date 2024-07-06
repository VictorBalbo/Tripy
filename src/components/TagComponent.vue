<script setup lang="ts">
defineProps<{ value: string }>()
</script>

<template>
  <p class="tag">{{ value }}</p>
</template>

<style scoped>
.tag {
  background-color: var(--color-primary-background);
  color: var(--color-text);
  border-radius: var(--small-spacing);
  display: inline-block;
  padding: 0 var(--small-spacing);
}
</style>
