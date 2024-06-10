<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ButtonComponent, CardComponent, TagComponent } from '.'
import { ClockIcon, GlobeIcon, MarkerIcon, StarIcon, PhoneIcon } from './icons'
import { MapsService } from '@/services/MapsService'
import type { Location } from '@/models/Location'

const props = defineProps<{
  placeId: string
}>()
const emit = defineEmits(['close'])

const location = ref<Location>()

const getLocationDetails = (id: string) => MapsService.getDetaisForPlaceId(id)
const closeWindow = () => emit('close')

watchEffect(async () => {
  location.value = undefined
  location.value = await getLocationDetails(props.placeId)
})
</script>

<template>
  <section class="info-window-container">
    <CardComponent v-if="!location" class="info-window"> Loading </CardComponent>
    <CardComponent v-else class="info-window">
      <div class="close-button" @click="() => closeWindow()">X</div>
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
      <section class="body">
        <ButtonComponent class="add-button"> Add Place </ButtonComponent>
        <article>
          <TagComponent
            v-for="category in location.categories"
            :key="category"
            :value="category"
            class="tag"
          />
        </article>
        <article class="rating">
          <StarIcon class="icon" />
          <h3>{{ location.rating }} / 5</h3>
        </article>
        <article class="place-info">
          <MarkerIcon class="icon" />
          <h3>{{ location.address }}</h3>
        </article>
        <article v-if="location.phoneNumber" class="place-info">
          <PhoneIcon class="icon" />
          <h3>{{ location.phoneNumber }}</h3>
        </article>
        <article v-if="location.website" class="place-info">
          <GlobeIcon class="icon" />
          <h3>
            <a :href="location.website">{{ location.website }}</a>
          </h3>
        </article>
        <article v-if="location.openingHours" class="place-info">
          <ClockIcon class="icon" />
          <h3>
            {{
              location.openingHours.weekday_text.find((o) =>
                o.startsWith(new Date().toLocaleDateString('en-US', { weekday: 'long' }))
              )
            }}
          </h3>
        </article>
      </section>
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
  position: relative;
}
.close-button {
  position: absolute;
  top: var(--large-spacing);
  right: var(--large-spacing);
  background-color: inherit;
  border: 1px solid;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.header {
  display: flex;
  flex-direction: row;
}
.icon {
  width: 1rem;
  margin-right: var(--small-spacing);
}
.photo {
  border-radius: var(--small-spacing);
  width: 30%;
  max-width: 350px;
  height: fit-content;
}
.tag {
  margin-right: var(--small-spacing);
  margin-top: var(--small-spacing);
}
.rating {
  margin-top: var(--small-spacing);
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.rating * {
  color: var(--color-orange);
  fill: var(--color-orange);
}
.place-info {
  margin-top: var(--small-spacing);
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
</style>
