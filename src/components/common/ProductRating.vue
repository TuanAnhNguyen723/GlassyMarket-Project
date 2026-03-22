<template>
  <div class="flex items-center gap-2" :class="textColorClass">
    <div class="flex items-center gap-0.5" :class="sizeClass">
      <template v-for="i in 5" :key="i">
        <!-- Ngôi sao đầy -->
        <svg
          v-if="normalizedRating >= i"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="text-amber-400"
          :class="sizeSvgClass"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <!-- Ngôi sao nửa: dùng clip-path để hiển thị phần vàng bên trái -->
        <span
          v-else-if="normalizedRating > i - 1 && normalizedRating < i"
          class="relative inline-block"
          :class="sizeSvgClass"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-600"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span
            class="absolute inset-0 w-full h-full"
            :style="{ clipPath: `inset(0 ${(1 - (normalizedRating - (i - 1))) * 100}% 0 0)` }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="absolute inset-0 w-full h-full text-amber-400"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
        </span>
        <!-- Ngôi sao trống -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="text-slate-200 dark:text-slate-600"
          :class="sizeSvgClass"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </template>
    </div>
    <span v-if="showReviews" :class="reviewsTextClass">
      {{ showReviewsCount ? `(${reviews})` : reviewsText }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: [Number, String],
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: 'sm', // 'sm' | 'md' | 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  showReviews: {
    type: Boolean,
    default: true,
  },
  showReviewsCount: {
    type: Boolean,
    default: true,
  },
  reviewsText: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: 'yellow', // 'yellow' | 'amber'
  },
})

const normalizedRating = computed(() => {
  const r = props.rating
  if (typeof r === 'number' && !Number.isNaN(r)) return Math.min(5, Math.max(0, r))
  const n = Number(String(r).replace(/[^0-9.]/g, ''))
  return Number.isNaN(n) ? 0 : Math.min(5, Math.max(0, n))
})

const sizeClass = computed(() => {
  const sizes = {
    sm: '!text-sm',
    md: 'text-[18px]',
    lg: 'text-xl',
  }
  return sizes[props.size] || sizes.sm
})

const sizeSvgClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  return sizes[props.size] || sizes.sm
})

const textColorClass = computed(() => {
  return props.textColor === 'yellow' ? 'text-yellow-500' : 'text-amber-400'
})

const reviewsTextClass = computed(() => {
  if (props.size === 'sm') {
    return 'text-[10px] text-[#578e89] font-bold'
  }
  return 'text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer'
})
</script>
