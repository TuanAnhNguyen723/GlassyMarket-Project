<template>
  <div class="flex items-center gap-3 bg-[#eaf0f0] dark:bg-gray-800 rounded-lg p-1">
    <button
      class="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:text-primary transition-colors"
      type="button"
      :disabled="modelValue <= min"
      @click="$emit('update:modelValue', Math.max(min, modelValue - 1))"
    >
      <span class="material-symbols-outlined text-sm font-bold">remove</span>
    </button>
    <span class="text-base font-bold px-2">{{ modelValue }}</span>
    <button
      class="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:text-primary transition-colors"
      type="button"
      :disabled="modelValue >= max"
      @click="$emit('update:modelValue', Math.min(max, modelValue + 1))"
    >
      <span class="material-symbols-outlined text-sm font-bold">add</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
})

defineEmits(['update:modelValue'])
</script>

