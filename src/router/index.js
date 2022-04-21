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
    component: () => import('@/components/checkout/Checkout.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { auth: false },
    component: () => import('@/components/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: { auth: false },
    component: () => import('@/components/auth/Register.vue')
  },
  {
    path: '/forgot/password',
    name: 'ForgotPassword',
    meta: { auth: false },
    component: () => import('@/components/auth/ForgotPassword.vue')
  },
  {
    path: '/reset/password',
    name: 'ResetPassword',
    meta: { auth: false },
    component: () => import('@/components/auth/ResetPassword.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: { auth: true },
    component: () => import('@/components/home/index.vue')
  },
  {
    path: '/admin/orders',
    name: 'Orders',
    meta: { auth: true },
    component: () => import('@/components/orders/Orders.vue')
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    meta: { auth: true },
    component: () => import('@/components/reports/Reports.vue')
  },
  {
    path: '/admin/reports/sales',
    name: 'Sales',
    meta: { auth: true },
    component: () => import('@/components/reports/Sales.vue')
  },
  {
    path: '/admin/reports/sales/:id',
    name: 'ShowSale',
    meta: { auth: true },
    component: () => import('@/components/reports/ShowSale.vue')
  },
  {
    path: '/admin/products',
    name: 'Products',
    meta: { auth: true },
    component: () => import('@/components/products/Products.vue')
  },
  {
    path: '/admin/products/:id',
    name: 'ShowProduct',
    meta: { auth: true },
    component: () => import('@/components/products/Show.vue')
  },
  {
    path: '/admin/products/create',
    name: 'CreateProduct',
    meta: { auth: true },
    component: () => import('@/components/products/Create.vue')
  },
  {
    path: '/admin/products/count',
    name: 'CountProducts',
    meta: { auth: true },
    component: () => import('@/components/products/Count.vue')
  },
  {
    path: '/admin/promotions',
    name: 'Promotions',
    meta: { auth: true },
    component: () => import('@/components/promotions/Promotions.vue')
  },
  {
    path: '/admin/users',
    name: 'Users',
    meta: { auth: true },
    component: () => import('@/components/users/Users.vue')
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
