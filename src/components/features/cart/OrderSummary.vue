<template>
  <div class="p-5 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/80 shadow-[0_24px_45px_-38px_rgba(0,0,0,0.8)]">
    <h2 class="text-xl font-black tracking-tight mb-5 text-zinc-900 dark:text-zinc-100">{{ $t('cart.orderSummary') }}</h2>

    <div class="space-y-2.5 mb-5 text-sm">
      <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
        <span>{{ $t('cart.subtotal') }}</span>
        <span class="text-zinc-900 dark:text-white font-semibold">{{ formatMoney(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
        <span>{{ $t('cart.shipping') }}</span>
        <span class="text-zinc-900 dark:text-white font-semibold">{{ shippingLabel }}</span>
      </div>
      <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
        <span>{{ $t('cart.tax') }}</span>
        <span class="text-zinc-900 dark:text-white font-semibold">{{ formatMoney(tax) }}</span>
      </div>
      <div class="flex justify-between text-zinc-700 dark:text-zinc-200 font-semibold pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
        <span>{{ $t('cart.promoDiscount') }}</span>
        <span>-{{ formatMoney(discount) }}</span>
      </div>
    </div>

    <div class="mb-5">
      <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">{{ $t('cart.promoCode') }}</label>
      <div class="flex gap-2">
        <input
          v-model="promoModel"
          class="flex-1 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 text-xs uppercase font-semibold px-3 py-2 placeholder:text-zinc-300"
          :placeholder="$t('cart.promoPlaceholder')"
          type="text"
        />
        <button
          class="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
          type="button"
          @click="$emit('apply-promo', promoModel)"
        >
          {{ $t('cart.apply') }}
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center py-4 border-t border-zinc-200 dark:border-zinc-800 mb-5">
      <span class="text-base font-bold">{{ $t('cart.total') }}</span>
      <span class="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{{ formatMoney(total) }}</span>
    </div>

    <button
      class="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98]"
      type="button"
      @click="$emit('checkout')"
    >
      {{ $t('cart.proceedToCheckout') }}
    </button>

    <div class="mt-4 flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-zinc-400 text-sm">lock</span>
      <p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium text-center">{{ $t('cart.secureCheckout') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, required: true },
  shippingLabel: { type: String, default: 'Free' },
  promoCode: { type: String, default: '' },
})

defineEmits(['apply-promo', 'checkout'])

const promoModel = defineModel('promoCode', { type: String })

const total = computed(() => Math.max(0, props.subtotal + props.tax - props.discount))

function formatMoney(value) {
  if (value == null) return '0 đ'
  const num = Number(value) || 0
  const rounded = Math.round(num)
  return `${rounded.toLocaleString('vi-VN')} đ`
}
</script>

