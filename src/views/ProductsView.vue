<template>
  <main class="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
    <!-- Breadcrumbs & Heading -->
    <div class="mb-8">
      <Breadcrumbs
        :items="[
          { label: $t('products.home'), to: '/' },
          { label: $t('products.eyewearCollection') },
        ]"
        class-name="mb-4"
      />

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-[#101918] dark:text-white mb-2">{{ $t('products.title') }}</h1>
          <p class="text-[#578e89] max-w-lg">
            {{ $t('products.subtitle') }}
          </p>
        </div>

        <div
          class="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-[#e9f1f1] dark:border-gray-700"
        >
          <span class="text-sm font-medium px-2">{{ $t('products.sortBy') }}</span>
          <select class="bg-transparent border-none text-sm font-bold focus:ring-0 py-0 pr-8">
            <option>{{ $t('products.newestArrivals') }}</option>
            <option>{{ $t('products.priceLowToHigh') }}</option>
            <option>{{ $t('products.priceHighToLow') }}</option>
            <option>{{ $t('products.mostPopular') }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div
          class="sticky top-28 space-y-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#e9f1f1] dark:border-gray-800 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ $t('products.filters') }}</h3>
            <button class="text-primary text-xs font-bold uppercase tracking-widest hover:underline" type="button">
              {{ $t('products.clearAll') }}
            </button>
          </div>

          <!-- Type Filter -->
          <div class="space-y-4">
            <p class="text-xs font-bold text-[#578e89] uppercase tracking-widest">{{ $t('products.type') }}</p>
            <div class="flex flex-wrap gap-2">
              <button class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold" type="button">{{ $t('products.all') }}</button>
              <button
                class="px-4 py-2 rounded-lg bg-[#e9f1f1] dark:bg-gray-800 text-sm font-medium hover:bg-primary/10 transition-colors"
                type="button"
              >
                {{ $t('products.optical') }}
              </button>
              <button
                class="px-4 py-2 rounded-lg bg-[#e9f1f1] dark:bg-gray-800 text-sm font-medium hover:bg-primary/10 transition-colors"
                type="button"
              >
                {{ $t('products.sunglasses') }}
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <p class="text-xs font-bold text-[#578e89] uppercase tracking-widest">{{ $t('products.priceRange') }}</p>
              <span class="text-sm font-bold text-primary">$120 - $350</span>
            </div>
            <input
              class="w-full accent-primary h-1.5 bg-[#e9f1f1] dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              type="range"
            />
          </div>

          <!-- Frame Shape -->
          <div class="space-y-3">
            <p class="text-xs font-bold text-[#578e89] uppercase tracking-widest">{{ $t('products.frameShape') }}</p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input checked class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span class="text-sm group-hover:text-primary transition-colors">{{ $t('products.aviator') }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span class="text-sm group-hover:text-primary transition-colors">{{ $t('products.wayfarer') }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span class="text-sm group-hover:text-primary transition-colors">{{ $t('products.round') }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span class="text-sm group-hover:text-primary transition-colors">{{ $t('products.square') }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                <span class="text-sm group-hover:text-primary transition-colors">{{ $t('products.catEye') }}</span>
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div class="space-y-4">
            <p class="text-xs font-bold text-[#578e89] uppercase tracking-widest">{{ $t('products.colors') }}</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="size-8 rounded-full bg-black ring-2 ring-offset-2 ring-primary border border-white/20"
                type="button"
                :title="$t('products.black')"
              />
              <button
                class="size-8 rounded-full bg-[#5D4037] ring-1 ring-black/5 hover:ring-primary transition-all"
                type="button"
                :title="$t('products.tortoise')"
              />
              <button
                class="size-8 rounded-full bg-[#D4AF37] ring-1 ring-black/5 hover:ring-primary transition-all"
                type="button"
                :title="$t('products.gold')"
              />
              <button
                class="size-8 rounded-full bg-[#C0C0C0] ring-1 ring-black/5 hover:ring-primary transition-all"
                type="button"
                :title="$t('products.silver')"
              />
              <button
                class="size-8 rounded-full bg-white border border-gray-200 ring-1 ring-black/5 hover:ring-primary transition-all"
                type="button"
                :title="$t('products.crystal')"
              />
            </div>
          </div>

          <!-- Promotion Card -->
          <div class="mt-8 bg-primary/10 dark:bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p class="text-sm font-bold text-primary mb-1">{{ $t('products.freeEyeExam') }}</p>
            <p class="text-xs text-[#578e89] leading-relaxed">
              {{ $t('products.freeEyeExamDesc') }}
            </p>
            <button
              class="mt-3 w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-105 transition-all"
              type="button"
            >
              {{ $t('products.bookNow') }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <section class="flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :show-quick-view="true"
            :show-rating="true"
          />
        </div>

        <!-- Pagination -->
        <Pagination :current-page="currentPage" :total-pages="12" @page-change="handlePageChange" />
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import ProductCard from '@/components/features/products/ProductCard.vue'
import Pagination from '@/components/common/Pagination.vue'

const currentPage = ref(1)

const handlePageChange = (page) => {
  currentPage.value = page
  // TODO: Fetch products for new page
}

const baseProducts = [
  {
    id: 'aviator-classic',
    name: 'Aviator Classic',
    category: 'Sunglasses',
    price: '$149',
    badge: 'New',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD38n7OWel44o2y7ygSFMqRKjahtV_da6ATMWTNa_Vmuv7wALf4ai7mgXt-b4nJGiXzKpnUMn0uLKUjEr6jWq4xshe3w8Mns5-2I_Qm8djnC57YdIxoqegZQ5Yrlljtxd3SuAxyNdv_gKIzDdJ0n6R08KRUUBJmPFjj27WG48Tc0OC3jBK8FLO4NNCKOhJjVb5EwCI3av-6uCz0Rcvx7VB1uFa4Bs9ZDy3xWkCf9E5hRWOQwSopjAyTw_fYIlfYYuQAeqB9sQjKWAjG',
    alt: 'Main front view of classic gold aviator glasses',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 'luna-round',
    name: 'Luna Round',
    category: 'Optical',
    price: '$210',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGkkJKxlUkdClFYHLpB2TlOOQtMvcH7RYBBG0V5pmH9U0uFt0sc4-JWYIK8Zwa0bfuuAcios7qEJ4-VntotjE8NaJ8gRJ8uul_54KhLoE9531QFB-JesLg06ROcgZ90r_F9TOYXFdjgzoL8NDCzOdSrz0s0jrHh5QVUcojynWJt5IUKUqNG9XXic2cxsS7Z9TLmCYYHWkGPyjFdjFa2STrH7FaxD7uirFfc3wjW4ObSaNqeQEwQEG97lRII36x0DrY6jKWOk38btr4',
    alt: 'Amber tortoise shell round frames',
    rating: 5,
    reviews: 89,
  },
  {
    id: 'brooklyn-square',
    name: 'Brooklyn Square',
    category: 'Optical',
    price: '$155',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCiQQ_qiJioWkeMIVEOTr8fVMqc_W1FDaze3OIeChK8hFv2GrQjQeSd4AzoYEY-fsYtbTi7oD1scQALqfnDen6cBZBhFGRLN9aVNn-c0huNw5kFaFnynjhxcfivSjBAR2Rgj0eJhKbmmCt7QHYkMCEjflXKBOQ6u77EjDCbXHusEX-3qlwdnh9Koe3UXjDE4l6Xd2hFedLVuwYxDVnYRUOmmHma8He2QAeFLJdoC6lrCJATCJjbRQxonO49RBHUZTIsPN_NqVLGf3Xy',
    alt: 'Classic thick black square frames',
    rating: 4,
    reviews: 256,
  },
  {
    id: 'gold-luxe-rim',
    name: 'Gold Luxe Rim',
    category: 'Sunglasses',
    price: '$320',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfYEZsYIWOHsVfTXXmIxf2rIqfoV36JSqMBBDFlb5tVEbwTxeu8WbW2wrisbof60wnIBZ8tIaejtW2JJ0tgbFUX2Xy2-ThTeUgu9oKfo4lEkXPe1NpGDpzoQF2pP4SPke14LjHSeV0S12jhMe8mkcGHMkGB14Wj0vh0e_kO7LG1-Kab2vEijQkMC0nshLuUDZME2JjWS-UsrKBwpm_aBNdRlNfDCLK7wEJGSVoWqggqcDCHQMo5Eeql82x3ckMov56eV4UR75TVIH8',
    alt: 'Golden rimless sunglasses on model',
    rating: 5,
    reviews: 42,
  },
  {
    id: 'crystal-cat-eye',
    name: 'Crystal Cat Eye',
    category: 'Optical',
    price: '$175',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrvCy-Lfhs3UWotKUd4IrXrD4MUJ7e-SOkBikBzGDPT2e71d_eIFTdSTBg9S1s0ydvAXUhk4XaPs68K7AZKPSvbaLL9Py2b0q8zw8Cp8U4fckdJn0rX8gWCyXnOouviPpUI2KZLs6JR_XfZb6MOyHZ5ya7GdkP02kdPCP8CZ33Hd61YPpFde2hNWYi-eyWOJuzfvCJ5yLXeEcMJXy3Z7kvK5eYKXaFEaoI3e1ggBY-A5toNY9GcKv846yn9cEJI4LobE526x6Hh5mt',
    alt: 'Clear transparent cat-eye optical frames',
    rating: 4,
    reviews: 15,
  },
  {
    id: 'silver-wire-minimalist',
    name: 'Silver Wire Minimalist',
    category: 'Optical',
    price: '$195',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn0WbBWIXREQnsyr_NkHm06Aqgwq1iGDOfNSVtSWrAPRzl9YsIESZR-14W1HRsQCHXrqQtp90yuJS0Gj-4Czue9kZeq14oFG2rp-HCX9bzS5DwgyRbHdLMFzeTgKCwutdyvCtzXlMLrpVBa6J2IRLq7gKDKB5vAGZuMqAmyyE3WpNxEr8r_t_SjDB6uIcSCylxeI-SrY5tFHjdijli9TLLCR1Q4yGBIj6GrjH-IZpJ0tFQTVonztm5N8lh9eXVoJZ8arSvG5Nt8uKD',
    alt: 'Silver minimalist wire frames',
    rating: 5,
    reviews: 76,
  },
  {
    name: 'Luna Round',
    category: 'Optical',
    price: '$210',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGkkJKxlUkdClFYHLpB2TlOOQtMvcH7RYBBG0V5pmH9U0uFt0sc4-JWYIK8Zwa0bfuuAcios7qEJ4-VntotjE8NaJ8gRJ8uul_54KhLoE9531QFB-JesLg06ROcgZ90r_F9TOYXFdjgzoL8NDCzOdSrz0s0jrHh5QVUcojynWJt5IUKUqNG9XXic2cxsS7Z9TLmCYYHWkGPyjFdjFa2STrH7FaxD7uirFfc3wjW4ObSaNqeQEwQEG97lRII36x0DrY6jKWOk38btr4',
    alt: 'Amber tortoise shell round frames',
    rating: 5,
    reviews: 89,
  },
  {
    name: 'Brooklyn Square',
    category: 'Optical',
    price: '$155',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCiQQ_qiJioWkeMIVEOTr8fVMqc_W1FDaze3OIeChK8hFv2GrQjQeSd4AzoYEY-fsYtbTi7oD1scQALqfnDen6cBZBhFGRLN9aVNn-c0huNw5kFaFnynjhxcfivSjBAR2Rgj0eJhKbmmCt7QHYkMCEjflXKBOQ6u77EjDCbXHusEX-3qlwdnh9Koe3UXjDE4l6Xd2hFedLVuwYxDVnYRUOmmHma8He2QAeFLJdoC6lrCJATCJjbRQxonO49RBHUZTIsPN_NqVLGf3Xy',
    alt: 'Classic thick black square frames',
    rating: 4,
    reviews: 256,
  },
  {
    name: 'Gold Luxe Rim',
    category: 'Sunglasses',
    price: '$320',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfYEZsYIWOHsVfTXXmIxf2rIqfoV36JSqMBBDFlb5tVEbwTxeu8WbW2wrisbof60wnIBZ8tIaejtW2JJ0tgbFUX2Xy2-ThTeUgu9oKfo4lEkXPe1NpGDpzoQF2pP4SPke14LjHSeV0S12jhMe8mkcGHMkGB14Wj0vh0e_kO7LG1-Kab2vEijQkMC0nshLuUDZME2JjWS-UsrKBwpm_aBNdRlNfDCLK7wEJGSVoWqggqcDCHQMo5Eeql82x3ckMov56eV4UR75TVIH8',
    alt: 'Golden rimless sunglasses on model',
    rating: 5,
    reviews: 42,
  },
  {
    name: 'Crystal Cat Eye',
    category: 'Optical',
    price: '$175',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrvCy-Lfhs3UWotKUd4IrXrD4MUJ7e-SOkBikBzGDPT2e71d_eIFTdSTBg9S1s0ydvAXUhk4XaPs68K7AZKPSvbaLL9Py2b0q8zw8Cp8U4fckdJn0rX8gWCyXnOouviPpUI2KZLs6JR_XfZb6MOyHZ5ya7GdkP02kdPCP8CZ33Hd61YPpFde2hNWYi-eyWOJuzfvCJ5yLXeEcMJXy3Z7kvK5eYKXaFEaoI3e1ggBY-A5toNY9GcKv846yn9cEJI4LobE526x6Hh5mt',
    alt: 'Clear transparent cat-eye optical frames',
    rating: 4,
    reviews: 15,
  },
  {
    name: 'Silver Wire Minimalist',
    category: 'Optical',
    price: '$195',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn0WbBWIXREQnsyr_NkHm06Aqgwq1iGDOfNSVtSWrAPRzl9YsIESZR-14W1HRsQCHXrqQtp90yuJS0Gj-4Czue9kZeq14oFG2rp-HCX9bzS5DwgyRbHdLMFzeTgKCwutdyvCtzXlMLrpVBa6J2IRLq7gKDKB5vAGZuMqAmyyE3WpNxEr8r_t_SjDB6uIcSCylxeI-SrY5tFHjdijli9TLLCR1Q4yGBIj6GrjH-IZpJ0tFQTVonztm5N8lh9eXVoJZ8arSvG5Nt8uKD',
    alt: 'Silver minimalist wire frames',
    rating: 5,
    reviews: 76,
  },
]

const products = baseProducts.map((p) => ({
  ...p,
  fullStars: Math.round(p.rating),
}))
</script>

