import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import FocusTrap from 'primevue/focustrap'
import '@/assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: true,
      darkModeSelector: '.dark-mode'
    }
  }
})
app.directive('focustrap', FocusTrap)

app.mount('#app')
