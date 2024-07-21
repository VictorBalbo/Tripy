import { createRouter, createWebHistory } from 'vue-router'
import PlanView from '@/views/PlanView.vue'
import PlanListView from '@/views/PlanListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'Plan' } },
    {
      path: '/plan',
      name: 'Plan',
      component: PlanView
    },
    {
      path: '/planlist',
      name: 'PlanList',
      component: PlanListView
    }
  ]
})

export default router
