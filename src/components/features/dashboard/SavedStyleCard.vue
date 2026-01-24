<template>
  <div
    class="product-card group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
  >
    <div class="relative w-full aspect-[4/3] bg-slate-50 dark:bg-slate-800 overflow-hidden">
      <div class="absolute top-3 right-3 z-10">
        <button
          class="w-9 h-9 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 rounded-full text-primary shadow-sm hover:scale-110 transition-transform"
          type="button"
          @click.stop="$emit('toggle-favorite', product.id)"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">favorite</span>
        </button>
      </div>
      <div
        class="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
        :style="{ backgroundImage: `url('${product.image}')` }"
        :aria-label="product.alt || product.name"
      ></div>
      <!-- Quick Actions Overlay -->
      <div
        class="quick-actions absolute inset-0 bg-black/5 flex flex-col items-center justify-center gap-3 opacity-0 transform translate-y-4 transition-all duration-300"
      >
        <button
          class="w-[85%] py-3 bg-primary text-white rounded-lg font-bold text-sm shadow-lg hover:bg-primary/90 transition-colors"
          type="button"
          @click.stop="$emit('add-to-cart', product.id)"
        >
          {{ $t('savedStyles.addToCart') }}
        </button>
        <button
          class="w-[85%] py-3 bg-white text-[#0d171c] dark:text-white dark:bg-slate-800 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          type="button"
          @click.stop="$emit('virtual-try-on', product.id)"
        >
          <span class="material-symbols-outlined text-[18px]">visibility</span>
          {{ $t('savedStyles.virtualTryOn') }}
        </button>
      </div>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-1">
        <p class="text-lg font-bold leading-tight text-[#0d171c] dark:text-white">{{ product.name }}</p>
      </div>
      <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">{{ product.description }}</p>
      <div class="mt-auto flex items-center justify-between">
        <p class="text-xl font-extrabold text-[#0d171c] dark:text-white">{{ product.price }}</p>
        <div v-if="product.colors && product.colors.length > 0" class="flex gap-1">
          <div
            v-for="(color, index) in product.colors"
            :key="index"
            class="size-3 rounded-full border border-slate-200"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle-favorite', 'add-to-cart', 'virtual-try-on'])
</script>

<style scoped>
.product-card:hover .quick-actions {
  opacity: 1;
  transform: translateY(0);
}
</style>
