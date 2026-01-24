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
      <!-- PageHeading -->
      <header class="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div class="flex flex-col gap-1">
          <h2 class="text-[#0d171b] dark:text-white text-4xl font-black leading-tight tracking-tight">
            Welcome back, {{ userName }}!
          </h2>
          <p class="text-[#578e89] dark:text-slate-400 text-lg font-normal">Your stylish view is on its way.</p>
        </div>
        <button
          class="flex items-center justify-center rounded-xl h-11 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0d171b] dark:text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
          type="button"
        >
          View Profile
        </button>
      </header>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Recent Order Card -->
        <RecentOrderCard :order="recentOrder" />

        <!-- Prescription Summary Card -->
        <PrescriptionCard :prescription="prescription" />

        <!-- Saved Styles Card (Carousel Style) -->
        <SavedStylesCard :saved-styles="savedStyles" @style-click="handleStyleClick" />
      </div>

      <!-- Footer Section -->
      <footer
        class="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6"
      >
        <div class="flex gap-8">
          <div class="flex flex-col gap-1">
            <p class="text-[#0d171b] dark:text-white text-sm font-bold">Need help?</p>
            <p class="text-[#578e89] text-xs">Available 24/7 for our members</p>
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
            <p class="text-xs font-bold text-slate-800 dark:text-white">Learn how to read your prescription</p>
            <p class="text-[10px] text-[#578e89] mt-0.5">Our guide makes it easy to understand OD, OS, and CYL.</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePageLoading } from '@/composables/usePageLoading'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import RecentOrderCard from '../components/features/dashboard/RecentOrderCard.vue'
import PrescriptionCard from '../components/features/dashboard/PrescriptionCard.vue'
import SavedStylesCard from '../components/features/dashboard/SavedStylesCard.vue'

const router = useRouter()
const { setLoading } = usePageLoading()
const userName = 'Alex'

onMounted(async () => {
  // Simulate loading data
  setLoading(true)
  // In a real app, you would fetch data here
  await new Promise((resolve) => setTimeout(resolve, 300))
  setLoading(false)
})

const recentOrder = ref({
  orderNumber: 'ORD-8821',
  productName: 'Urban Classic Frames',
  status: 'Out for Delivery',
  estimatedArrival: 'Today',
  progress: 85,
  statusMessage: 'Package is at your local distribution center',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_4tzGN9se0EhS7Mp59o3VVBZSNS8EnnQfOVZsg0_fcY4j42YaSPN-bjLGABVTLWKJh-hxCiELqtkyHOOesOnNHfs4Wz5wMjiB2oAp9ebS0z4-mSspTeEysadQgTVQNUeGn2RIBHVmk-FRGcMxKjU2lt1w_lpyLcE3S5XUJIhgNLbHpvlnXmUBK48ein2Jei-08TwIoCa2mmYp8K5XJj4zLiWaPk9CTriLGakyPkJ9odDLGb_nJFHLtNR5imVtVSJOQmcxJUkK6a8J',
})

const prescription = ref({
  rightEye: {
    sph: '-2.25',
    cyl: '-0.75',
    axis: '165',
  },
  leftEye: {
    sph: '-2.50',
    cyl: '-0.50',
    axis: '010',
  },
  updatedDate: 'October 12, 2023',
})

const savedStyles = ref([
  {
    id: 'golden-retro',
    name: 'Golden Retro Circle',
    material: 'Gold Metal Finish',
    price: 129,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Helo1RLSMpIjHS0h7xM0mM0lr8qIXiWb8As-X-Ed-5VMvdmKFhafei0TwZSDfl_ursRI7uBoRRyzAt4fRkftWoHJmzFcHXhQyCieuAIPXtgoyY_W5cRrH1pUymOe3WLxAcZeLIkD0Aq3de-CJpJwyCLEOXj3FjojJZ-O5YajCog6JFjamR36lpwcjobc3RRKnWdc843CNv47522e1oWz8-vTmUud_XpHDahUNf_fLuD6UKu0dqOC_4Eb02OMXKmZ5s-uIzsNQOOT',
    isFavorite: true,
  },
  {
    id: 'avenue-wayfarer',
    name: 'Avenue Wayfarer',
    material: 'Tortoise Shell Acetate',
    price: 145,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6OmGj_hxlY2rPg-GCzQnP2WwrJMmtE9MGWSvsOZYVFosgb66k_WPYnQ6UiWtkmwJ4vH3yhP-zBP1iEXHxwf7Eo95jHSsc9V8fqyobtJkVbFgea1XWX8UNJKCRKx2A9Otg0a3LCTZ0d3W56Y1HoxIN4wo0-S9-d6txXdv-z2Sk4oeajpzDBTXG74alR9QoBMrVFmws6L6AGgv-In7TUYj4RMmEO6LCY2Jeii_2-5l4zmRtULQYZ4aJP691JbUA3ceFLNRTjp_3iwIU',
    isFavorite: true,
  },
  {
    id: 'crystal-clear-square',
    name: 'Crystal Clear Square',
    material: 'Transparent Nylon',
    price: 99,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBN1xrSYyGt2wfM82VcUhOJOOiI9ufi8-m1H-5lkjbj7aQJFsmBRNDAtFYeqbiBA6lrXeDd41mbCMgPW1CI2_r-XS1sniiiukMwfaOnD0NUhb7dcLkeRYOnY4GwNMgIzVgBMSp4oDSJgw7PNhCFWb9RjXSgbBJQx1b6m-3eC0CthbIbsZ-HgQYoAYsHlSpu05Hxt1UfbHFyPw_XkRXoTKj8iDp-WrtINPpLrJgw2ZEUxv4AyTIyjMYoPCvrZQdElnQIISrmSIxDPFVj',
    isFavorite: true,
  },
])

const handleStyleClick = (style) => {
  router.push(`/product/${style.id}`)
}
</script>
