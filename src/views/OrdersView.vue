<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <div class="max-w-[1440px] mx-auto">
      <div class="flex w-full gap-8">
        <!-- SideNavBar -->
        <div class="px-6 lg:px-20">
          <DashboardSidebar />
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col overflow-y-auto px-6 py-10">
          <!-- Heading -->
          <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div class="flex flex-col gap-1">
              <h1 class="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">{{ $t('orders.title') }}</h1>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $t('orders.totalOrders', { count: totalOrders }) }}</p>
            </div>
          </div>

          <!-- Filters/Chips -->
          <div class="flex gap-2 flex-wrap mb-6">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="flex h-9 items-center justify-center rounded-full px-5 text-xs font-bold transition-all"
              :class="
                activeFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              "
              type="button"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>

          <!-- Order Cards List -->
          <div class="flex flex-col gap-4 mb-6">
            <OrderCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @action="handleOrderAction"
            />
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-4 py-6">
            <button
              class="flex size-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50"
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <span class="text-sm font-bold text-slate-900 dark:text-white">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              class="flex size-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/composables/usePageLoading'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import OrderCard from '../components/features/dashboard/OrderCard.vue'

const { setLoading } = usePageLoading()
const activeFilter = ref('All Orders')
const currentPage = ref(1)
const totalPages = ref(3)

onMounted(async () => {
  // Simulate loading data
  setLoading(true)
  // In a real app, you would fetch orders here
  await new Promise((resolve) => setTimeout(resolve, 300))
  setLoading(false)
})

const { t } = useI18n()

const filters = computed(() => [
  { label: t('orders.allOrders'), value: 'All Orders' },
  { label: t('orders.ongoing'), value: 'Ongoing' },
  { label: t('orders.delivered'), value: 'Delivered' },
  { label: t('orders.cancelled'), value: 'Cancelled' },
])

const orders = ref([
  {
    id: 'eye-90210',
    orderNumber: 'Order #EYE-90210',
    productName: 'Modern black frame eyewear',
    status: 'Shipped',
    statusMessage: 'Expected by Oct 18',
    orderDate: 'Oct 12, 2023',
    total: '129.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPj0J4hXqID5rsCyHIkNXckeUELda4LRYh9fFpG04H5X7UMD5IYtod1PMGtF0yfeZ_EM-x7J7iJ8EQQ5usr9VkrsTmOUdKYqQGI4K7epIimyuopiNscD1axqxCyfsUD3fS4fiVELXGZhQv5tHAFDfyplku407KbXBchSqiC8z_Me_c2K89BGaDWQAKf2vntYNjm6WdW8AFNV6032F_QFlPFhjOniOxMUqXF1vRzwy3wxDCJmYbG_sNRKB-W_E1lOSJm46iwPyB65Rd',
    actions: [
      {
        type: 'track',
        label: 'Track Shipment',
        icon: 'local_shipping',
        classes: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90',
      },
      {
        type: 'details',
        label: 'Details',
        icon: null,
        classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
      },
    ],
  },
  {
    id: 'eye-88432',
    orderNumber: 'Order #EYE-88432',
    productName: 'Classic tortoise shell glasses',
    status: 'Delivered',
    statusMessage: 'Arrived on Sep 24',
    orderDate: 'Sep 18, 2023',
    total: '210.50',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCH5M1Oj5Jsmq1q03NEp-AEYhYSR5R1TKEeYVV08IqwmOaFqwzRAd7s3nd9xeprO-KDD-mtwIwXedaLLr6dUHWmPcz3cNf_RTnj2VVHJ3XouMPADm7sAgjYKM8huCq_bQmUdASVx8ZZue7f6660fUFLP3_ynPv8xsSjdmlrFE5gcIGg3G5D0w3LZgyH039XVWj3QzCfoj2izEVrvBrGMn4vEOjfNwQzWyKwhLOHrJfKLx_MnY6827fyNmQ5TUS36EyzOce5UsembFN4',
    actions: [
      {
        type: 'buy-again',
        label: 'Buy Again',
        icon: 'rebase_edit',
        classes: 'border border-primary text-primary hover:bg-primary/5',
      },
      {
        type: 'details',
        label: 'Details',
        icon: null,
        classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
      },
    ],
  },
  {
    id: 'eye-91105',
    orderNumber: 'Order #EYE-91105',
    productName: 'Gold rimmed circular frames',
    status: 'Processing',
    statusMessage: 'Estimated shipping: Tomorrow',
    orderDate: 'Oct 14, 2023',
    total: '185.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeYiYRsUOvFt14Cyo94KjZUnFivGqohTDErNp3y1foJkHW4PHFugQtQKlzHIIIb72N7gOvv9fJSpv3gIuat06X-dHt_n9HaIYLedvXJ8_obwFyObLrGex6UuSCl9QfoR5yau6bmKmxLGIBzK8HCdlvgntMGGcB5ABxM84a759JyrKzeWqyD9ABD9QE3sPfRNWIg7m1O1yeUFWJHeWXOxehIgCHdVQQat1kJI67IFe5yPP57iDH6yS-2IeOGQPsvq6YA6m0qV7O96MS',
    actions: [
      {
        type: 'cancel',
        label: 'Cancel Order',
        icon: null,
        classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
      },
      {
        type: 'details',
        label: 'Details',
        icon: null,
        classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
      },
    ],
  },
])

const totalOrders = computed(() => orders.value.length)

const filteredOrders = computed(() => {
  if (activeFilter.value === 'All Orders') {
    return orders.value
  }
  if (activeFilter.value === 'Ongoing') {
    return orders.value.filter((order) => order.status === 'Shipped' || order.status === 'Processing')
  }
  return orders.value.filter((order) => order.status === activeFilter.value)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // In a real app, you would fetch orders for the new page here
  }
}

const handleOrderAction = ({ type, order }) => {
  console.log('Order action:', type, order)
  // Handle different action types: track, details, buy-again, cancel
}
</script>
