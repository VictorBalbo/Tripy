<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
  ButtonComponent,
  CardComponent,
  TagComponent
} from '.'
import { AddIcon, GlobeIcon, StarIcon, TrashIcon } from './icons'
import { MapsService } from '@/services/MapsService'
import type { Location } from '@/models/Location'
import { useTripStore } from '@/stores/tripStore'

const props = defineProps<{
  placeId: string
}>()
const emit = defineEmits(['close'])
const tripStore = useTripStore()

const location = ref<Location>()

const getLocationDetails = (id: string) => MapsService.getDetaisForPlaceId(id)
const closeWindow = () => emit('close')
const getUrlDomain = (url: string) => new URL(url).hostname
const isLocationOnTripItinerary = () =>
  tripStore.activities?.find((a) => a.PlaceId === props.placeId)

const isOpenHoursAccordionOpen = ref(false)

watchEffect(async () => {
  location.value = undefined
  location.value = await getLocationDetails(props.placeId)
})
</script>

<template>
  <section class="info-window-container">
    <CardComponent class="info-window scroll">
      <article class="close-button" @click="() => closeWindow()">
        <AddIcon class="close-icon" />
      </article>
      <Transition name="slide-up">
        <section v-if="!location" class="info-window-section">Loading</section>
        <section v-else class="info-window-section">
          <img
            class="photo"
            :src="MapsService.getPhotoForPlace(location.images)"
            :alt="location.name"
          />
          <header class="header">
            <h2>{{ location.name }}</h2>
            <article class="rating">
              <StarIcon class="icon" />
              <h4>{{ location.rating }} / 5</h4>
            </article>
            <article>
              <TagComponent
                v-for="category in location.categories?.slice(0, 1)"
                :key="category"
                :value="category"
                class="tag"
              />
            </article>
            <article class="actions">
              <ButtonComponent v-if="!isLocationOnTripItinerary()" size="small" class="add-button">
                <AddIcon class="icon-button" /> Add to trip
              </ButtonComponent>
              <ButtonComponent v-else type="secondary" outlined size="small" class="remove-button">
                <TrashIcon class="icon-button" /> Remove
              </ButtonComponent>
              <ButtonComponent
                as="a"
                :href="location.website"
                target="_blank"
                rel="noreferrer noopener"
                size="small"
                outlined
                class="link link-button"
              >
                <GlobeIcon class="icon-button" /> Go to Website
              </ButtonComponent>
            </article>
          </header>
          <section class="body">
            <article class="card-info">
              <h4>Description</h4>
              <p>{{ location.description }}</p>
            </article>
            <article class="card-info">
              <h4>Address</h4>
              <a :href="location.mapsUrl">{{ location.address }}</a>
            </article>
            <article v-if="location.phoneNumber" class="card-info">
              <h4>Phone</h4>
              <a :href="`tel:${location.phoneNumber}`">{{ location.phoneNumber }}</a>
            </article>
            <article v-if="location.website" class="card-info website-card">
              <h4>Website</h4>
              <a :href="location.website">{{ getUrlDomain(location.website) }}</a>
            </article>
            <Accordion
              v-if="location.openingHours"
              class="card-info"
              @update:value="(value) => (isOpenHoursAccordionOpen = value == 1)"
            >
              <AccordionPanel value="1">
                <AccordionHeader>
                  <section class="accordion-header">
                    <h4>Opening Hours</h4>
                    <p v-if="!isOpenHoursAccordionOpen">
                      {{
                        location.openingHours.weekday_text.find((o) =>
                          o.startsWith(new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                        )
                      }}
                    </p>
                  </section>
                </AccordionHeader>
                <AccordionContent>
                  <p
                    v-for="(hours, index) in location.openingHours.weekday_text"
                    :key="index"
                    class="opening-hours"
                  >
                    {{ hours }}
                  </p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </section>
        </section>
      </Transition>
    </CardComponent>
  </section>
</template>

<style scoped>
.info-window-container {
  width: 25rem;
  height: 100%;
  position: absolute;
  bottom: 0;
  padding: var(--large-spacing);
}
.info-window {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--color-background);
  overflow: auto;
}
.info-window-section {
  position: absolute;
  display: flex;
  flex-direction: column;
}
.close-button {
  position: absolute;
  top: var(--large-spacing);
  right: var(--large-spacing);
  z-index: 1;
  background-color: var(--color-background);
  border: 1px solid;
  width: 40px;
  height: 40px;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.75;
  transition: var(--default-transition);
}
.close-button:hover {
  opacity: 1;
  color: var(--color-primary);
}
.close-icon {
  rotate: 45deg;
  width: 1rem;
}
.photo {
  width: 100%;
  height: 15rem;
  object-fit: cover;
}
.header {
  display: flex;
  flex-direction: column;
  padding: var(--small-spacing) var(--large-spacing);
  background-color: var(--color-background-soft);
  border-bottom: 1px var(--color-border) solid;
}
.rating {
  margin-top: var(--small-spacing);
  display: flex;
  flex-direction: row;
  color: var(--color-orange);
}
.actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  fill: var(--color-text);
}
.actions .link {
  width: 45%;
  color: var(--color-text);
}
.actions .add-button,
.actions .remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45%;
}
.remove-button {
  color: var(--color-red);
  border: 1px solid var(--color-red);
}
.body {
  display: flex;
  flex-direction: column;
  padding: 0 var(--large-spacing);
  margin-top: var(--large-spacing);
}
.card-info {
  padding: var(--large-spacing);
  margin-bottom: var(--large-spacing);
  background-color: var(--color-background-soft);
  box-shadow: 0 1px 5px #0000001f;
  border-radius: var(--small-spacing);
}
.website-card {
  word-break: break-all;
}
.icon {
  width: 1rem;
  margin-right: var(--small-spacing);
}
.icon-button {
  width: 1rem;
}
.tag {
  margin: var(--small-spacing) var(--small-spacing) var(--small-spacing) 0;
}
.accordion-header {
  display: flex;
  flex-direction: column;
}
.opening-hours {
  margin: var(--small-spacing) 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s linear;
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-leave-to {
  opacity: 0;
}
</style>
