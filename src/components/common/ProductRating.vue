<template>
  <div class="flex items-center gap-2" :class="textColorClass">
    <div class="flex">
      <span
        v-for="i in 5"
        :key="i"
        class="material-symbols-outlined"
        :class="[
          sizeClass,
          i <= Math.floor(rating) ? 'fill-amber-400' : '',
          i === Math.ceil(rating) && rating % 1 !== 0 ? 'fill-amber-400' : '',
        ]"
      >
        {{ i <= Math.floor(rating) ? 'star' : i === Math.ceil(rating) && rating % 1 !== 0 ? 'star_half' : 'star' }}
      </span>
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
    type: Number,
    required: true,
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

const sizeClass = computed(() => {
  const sizes = {
    sm: '!text-sm',
    md: 'text-[18px]',
    lg: 'text-xl',
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
