<template>
  <article class="button">
    <p><slot /></p>
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
  background-color: var(--color-primary-light);
}
.button:active {
  background-color: var(--color-primary-active);
}
</style>
