<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <div class="max-w-[1440px] mx-auto">
      <div class="flex w-full gap-8">
        <!-- Side Navigation -->
        <div class="px-6 lg:px-20">
          <DashboardSidebar />
        </div>

        <!-- Content Area -->
        <main class="flex-1 flex flex-col overflow-y-auto px-6 py-10">
          <!-- Page Heading -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div class="flex flex-col gap-1">
              <h1 class="text-4xl font-black tracking-tight text-[#0d171c] dark:text-white">
                {{ $t('savedStyles.title') }}
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-base">
                {{ $t('savedStyles.subtitle', { count: savedItems.length }) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                type="button"
                @click="handleClearAll"
              >
                <span class="material-symbols-outlined text-[20px]">delete</span>
                <span>{{ $t('savedStyles.clearAll') }}</span>
              </button>
              <button
                class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                type="button"
                @click="handleBuyAll"
              >
                <span class="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                <span>{{ $t('savedStyles.buyAllItems') }}</span>
              </button>
            </div>
          </div>

          <!-- Filters and Sort -->
          <div class="flex flex-wrap gap-2 mb-8 items-center">
            <span class="text-sm font-bold text-slate-400 mr-2">{{ $t('savedStyles.filter') }}:</span>
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              :class="
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary'
              "
              type="button"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
              <span class="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
            <div class="ml-auto hidden sm:block">
              <select
                v-model="sortBy"
                class="bg-transparent border-none text-sm font-bold text-slate-500 dark:text-slate-400 focus:ring-0 cursor-pointer"
              >
                <option value="recently-added">{{ $t('savedStyles.sortRecentlyAdded') }}</option>
                <option value="price-low">{{ $t('savedStyles.sortPriceLow') }}</option>
                <option value="price-high">{{ $t('savedStyles.sortPriceHigh') }}</option>
              </select>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SavedStyleCard
              v-for="item in filteredAndSortedItems"
              :key="item.id"
              :product="item"
              @toggle-favorite="handleToggleFavorite"
              @add-to-cart="handleAddToCart"
              @virtual-try-on="handleVirtualTryOn"
            />
          </div>

          <!-- Load More -->
          <div class="mt-12 flex justify-center">
            <button
              v-if="hasMore"
              class="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold hover:border-primary hover:text-primary transition-all"
              type="button"
              @click="handleLoadMore"
            >
              {{ $t('savedStyles.loadMoreStyles') }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePageLoading } from '@/composables/usePageLoading'
import { useI18n } from 'vue-i18n'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import SavedStyleCard from '../components/features/dashboard/SavedStyleCard.vue'

const { setLoading } = usePageLoading()
const { t } = useI18n()

const activeFilter = ref('all')
const sortBy = ref('recently-added')
const hasMore = ref(true)

const filters = computed(() => [
  { label: t('savedStyles.allFrames'), value: 'all' },
  { label: t('products.aviator'), value: 'aviator' },
  { label: t('products.wayfarer'), value: 'wayfarer' },
  { label: t('products.round'), value: 'round' },
])

const savedItems = ref([
  {
    id: 'aero-lite-aviator',
    name: 'Aero-Lite Aviator',
    description: 'Midnight Blue / Silver',
    price: '$145.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6NQRAlobI-Vek8MFIcIzHCqW-lZGQToFy7a4Eqyj35u755wcJVc5xxyePHO0qVNkh09eLUKAUVdMGSClzfXvaxdTuxR19st44Dr96d-VoDrMzrU2iYoWdCkI_xE6jyZb90nFpq02fZ7GcIkOP4TPsiMGSB-5_6VWgwcscyfzn_ilUxvn8dvtlsmaemCEZx5ngI_2yECe_jvbfPqt5i5YO7bfh9rCBkD_sdA-Yo2-4PhVdJphYLxstlmYPt08z7cmapGGh4sRydygx',
    alt: 'Blue and silver aviator glasses',
    category: 'aviator',
    colors: ['#1a2b34', '#25aff4'],
    priceValue: 145,
  },
  {
    id: 'urban-retro',
    name: 'Urban Retro',
    description: 'Tortoise Shell',
    price: '$120.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_S4R8svayDfmMF2qjuIgkbne1mNIM8NG-UemWH6sZZvd_OWw0ZL3vPsgRs0qErWMeS6PMJmbeHEYDes208JPCgs0-eoAVxUd7rie_umKtTIB06wLu6-PMucdVjEnrg7OXXvw2fsvViVTCoenrNf9DJKO_lCjbFM1mknppGZ-6ItkqmEe32RULcrh5lplJMFUvJ7YTUp1e_57JKTOHoL96QaI4fFkepbmq2RCaU0H4ORhs14zcjo8Milnex_o6Xp-6JNEhG7l7B-pT',
    alt: 'Tortoise shell retro glasses',
    category: 'wayfarer',
    priceValue: 120,
  },
  {
    id: 'cat-eye-bloom',
    name: 'Cat-Eye Bloom',
    description: 'Matte Black',
    price: '$155.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7OXJ24ywcAYkf_6E9ys9G8QDWt7IUyBQFbYgs8vT99ZRdzE1xRRT_LVlVTjBB_KjDXaz8Rj-I2bg4Evo9XOvNZybcVRZRDUL4acs_nXxGsZwEkewqq9OUGD2mg-UVyyjTpdGeD4cBYm6DpSVPGBieXt83-O13WC6FO3vOG8PKQfQmZqMqvrsEAfeLyTN8GszVHuocMfmm3dkUKoQw5ErJnSCOCYLmPezDrUd5infWDw1h8svxVL_Rkzeahgq9nwsv27h9GKip3keL',
    alt: 'Matte black cat-eye glasses',
    category: 'cat-eye',
    priceValue: 155,
  },
  {
    id: 'titanium-tech',
    name: 'Titanium Tech',
    description: 'Brushed Gold',
    price: '$180.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAT9OJZ2BCa-W59_x3Rpbje3awPpHu8XJqFh2UGZkEUThXUhfwoP5fIbonpdbPZSfjATQUBLbGLwhU1nXa_dMKxwmMpuiLJP2e7h0re6xTgj4KYS0Rq1Chv3YCL00C6dxUspk9NwI2OAY-nxvVAQJ5yDuuMBQzix9tTec71P04xXzFA5zIXaNK2tfs9U-If4PLJ5npeSJFpaNsyZKQV2E6HUFUX6n9_TbvOsNpmGhfsRfAo8ND6fl-IBclfhZdOQ_QqcCs0Qh_I5qeJ',
    alt: 'Brushed gold titanium glasses',
    category: 'round',
    priceValue: 180,
  },
  {
    id: 'clear-vision',
    name: 'Clear Vision',
    description: 'Crystal Clear',
    price: '$115.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCDXB3Pa3ZjY9l_Jy53zFdK4MxELyFVzFrAMy53FpbYtqBDD54nZKMI3AZLlqKkwGVeNZUb3Z3g45THvEJYgsugSZhc65uI7t2qAub9zLC-ZcrDEV5sP3qVpuHKgDf_9bKu6ccCMknsDAE2W8c7TXchPqIFkep2Rjq4U-BCB1Hn4CfnKNG9RtlfBSYiKlII0n8JXqx42UEk1O6hY2Qs-b_a2C6U_vPS4F-wEZHn7At3lPyghrafONPR9ZXv7tE43nqyBHFAVY_1o_w',
    alt: 'Crystal clear vision frames',
    category: 'round',
    priceValue: 115,
  },
  {
    id: 'midnight-wayfarer',
    name: 'Midnight Wayfarer',
    description: 'Deep Navy',
    price: '$135.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0VwvB7jRXxEeNmE6owlTSpJyAQtQ1n_z9cR7nN41vE1-MLRrIqp4xUkamnmSJQIE4WNZmGMeBbRWUWkbRuCMllkS3w0CNLJFPB3Q8SIPksiS4zQWX6EzPHBwyEvX0ifPd0V-6ZyLzbYQJhEBG-g-uDPTUZDJAEwyvNBA4DVOtSSFG_dB2Hb61I65K1hYcPpM4SqRanX5m0bJ_ji8GZorIYy07PJROxqnjJj_8Ljy6IA-y6IxE6giKD74qxv1tT8He1j8tCXFDzMJc',
    alt: 'Deep navy wayfarer frames',
    category: 'wayfarer',
    priceValue: 135,
  },
])

const filteredAndSortedItems = computed(() => {
  let filtered = savedItems.value

  // Filter by category
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter((item) => item.category === activeFilter.value)
  }

  // Sort
  const sorted = [...filtered]
  if (sortBy.value === 'price-low') {
    sorted.sort((a, b) => a.priceValue - b.priceValue)
  } else if (sortBy.value === 'price-high') {
    sorted.sort((a, b) => b.priceValue - a.priceValue)
  }
  // 'recently-added' is default order

  return sorted
})

onMounted(async () => {
  setLoading(true)
  // Simulate loading data
  await new Promise((resolve) => setTimeout(resolve, 300))
  setLoading(false)
})

const handleToggleFavorite = (id) => {
  const index = savedItems.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    savedItems.value.splice(index, 1)
  }
}

const handleAddToCart = (id) => {
  console.log('Add to cart:', id)
  // Handle add to cart logic
}

const handleVirtualTryOn = (id) => {
  console.log('Virtual try on:', id)
  // Handle virtual try on logic
}

const handleClearAll = () => {
  if (confirm(t('savedStyles.confirmClearAll'))) {
    savedItems.value = []
  }
}

const handleBuyAll = () => {
  console.log('Buy all items')
  // Handle buy all logic
}

const handleLoadMore = () => {
  console.log('Load more styles')
  // Handle load more logic
  hasMore.value = false // For demo purposes
}
</script>

<style scoped>
.product-card:hover .quick-actions {
  opacity: 1;
  transform: translateY(0);
}
</style>
