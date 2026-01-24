<template>
  <div
    class="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-[#0d171b] dark:text-white text-xl font-bold">{{ $t('dashboard.recentOrder') }}</h3>
        <span
          class="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
        >
          {{ $t(`dashboard.${order.statusKey || 'outForDelivery'}`) }}
        </span>
      </div>

      <div class="flex gap-6 items-center">
        <div class="w-32 h-20 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2">
          <img
            :alt="order.productName"
            class="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            :src="order.image"
          />
        </div>
        <div class="flex-1">
          <p class="text-[#0d171b] dark:text-white text-lg font-bold leading-tight">{{ order.productName }}</p>
          <p class="text-[#578e89] dark:text-slate-400 text-sm mt-1">
            {{ $t('dashboard.orderNumber', { number: order.orderNumber }) }} • {{ $t('dashboard.estArrival', { date: order.estimatedArrival }) }}
          </p>
        </div>
      </div>

      <!-- Progress Bar Section -->
      <div class="mt-8">
        <div class="flex justify-between items-center mb-2">
          <p class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ $t('orders.deliveryStatus') }}</p>
          <p class="text-sm font-bold text-primary">{{ order.progress }}% {{ $t('dashboard.complete') }}</p>
        </div>
        <div class="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
            :style="{ width: `${order.progress}%` }"
          ></div>
        </div>
        <div class="flex items-center gap-2 mt-3 text-slate-500 dark:text-slate-400">
          <span class="material-symbols-outlined text-base">local_shipping</span>
          <p class="text-xs font-medium">{{ order.statusMessageKey ? $t(`dashboard.${order.statusMessageKey}`) : order.statusMessage }}</p>
        </div>
      </div>

      <div class="mt-8">
        <button
          class="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          type="button"
        >
          <span class="material-symbols-outlined text-sm">location_on</span>
          {{ $t('common.track') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
  },
})
</script>
