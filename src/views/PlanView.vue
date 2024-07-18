<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import { CardComponent, InputNumber } from '@/components'
import { AddIcon, BedIcon, MinusIcon, MoonIcon, TicketIcon } from '@/components/icons'
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
  <section class="body">
    <CardComponent
      v-for="destination in tripStore.destinations"
      :key="destination.name"
      class="destination-card"
    >
      <article class="name-field info-field">
        <h2 class="elipsis">
          {{ destination.name }}
        </h2>
        <p v-if="destination.startDate && destination.endDate" class="info-value">
          {{ dayjs(destination.startDate).format('ddd DD/MM') }} -
          {{ dayjs(destination.endDate).format('ddd DD/MM') }}
        </p>
      </article>
      <article class="nights-field info-field">
        <h4 class="center"><MoonIcon class="icon" />Nights</h4>
        <InputNumber
          :modelValue="dayjs(destination.endDate).diff(destination.startDate, 'days')"
          @update:model-value="(e: number) => updateNights(destination, e)"
          :show-buttons="true"
          :button-layout="'horizontal'"
          class="info-value center"
        >
          <template #decrementbuttonicon>
            <MinusIcon class="input-controls" />
          </template>
          <template #incrementbuttonicon>
            <AddIcon class="input-controls" />
          </template>
        </InputNumber>
      </article>
      <article class="activities-field info-field">
        <h4 class="center"><TicketIcon class="icon" />Activities</h4>
        <p class="center info-value">
          {{ destination.activities?.length ?? 0 }}
        </p>
      </article>
      <article class="housing-field info-field">
        <h4 class="center"><BedIcon class="icon" />Sleeping</h4>
        <div class="info-value">
          <p class="center elipsis">
            {{ destination?.housing?.Name ?? '-' }}
          </p>
        </div>
      </article>
    </CardComponent>
  </section>
</template>
<style scoped lang="scss">
.header {
  background-color: var(--color-background-soft);
  padding: var(--large-spacing);
  border-bottom: solid 1px var(--color-border);
}
.body {
  padding: var(--large-spacing);
  width: 100%;
}
.destination-card {
  width: 100%;
  background-color: var(--color-background-soft);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: var(--large-spacing);
}
.info-field {
  display: flex;
  flex-direction: column;
  padding: var(--large-spacing) var(--small-spacing);
  transition: var(--default-transition);
  &:first-child {
    padding-left: var(--large-spacing);
  }
  &:last-child {
    padding-right: var(--large-spacing);
  }
  .icon {
    width: 1rem;
    margin-right: var(--small-spacing);
  }
}
.info-value {
  display: flex;
  flex-grow: 1;
  align-items: center;
}
.elipsis {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name-field {
  width: 13rem;
  &:hover {
    background: var(--color-primary-background);
    h2 {
      color: var(--color-primary);
    }
  }
}
.nights-field {
  width: 7rem;
  .input-controls {
    width: 0.875rem;
  }
}
.housing-field {
  width: 15rem;
  &:hover {
    background-color: var(--color-green-background);
    h4 {
      color: var(--color-green);
    }
  }
}
.activities-field {
  width: 8rem;
  &:hover {
    background-color: var(--color-yellow-background);
    h4 {
      color: var(--color-yellow);
    }
  }
}
.icon {
  width: 0.75rem;
}
.center {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 720px) {
  .name-field,
  .housing-field {
    flex-grow: 1;
  }
  .activities-field {
    display: none;
  }
}

@media (max-width: 490px) {
  .housing-field {
    display: none;
  }
}
</style>
