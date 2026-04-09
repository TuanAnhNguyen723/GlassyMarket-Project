<template>
  <div class="mt-4 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-zinc-900 dark:text-zinc-100 text-3xl">local_shipping</span>
      <div>
        <p class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ title || $t('cart.freeShipping') }}</p>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ subtitle || $t('cart.estimatedDelivery') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

