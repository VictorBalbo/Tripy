<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import { DividerComponent, InputNumber, TransportationCard } from '@/components'
import { AddIcon, BedIcon, MarkerIcon, MinusIcon, MoonIcon, TicketIcon } from '@/components/icons'
import dayjs from 'dayjs'
import type { Destination } from '@/models'

const tripStore = useTripStore()
const updateNights = (destination: Destination, nights: number) => {
  let change = 0
  let isNewEndDateInValid = false
  tripStore.destinations = tripStore.destinations?.map((d) => {
    if (d.key === destination.key) {
      const previousNights = dayjs(destination.endDate).diff(destination.startDate, 'days')
      change = nights - previousNights
      isNewEndDateInValid = dayjs(d.endDate).add(change, 'd').isBefore(dayjs(d.startDate), 'd')
      if (!isNewEndDateInValid) {
        d.endDate = dayjs(d.endDate).add(change, 'd').toString()
      }
    } else {
      if (!isNewEndDateInValid) {
        d.startDate = dayjs(d.startDate).add(change, 'd').toString()
        d.endDate = dayjs(d.endDate).add(change, 'd').toString()
      }
    }
    return d
  })
}
</script>
<template>
  <header class="header">
    {{ tripStore.name }}
  </header>
  <main class="body">
    <section class="header-section">
      <h3 class="destination title"><MarkerIcon class="icon" /> Destination</h3>
      <h3 class="nights title"><MoonIcon class="icon" /> Nights</h3>
      <h3 class="activities title"><TicketIcon class="icon" /> Activities</h3>
      <h3 class="housing title"><BedIcon class="icon" /> Housing</h3>
    </section>
    <DividerComponent />
    <section v-for="destination in tripStore.destinations" :key="destination.name">
      <section class="body-section">
        <article class="destination item">
          <h2 class="elipsis">{{ destination.name }}</h2>
          <p>
            {{ dayjs(destination.startDate).format('ddd DD/MM') }} -
            {{ dayjs(destination.endDate).format('ddd DD/MM') }}
          </p>
        </article>
        <InputNumber
          :modelValue="dayjs(destination.endDate).diff(destination.startDate, 'days')"
          @update:model-value="(e: number) => updateNights(destination, e)"
          :show-buttons="true"
          :button-layout="'horizontal'"
          class="nights item"
        >
          <template #decrementbuttonicon>
            <MinusIcon class="input-controls" />
          </template>
          <template #incrementbuttonicon>
            <AddIcon class="input-controls" />
          </template>
        </InputNumber>
        <article class="activities item">
          <p class="elipsis">{{ destination.activities?.length ?? 0 }}</p>
        </article>
        <article class="housing item elipsis">
          <p class="elipsis">{{ destination?.housing?.Name ?? '-' }}</p>
        </article>
      </section>
      <DividerComponent>
        <TransportationCard
          v-if="tripStore.transportations?.find((t) => t.origin === destination.key)?.type"
          :transport-type="
            tripStore.transportations.find((t) => t.origin === destination.key)!.type
          "
          class="transportation"
        />
      </DividerComponent>
    </section>
  </main>
</template>
<style scoped lang="scss">
.header {
  background-color: var(--color-background-soft);
  padding: var(--large-spacing);
  border-bottom: solid 1px var(--color-border);
}
.body {
  background-color: var(--color-background-soft);
  box-shadow: 0 1px 5px #0000001f;
  width: 100%;
  padding: var(--large-spacing);
}
.header-section {
  display: flex;
  flex-direction: row;
  text-align: center;
}
.title {
  padding: var(--large-spacing) var(--small-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  &.destination {
    justify-content: flex-start;
  }
}
.body-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}
.item {
  padding: var(--small-spacing);
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--default-transition);
}
.destination {
  width: 13rem;
  min-width: 11rem;
  text-align: start;
  &.item {
    flex-direction: column;
    align-items: flex-start;
  }
  &.item:hover {
    background: var(--color-primary-background);
    &.title {
      color: var(--color-primary);
    }
  }
  .icon {
    color: var(--color-primary);
  }
}
.nights {
  width: 7rem;
  display: flex;
  justify-content: center;
}
.activities {
  width: 8rem;
  &.item:hover {
    background: var(--color-yellow-background);
    &.title {
      color: var(--color-yellow);
    }
  }
  .icon {
    color: var(--color-yellow);
  }
}
.housing {
  width: 15rem;
  &.item:hover {
    background: var(--color-green-background);
    &.title {
      color: var(--color-green);
    }
  }
  .icon {
    color: var(--color-green);
  }
}
.input-controls {
  height: 1rem;
  width: 1rem;
}
.icon {
  height: 1rem;
  width: 1rem;
  margin-right: var(--small-spacing);
}
.elipsis {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.center {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transportation {
  // margin-bottom: var(--small-spacing);
}

@media (max-width: 720px) {
  .destination,
  .housing {
    flex-grow: 1;
    flex-shrink: 1;
  }
  .activities {
    display: none;
  }
}

@media (max-width: 470px) {
  .housing {
    display: none;
  }
}
</style>
