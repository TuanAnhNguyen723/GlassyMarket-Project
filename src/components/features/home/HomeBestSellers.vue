<template>
  <section class="mb-6 mt-2 flex items-end justify-between gap-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2">Featured Picks</p>
      <h2 class="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{{ title }}</h2>
      <p class="text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">{{ subtitle }}</p>
    </div>
    <RouterLink
      class="hidden md:inline-flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      :to="viewAllTo"
    >
      {{ viewAllText }}
      <span class="material-symbols-outlined text-base">arrow_outward</span>
    </RouterLink>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-16">
    <article
      v-for="p in products"
      :key="p.id ?? p.name"
      class="group cursor-pointer rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 hover:shadow-[0_24px_45px_-35px_rgba(0,0,0,0.55)] hover:-translate-y-1 transition-all"
      @click="goToDetail(p)"
    >
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4">
        <div
          class="product-image w-full h-full bg-cover bg-center"
          :style="{ backgroundImage: `url('${p.image}')` }"
          :aria-label="p.alt"
        />

        <button
          class="absolute bottom-3 right-3 h-9 px-3 rounded-full flex items-center justify-center transition-all shadow-lg"
          :class="
            p.isOutOfStock
              ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 opacity-100 cursor-not-allowed'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          "
          type="button"
          :title="p.isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ'"
          :disabled="p.isOutOfStock"
          @click.stop="$emit('addToCart', p)"
        >
          <span class="material-symbols-outlined text-[18px] mr-1">add_shopping_cart</span>
          <span class="text-xs font-semibold">{{ p.isOutOfStock ? 'Hết hàng' : 'Thêm' }}</span>
        </button>

        <div
          v-if="p.badge || p.isOutOfStock"
          class="absolute top-3 left-3 px-3 py-1 backdrop-blur-sm text-[10px] font-bold rounded-full uppercase tracking-widest"
          :class="p.isOutOfStock ? 'bg-red-600/90 text-white' : 'bg-black/70 text-white'"
        >
          {{ p.isOutOfStock ? 'Hết hàng' : p.badge }}
        </div>
      </div>

      <div class="space-y-2">
        <h4 class="font-bold text-[15px] leading-snug text-zinc-900 dark:text-zinc-100 min-h-[2.7rem]">{{ p.name }}</h4>
        <p class="text-zinc-500 dark:text-zinc-400 text-xs italic">{{ p.subtitle || 'Thiết kế thanh lịch, đeo nhẹ cả ngày' }}</p>
        <div class="flex items-center justify-between pt-1">
          <p class="font-extrabold text-zinc-900 dark:text-zinc-100 text-base whitespace-nowrap">{{ p.price }}</p>
          <span
            class="text-[11px] font-semibold px-2 py-1 rounded-full"
            :class="
              p.isOutOfStock
                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
            "
          >
            {{ p.isOutOfStock ? 'Hết hàng' : 'Còn hàng' }}
          </span>
        </div>
      </div>
    </article>
  </section>

  <div class="md:hidden pb-10">
    <RouterLink
      class="inline-flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      :to="viewAllTo"
    >
      {{ viewAllText }}
      <span class="material-symbols-outlined text-base">arrow_outward</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

defineProps({
  title: { type: String, default: 'Best Sellers' },
  subtitle: { type: String, default: 'Our most loved frames this season' },
  viewAllText: { type: String, default: 'View All Collection' },
  viewAllTo: { type: [String, Object], default: '/products' },
  products: { type: Array, required: true },
})

defineEmits(['addToCart'])

const router = useRouter()

function goToDetail(p) {
  const id = p?.id
  if (!id) return
  router.push(`/product/${id}`)
}
</script>

