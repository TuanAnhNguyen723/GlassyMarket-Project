<template>
  <div
    class="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
  >
    <div class="flex flex-1 items-start gap-6 w-full">
      <div
        class="w-32 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl bg-center bg-no-repeat bg-contain"
        :style="{ backgroundImage: `url('${order.image}')` }"
        :aria-label="order.productName"
      ></div>
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-3">
          <span
            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            :class="statusClasses[order.status]"
          >
            {{ order.status }}
          </span>
          <p class="text-slate-400 dark:text-slate-500 text-xs">{{ order.statusMessage }}</p>
        </div>
        <p class="text-slate-900 dark:text-white text-base font-bold">{{ order.orderNumber }}</p>
        <p class="text-slate-500 dark:text-slate-400 text-xs">
          Ordered on {{ order.orderDate }} • <span class="font-semibold text-slate-900 dark:text-slate-200">${{ order.total }}</span>
        </p>
      </div>
    </div>
    <div class="flex gap-3 w-full md:w-auto">
      <button
        v-for="(action, index) in order.actions"
        :key="index"
        class="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all"
        :class="action.classes"
        type="button"
        @click="handleAction(action.type, order)"
      >
        <span v-if="action.icon" class="material-symbols-outlined text-lg">{{ action.icon }}</span>
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['action'])

const statusClasses = {
  Shipped: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Delivered: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Processing: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  Cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

const handleAction = (type, order) => {
  emit('action', { type, order })
}
</script>
