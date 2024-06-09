<template>
  <article class="button">
    <slot />
  </article>
</template>
<style scoped>
.button {
  width: fit-content;
  padding: var(--small-spacing);
  border-radius: var(--small-spacing);
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: var(--default-transition);
}
.button:hover {
  background-color: var(--color-blue-faded);
}
.button:active {
  background-color: var(--color-blue-active);
}
</style>
