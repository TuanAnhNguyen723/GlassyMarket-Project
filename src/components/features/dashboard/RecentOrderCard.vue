<template>
  <div
    class="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_24px_45px_-38px_rgba(0,0,0,0.8)] overflow-hidden"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4 gap-1">
        <h3
          class="text-zinc-900 dark:text-white text-1xl font-black tracking-tight"
        >
          {{ $t("dashboard.recentOrder") }}
        </h3>
        <div>
          <RouterLink
            v-if="order"
            to="/dashboard/orders"
            class="text-sm font-semibold border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
      </div>

      <!-- Empty state -->
      <div v-if="!order" class="py-8 text-center">
        <span
          class="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-600"
          >package_2</span
        >
        <p class="text-zinc-600 dark:text-zinc-300 font-medium mt-2">
          {{ $t("dashboard.noRecentOrder") }}
        </p>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {{ $t("dashboard.noRecentOrderHint") }}
        </p>
        <RouterLink
          to="/products"
          class="inline-block mt-4 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90"
        >
          {{ $t("cart.continueShopping") }}
        </RouterLink>
      </div>

      <template v-else>
        <div class="flex gap-6 items-center">
          <div
            class="w-32 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden"
          >
            <img
              v-if="displayImage"
              :alt="order.productName"
              class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
              :src="displayImage"
              @error="imageError = true"
            />
            <span
              v-else
              class="w-full h-full flex items-center justify-center material-symbols-outlined text-slate-400 text-3xl"
              >image</span
            >
          </div>
          <div class="flex-1">
            <p
              class="text-zinc-900 dark:text-white text-lg font-bold leading-tight"
            >
              {{ order.productName }}
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              #{{ order.orderNumber }}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <button
            class="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  order: {
    type: Object,
    default: null,
  },
});

defineEmits(["track"]);

const imageError = ref(false);
const displayImage = computed(() => {
  if (imageError.value || !props.order?.image) return "";
  return props.order.image;
});
watch(
  () => props.order?.image,
  () => {
    imageError.value = false;
  },
);
</script>
