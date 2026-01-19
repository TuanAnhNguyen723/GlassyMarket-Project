<template>
  <main class="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-8 lg:py-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs
      :items="[
        { label: 'Home', to: '/' },
        { label: 'Eyewear', to: '/products' },
        { label: product.name },
      ]"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <!-- Left: Gallery Side -->
      <div class="lg:col-span-7 flex flex-col gap-6">
        <div
          class="relative group aspect-[4/5] rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div
            class="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
            :style="{ backgroundImage: `url('${selectedImage}')` }"
            :aria-label="product.images[0].alt"
          ></div>
          <!-- Virtual Try-On Floating CTA -->
          <div class="absolute bottom-6 left-6">
            <button
              class="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-xl hover:bg-primary/90 hover:scale-105 transition-all"
              type="button"
            >
              <span class="material-symbols-outlined">videocam</span>
              <span>Virtual Try-On</span>
            </button>
          </div>
          <button
            class="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-900 hover:text-red-500 transition-colors shadow-sm"
            type="button"
            @click="toggleFavorite"
          >
            <span class="material-symbols-outlined">{{ isFavorite ? 'favorite' : 'favorite_border' }}</span>
          </button>
        </div>
        <!-- Thumbnails -->
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="(img, idx) in product.images"
            :key="idx"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all bg-white dark:bg-slate-800"
            :class="selectedImage === img.url ? 'border-2 border-primary' : 'border border-slate-200 dark:border-slate-800'"
            @click="selectedImage = img.url"
          >
            <div
              class="w-full h-full bg-center bg-no-repeat bg-cover"
              :style="{ backgroundImage: `url('${img.url}')` }"
              :aria-label="img.alt"
            ></div>
          </div>
        </div>
      </div>

      <!-- Right: Product Detail Side -->
      <div
        class="lg:col-span-5 flex flex-col gap-8 bg-white dark:bg-slate-900/50 p-8 lg:p-10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800"
      >
        <div>
          <div class="flex justify-between items-start mb-2">
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{{ product.name }}</h1>
            <span class="text-2xl font-light text-primary">${{ product.price }}</span>
          </div>
          <ProductRating
            :rating="product.rating"
            :reviews="product.reviews"
            size="md"
            :show-reviews-count="false"
            :reviews-text="`${product.reviews} reviews`"
            text-color="amber"
          />
        </div>
        <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Frame Details -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-widest text-slate-400">Frame Details</h3>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="detail in product.frameDetails"
              :key="detail.label"
              class="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
            >
              <span class="text-xs text-slate-500">{{ detail.label }}</span>
              <span class="text-sm font-semibold">{{ detail.value }}</span>
            </div>
          </div>
        </div>

        <!-- Lens Options -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-widest text-slate-400">Lens Options</h3>
          <div class="flex flex-col gap-3">
            <label
              v-for="option in product.lensOptions"
              :key="option.id"
              class="group relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
              :class="
                selectedLens === option.id
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-2 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :class="
                    selectedLens === option.id
                      ? 'border-4 border-primary bg-white'
                      : 'border-2 border-slate-300'
                  "
                ></div>
                <span class="font-semibold">{{ option.name }}</span>
              </div>
              <span
                v-if="option.priceChange === 0"
                class="text-xs font-medium bg-primary text-white px-2 py-0.5 rounded"
                >Included</span
              >
              <span v-else class="text-sm text-slate-500">{{ option.priceChange > 0 ? '+' : '' }}${{ option.priceChange }}</span>
              <input
                v-model="selectedLens"
                :value="option.id"
                type="radio"
                class="sr-only"
                @change="selectedLens = option.id"
              />
            </label>
          </div>
        </div>

        <!-- CTA Actions -->
        <div class="flex flex-col gap-3 mt-4">
          <button
            class="w-full bg-primary text-white py-5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            type="button"
            @click="addToCart"
          >
            <span class="material-symbols-outlined">add_shopping_cart</span>
            Add to Cart
          </button>
          <p class="text-center text-xs text-slate-400 mt-2">Hurry! Only {{ product.stock }} pairs left in stock.</p>
        </div>

        <!-- Delivery & Info -->
        <div class="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">local_shipping</span>
            <div>
              <h4 class="text-sm font-semibold">Free Express Shipping</h4>
              <p class="text-xs text-slate-500">Arrives between Oct 24 - Oct 26</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">verified_user</span>
            <div>
              <h4 class="text-sm font-semibold">2-Year Lumina Warranty</h4>
              <p class="text-xs text-slate-500">Complete protection for your premium eyewear</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">keyboard_return</span>
            <div>
              <h4 class="text-sm font-semibold">30-Day Hassle-Free Returns</h4>
              <p class="text-xs text-slate-500">Not the right fit? Send them back for free</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <section class="mt-20">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">You Might Also Like</h2>
          <p class="text-slate-500">Curated styles that match the Aviator aesthetic.</p>
        </div>
        <RouterLink
          class="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-1 hover:underline"
          to="/products"
        >
          View All <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="{
            ...item,
            imageUrl: item.image,
            price: item.price,
          }"
          :show-quick-view="false"
          :show-favorite="true"
          :show-rating="false"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import ProductRating from '@/components/common/ProductRating.vue'
