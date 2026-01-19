<template>
  <div class="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-primary text-3xl">local_shipping</span>
      <div>
        <p class="font-bold text-sm">{{ title }}</p>
        <p class="text-xs text-[#5e8487]">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Free Express Shipping' },
  subtitle: { type: String, default: 'Estimated delivery: 2-3 business days' },
})
</script>

