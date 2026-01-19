<template>
  <article
    class="product-card group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-[#e9f1f1] dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
    :class="{ 'cursor-pointer': clickable }"
    @click="handleClick"
  >
    <div class="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-800">
      <img
        v-if="product.image"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :src="product.image"
        :alt="product.alt || product.name"
      />
      <div
        v-else-if="product.imageUrl"
        class="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
        :style="{ backgroundImage: `url('${product.imageUrl}')` }"
        :aria-label="product.alt || product.name"
      ></div>

      <div v-if="product.badge" class="absolute top-4 left-4">
        <span
          class="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded"
        >
          {{ product.badge }}
        </span>
      </div>

      <div
        v-if="showQuickView"
        class="quick-view-btn absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 flex items-center justify-center transition-all duration-300 translate-y-4"
      >
        <button
          class="bg-white text-[#101918] px-6 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          type="button"
          @click.stop="handleQuickView"
        >
          <span class="material-symbols-outlined !text-lg">visibility</span>
          Quick View
        </button>
      </div>

      <button
        v-if="showFavorite"
        class="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        type="button"
        @click.stop="toggleFavorite"
      >
        <span class="material-symbols-outlined text-[20px]">{{ isFav ? 'favorite' : 'favorite_border' }}</span>
      </button>
    </div>

    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <div>
          <p v-if="product.category" class="text-xs text-[#578e89] font-medium mb-1">{{ product.category }}</p>
          <h3 class="text-lg font-bold">{{ product.name }}</h3>
        </div>
        <span class="text-lg font-black text-primary">{{ formatPrice(product.price) }}</span>
      </div>

      <ProductRating
        v-if="showRating && product.rating"
        :rating="product.rating"
        :reviews="product.reviews || 0"
        size="sm"
        :show-reviews-count="true"
      />
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductRating from '@/components/common/ProductRating.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  showQuickView: {
    type: Boolean,
    default: true,
  },
  showFavorite: {
    type: Boolean,
    default: false,
  },
  showRating: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click', 'quick-view', 'favorite'])

const router = useRouter()
const isFav = ref(false)

const handleClick = () => {
  if (props.clickable && props.product.id) {
    router.push(`/product/${props.product.id}`)
  }
  emit('click', props.product)
}

const handleQuickView = () => {
  emit('quick-view', props.product)
}

const toggleFavorite = () => {
  isFav.value = !isFav.value
  emit('favorite', { product: props.product, isFavorite: isFav.value })
}

const formatPrice = (price) => {
  if (typeof price === 'string' && price.startsWith('$')) {
    return price
  }
  return `$${price}`
}
</script>
