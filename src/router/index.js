import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/components/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/components/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '@/components/auth/Register.vue')
  },
  {
    path: '/forgot/password',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "forgortpass" */ '@/components/auth/ForgotPassword.vue')
  },
  {
    path: '/reset/password',
    name: 'ResetPassword',
    component: () => import(/* webpackChunkName: "resetpass" */ '@/components/auth/ResetPassword.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
