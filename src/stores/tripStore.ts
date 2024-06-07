import type { Activity, Housing, Trip } from '@/models'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mockTripData } from '@/constants'

export const useTripStore = defineStore('trip', () => {
  const trip = ref<Trip>()
  /// TODO: Remove this mock data
  trip.value = JSON.parse(mockTripData)

  const activities = computed(() =>
    trip.value?.Destinations.filter((d) => d.Activities.length).reduce<Activity[]>(
      (acc, d) => acc.concat(d.Activities),
      []
    )
  )
  const housing = computed(() =>
    trip.value?.Destinations.filter((d) => d.Housing).reduce<Housing[]>(
      (acc, d) => [...acc, d.Housing!],
      []
    )
  )

  return {
    name: trip.value?.Name,
    destinations: trip.value?.Destinations,
    activities,
    housing
  }
})
