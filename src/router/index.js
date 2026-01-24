import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/dashboard/orders',
    name: 'Orders',
    component: () => import('../views/OrdersView.vue')
  },
  {
    path: '/dashboard/settings',
    name: 'ProfileSettings',
    component: () => import('../views/ProfileSettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
