<template>
  <div class="p-8 border border-[#eaf0f0] dark:border-gray-800 rounded-xl bg-white dark:bg-zinc-900/50">
    <h2 class="text-2xl font-bold mb-8">{{ $t('cart.orderSummary') }}</h2>

    <div class="space-y-4 mb-8">
      <div class="flex justify-between text-[#5e8487] dark:text-gray-400">
        <span>{{ $t('cart.subtotal') }}</span>
        <span class="text-[#111718] dark:text-white font-semibold">{{ formatMoney(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-[#5e8487] dark:text-gray-400">
        <span>{{ $t('cart.shipping') }}</span>
        <span class="text-[#111718] dark:text-white font-semibold">{{ shippingLabel }}</span>
      </div>
      <div class="flex justify-between text-[#5e8487] dark:text-gray-400">
        <span>{{ $t('cart.tax') }}</span>
        <span class="text-[#111718] dark:text-white font-semibold">{{ formatMoney(tax) }}</span>
      </div>
      <div class="flex justify-between text-primary font-semibold pt-2 border-t border-dashed border-[#eaf0f0] dark:border-gray-800">
        <span>{{ $t('cart.promoDiscount') }}</span>
        <span>-{{ formatMoney(discount) }}</span>
      </div>
    </div>

    <div class="mb-8">
      <label class="block text-xs font-bold uppercase tracking-wider text-[#5e8487] mb-2">{{ $t('cart.promoCode') }}</label>
      <div class="flex gap-2">
        <input
          v-model="promoModel"
          class="flex-1 rounded-lg border-[#eaf0f0] dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-0 text-sm uppercase font-bold px-4 py-2 placeholder:text-gray-300"
          :placeholder="$t('cart.promoPlaceholder')"
          type="text"
        />
        <button
          class="px-6 py-2 bg-[#eaf0f0] dark:bg-gray-800 text-[#111718] dark:text-white font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
          type="button"
          @click="$emit('apply-promo', promoModel)"
        >
          {{ $t('cart.apply') }}
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center py-6 border-t border-[#eaf0f0] dark:border-gray-800 mb-8">
      <span class="text-lg font-bold">{{ $t('cart.total') }}</span>
      <span class="text-3xl font-black tracking-tight text-primary">{{ formatMoney(total) }}</span>
    </div>

    <button
      class="w-full bg-primary text-white py-5 rounded-xl font-extrabold text-lg hover:brightness-105 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
      type="button"
      @click="$emit('checkout')"
    >
      {{ $t('cart.proceedToCheckout') }}
    </button>

    <div class="mt-6 flex items-center justify-center gap-4">
      <span class="material-symbols-outlined text-gray-400">lock</span>
      <p class="text-xs text-[#5e8487] font-medium text-center">{{ $t('cart.secureCheckout') }}</p>
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
  const num = Number(value) || 0
  return `$${num.toFixed(2)}`
}
</script>

