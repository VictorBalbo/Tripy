<script setup lang="ts">
import { DividerComponent } from '@/components'
import { BusIcon, CarIcon, PlaneIcon, ShipIcon, TrainIcon } from '@/components/icons'
import { TransportTypes } from '@/models'
import { type Component } from 'vue'

defineProps<{
  transportType: TransportTypes
}>()
const types: Record<TransportTypes, Component> = {
  Bus: BusIcon,
  Car: CarIcon,
  Plane: PlaneIcon,
  Ship: ShipIcon,
  Train: TrainIcon
}
</script>
<template>
  <DividerComponent layout="vertical">
    <article class="transport-card">
      <component :is="types[transportType]" class="icon" />
      {{ transportType }}
    </article>
  </DividerComponent>
</template>

<style scoped>
.transport-card {
  width: 4rem;
  padding: var(--small-spacing);
  background-color: var(--color-red-dark);
  border: 1px solid var(--color-red);
  border-radius: var(--small-spacing);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color);
}
.icon {
  width: 1rem;
  height: 1rem;
}
</style>
