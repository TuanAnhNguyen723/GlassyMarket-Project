<template>
  <article
    class="product-card group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-transparent transition-all duration-700 ease-out hover:shadow-lg hover:shadow-black/5"
    :class="{ 'cursor-pointer': clickable }"
    @click="handleClick"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden bg-white dark:bg-gray-900">
      <img
        v-if="product.image || product.imageUrl"
        class="w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        :src="product.image || product.imageUrl"
        :alt="product.alt || product.name || 'Product image'"
        @error="handleImageError"
      />
      <!-- Placeholder when no image -->
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
      >
        <div class="text-center p-4">
          <span class="material-symbols-outlined text-6xl text-primary/40">image</span>
          <p class="text-xs text-primary/60 mt-2 font-medium">No Image</p>
        </div>
      </div>

      <div v-if="product.badge" class="absolute top-4 left-4">
        <span
          class="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
        >
          {{ product.badge }}
        </span>
      </div>

      <!-- (Giữ lại quick-view cho chỗ khác dùng) -->
      <div
        v-if="showQuickView"
        class="quick-view-btn absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 flex items-center justify-center transition-all duration-300 translate-y-2 group-hover:opacity-100"
      >
        <button
          class="bg-white text-[#101918] px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
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

    <!-- Content -->
    <div class="px-4 pb-5 pt-4">
      <!-- Brand/Category -->
      <p class="text-[11px] font-extrabold tracking-widest uppercase text-zinc-400 mb-1">
        {{ (product.brand || product.category || '').toString() }}
      </p>

      <!-- Name -->
      <h3 class="text-sm font-extrabold tracking-wide uppercase text-zinc-800 dark:text-zinc-100 leading-snug">
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="mt-2 flex items-baseline gap-2">
        <span
          v-if="product.comparePrice"
          class="text-sm font-bold text-zinc-900 dark:text-zinc-200 line-through"
        >
          {{ formatPrice(product.comparePrice) }}
        </span>
        <span class="text-sm font-extrabold text-red-600">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Colors -->
      <div v-if="product.colors && product.colors.length" class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="(color, index) in product.colors.slice(0, 6)"
          :key="color.id || index"
          class="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ring-1 ring-black/25"
          :style="{ backgroundColor: color.hex || '#ffffff' }"
          :title="color.name"
        />
      </div>

      <!-- Rating (nếu muốn dùng ở nơi khác) -->
      <ProductRating
        v-if="showRating && product.rating"
        class="mt-3"
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
const imageError = ref(false)

// Placeholder image URL
const placeholderImage = 'https://via.placeholder.com/400x500/59b7c0/ffffff?text=Product+Image'

const handleImageError = (event) => {
  // If image fails to load, use placeholder
  if (event.target.src !== placeholderImage) {
    event.target.src = placeholderImage
  }
  imageError.value = true
}

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
  // Normalize to number (handle "$1,234,567.00", "1,234,567.00", 1234567, etc.)
  let value = 0

  if (typeof price === 'number') {
    value = price
  } else if (typeof price === 'string') {
    // Keep digits, separators and minus; then remove thousands commas
    const cleaned = price.replace(/[^0-9.,-]/g, '').replace(/,/g, '')
    const parsed = Number.parseFloat(cleaned)
    value = Number.isNaN(parsed) ? 0 : parsed
  }

  // VND: no decimals
  const vnd = Math.round(value)
  return `${vnd.toLocaleString('vi-VN')} đ`
}
</script>
