<template>
  <div class="min-h-screen w-full overflow-x-hidden relative">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl" />
    <div class="max-w-[1440px] mx-auto">
      <div class="flex w-full gap-6 lg:gap-8">
        <!-- SideNavBar -->
        <div class="px-5 sm:px-8 lg:px-14 py-8">
          <DashboardSidebar />
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col overflow-y-auto pr-5 sm:pr-8 lg:pr-14 py-8 lg:py-10">
          <div class="mb-4">
            <h1 class="text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ $t('orders.title') }}
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              {{ $t('orders.totalOrders', { count: totalOrders }) }}
            </p>
          </div>

          <!-- Filters/Chips -->
          <div class="flex gap-2 flex-wrap mb-6">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="flex h-10 items-center justify-center rounded-full px-5 text-xs font-bold transition-all border"
              :class="
                activeFilter === filter.value
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              "
              type="button"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>

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
              class="flex size-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-50"
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <span class="text-sm font-bold text-zinc-900 dark:text-white">{{ $t('orders.page', { current: currentPage, total: totalPages }) }}</span>
            <button
              class="flex size-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <Teleport to="body">
            <div
              v-if="trackModalOrder"
              class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
              @click.self="trackModalOrder = null"
            >
              <div class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <h3 class="text-lg font-bold text-zinc-900 dark:text-white">{{ $t('common.track') }}</h3>
                  <button type="button" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full" @click="trackModalOrder = null">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div class="p-6 overflow-y-auto">
                  <template v-if="trackDetail && !trackLoading">
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">#{{ effectiveOrderNumber }}</p>
                    <p class="mt-1 font-bold text-zinc-800 dark:text-white">{{ trackStatusLabel(effectiveTrackStatus) }}</p>
                    <p v-if="effectiveTrackingNumber" class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      Mã vận đơn: {{ effectiveTrackingNumber }}
                    </p>
                    <p v-if="trackDetail.estimated_delivery_date" class="text-sm text-primary mt-1">
                      {{ $t('dashboard.estArrival', { date: formatTrackDate(trackDetail.estimated_delivery_date) }) }}
                    </p>

                    <div class="mt-5">
                      <div class="flex items-center justify-between mb-1.5">
                        <p class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{{ $t('orders.deliveryStatus') }}</p>
                        <p class="text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">{{ trackProgress }}%</p>
                      </div>
                      <div class="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div class="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500" :style="{ width: `${trackProgress}%` }" />
                      </div>
                      <div class="mt-3 flex w-full">
                        <div
                          v-for="(step, idx) in trackSteps"
                          :key="step.key"
                          class="flex min-w-0 flex-1 flex-col items-center"
                        >
                          <div
                            class="size-4 shrink-0 rounded-full"
                            :class="idx <= trackStepIndex ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'"
                          />
                          <p class="mt-1.5 w-full px-0.5 text-center text-[10px] leading-tight text-zinc-500 dark:text-zinc-400">
                            {{ step.label }}
                          </p>
                        </div>
                      </div>
                    </div>

                  </template>
                  <div v-else class="flex items-center justify-center py-8">
                    <span class="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                  </div>
                </div>
              </div>
            </div>
          </Teleport>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/composables/usePageLoading'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import OrderCard from '../components/features/dashboard/OrderCard.vue'
import { getOrders, mapOrderToCard, getOrderTrack, getOrderStatusKey, getOrderProgress, normalizeOrderStatus, cancelOrder } from '@/services/profileService'
import productService from '@/services/productService.js'
import { useCart } from '@/composables/useCart'
import { useNotification } from '@/composables/useNotification'
import { get, CACHE_KEYS } from '@/utils/cache'
import { invalidateOrders } from '@/utils/cache'

const { t } = useI18n()
const { setLoading } = usePageLoading()
const router = useRouter()
const cart = useCart()
const { showNotification } = useNotification()
const activeFilter = ref('all')
const currentPage = ref(1)
const perPage = 10
const orders = ref([])
const meta = ref({ total: 0, current_page: 1, last_page: 1 })
const isLoading = ref(true)
const trackModalOrder = ref(null)
const trackDetail = ref(null)
const trackLoading = ref(false)
const effectiveTrackStatus = computed(() =>
  trackDetail.value?.status || trackModalOrder.value?.status || 'pending'
)
const normalizedTrackStatus = computed(() => normalizeOrderStatus(effectiveTrackStatus.value))
const effectiveOrderNumber = computed(() =>
  trackDetail.value?.order_number || trackModalOrder.value?.orderNumber || '—'
)
const effectiveTrackingNumber = computed(() =>
  trackDetail.value?.tracking_number || trackModalOrder.value?.tracking_number || null
)
const trackPollingMs = 12000
let trackPollTimer = null

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
  const s = normalizeOrderStatus(order.status || '')
  if (s === 'shipped') return order.estimatedArrival ? t('orders.expectedBy', { date: order.estimatedArrival }) : t('orders.estimatedShipping', { date: '—' })
  if (s === 'delivered') return t('orders.arrivedOn', { date: order.estimatedArrival || '—' })
  if (s === 'processing' || s === 'confirmed') return t('orders.estimatedShipping', { date: order.estimatedArrival || '—' })
  return ''
}

