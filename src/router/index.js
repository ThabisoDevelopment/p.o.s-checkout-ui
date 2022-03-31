import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { notify } from "@kyvg/vue3-notification"

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "home" */ '@/components/Home.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "home" */ '@/components/checkout/Checkout.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "register" */ '@/components/auth/Register.vue')
  },
  {
    path: '/forgot/password',
    name: 'ForgotPassword',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "forgortpass" */ '@/components/auth/ForgotPassword.vue')
  },
  {
    path: '/reset/password',
    name: 'ResetPassword',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "resetpass" */ '@/components/auth/ResetPassword.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "admin" */ '@/components/home/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async(to, from, next) => {
	try {
		if (to.meta.auth) {
			await axios.post('/oauth/verify')
			next()
		}
		else next()
	} catch (error) {
		next({ name: 'Login' })
		notify({
			title: "User Authorization Error",
			text: error,
			type: 'error'
		})
	}
})

export default router
