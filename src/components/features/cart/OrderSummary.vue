<template>
  <div class="p-5 border border-[#eaf0f0] dark:border-gray-800 rounded-xl bg-white dark:bg-zinc-900/50">
    <h2 class="text-lg font-bold mb-5">{{ $t('cart.orderSummary') }}</h2>

    <div class="space-y-2.5 mb-5 text-sm">
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

    <div class="mb-5">
      <label class="block text-[10px] font-bold uppercase tracking-wider text-[#5e8487] mb-1.5">{{ $t('cart.promoCode') }}</label>
      <div class="flex gap-2">
        <input
          v-model="promoModel"
          class="flex-1 rounded-md border-[#eaf0f0] dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-0 text-xs uppercase font-semibold px-3 py-1.5 placeholder:text-gray-300"
          :placeholder="$t('cart.promoPlaceholder')"
          type="text"
        />
        <button
          class="px-4 py-1.5 text-sm bg-[#eaf0f0] dark:bg-gray-800 text-[#111718] dark:text-white font-semibold rounded-md hover:bg-primary hover:text-white transition-colors"
          type="button"
          @click="$emit('apply-promo', promoModel)"
        >
          {{ $t('cart.apply') }}
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center py-4 border-t border-[#eaf0f0] dark:border-gray-800 mb-5">
      <span class="text-base font-bold">{{ $t('cart.total') }}</span>
      <span class="text-xl font-black tracking-tight text-primary">{{ formatMoney(total) }}</span>
    </div>

    <button
      class="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-sm hover:brightness-105 transition-all shadow-md shadow-primary/20 active:scale-[0.98]"
      type="button"
      @click="$emit('checkout')"
    >
      {{ $t('cart.proceedToCheckout') }}
    </button>

    <div class="mt-4 flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-gray-400 text-sm">lock</span>
      <p class="text-[11px] text-[#5e8487] font-medium text-center">{{ $t('cart.secureCheckout') }}</p>
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

