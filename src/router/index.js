import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/timeOff',
      name: 'timeOff',
      component: () => import('../views/timeOff.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payroll',
      name: 'Payroll',
      component: () => import('../views/PayrollView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/management',
      name: 'management',
      component: () => import('../views/ManagementView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employee',
      name: 'employee',
      component: () => import('../views/employeeReview.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = auth.isAuthenticated() // Must return true/false

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Page requires login but user not logged in
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && isLoggedIn) {
    // Logged-in user tries to access login page
    next({ path: '/management' })
  } else {
    next()
  }
})

export default router