import ProductCard from '@/components/features/products/ProductCard.vue'

const route = useRoute()
const selectedImage = ref('')
const selectedLens = ref('single-vision')
const isFavorite = ref(false)

// Product data - trong thực tế sẽ fetch từ API dựa trên route.params.id
const product = ref({
  id: 'aviator-classic',
  name: 'Aviator Classic',
  price: 149,
  rating: 4.5,
  reviews: 128,
  stock: 4,
  images: [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD38n7OWel44o2y7ygSFMqRKjahtV_da6ATMWTNa_Vmuv7wALf4ai7mgXt-b4nJGiXzKpnUMn0uLKUjEr6jWq4xshe3w8Mns5-2I_Qm8djnC57YdIxoqegZQ5Yrlljtxd3SuAxyNdv_gKIzDdJ0n6R08KRUUBJmPFjj27WG48Tc0OC3jBK8FLO4NNCKOhJjVb5EwCI3av-6uCz0Rcvx7VB1uFa4Bs9ZDy3xWkCf9E5hRWOQwSopjAyTw_fYIlfYYuQAeqB9sQjKWAjG',
      alt: 'Main front view of classic gold aviator glasses',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4y623Qz8Pbpvk1MUSQ27ilbCg1R8NzkQ5RfbBk0tROfBUtOtMO_MAp7FNHALu3a7RRCJNgQZzG0GPUiI_I3gY_S0k_cCCEEG419YBDYK8jcppAeuZz1IwOgY2tZ_lSeUAWHUD895E3RctkGwlcv-m7NNrYh8EYeNrU_7YTziFDQtsR3eWzUmqYWEMScavBL-0VKtCGdsBIWUS-7eXfvSXkZRaPcyd4x1c5Z2bwZLkqHgZvI-fz8HZAVpHb1dFVr5A4s_NCdgqDY8',
      alt: 'Close up of aviator frame hinge',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtqeL8bTp-fQOOr9QLaZZQSEEghoIvWIxe4Dycm2dUV4OuuFHKt7XaUVWVCAs21woPLZoLwYqk0sjiOZ-nDWWBpMDzpd-6q8joaLbMBTWk-Q0HAwRP7BzcbOhXrhTOW2J9aQ1tx18VvwjjO9L0_xLVrTr2Bf2yuB76RkY5FGSlq-lIcxC6YXnrW6pEV2FR87O2xynvbfNQHDvhvEW3JG6f0xpVfUFv62JwW8NBDsSRVsujunJNbkwfED01ReDiX5kJcdiw-RBKSEYc',
      alt: 'Side profile of gold aviator glasses',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsLFawUzNzUZ1IKpNb6Cu1Pmj9CYF7lS1q5i14HQD3sF8Gl1kcK0ajTJwbSU9jHr9-TAOSivI7UPEJMhV9pn4AYTBfIxOnaUfIRep3jbwQpMRhkMuRAzNNKcBx_7R2GkPhXJ3OkoQvngSkn72ocxoJCpm8RygM7b_ZaLojIYmCkKNhd6pgconnQ6BPSaeAHCdTB7KKKwCFGbmmkHSkfduLzJtjkjTe-E-xHfDDpEZlXLC2b2ijw2guSOfBFcciyop1chX-5tg5N2F2',
      alt: 'Model wearing aviator classic glasses',
    },
  ],
  frameDetails: [
    { label: 'Material', value: 'Premium Acetate' },
    { label: 'Size', value: 'Medium (140mm)' },
    { label: 'Bridge', value: '18mm' },
    { label: 'Shape', value: 'Classic Aviator' },
  ],
  lensOptions: [
    { id: 'single-vision', name: 'Single Vision', priceChange: 0 },
    { id: 'progressive', name: 'Progressive', priceChange: 80 },
    { id: 'blue-light', name: 'Blue Light Blocking', priceChange: 30 },
  ],
})

