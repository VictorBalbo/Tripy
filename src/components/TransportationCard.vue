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
  <article class="transport-card">
    <component :is="types[transportType]" class="icon" />
    <h2 class="transport-type">{{ transportType }}</h2>
  </article>
</template>

<style scoped lang="scss">
.transport-card {
  width: fit-content;
  background-color: var(--color-background-soft);
  padding: var(--small-spacing);
  border-radius: var(--small-spacing);
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--color-red);
  transition: var(--default-transition);
  &:hover {
    background-color: var(--color-red-background);
    // border: 1px solid var(--color-red);
  }
}
.icon {
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
}
.transport-type {
  color: var(--color-red);
}
</style>
