<template>
  <div
    class="flex flex-col sm:flex-row gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/70 hover:shadow-[0_20px_40px_-35px_rgba(0,0,0,0.75)] transition-all"
  >
    <div
      class="w-full h-44 sm:w-[30%] sm:min-w-[150px] sm:max-w-[190px] sm:h-auto sm:self-stretch flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
    >
      <img
        :src="item.image"
        :alt="item.alt || item.name"
        class="w-full h-full object-cover object-center"
        loading="lazy"
      />
    </div>

    <div class="flex flex-1 min-w-0 flex-col justify-between py-0.5">
      <div>
        <div class="flex justify-between items-start gap-2 mb-0.5">
          <h3 class="text-base font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100">{{ item.name }}</h3>
          <p class="text-base font-bold text-zinc-900 dark:text-white whitespace-nowrap flex-shrink-0">{{ formatMoney(item.unitPrice ?? item.price) }}</p>
        </div>

        <div class="space-y-0.5">
          <p class="text-zinc-500 dark:text-zinc-400 text-xs">
            {{ $t('cart.frameType') }}:
            <span class="text-zinc-900 dark:text-white font-medium">{{ item.frameType || item.color || '—' }}</span>
          </p>
          <p class="text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1.5">
            {{ $t('cart.color') }}:
            <span
              v-if="item.colorHex"
              class="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-600"
              :style="{ backgroundColor: item.colorHex }"
              :aria-label="$t('cart.color')"
            />
            <span v-else class="text-zinc-900 dark:text-white font-medium">—</span>
          </p>
          <p class="text-zinc-500 dark:text-zinc-400 text-xs">
            {{ $t('cart.lens') }}:
            <span class="text-zinc-900 dark:text-white font-medium">{{ lensDisplayName }}</span>
          </p>
          <div
            v-if="hasPrescription"
            class="mt-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 space-y-1"
          >
            <p class="font-bold text-zinc-900 dark:text-zinc-100">Độ mắt</p>
            <p v-if="rightPrescriptionText">
              Mắt phải: <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ rightPrescriptionText }}</span>
            </p>
            <p v-if="leftPrescriptionText">
              Mắt trái: <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ leftPrescriptionText }}</span>
            </p>
            <p v-if="pdText">
              PD: <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ pdText }}</span>
            </p>
            <p v-if="notesText">
              Ghi chú: <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ notesText }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-3">
          <QuantityStepper v-model="qtyModel" :max="quantityMax" />
          <span
            v-if="hasStockLimit"
            class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400"
          >
            Còn {{ quantityMax }}
          </span>
        </div>

        <button class="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-semibold text-xs hover:text-red-600 dark:hover:text-red-400 transition-colors" type="button" @click="$emit('remove', item.id)">
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

const quantityMax = computed(() => {
  const stock = Number(props.item.stock ?? props.item.stock_quantity ?? 0)
  return Number.isFinite(stock) && stock > 0 ? stock : 99
})

const hasStockLimit = computed(() => quantityMax.value !== 99)

const lensDisplayName = computed(() => {
  const value =
    props.item.lensName ??
    props.item.lens_name ??
    props.item.lens ??
    props.item.lens_option_name ??
    ''
  return String(value).trim() || 'Không chọn lens'
})

const prescription = computed(() => props.item.prescription || null)

const hasPrescription = computed(() => {
  const p = prescription.value
  return !!p && Object.values(p).some((value) => value !== null && value !== undefined && value !== '')
})

function formatPrescriptionNumber(value, digits = 2) {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  return num > 0 ? `+${num.toFixed(digits)}` : num.toFixed(digits)
}

function joinParts(parts) {
  return parts.filter(Boolean).join(', ')
}

const rightPrescriptionText = computed(() =>
  joinParts([
    prescription.value?.right_sphere !== undefined ? `SPH ${formatPrescriptionNumber(prescription.value?.right_sphere)}` : '',
    prescription.value?.right_cylinder !== undefined ? `CYL ${formatPrescriptionNumber(prescription.value?.right_cylinder)}` : '',
    prescription.value?.right_axis !== undefined ? `AXIS ${prescription.value?.right_axis}` : '',
  ]),
)

const leftPrescriptionText = computed(() =>
  joinParts([
    prescription.value?.left_sphere !== undefined ? `SPH ${formatPrescriptionNumber(prescription.value?.left_sphere)}` : '',
    prescription.value?.left_cylinder !== undefined ? `CYL ${formatPrescriptionNumber(prescription.value?.left_cylinder)}` : '',
    prescription.value?.left_axis !== undefined ? `AXIS ${prescription.value?.left_axis}` : '',
  ]),
)

const pdText = computed(() => {
  const value = prescription.value?.pd
  return value === null || value === undefined || value === '' ? '' : String(value)
})

const notesText = computed(() => String(prescription.value?.notes || '').trim())

function formatMoney(value) {
  if (value == null) return '0 đ'
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.,-]/g, '').replace(/,/g, '')) || 0
  const rounded = Math.round(num)
  return `${rounded.toLocaleString('vi-VN')} đ`
}
</script>

