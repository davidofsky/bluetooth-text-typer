import { createRouter, createWebHistory } from 'vue-router'
import TextTyperView from '../views/TextTyperView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TextTyper',
      component: TextTyperView,
    }
  ],
})

export default router
