<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'
import { googleKey, googleMapId } from '@/constants'
import { useTripStore } from '@/stores/tripStore'
import { MapInfoWindow } from '@/components'
import AutoComplete from 'primevue/autocomplete'
import { MapsService } from '@/services'
import { distanceBetweenPoints, type Coordinates } from '@/models/Coordinates'
import type { Location } from '@/models'

const tripStore = useTripStore()
const { activities, housing } = storeToRefs(tripStore)

const mapCenter = ref<Location>()
const currentPlace = ref<string>()
const openCustomInfoWindow = async (placeId?: string) => {
  if (currentPlace.value !== placeId) {
    mapCenter.value = undefined
    currentPlace.value = placeId
  }
}
const closeCustomInfoWindow = async () => {
  mapCenter.value = undefined
  currentPlace.value = undefined
}
const onLocationLoaded = async (location: Location) => {
  mapCenter.value = location
  const minZoom = 12
  if (mapRef.value?.map.zoom && mapRef.value?.map.zoom < minZoom) {
    mapRef.value.map.zoom = 13
  }
  mapRef.value?.map.panTo(location.coordinates)
}

const mapRef = ref<typeof GoogleMap | null>(null)
const mapUnwatch = watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) {
      return
    }

    mapRef.value?.map.addListener('click', (e: any) => {
      if (e.placeId) {
        openCustomInfoWindow(e.placeId)
        e.stop()
      }
    })

    // Set map boundries to fit all markers
    const latLngBounds = mapRef.value?.api.LatLngBounds
    const bounds = new latLngBounds()
    activities.value?.forEach((a) => bounds.extend(a.coordinates))
    housing.value?.forEach((a) => bounds.extend(a.Coordinates))
    mapRef.value?.api.event.addListenerOnce(mapRef.value?.map, 'bounds_changed', () =>
      mapRef.value?.map.setZoom(Math.min(mapRef.value?.map.getZoom(), 14))
    )
    mapRef.value?.map.fitBounds(bounds)

    mapUnwatch()
  }
)

const autocomplete = ref<string | Location>()
const isLoadingSuggestions = ref(false)
const suggestion = ref<Location[]>()
const searchLocation = async () => {
  try {
    isLoadingSuggestions.value = true
    if (!autocomplete.value) {
      return
    }
    const search =
      typeof autocomplete.value === 'string' ? autocomplete.value : autocomplete.value.name
    const center = mapRef.value?.map.getCenter()
    const centerCoordinates: Coordinates = { lat: center.lat(), lng: center.lng() }

    const northEast = mapRef.value?.map.getBounds().getNorthEast()
    const northEastCoordinates: Coordinates = { lat: northEast.lat(), lng: northEast.lng() }

    const radius = distanceBetweenPoints(centerCoordinates, northEastCoordinates)
    const locations = await MapsService.getAutocompletePlaceName(search, centerCoordinates, radius)
    suggestion.value = locations
  } finally {
    isLoadingSuggestions.value = false
  }
}
</script>

<template>
  <div class="map-container">
    <GoogleMap ref="mapRef" class="map" :apiKey="googleKey" :mapId="googleMapId">
      <MarkerCluster>
        <AdvancedMarker
          v-for="marker in activities"
          :key="marker.name"
          :animation="2"
          :options="{
            position: marker.coordinates,
            title: marker.name
          }"
          :pin-options="{ scale: marker.placeId === currentPlace ? 1.25 : 1 }"
          @click="() => openCustomInfoWindow(marker.placeId)"
        />
        <AdvancedMarker
          v-for="marker in housing"
          :key="marker.Name"
          :animation="2"
          :options="{
            position: marker.Coordinates,
            title: marker.Name
          }"
          :pin-options="{
            borderColor: '#1476ff',
            background: '#4995ff',
            glyphColor: '#005ee2',
            scale: 1
          }"
        />
        <AdvancedMarker
          v-if="mapCenter && !activities?.find((a) => a.placeId === currentPlace)"
          :options="{
            position: mapCenter?.coordinates,
            title: mapCenter?.name
          }"
          :pin-options="{
            borderColor: '#658c96',
            background: '#3e5871',
            glyphColor: '#1a252f',
            scale: 1.25
          }"
        />
      </MarkerCluster>
    </GoogleMap>
    <article class="auto-complete">
      <AutoComplete
        v-model="autocomplete"
        :suggestions="suggestion"
        option-label="name"
        :loading="isLoadingSuggestions"
        placeholder="Search for a place"
        dropdown
        fluid
        @complete="searchLocation"
        @option-select="(e) => openCustomInfoWindow(e.value.placeId)"
      />
    </article>
    <Transition>
      <MapInfoWindow
        v-if="currentPlace"
        :placeId="currentPlace"
        @close="closeCustomInfoWindow"
        @location-loaded="onLocationLoaded"
      />
    </Transition>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
}
.auto-complete {
  width: 100%;
  position: absolute;
  top: 0;
  padding: var(--large-spacing);
  display: flex;
  justify-content: center;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-2rem);
  opacity: 0;
}
</style>

<!-- Remove map border on focus -->
<style>
.gm-style div {
  border: none !important;
}
</style>
