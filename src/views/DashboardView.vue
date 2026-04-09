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

      <!-- Profile header (GET /api/v1/profile) -->
      <section class="mb-8">
        <ProfileHeaderCard :user="profile || {}" />
      </section>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <!-- Recent Order Card (GET /api/v1/orders?per_page=5) -->
        <RecentOrderCard :order="recentOrder" @track="openTrackModal" />
      </div>

      <!-- Modal theo dõi đơn (GET /api/v1/orders/{id}/track) -->
      <Teleport to="body">
        <div
          v-if="trackModalOrder"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          @click.self="closeTrackModal"
        >
          <div class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 class="text-lg font-bold text-zinc-900 dark:text-white">{{ $t('common.track') }}</h3>
              <button type="button" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full" @click="closeTrackModal">
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

      <!-- Footer Section -->
      <footer
        class="mt-12 py-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-6"
      >
        <div class="flex gap-8">
          <div class="flex flex-col gap-1">
            <p class="text-zinc-900 dark:text-white text-sm font-bold">{{ $t('dashboard.needHelp') }}</p>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs">{{ $t('dashboard.helpAvailable') }}</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined">chat</span>
            </button>
            <button
              class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined">call</span>
            </button>
          </div>
        </div>
        <div class="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-6 py-4 rounded-2xl flex items-center gap-4">
          <span class="material-symbols-outlined text-zinc-900 dark:text-zinc-100">local_library</span>
          <div>
            <p class="text-xs font-bold text-zinc-800 dark:text-white">{{ $t('dashboard.learnPrescription') }}</p>
            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('dashboard.learnPrescriptionDesc') }}</p>
          </div>
          <span class="material-symbols-outlined text-zinc-400 text-sm">arrow_forward_ios</span>
        </div>
      </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoading } from '@/composables/usePageLoading'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import ProfileHeaderCard from '../components/features/dashboard/ProfileHeaderCard.vue'
import RecentOrderCard from '../components/features/dashboard/RecentOrderCard.vue'
import {
  getProfile,
  getOrders,
  getOrderTrack,
  mapOrderToCard,
  getOrderStatusKey,
  getOrderProgress,
  normalizeOrderStatus,
} from '@/services/profileService'
import { useAuth } from '@/composables/useAuth'
import { get, CACHE_KEYS } from '@/utils/cache'

const { t } = useI18n()
const { setLoading } = usePageLoading()
const { user: authUser } = useAuth()

const profile = ref(null)
const recentOrder = ref(null)
const trackModalOrder = ref(null)
const trackDetail = ref(null)
const trackLoading = ref(false)
const trackPollingMs = 12000
let trackPollTimer = null

const trackSteps = computed(() => [
  { key: 'pending', label: t('dashboard.orderStatusPending') },
  { key: 'confirmed', label: t('dashboard.orderStatusConfirmed') },
  { key: 'processing', label: t('dashboard.orderStatusProcessing') },
  { key: 'shipped', label: t('dashboard.orderStatusShipped') },
  { key: 'delivered', label: t('dashboard.orderStatusDelivered') },
])

const effectiveTrackStatus = computed(() =>
  trackDetail.value?.status || trackModalOrder.value?.status || 'pending'
)
const normalizedTrackStatus = computed(() => normalizeOrderStatus(effectiveTrackStatus.value))
const trackProgress = computed(() => getOrderProgress(normalizedTrackStatus.value))
const effectiveOrderNumber = computed(() =>
  trackDetail.value?.order_number || trackModalOrder.value?.orderNumber || '—'
)
const effectiveTrackingNumber = computed(() =>
  trackDetail.value?.tracking_number || trackModalOrder.value?.tracking_number || null
)

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

function loadProfileInBackground() {
  const cached = get(CACHE_KEYS.PROFILE)
  if (cached && typeof cached === 'object') {
    profile.value = {
      name: cached.name,
      email: cached.email,
      avatar: cached.avatar || '',
      is_premium: !!cached.is_premium,
      phone: cached.phone,
      date_of_birth: cached.date_of_birth,
      gender: cached.gender,
    }
  }
  getProfile()
    .then((data) => {
      profile.value = {
        name: data.name,
        email: data.email,
        avatar: data.avatar || '',
        is_premium: !!data.is_premium,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
      }
    })
    .catch(() => {
      if (!profile.value?.name) profile.value = { name: '', email: '', avatar: '', is_premium: false }
    })
}

async function loadOrders() {
  try {
    const res = await getOrders({ per_page: 5 })
    const list = res.data || []
    recentOrder.value = list.length ? mapOrderToCard(list[0]) : null
  } catch {
    recentOrder.value = null
  }
}

async function fetchTrack(orderId, { silent = false } = {}) {
  if (!orderId) return
  if (!silent) trackLoading.value = true
  try {
    const data = await getOrderTrack(orderId)
    trackDetail.value = data
  } catch {
    if (!trackDetail.value) {
      trackDetail.value = {
        order_number: trackModalOrder.value?.orderNumber ?? '',
        status: trackModalOrder.value?.status ?? 'pending',
        status_history: [],
      }
    }
  } finally {
    if (!silent) trackLoading.value = false
  }
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
  trackPollTimer = setInterval(() => {
    if (!trackModalOrder.value?.id) return
    fetchTrack(orderId, { silent: true })
  }, trackPollingMs)
}

function openTrackModal(order) {
  if (!order?.id) return
  trackModalOrder.value = order
  trackDetail.value = null
  fetchTrack(order.id)
  startTrackPolling()
}

function closeTrackModal() {
  trackModalOrder.value = null
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

const DASHBOARD_LOAD_TIMEOUT = 4000

onMounted(async () => {
  const u = authUser.value
  if (u) {
    profile.value = {
      name: u.name,
      email: u.email,
      avatar: u.avatar || '',
      is_premium: !!u.is_premium,
      phone: u.phone,
      date_of_birth: u.date_of_birth,
      gender: u.gender,
    }
  }
  loadProfileInBackground()

  setLoading(true)
  try {
    const dataPromise = loadOrders()
    const timeoutPromise = new Promise((r) => setTimeout(r, DASHBOARD_LOAD_TIMEOUT))
    await Promise.race([dataPromise, timeoutPromise])
  } finally {
    setLoading(false)
  }
})

onUnmounted(() => {
  stopTrackPolling()
})
</script>
