<template>
  <div class="flex justify-center" :class="className">
    <nav class="flex items-center gap-2">
      <button
        class="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f1] dark:border-gray-800 hover:bg-primary hover:text-white transition-colors"
        :disabled="currentPage === 1"
        type="button"
        @click="goToPage(currentPage - 1)"
      >
        <span class="material-symbols-outlined">chevron_left</span>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          class="size-10 flex items-center justify-center rounded-xl font-bold transition-colors"
          :class="
            page === currentPage
              ? 'bg-primary text-white'
              : 'border border-[#e9f1f1] dark:border-gray-800 hover:bg-primary hover:text-white'
          "
          type="button"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 text-[#578e89]">...</span>
      </template>

      <button
        class="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f1] dark:border-gray-800 hover:bg-primary hover:text-white transition-colors"
        :disabled="currentPage === totalPages"
        type="button"
        @click="goToPage(currentPage + 1)"
      >
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
  },
  className: {
    type: String,
    default: 'mt-16',
  },
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  const { currentPage, totalPages } = props

  if (totalPages <= 7) {
    // Hiển thị tất cả nếu <= 7 trang
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Logic hiển thị với ellipsis
    if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>
