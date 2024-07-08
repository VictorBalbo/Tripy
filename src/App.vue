<script setup lang="ts">
import { RouterView } from 'vue-router'
import { MapComponent } from '@/components'
import StyleView from './views/StyleView.vue'

const checkDarkMode = () => {
  console.log()
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  const element = document.querySelector('html')
  if (isDarkMode) {
    element?.classList.add('dark-mode')
  } else {
    element?.classList.remove('dark-mode')
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode)
checkDarkMode()
</script>

<template>
  <div class="app">
    <main class="main">
      <RouterView />
      <StyleView />
    </main>
    <aside class="aside">
      <MapComponent class="map-component" />
    </aside>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.main {
  width: 100%;
  max-width: 45rem;
}
.aside {
  height: 100%;
  position: relative;
  flex-grow: 1;
}
.map-component:before {
  position: absolute;
  display: block;
  box-shadow: inset 1.25rem 0 1rem -1rem rgba(0, 0, 0, 0.5);
  content: '';
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
</style>
