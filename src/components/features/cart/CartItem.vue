<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-6 border border-[#eaf0f0] dark:border-gray-800 rounded-xl bg-white dark:bg-zinc-900/50"
  >
    <div
      class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-full sm:w-32 lg:w-40 bg-[#f9fbfb]"
      :style="{ backgroundImage: `url('${item.image}')` }"
      :aria-label="item.alt || item.name"
    />

    <div class="flex flex-1 flex-col justify-between py-1">
      <div>
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-xl font-bold">{{ item.name }}</h3>
          <p class="text-xl font-bold">{{ formatMoney(item.price) }}</p>
        </div>

        <div class="space-y-1">
          <p class="text-[#5e8487] dark:text-gray-400 text-sm">
            Color:
            <span class="text-[#111718] dark:text-white font-medium">{{ item.color }}</span>
          </p>
          <p class="text-[#5e8487] dark:text-gray-400 text-sm">
            Lens:
            <span class="text-[#111718] dark:text-white font-medium">{{ item.lens }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <QuantityStepper v-model="qtyModel" />

        <button class="flex items-center gap-1.5 text-primary font-bold text-sm hover:underline" type="button" @click="$emit('remove', item.id)">
          <span class="material-symbols-outlined text-lg">delete</span>
          Remove
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
  if (typeof value === 'string' && value.startsWith('$')) return value
  const num = Number(value) || 0
  return `$${num.toFixed(2)}`
}
</script>

