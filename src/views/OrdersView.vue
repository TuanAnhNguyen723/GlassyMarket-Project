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
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">{{ $t('orders.totalOrders', { count: totalOrders }) }}</p>

          <!-- Loading -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredOrders.length === 0" class="text-center py-12 text-slate-500 dark:text-slate-400">
            <span class="material-symbols-outlined text-5xl mb-4">package_2</span>
            <p>{{ $t('dashboard.noRecentOrder') }}</p>
          </div>

          <!-- Order Cards List -->
          <div v-else class="flex flex-col gap-4 mb-6">
            <OrderCard
              v-for="order in orderCards"
              :key="order.id"
              :order="order"
              @action="handleOrderAction"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 py-6">
            <button
              class="flex size-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50"
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $t('orders.page', { current: currentPage, total: totalPages }) }}</span>
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
import { getOrders, mapOrderToCard } from '@/services/profileService'

const { t } = useI18n()
const { setLoading } = usePageLoading()
const activeFilter = ref('all')
const currentPage = ref(1)
const perPage = 10
const orders = ref([])
const meta = ref({ total: 0, current_page: 1, last_page: 1 })
const isLoading = ref(true)

const filters = computed(() => [
  { label: t('orders.allOrders'), value: 'all' },
  { label: t('orders.ongoing'), value: 'ongoing' },
  { label: t('orders.delivered'), value: 'delivered' },
  { label: t('orders.cancelled'), value: 'cancelled' },
])

const totalOrders = computed(() => meta.value.total ?? orders.value.length)

const totalPages = computed(() => Math.max(1, meta.value.last_page ?? 1))

/** Build status message for card display */
function getStatusMessage(order) {
  const s = (order.status || '').toLowerCase()
  if (s === 'shipped') return order.estimatedArrival ? t('orders.expectedBy', { date: order.estimatedArrival }) : t('orders.estimatedShipping', { date: '—' })
  if (s === 'delivered') return t('orders.arrivedOn', { date: order.estimatedArrival || '—' })
  if (s === 'processing' || s === 'confirmed') return t('orders.estimatedShipping', { date: order.estimatedArrival || '—' })
  return ''
}

/** Build actions theo status (giống mock) */
function buildActions(order) {
  const s = (order.status || '').toLowerCase()
  const actions = []
  if (s === 'shipped') {
    actions.push({ type: 'track', label: t('common.track'), icon: 'local_shipping', classes: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' })
  }
  if (s === 'delivered') {
    actions.push({ type: 'buy-again', label: t('common.buyAgain'), icon: 'rebase_edit', classes: 'border border-primary text-primary hover:bg-primary/5' })
  }
  if (s === 'processing' || s === 'confirmed') {
    actions.push({ type: 'cancel', label: t('common.cancelOrder'), icon: null, classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800' })
  }
  actions.push({ type: 'details', label: t('common.details'), icon: null, classes: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800' })
  return actions
}

/** Format total (VND) */
function formatTotal(value) {
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, '')) || 0
  return num.toLocaleString('vi-VN') + ' đ'
}

const filteredOrders = computed(() => {
  const list = orders.value
  if (activeFilter.value === 'all') return list
  if (activeFilter.value === 'ongoing') {
    return list.filter((o) => ['confirmed', 'processing', 'shipped'].includes((o.status || '').toLowerCase()))
  }
  if (activeFilter.value === 'delivered') return list.filter((o) => (o.status || '').toLowerCase() === 'delivered')
  if (activeFilter.value === 'cancelled') return list.filter((o) => (o.status || '').toLowerCase() === 'cancelled')
  return list
})

/** Order card shape for OrderCard component */
const orderCards = computed(() =>
  filteredOrders.value.map((order) => ({
    ...order,
    statusMessage: getStatusMessage(order),
    orderDate: order.orderDate,
    totalFormatted: formatTotal(order.total),
    actions: buildActions(order),
  }))
)

async function loadOrders(page = 1) {
  setLoading(true)
  isLoading.value = true
  try {
    const res = await getOrders({ page, per_page: perPage })
    const data = res.data ?? []
    const pagination = res.meta ?? {}
    orders.value = data.map(mapOrderToCard)
    meta.value = {
      total: pagination.total ?? data.length,
      current_page: pagination.current_page ?? page,
      last_page: pagination.last_page ?? 1,
    }
    currentPage.value = meta.value.current_page
  } catch {
    orders.value = []
    meta.value = { total: 0, current_page: 1, last_page: 1 }
  } finally {
    setLoading(false)
    isLoading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadOrders(page)
}

onMounted(() => loadOrders(1))

const handleOrderAction = ({ type, order }) => {
  if (type === 'track') {
    // Có thể mở modal track hoặc navigate
    return
  }
  if (type === 'details') {
    // Sau này: trang chi tiết đơn GET /api/v1/orders/{id}
    return
  }
  if (type === 'buy-again' || type === 'cancel') {
    // TODO: buy-again thêm vào giỏ; cancel gọi API hủy đơn
  }
}
</script>
