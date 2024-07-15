<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import { CardComponent, InputNumber } from '@/components'
import { AddIcon, MinusIcon } from '@/components/icons'
import dayjs from 'dayjs'
import { computed, setDevtoolsHook } from 'vue'
import type { Destination } from '@/models'

const tripStore = useTripStore()
const updateNights = (destination: Destination, nights: number) => {
  tripStore.destinations = tripStore.destinations?.map((d) => {
    let change = 0
    let isNewEndDateInValid = false
    if (d.key === destination.key) {
      const previousNights = dayjs(destination.endDate).diff(destination.startDate, 'days')
      change = nights - previousNights
      isNewEndDateInValid = dayjs(d.endDate).add(change, 'd').isBefore(dayjs(d.startDate), 'd')
      if (!isNewEndDateInValid) {
        d.endDate = dayjs(d.endDate).add(change, 'd').toString()
      }
    }
    if (!isNewEndDateInValid && d.key > destination.key) {
      d.startDate = dayjs(d.startDate).add(change, 'd').toString()
      d.endDate = dayjs(d.endDate).add(change, 'd').toString()
    }
    return d
  })
}
</script>
<template>
  <header class="header">
    {{ tripStore.name }}
  </header>
  <body class="body">
    <section>
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
            {{ dayjs(destination.startDate).format('DD MMM') }} -
            {{ dayjs(destination.endDate).format('DD MMM') }}
          </p>
        </article>
        <article class="nights-field info-field">
          <h2 class="center">Nights</h2>
          <InputNumber
            :modelValue="dayjs(destination.endDate).diff(destination.startDate, 'days')"
            @update:model-value="(e: number) => updateNights(destination, e)"
            :show-buttons="true"
            :button-layout="'horizontal'"
            class="info-value center"
          >
            <template #decrementbuttonicon>
              <MinusIcon class="icon" />
            </template>
            <template #incrementbuttonicon>
              <AddIcon class="icon" />
            </template>
          </InputNumber>
        </article>
        <article class="housing-field info-field">
          <h2 class="center">Sleeping</h2>
          <div class="info-value">
            <p class="center elipsis">
              {{ destination?.housing?.Name ?? '-' }}
            </p>
          </div>
        </article>
        <article class="activities-field info-field">
          <h2 class="center">Activities</h2>
          <p class="center info-value">
            {{ destination.activities?.length ?? 0 }}
          </p>
        </article>
      </CardComponent>
    </section>
  </body>
</template>
<style scoped>
.header {
  background-color: var(--color-background-soft);
  padding: var(--large-spacing);
  border-bottom: solid 1px var(--color-border);
}
.body {
  padding: var(--large-spacing);
}
.destination-card {
  background-color: var(--color-background-soft);
  padding: var(--large-spacing);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: var(--large-spacing);
}
.info-field {
  display: flex;
  flex-direction: column;
  padding: 0 var(--small-spacing);
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
}
.nights-field {
  width: 8rem;
}
.housing-field {
  width: 13rem;
}
.activities-field {
  width: 6rem;
}
.icon {
  width: 1rem;
}
.center {
  text-align: center;
  justify-content: center;
}
</style>
