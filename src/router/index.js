import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: HomeView,
    },
    {
      path: '/timeOff',
      name: 'timeOff',
     
      component: () => import('../views/timeOff.vue'),
    },
    {
      path: '/payroll',
      name: 'Payroll',
      component: () => import('../views/Payroll.vue'),
    },
    {
      path: '/management',
      name: 'management',
      component: () => import('../views/ManagementView.vue'),

    }
  ],
})

export default router
