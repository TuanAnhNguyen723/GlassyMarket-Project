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

      <!-- Profile header (GET /api/v1/profile) -->
      <section class="mb-8">
        <ProfileHeaderCard :user="profile || {}" />
      </section>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Recent Order Card (GET /api/v1/orders?per_page=5) -->
        <RecentOrderCard :order="recentOrder" @track="openTrackModal" />
      </div>

      <!-- Modal theo dõi đơn (GET /api/v1/orders/{id}/track) -->
      <Teleport to="body">
        <div
          v-if="trackModalOrder"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          @click.self="trackModalOrder = null"
        >
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('common.track') }}</h3>
              <button type="button" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" @click="trackModalOrder = null">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="p-6 overflow-y-auto">
              <template v-if="trackDetail">
                <p class="text-sm text-slate-500 dark:text-slate-400">#{{ trackDetail.order_number }}</p>
                <p class="mt-1 font-bold text-slate-800 dark:text-white">{{ trackStatusLabel(trackDetail.status) }}</p>
                <p v-if="trackDetail.tracking_number" class="mt-2 text-sm">Mã vận đơn: {{ trackDetail.tracking_number }}</p>
                <p v-if="trackDetail.estimated_delivery_date" class="text-sm text-primary mt-1">{{ $t('dashboard.estArrival', { date: formatTrackDate(trackDetail.estimated_delivery_date) }) }}</p>
                <div v-if="trackDetail.status_history?.length" class="mt-6 space-y-2">
                  <p class="text-xs font-bold uppercase text-slate-400">{{ $t('orders.deliveryStatus') }}</p>
                  <ul class="space-y-2">
                    <li v-for="(h, i) in trackDetail.status_history" :key="i" class="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                      <span class="text-primary">•</span> {{ h.status || h }} <span v-if="h.date" class="text-slate-400">{{ h.date }}</span>
                    </li>
                  </ul>
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
        class="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6"
      >
        <div class="flex gap-8">
          <div class="flex flex-col gap-1">
            <p class="text-[#0d171b] dark:text-white text-sm font-bold">{{ $t('dashboard.needHelp') }}</p>
            <p class="text-[#578e89] text-xs">{{ $t('dashboard.helpAvailable') }}</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined">chat</span>
            </button>
            <button
              class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined">call</span>
            </button>
          </div>
        </div>
        <div class="bg-primary/5 dark:bg-primary/10 px-6 py-4 rounded-2xl flex items-center gap-4">
          <span class="material-symbols-outlined text-primary">local_library</span>
          <div>
            <p class="text-xs font-bold text-slate-800 dark:text-white">{{ $t('dashboard.learnPrescription') }}</p>
            <p class="text-[10px] text-[#578e89] mt-0.5">{{ $t('dashboard.learnPrescriptionDesc') }}</p>
          </div>
          <span class="material-symbols-outlined text-slate-400 text-sm">arrow_forward_ios</span>
        </div>
      </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
  getOrderStatusKey
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

function trackStatusLabel(status) {
  const key = getOrderStatusKey(status || '')
  return t(`dashboard.${key}`)
}

function formatTrackDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Gọi nền, không chặn loading. getProfile() có cache 5 phút - chuyển tab không gọi lại. */
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
      gender: cached.gender
    }
  }
  getProfile()
    .then((data) => {
      const next = {
        name: data.name,
        email: data.email,
        avatar: data.avatar || '',
        is_premium: !!data.is_premium,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender
      }
      profile.value = next
    })
    .catch(() => {
      if (!profile.value?.name) profile.value = { name: '', email: '', avatar: '', is_premium: false }
    })
}

/** getOrders đã có cache - chuyển tab Dashboard không gọi lại API. */
async function loadOrders() {
  try {
    const res = await getOrders({ per_page: 5 })
    const list = res.data || []
    const first = list.length ? mapOrderToCard(list[0]) : null
    recentOrder.value = first
  } catch {
    recentOrder.value = null
  }
}

function openTrackModal(order) {
  if (!order?.id) return
  trackModalOrder.value = order
  trackDetail.value = null
  getOrderTrack(order.id)
    .then((data) => {
      trackDetail.value = data
    })
    .catch(() => {
      trackDetail.value = { order_number: order.orderNumber, status: order.status }
    })
}

watch(trackModalOrder, (v) => {
  if (!v) trackDetail.value = null
})

/** Thời gian tối đa chờ orders (ms). */
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
      gender: u.gender
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
</script>
