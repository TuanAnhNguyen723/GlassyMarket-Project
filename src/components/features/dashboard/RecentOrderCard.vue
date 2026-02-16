<template>
  <div
    class="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-[#0d171b] dark:text-white text-xl font-bold">
          {{ $t("dashboard.recentOrder") }}
        </h3>
        <RouterLink
          v-if="order"
          to="/dashboard/orders"
          class="text-primary text-sm font-bold hover:underline"
        >
          {{ $t("common.viewAll") }}
        </RouterLink>
        <span
          v-if="order"
          class="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
        >
          {{ $t(`dashboard.${order.statusKey || "orderStatusPending"}`) }}
        </span>
      </div>

      <!-- Empty state -->
      <div v-if="!order" class="py-8 text-center">
        <span
          class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600"
          >package_2</span
        >
        <p class="text-slate-600 dark:text-slate-400 font-medium mt-2">
          {{ $t("dashboard.noRecentOrder") }}
        </p>
        <p class="text-slate-500 dark:text-slate-500 text-sm mt-1">
          {{ $t("dashboard.noRecentOrderHint") }}
        </p>
        <RouterLink
          to="/products"
          class="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90"
        >
          {{ $t("cart.continueShopping") }}
        </RouterLink>
      </div>

      <template v-else>
        <div class="flex gap-6 items-center">
          <div
            class="w-32 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden"
          >
            <img
              v-if="order.image"
              :alt="order.productName"
              class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
              :src="order.image"
            />
            <span
              v-else
              class="material-symbols-outlined text-slate-400 text-3xl"
              >image</span
            >
          </div>
          <div class="flex-1">
            <p
              class="text-[#0d171b] dark:text-white text-lg font-bold leading-tight"
            >
              {{ order.productName }}
            </p>
            <p class="text-[#578e89] dark:text-slate-400 text-sm mt-1">
              #{{ order.orderNumber }}
            </p>
          </div>
        </div>

        <!-- Progress Bar Section (chỉ khi không phải cancelled) -->
        <div v-if="order.status !== 'cancelled'" class="mt-8">
          <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-bold text-slate-700 dark:text-slate-300">
              {{ $t("orders.deliveryStatus") }}
            </p>
            <p class="text-sm font-bold text-primary">
              {{ order.progress }}% {{ $t("dashboard.complete") }}
            </p>
          </div>
          <div
            class="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              class="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: `${order.progress}%` }"
            ></div>
          </div>
          <div
            v-if="order.statusMessageKey || order.statusMessage"
            class="flex items-center gap-2 mt-3 text-slate-500 dark:text-slate-400"
          >
            <span class="material-symbols-outlined text-base"
              >local_shipping</span
            >
            <p class="text-xs font-medium">
              {{
                order.statusMessageKey
                  ? $t(`dashboard.${order.statusMessageKey}`)
                  : order.statusMessage
              }}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <button
            class="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            type="button"
            @click="$emit('track', order)"
          >
            <span class="material-symbols-outlined text-sm">location_on</span>
            {{ $t("common.track") }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  order: {
    type: Object,
    default: null,
  },
});

defineEmits(["track"]);
</script>
