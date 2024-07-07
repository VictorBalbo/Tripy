<script setup lang="ts">
import { AddIcon, ClockIcon, GlobeIcon, MarkerIcon, StarIcon, PhoneIcon } from '@/components/icons'
import { ButtonComponent } from '@/components'
</script>
<template>
  <h1>Title 1</h1>
  <h2>Title 2</h2>
  <h3>Title 3</h3>
  <h4>Title 4</h4>
  <p>Normal Text</p>
  <a href="google.com">Text with link</a>
  <div class="example">
    Background Color
    <div class="demo background-color"></div>
  </div>
  <div class="example">
    Heading Color
    <div class="demo heading-color"></div>
  </div>
  <div class="example">
    Sub Heading Color
    <div class="demo sub-heading-color"></div>
  </div>
  <div class="example">
    Font Color
    <div class="demo font-color"></div>
  </div>
  <div class="example">
    Primary Color
    <div class="demo primary-color"></div>
  </div>
  <div class="example">
    Primary Color Faded
    <div class="demo primary-color-faded"></div>
  </div>
  <div class="example">
    Primary Color Active
    <div class="demo primary-color-active"></div>
  </div>
  <div>Icons</div>
  <AddIcon class="icon" />
  <ClockIcon class="icon" />
  <GlobeIcon class="icon" />
  <MarkerIcon class="icon" />
  <PhoneIcon class="icon" />
  <StarIcon class="icon" />
  <div>Buttons</div>
  <ButtonComponent type="primary"> Button Primary</ButtonComponent>
  <ButtonComponent type="secondary"> Button Secondary</ButtonComponent>
</template>
<style scoped>
.example {
  display: flex;
  align-items: center;
  margin-top: 2.5px;
  margin-bottom: 2.5px;
}
.demo {
  height: 40px;
  width: 40px;
  border: 1px solid black;
  margin-left: 15px;
}
.background-color {
  background-color: var(--color-background);
}
.heading-color {
  background-color: var(--color-heading);
}
.sub-heading-color {
  background-color: var(--color-subheading);
}
.font-color {
  background-color: var(--color-text);
}
.primary-color {
  background-color: var(--color-primary);
}
.primary-color-faded {
  background-color: var(--color-primary-light);
}
.primary-color-active {
  background-color: var(--color-primary-dark);
}
.icon {
  width: 1.25rem;
}
</style>
