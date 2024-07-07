<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { GoogleMap, Marker, MarkerCluster } from 'vue3-google-map'
import { googleKey, googleMapId } from '@/constants'
import { useTripStore } from '@/stores/tripStore'
import { MapInfoWindow } from '@/components'

const tripStore = useTripStore()
const { activities, housing } = storeToRefs(tripStore)
const currentPlace = ref<string>()

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
    activities.value?.forEach((a) => bounds.extend(a.Coordinates))
    mapRef.value?.map.fitBounds(bounds)

    mapUnwatch()
  }
)

const openCustomInfoWindow = async (placeId?: string) => {
  currentPlace.value = placeId
}
</script>

<template>
  <div class="map-container">
    <GoogleMap ref="mapRef" class="map" :apiKey="googleKey" :zoom="15" :mapId="googleMapId">
      <MarkerCluster>
        <Marker
          v-for="marker in activities"
          :key="marker.Name"
          :options="{
            position: marker.Coordinates,
            title: marker.Name,
            animation: 2
          }"
          @click="() => openCustomInfoWindow(marker.PlaceId)"
        />
        <Marker
          v-for="marker in housing"
          :key="marker.Name"
          :options="{
            position: marker.Coordinates,
            title: marker.Name,
            animation: 2
          }"
        >
        </Marker>
      </MarkerCluster>
    </GoogleMap>
    <Transition>
      <MapInfoWindow
        v-if="currentPlace"
        :placeId="currentPlace"
        @close="() => (currentPlace = undefined)"
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
