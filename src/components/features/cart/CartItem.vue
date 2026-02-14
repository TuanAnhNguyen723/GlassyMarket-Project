<template>
  <div
    class="flex flex-col sm:flex-row gap-4 p-4 border border-[#eaf0f0] dark:border-gray-800 rounded-lg bg-white dark:bg-zinc-900/50"
  >
    <div
      class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-full sm:w-20 lg:w-24 flex-shrink-0 bg-[#f9fbfb]"
      :style="{ backgroundImage: `url('${item.image}')` }"
      :aria-label="item.alt || item.name"
    />

    <div class="flex flex-1 min-w-0 flex-col justify-between py-0.5">
      <div>
        <div class="flex justify-between items-start gap-2 mb-0.5">
          <h3 class="text-base font-semibold line-clamp-2">{{ item.name }}</h3>
          <p class="text-base font-semibold text-[#111718] dark:text-white whitespace-nowrap flex-shrink-0">{{ formatMoney(item.price) }}</p>
        </div>

        <div class="space-y-0.5">
          <p class="text-[#5e8487] dark:text-gray-400 text-xs">
            {{ $t('cart.frameType') }}:
            <span class="text-[#111718] dark:text-white font-medium">{{ item.frameType || item.color || '—' }}</span>
          </p>
          <p class="text-[#5e8487] dark:text-gray-400 text-xs flex items-center gap-1.5">
            {{ $t('cart.color') }}:
            <span
              v-if="item.colorHex"
              class="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0 ring-1 ring-slate-200 dark:ring-slate-600"
              :style="{ backgroundColor: item.colorHex }"
              :aria-label="$t('cart.color')"
            />
            <span v-else class="text-[#111718] dark:text-white font-medium">—</span>
          </p>
          <p class="text-[#5e8487] dark:text-gray-400 text-xs">
            {{ $t('cart.lens') }}:
            <span class="text-[#111718] dark:text-white font-medium">{{ item.lens }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <QuantityStepper v-model="qtyModel" />

        <button class="flex items-center gap-1 text-primary font-semibold text-xs hover:underline" type="button" @click="$emit('remove', item.id)">
          <span class="material-symbols-outlined text-base">delete</span>
          {{ $t('cart.remove') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import QuantityStepper from './QuantityStepper.vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['update:quantity', 'remove'])

const qtyModel = computed({
  get: () => props.item.quantity,
  set: (v) => emit('update:quantity', { id: props.item.id, quantity: v }),
})

function formatMoney(value) {
  if (value == null) return '0 đ'
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.,-]/g, '').replace(/,/g, '')) || 0
  const rounded = Math.round(num)
  return `${rounded.toLocaleString('vi-VN')} đ`
}
</script>

