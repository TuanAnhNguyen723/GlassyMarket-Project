<template>
  <div class="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg py-0.5 px-1">
    <button
      class="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
      type="button"
      :disabled="modelValue <= min"
      @click="$emit('update:modelValue', Math.max(min, modelValue - 1))"
    >
      <span class="material-symbols-outlined text-xs font-bold">remove</span>
    </button>
    <span class="text-sm font-semibold min-w-[1.25rem] text-center">{{ modelValue }}</span>
    <button
      class="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
      type="button"
      :disabled="modelValue >= max"
      @click="$emit('update:modelValue', Math.min(max, modelValue + 1))"
    >
      <span class="material-symbols-outlined text-xs font-bold">add</span>
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

