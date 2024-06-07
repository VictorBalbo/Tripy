<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { CardComponent } from '.'
import { MapsService } from '@/services/MapsService'
import type { Location } from '@/models/Location'

const props = defineProps<{
  placeId: string
}>()

const location = ref<Location>()

const getLocationDetails = (id: string) => {
  console.log('Fetching for ', id)
  return MapsService.getDetaisForPlaceId(id)
}

watchEffect(async () => {
  console.log('Watcher', props.placeId)
  location.value = undefined
  location.value = await getLocationDetails(props.placeId)
})
</script>

<template>
  <section class="info-window-container">
    <CardComponent v-if="!location" class="info-window"> Loading </CardComponent>
    <CardComponent v-else class="info-window">
      <header class="header">
        <section class="name-description">
          <h2>{{ location.name }}</h2>
          <p>{{ location.description }}</p>
        </section>
        <img
          class="photo"
          :src="MapsService.getPhotoForPlace(location.images)"
          :alt="location.name"
        />
      </header>
    </CardComponent>
  </section>
</template>

<style scoped>
.info-window-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: var(--large-spacing);
}
.info-window {
  padding: var(--large-spacing);
}
</style>
