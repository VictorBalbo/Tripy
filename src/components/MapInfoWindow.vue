<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import dayjs from 'dayjs'
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
  ButtonComponent,
  CardComponent,
  DatePickerComponent,
  ProgressSpinner,
  TagComponent
} from '.'
import { AddIcon, EditIcon, GlobeIcon, StarIcon, TrashIcon } from './icons'
import { MapsService } from '@/services/MapsService'
import { useTripStore } from '@/stores/tripStore'
import type { Destination, Location } from '@/models'
import { distanceBetweenPoints } from '@/models/Coordinates'

const props = defineProps<{
  placeId: string
}>()
const emit = defineEmits(['close', 'locationLoaded'])
const tripStore = useTripStore()

const location = ref<Location>()
const activity = computed(() => tripStore.activities?.find((a) => a.placeId === props.placeId))

const centralizeMap = (location: Location) => emit('locationLoaded', location)
const closeWindow = () => emit('close')
const addPlaceToTrip = () => {
  let closestDestination: Destination
  let closestDestinationDistance: number = Number.MAX_VALUE
  tripStore.destinations?.forEach((d) => {
    const distance = distanceBetweenPoints(d.coordinates, location.value!.coordinates)
    if (!closestDestination || distance < closestDestinationDistance) {
      closestDestination = d
      closestDestinationDistance = distance
    }
  })
  closestDestination!.activities?.push({
    placeId: location.value!.placeId,
    address: location.value!.address,
    name: location.value!.name,
    coordinates: location.value!.coordinates
  })
  const store = { Name: tripStore.name, Destinations: tripStore.destinations }
  localStorage.setItem('tripStore', JSON.stringify(store))
}
const removePlaceFromTrip = () => {
  tripStore.destinations?.map((d) => {
    d.activities = d.activities?.filter((a) => a.placeId !== location.value?.placeId)
    return d
  })
  const store = { Name: tripStore.name, Destinations: tripStore.destinations }
  localStorage.setItem('tripStore', JSON.stringify(store))
}

const getUrlDomain = (url: string) => new URL(url).hostname.replace('www.', '')

const isEditingDate = ref<Boolean>(false)
const toogleEditingDate = async () => (isEditingDate.value = !isEditingDate.value)

const isOpenHoursAccordionOpen = ref(false)

watchEffect(async () => {
  location.value = undefined
  location.value = await MapsService.getDetaisForPlaceId(props.placeId)
  if (location.value && location.value.coordinates) {
    centralizeMap(location.value)
  }
})
</script>

<template>
  <section class="info-window-container">
    <CardComponent class="info-window scroll">
      <article class="close-button" @click="() => closeWindow()">
        <AddIcon class="close-icon" />
      </article>
      <Transition name="slide-up">
        <section v-if="!location" class="info-window-loading"><ProgressSpinner /></section>
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
              <h3>{{ location.rating }} / 5</h3>
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
              <ButtonComponent
                v-if="!activity"
                size="small"
                class="add-button"
                @click="addPlaceToTrip"
              >
                <AddIcon class="icon-button" /> Add to trip
              </ButtonComponent>
              <ButtonComponent
                v-else
                type="secondary"
                outlined
                size="small"
                class="remove-button"
                @click="removePlaceFromTrip"
              >
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
            <article
              v-if="activity && !isEditingDate"
              class="card-editable-info"
              @click="toogleEditingDate"
            >
              <article>
                <h3>Date</h3>
                <p v-if="activity.dateTime">
                  {{ dayjs(activity.dateTime).format('ddd, DD MMM HH:mm') }}
                </p>
                <p v-else>Select a date</p>
              </article>
              <EditIcon class="icon" />
            </article>
            <article v-else-if="activity" class="card-info">
              <h3>Date</h3>
              <DatePickerComponent
                v-model="activity.dateTime"
                v-focustrap
                dateFormat="dd/mm/yy"
                showTime
                fluid
                showIcon
                :stepMinute="5"
                hourFormat="24"
                @hide="() => toogleEditingDate()"
              />
            </article>

            <article class="card-info">
              <h3>Description</h3>
              <p>{{ location.description }}</p>
            </article>
            <article class="card-info">
              <h3>Address</h3>
              <a :href="location.mapsUrl" target="_blank" rel="noopener">{{ location.address }}</a>
            </article>
            <article v-if="location.phoneNumber" class="card-info">
              <h3>Phone</h3>
              <a :href="`tel:${location.phoneNumber}`">{{ location.phoneNumber }}</a>
            </article>
            <article v-if="location.website" class="card-info website-card">
              <h3>Website</h3>
              <a :href="location.website" target="_blank" rel="noopener">{{
                getUrlDomain(location.website)
              }}</a>
            </article>
            <Accordion
              v-if="location.openingHours"
              class="card-info"
              @update:value="(value) => (isOpenHoursAccordionOpen = value === '1')"
            >
              <AccordionPanel value="1">
                <AccordionHeader>
                  <section class="accordion-header">
                    <h3>Opening Hours</h3>
                    <p class="accordion-header-text">
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

<style scoped lang="scss">
.info-window-container {
  width: 25rem;
  height: 100%;
  position: absolute;
  bottom: 0;
  padding: var(--large-spacing);
  @media (max-width: 480px) {
    width: 100%;
    padding: 0;
  }
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
.info-window-loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  &:hover {
    opacity: 1;
    color: var(--color-primary);
  }
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
}
.rating {
  margin-top: var(--small-spacing);
  display: flex;
  flex-direction: row;
  color: var(--color-yellow);
}
.actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  fill: var(--color-text);
  .link {
    width: 45%;
    color: var(--color-text);
  }
  .add-button,
  .remove-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45%;
  }
  .remove-button {
    color: var(--color-red);
    border: 1px solid var(--color-red);
  }
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
.card-editable-info {
  padding: var(--large-spacing);
  margin-bottom: var(--large-spacing);
  background-color: var(--color-background-soft);
  box-shadow: 0 1px 5px #0000001f;
  border-radius: var(--small-spacing);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
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
.accordion-header-text {
  transition: var(--default-transition);
}
.p-accordionpanel-active .accordion-header-text {
  opacity: 0;
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