/** Build actions theo status (giống mock) */
function buildActions(order) {
  const s = normalizeOrderStatus(order.status || '')
  const actions = []
  if (s === 'shipped') {
    actions.push({ type: 'track', label: t('common.track'), icon: 'local_shipping', classes: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' })
  }
  if (s === 'delivered') {
    actions.push({ type: 'buy-again', label: t('common.buyAgain'), icon: 'rebase_edit', classes: 'border border-primary text-primary hover:bg-primary/5' })
  }
  if (s === 'pending') {
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

const trackSteps = computed(() => [
  { key: 'pending', label: t('dashboard.orderStatusPending') },
  { key: 'confirmed', label: t('dashboard.orderStatusConfirmed') },
  { key: 'processing', label: t('dashboard.orderStatusProcessing') },
  { key: 'shipped', label: t('dashboard.orderStatusShipped') },
  { key: 'delivered', label: t('dashboard.orderStatusDelivered') },
])

const trackProgress = computed(() => getOrderProgress(normalizedTrackStatus.value))

const trackStepIndex = computed(() => {
  const status = normalizedTrackStatus.value
  const idx = trackSteps.value.findIndex((s) => s.key === status)
  return idx < 0 ? 0 : idx
})

function trackStatusLabel(status) {
  const key = getOrderStatusKey(status || '')
  return t(`dashboard.${key}`)
}

function formatTrackDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Hôm nay'
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isSignedUrlExpired(url) {
  if (!url || typeof url !== 'string') return true
  try {
    const u = new URL(url)
    const amzDate = u.searchParams.get('X-Amz-Date')
    const expiresSec = Number(u.searchParams.get('X-Amz-Expires') || '0')
    if (!amzDate || !expiresSec) return false
    const m = amzDate.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
    if (!m) return false
    const issuedAt = Date.UTC(
      Number(m[1]),
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4]),
      Number(m[5]),
      Number(m[6])
    )
    const expireAt = issuedAt + expiresSec * 1000
    return Date.now() > expireAt
  } catch {
    return false
  }
}

function extractImageFromProductResponse(p) {
  if (!p || typeof p !== 'object') return ''
  if (typeof p.primary_image === 'string' && p.primary_image.trim()) return p.primary_image
  if (Array.isArray(p.images) && p.images.length) {
    const primary = p.images.find((img) => img && (img.is_primary === true || img.is_primary === 1)) || p.images[0]
    if (primary) {
      if (typeof primary.image_url === 'string' && primary.image_url.trim()) return primary.image_url
      if (typeof primary.url === 'string' && primary.url.trim()) return primary.url
    }
  }
  if (typeof p.image_url === 'string' && p.image_url.trim()) return p.image_url
  if (typeof p.image === 'string' && p.image.trim()) return p.image
  return ''
}

async function hydrateExpiredOrderImages() {
  const candidates = orders.value.filter((o) => o?.productId && (!o.image || isSignedUrlExpired(o.image)))
  if (!candidates.length) return

  const updates = await Promise.all(
    candidates.map(async (o) => {
      try {
        const p = await productService.getProductById(o.productId)
        const refreshed = extractImageFromProductResponse(p)
        return { id: o.id, image: refreshed || o.image }
      } catch {
        return { id: o.id, image: o.image }
      }
    })
  )

  if (!updates.length) return
  const imageById = new Map(updates.map((u) => [String(u.id), u.image]))
  orders.value = orders.value.map((o) => {
    const nextImage = imageById.get(String(o.id))
    return nextImage ? { ...o, image: nextImage } : o
  })
}

function getOrdersCacheKey(p) {
  return `${CACHE_KEYS.ORDERS}_p${p ?? 1}_pp${perPage}`
}

async function loadOrders(page = 1) {
  // Dùng cache trước - chuyển tab Đơn hàng không gọi API lại
  const cacheKey = getOrdersCacheKey(page)
  const cached = get(cacheKey)
  if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
    const pagination = cached.meta ?? {}
    orders.value = (cached.data ?? []).map(mapOrderToCard)
    meta.value = {
      total: pagination.total ?? cached.data.length,
      current_page: pagination.current_page ?? page,
      last_page: pagination.last_page ?? 1,
    }
    currentPage.value = meta.value.current_page
    hydrateExpiredOrderImages()
    isLoading.value = false
    return
  }

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
    hydrateExpiredOrderImages()
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

function extractOrderItemsForBuyAgain(order) {
  const raw = order?.raw ?? {}
  if (Array.isArray(raw.items)) return raw.items
  if (Array.isArray(raw.order_items)) return raw.order_items
  if (Array.isArray(raw.lines)) return raw.lines
  return []
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function addOrderToCart(order) {
  const items = extractOrderItemsForBuyAgain(order)
  if (!items.length) return 0
  let addedLines = 0

  for (const item of items) {
    const productId = item?.product_id ?? item?.product?.id
    if (!productId) continue

    const quantity = Math.max(1, toNumber(item?.quantity, 1))
    const unitPrice = item?.unit_price ?? item?.price ?? item?.product?.price ?? 0
    const lensId = item?.lens_id ?? item?.lens?.id ?? null
    const lensName = item?.lens_name ?? item?.lens?.name ?? '—'
    const productName = item?.product_name ?? item?.product?.name ?? 'Sản phẩm'
    const image = item?.product_image_url ?? item?.image_url ?? item?.product?.image_url ?? item?.product?.image ?? order?.image ?? ''
    const colorName = item?.color_name ?? item?.color?.name ?? '—'
    const colorHex = item?.color_hex ?? item?.color?.hex_code ?? null

    for (let i = 0; i < quantity; i += 1) {
      cart.addItem({
        productId,
        name: productName,
        price: unitPrice,
        image,
        lensId,
        lensName,
        color: colorName,
        colorHex,
      })
    }
    addedLines += 1
  }
  return addedLines
}

function openTrackModal(order) {
  if (!order?.id) return
  trackModalOrder.value = order
  trackDetail.value = null
  trackLoading.value = true
  getOrderTrack(order.id)
    .then((data) => {
      trackDetail.value = data
    })
    .catch(() => {
      trackDetail.value = { order_number: order.orderNumber, status: order.status, status_history: [] }
    })
    .finally(() => {
      trackLoading.value = false
    })
}

function stopTrackPolling() {
  if (trackPollTimer) {
    clearInterval(trackPollTimer)
    trackPollTimer = null
  }
}

function startTrackPolling() {
  stopTrackPolling()
  const orderId = trackModalOrder.value?.id
  if (!orderId) return
  trackPollTimer = setInterval(async () => {
    if (!trackModalOrder.value?.id) return
    try {
      const data = await getOrderTrack(orderId)
      trackDetail.value = data
    } catch {
      // ignore polling errors to avoid interrupting UI
    }
  }, trackPollingMs)
}

watch(trackModalOrder, (v) => {
  if (!v) {
    trackDetail.value = null
    trackLoading.value = false
    stopTrackPolling()
    return
  }
  startTrackPolling()
})

onUnmounted(() => {
  stopTrackPolling()
})

onMounted(() => loadOrders(1))

const handleOrderAction = ({ type, order }) => {
  if (type === 'track') {
    openTrackModal(order)
    return
  }
  if (type === 'details') {
    showNotification({
      message: t('orders.detailsSoon', 'Tính năng chi tiết đơn sẽ sớm có'),
      type: 'info',
      duration: 2200,
    })
    return
  }
  if (type === 'buy-again') {
    const added = addOrderToCart(order)
    if (added > 0) {
      showNotification({
        message: t('orders.buyAgainAdded', 'Đã thêm sản phẩm từ đơn vào giỏ hàng'),
        type: 'success',
        duration: 2500,
      })
      router.push('/cart')
    } else {
      showNotification({
        message: t('orders.buyAgainFailed', 'Không tìm thấy sản phẩm để mua lại'),
        type: 'error',
        duration: 3000,
      })
    }
    return
  }
  if (type === 'cancel') {
    if (!order?.id) return
    if (!window.confirm(t('orders.confirmCancel', 'Bạn có chắc muốn hủy đơn hàng này?'))) return
    cancelOrder(order.id)
      .then(async () => {
        invalidateOrders()
        await loadOrders(currentPage.value)
        showNotification({
          message: t('orders.cancelSuccess', 'Đã hủy đơn hàng'),
          type: 'success',
          duration: 2800,
        })
      })
      .catch((err) => {
        let message = err?.message || t('orders.cancelFailed', 'Không thể hủy đơn hàng')
        if (err?.status === 403) {
          message = t('orders.cancelForbidden', 'Bạn chỉ có thể hủy đơn của chính mình')
        } else if (err?.status === 422) {
          message = t('orders.cancelOnlyPending', 'Chỉ có thể hủy đơn ở trạng thái chờ xử lý')
        }
        showNotification({
          message,
          type: 'error',
          duration: 3600,
        })
      })
  }
}
</script>
