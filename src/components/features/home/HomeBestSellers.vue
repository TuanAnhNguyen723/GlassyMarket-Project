<template>
  <section class="flex items-end justify-between mb-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">{{ title }}</h2>
      <p class="text-zinc-500">{{ subtitle }}</p>
    </div>
    <RouterLink class="text-primary font-bold text-sm flex items-center gap-1 hover:underline" :to="viewAllTo">
      {{ viewAllText }}
      <span class="material-symbols-outlined text-xs">open_in_new</span>
    </RouterLink>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-24">
    <article v-for="p in products" :key="p.name" class="product-card group cursor-pointer">
      <div class="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-4">
        <div
          class="product-image w-full h-full bg-cover bg-center"
          :style="{ backgroundImage: `url('${p.image}')` }"
          :aria-label="p.alt"
        />

        <button
          class="absolute bottom-4 right-4 size-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0"
          type="button"
          title="Thêm vào giỏ"
          @click.stop="$emit('addToCart', p)"
        >
          <span class="material-symbols-outlined text-xl">add_shopping_cart</span>
        </button>

        <div
          v-if="p.badge"
          class="absolute top-4 left-4 px-3 py-1 backdrop-blur-sm text-[10px] font-bold rounded-full uppercase tracking-widest"
          :class="p.badge === 'New' ? 'bg-primary text-white' : 'bg-white/90 dark:bg-zinc-800/90'"
        >
          {{ p.badge }}
        </div>
      </div>

      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-lg">{{ p.name }}</h4>
          <p class="text-zinc-500 text-sm italic">{{ p.subtitle }}</p>
        </div>
        <p class="font-black text-primary">{{ p.price }}</p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: { type: String, default: 'Best Sellers' },
  subtitle: { type: String, default: 'Our most loved frames this season' },
  viewAllText: { type: String, default: 'View All Collection' },
  viewAllTo: { type: [String, Object], default: '/products' },
  products: { type: Array, required: true },
})

defineEmits(['addToCart'])
</script>