// Set initial selected image
selectedImage.value = product.value.images[0].url

const relatedProducts = ref([
  {
    id: 'horizon-silver',
    name: 'Horizon Silver',
    price: 129,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5HWDKaXu-yPJ8BlBExuY0OZdPi9PYw40YSNm30hGbN83ovasybHamzP92ctXDdSeisCyFOcUvOiplmQQpXJUZsWQHOOPNjTabruZPMnzL1vLz5DUpFw9jSRkPEUlFBu9WM2WdbcX6WS5vChSg177C3JKg21GP9YPE-ppjUUFYytUSPyPuR2A9Tj3dhcNP2VHsPvRheAt275ESBhZUm4eXjaF46wQuN31zk9jCgAoYPoW_K23bLcelO_94mzyeRWHBgYrgoI7NE9yy',
    alt: 'Classic silver frame glasses',
  },
  {
    id: 'tortoise-shell-neo',
    name: 'Tortoise Shell Neo',
    price: 159,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6vDTfOA0Wi_GxxksGINUkak17qlcACf8WwxFN6e0qAPsTWBBU0O2tygWwQyYoFC-JY0FcjOHS0N79pu4q28vm2-Ym5lb5ng3cel7YtxHdjZmDvSJtrOeR427Cg6V3vNpVJpmZKJc-K_0D_EA3758H75Of-8CfLvVUu3efB6iMrPiKDLUmrCK1PytsPI5gOBLY4Z1Ka87rPUKeS-iUxJjj2Zd8Hsy9hFAdQsOsJRsa3T89g2CvkEKPNzV7QQpSyrdTmFnFTEIHGTJl',
    alt: 'Tortoise shell acetate frames',
  },
  {
    id: 'noir-square',
    name: 'Noir Square',
    price: 149,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBy57fxLNuJklVQi3KrodwFFX940Xbdr6gg5S1lHe20BiVIJxAfzUrwFo-RyL7F-ge80nm7buL5FtJ5olAgPQHMvQ0IV86dR255_Kyu4UkObO6Lo5GPvsaCPUAJuU_D-20GPYeB2fOk4WjiUzPKPbpdYR4otlcIWHswxwHg06CVYt5c9ZX_h0nnobFN5eJNKbBWSpAJqF4JWaDoq94BYyuC8jEz20quGdhaegIWw08cJ2Kvdf-wV7mqSHoaI22ThNlsODArgN89HGqr',
    alt: 'Black modern square frames',
  },
  {
    id: 'aura-gold-rim',
    name: 'Aura Gold Rim',
    price: 199,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC__aOH061trYydLNJjOeuo81PgiZFR_wRzPYRp5Ln2qO7pChftJ-nn3zi3BMl5YCfIK5pxy9WXYJsadTo7KGnkJHEO_6BNEnR7rNPcM_8z83LufHtVjR3j320IzE2mkM56XXQSjHQt7jphTArck3Z0IOUEIHe_T9QCnpopr6UOwqORV0CmHDbr8K-dANR3KS3aU5AQO7F2hqKxSZWpWQRm0Rtxw1fVXO-yikS4hOOtLZSvHv0T3yu4SwA1dogrzemGPZ2S5sOXVV0l',
    alt: 'Gold rimless glasses',
  },
])

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const addToCart = () => {
  // TODO: Implement add to cart logic
  console.log('Added to cart:', {
    product: product.value.name,
    lens: selectedLens.value,
    price: product.value.price,
  })
  alert('Added to cart!')
}
</script>
