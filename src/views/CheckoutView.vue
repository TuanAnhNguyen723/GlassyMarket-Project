<template>
  <main class="relative flex-1 max-w-[1280px] mx-auto w-full px-5 sm:px-8 lg:px-14 py-8 lg:py-10">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl" />
    <Breadcrumbs
      :items="[
        { label: $t('products.home'), to: '/' },
        { label: $t('checkout.breadcrumbCart'), to: '/cart' },
        { label: $t('checkout.breadcrumbCheckout') },
      ]"
      class-name="mb-8"
      link-class="text-[#5e8487] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
      current-class="text-sm font-semibold text-[#111718] dark:text-white"
      separator-class="text-[#5e8487] dark:text-gray-600 text-sm"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- Left: Checkout steps -->
      <div class="lg:col-span-7 space-y-6">
        <div class="mb-6">
          <h1 class="text-3xl lg:text-4xl font-black tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
            {{ $t('checkout.title') }}
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm">
            {{ $t('checkout.subtitle') }}
          </p>
        </div>

        <!-- Step 1: Shipping -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 1 ? null : 1"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                1
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t('checkout.step1') }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 1 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 1" class="p-6 space-y-4">
            <label class="block">
              <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                $t('checkout.shippingName')
              }}</span>
              <input
                v-model="shipping.name"
                class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                type="text"
              />
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="block">
                <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                  $t('checkout.shippingPhone')
                }}</span>
                <input
                  v-model="shipping.phone"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="tel"
                />
              </label>
              <label class="block">
                <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                  $t('checkout.shippingEmail')
                }}</span>
                <input
                  v-model="shipping.email"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="email"
                />
              </label>
            </div>
            <label class="block">
              <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                $t('checkout.shippingAddress')
              }}</span>
              <input
                v-model="shipping.address"
                class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                type="text"
              />
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label class="block">
                <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                  $t('checkout.city')
                }}</span>
                <input
                  v-model="shipping.city"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="text"
                />
              </label>
              <label class="block">
                <span class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block">{{
                  $t('checkout.state')
                }}</span>
                <input
                  v-model="shipping.state"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="text"
                />
              </label>
              <label class="block">
                <span class="text-sm font-bold text-[#111718] dark:text-white mb-1.5 block">{{
                  $t('checkout.zipCode')
                }}</span>
                <input
                  v-model="shipping.zip_code"
                  class="w-full rounded-lg border border-[#eaf0f0] dark:border-gray-700 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary focus:border-primary h-11 px-4 text-sm"
                  type="text"
                />
              </label>
            </div>
          </div>
        </section>

        <!-- Step 2: Delivery -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 2 ? null : 2"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                2
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t('checkout.step2') }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 2 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 2" class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  deliveryMethod === 'standard'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="deliveryMethod"
                  class="sr-only"
                  type="radio"
                  value="standard"
                />
                <span class="flex-1">
                  <span class="block text-sm font-bold text-zinc-900 dark:text-white">{{
                    $t('checkout.deliveryStandard')
                  }}</span>
                  <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{{
                    $t('checkout.deliveryStandardDays')
                  }}</span>
                  <span class="mt-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ $t('cart.free') }}</span>
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="deliveryMethod === 'standard' ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-300 dark:text-gray-600'"
                >
                  {{ deliveryMethod === 'standard' ? 'check_circle' : 'circle' }}
                </span>
              </label>
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  deliveryMethod === 'express'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="deliveryMethod"
                  class="sr-only"
                  type="radio"
                  value="express"
                />
                <span class="flex-1">
                  <span class="block text-sm font-bold text-zinc-900 dark:text-white">{{
                    $t('checkout.deliveryExpress')
                  }}</span>
                  <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{{
                    $t('checkout.deliveryExpressDays')
                  }}</span>
                  <span class="mt-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">{{
                    formatPrice(expressShippingFee)
                  }}</span>
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="deliveryMethod === 'express' ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-300 dark:text-gray-600'"
                >
                  {{ deliveryMethod === 'express' ? 'check_circle' : 'circle' }}
                </span>
              </label>
            </div>
          </div>
        </section>

        <!-- Step 3: Chọn phương thức thanh toán (trước khi tạo đơn) -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 3 ? null : 3"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                3
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t('checkout.step3') }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 3 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 3" class="p-6 space-y-4">
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              {{ $t('checkout.selectPaymentMethod') }}
            </p>
            <p v-if="paymentMethod === 'momo' || paymentMethod === 'vnpay'" class="text-xs text-amber-600 dark:text-amber-400 mb-2">
              {{ $t('checkout.paymentDemoNote') }}
            </p>
            <div class="space-y-3">
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  paymentMethod === 'momo'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="paymentMethod"
                  class="sr-only"
                  type="radio"
                  value="momo"
                />
                <span class="flex-1 font-semibold text-sm text-zinc-900 dark:text-white">
                  {{ $t('checkout.payWithMomo') }}
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="paymentMethod === 'momo' ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-300 dark:text-gray-600'"
                >
                  {{ paymentMethod === 'momo' ? 'check_circle' : 'circle' }}
                </span>
              </label>
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  paymentMethod === 'vnpay'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="paymentMethod"
                  class="sr-only"
                  type="radio"
                  value="vnpay"
                />
                <span class="flex-1 font-semibold text-sm text-zinc-900 dark:text-white">
                  {{ $t('checkout.payWithVNPay') }}
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="paymentMethod === 'vnpay' ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-300 dark:text-gray-600'"
                >
                  {{ paymentMethod === 'vnpay' ? 'check_circle' : 'circle' }}
                </span>
              </label>
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  paymentMethod === 'direct'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="paymentMethod"
                  class="sr-only"
                  type="radio"
                  value="direct"
                />
                <span class="flex-1 font-semibold text-sm text-zinc-900 dark:text-white">
                  {{ $t('checkout.payDirect') }}
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="paymentMethod === 'direct' ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-300 dark:text-gray-600'"
                >
                  {{ paymentMethod === 'direct' ? 'check_circle' : 'circle' }}
                </span>
              </label>
            </div>
          </div>
        </section>

        <!-- Thanh toán (tạo đơn kèm payment_method → backend set paid/pending) -->
        <button
          type="button"
          class="w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-zinc-900 font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isPlacingOrder || !canPlaceOrder"
          @click="placeOrder"
        >
          <span v-if="isPlacingOrder" class="animate-pulse">...</span>
          <span v-else class="material-symbols-outlined">verified_user</span>
          {{ $t('checkout.placeOrder') }} - {{ formatPrice(grandTotal) }}
        </button>
      </div>

      <!-- Right: Order Summary -->
      <aside class="lg:col-span-5 lg:sticky lg:top-24">
        <div
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/80 p-6 space-y-6 shadow-[0_24px_45px_-38px_rgba(0,0,0,0.8)]"
        >
          <h2 class="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
            {{ $t('cart.orderSummary') }}
          </h2>

          <div v-if="!cartItems.length" class="py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            {{ $t('cart.emptyMessage') }}
          </div>
          <template v-else>
            <div class="space-y-4 max-h-[280px] overflow-y-auto pr-1">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-3"
              >
                <div
                  class="size-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 bg-cover bg-center"
                  :style="{ backgroundImage: item.image ? `url('${item.image}')` : '' }"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    x{{ item.quantity }}
                  </p>
                  <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    {{ formatPrice(parsePrice(item.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  class="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm h-10 px-3 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
                  :placeholder="$t('checkout.promoCode')"
                  type="text"
                />
                <button
                  type="button"
                  class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 rounded-xl text-sm font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
                >
                  {{ $t('checkout.apply') }}
                </button>
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm">
              <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>{{ $t('cart.subtotal') }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">{{ formatPrice(cartSubtotal) }}</span>
              </div>
              <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>{{ $t('cart.shipping') }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">
                  {{ deliveryMethod === 'express' ? formatPrice(expressShippingFee) : $t('cart.free') }}
                </span>
              </div>
              <div class="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>{{ $t('checkout.estimatedTax') }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">{{ formatPrice(cartTax) }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span class="font-bold text-zinc-900 dark:text-white">{{ $t('cart.total') }}</span>
                <span class="text-xl font-black text-zinc-900 dark:text-zinc-100">{{ formatPrice(grandTotal) }}</span>
              </div>
            </div>
          </template>
        </div>

        <div class="mt-4 flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
          <span class="material-symbols-outlined text-lg">lock</span>
          <span class="text-xs font-medium">{{ $t('checkout.secureBadge') }}</span>
        </div>
        <p class="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {{ $t('checkout.termsNote') }}
          <RouterLink to="/" class="underline hover:text-primary">{{ $t('checkout.terms') }}</RouterLink>
          {{ $t('checkout.termsAnd') }}
          <RouterLink to="/" class="underline hover:text-primary">{{ $t('checkout.privacy') }}</RouterLink>.
        </p>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import { useCart } from '@/composables/useCart.js'
import { useAuth } from '@/composables/useAuth.js'
import orderService from '@/services/orderService.js'
import { useNotification } from '@/composables/useNotification.js'
import { invalidateOrders, invalidateProducts, invalidateProductDetail } from '@/utils/cache.js'

const { t: $t } = useI18n()
const { user } = useAuth()
const router = useRouter()
const cart = useCart()
const cartItems = cart.items
const cartSubtotal = cart.subtotal
const cartTax = cart.tax
const { showNotification } = useNotification()

const stepOpen = ref(1)
const deliveryMethod = ref('standard')
const paymentMethod = ref(null) // 'momo' | 'vnpay' | 'direct' → backend set paid / pending
const expressShippingFee = 15000
const promoCode = ref('')
const shipping = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
})

const isPlacingOrder = ref(false)

function parsePrice(value) {
  if (value == null) return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  const cleaned = String(value).replace(/[^0-9.,-]/g, '').replace(/,/g, '')
  const num = Number.parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

function formatPrice(price) {
  const num = Math.round(parsePrice(price))
  return `${num.toLocaleString('vi-VN')} đ`
}

const shippingTotal = computed(() =>
  deliveryMethod.value === 'express' ? expressShippingFee : 0
)

const grandTotal = computed(() => {
  const sub = (cartSubtotal?.value ?? cartSubtotal) ?? 0
  const tax = (cartTax?.value ?? cartTax) ?? 0
  const ship = shippingTotal.value
  const discount = 0
  return Math.max(0, sub + tax + ship - discount)
})

const canPlaceOrder = computed(() => {
  if (!(cartItems.value ?? []).length) return false
  const s = shipping.value
  const hasShipping = !!(
    s.name?.trim() &&
    s.phone?.trim() &&
    s.email?.trim() &&
    s.address?.trim()
  )
  const hasPayment = paymentMethod.value === 'momo' || paymentMethod.value === 'vnpay' || paymentMethod.value === 'direct'
  return hasShipping && hasPayment
})

function isPaymentMethodValidationError(err) {
  const msg = String(err?.message || '').toLowerCase()
  return err?.status === 422 && msg.includes('payment method')
}

function getPaymentMethodCandidates(uiMethod) {
  if (uiMethod === 'momo') return ['momo']
  if (uiMethod === 'vnpay') return ['vnpay', 'vnpay']
  if (uiMethod === 'direct') return ['cod', 'cash', 'direct']
  return []
}

async function placeOrder() {
  if (!canPlaceOrder.value || isPlacingOrder.value) return
  isPlacingOrder.value = true
  try {
    const items = (cartItems.value ?? []).map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: parsePrice(i.price),
      lens_id: i.lensId ?? null,
    }))
    const s = shipping.value
    const name = (s.name && String(s.name).trim()) || ''
    const phone = (s.phone && String(s.phone).trim()) || ''
    const email = (s.email && String(s.email).trim()) || ''
    const address = (s.address && String(s.address).trim()) || ''

    if (!name || !phone || !email || !address) {
      showNotification({
        message: $t('checkout.errorShippingRequired'),
        type: 'error',
        duration: 4000,
      })
      isPlacingOrder.value = false
      return
    }

    const method = paymentMethod.value
    if (method !== 'momo' && method !== 'vnpay' && method !== 'direct') {
      showNotification({
        message: $t('checkout.errorPaymentRequired'),
        type: 'error',
        duration: 4000,
      })
      isPlacingOrder.value = false
      return
    }
    // payment_status: 'paid' (momo/vnpay) hoặc 'pending' (direct) — backend cần lưu vào DB (status / payment_status)
    const paymentStatus = method === 'momo' || method === 'vnpay' ? 'paid' : 'pending'
    const basePayload = {
      shipping_name: name,
      shipping_phone: phone,
      shipping_email: email,
      shipping_address: address,
      shipping: {
        name,
        phone,
        email,
        address,
        city: (s.city && String(s.city).trim()) || null,
        state: (s.state && String(s.state).trim()) || null,
        zip_code: (s.zip_code && String(s.zip_code).trim()) || null,
      },
      items,
      delivery_method: deliveryMethod.value,
      payment_status: paymentStatus,
      status: paymentStatus === 'paid' ? 'completed' : 'pending',
    }
    // Gửi user_id khi đã đăng nhập để backend gán đơn cho user (GET /orders trả về đơn theo user)
    const userId = user.value?.id
    if (userId != null) {
      basePayload.user_id = userId
    }
    const methodCandidates = getPaymentMethodCandidates(method)
    let data = null
    let lastErr = null
    for (const apiMethod of methodCandidates) {
      try {
        data = await orderService.createOrder({
          ...basePayload,
          payment_method: apiMethod,
        })
        lastErr = null
        break
      } catch (err) {
        lastErr = err
        if (!isPaymentMethodValidationError(err)) {
          throw err
        }
      }
    }
    if (!data) {
      throw lastErr || new Error($t('checkout.errorPaymentRequired'))
    }
    const orderId = data.id ?? data.data?.id
    if (orderId) {
      invalidateOrders()
      invalidateProducts()
      // Xóa thêm cache chi tiết của các sản phẩm vừa mua để đảm bảo stock hiển thị mới nhất.
      for (const item of items) {
        if (item?.product_id != null) {
          invalidateProductDetail(item.product_id)
        }
      }
      if (method === 'momo' || method === 'vnpay') {
        showNotification({
          message: $t('checkout.paymentDemoComplete'),
          type: 'success',
          duration: 4000,
        })
      } else {
        showNotification({
          message: $t('checkout.payDirectPending'),
          type: 'success',
          duration: 5000,
        })
      }
      cart.clear()
      router.push('/dashboard/orders')
    }
  } catch (e) {
    console.error('Create order failed:', e)
    showNotification({
      message: $t('checkout.errorCreateOrder'),
      type: 'error',
      duration: 4000,
    })
  } finally {
    isPlacingOrder.value = false
  }
}

onMounted(() => {
  if (!(cartItems.value ?? []).length) {
    router.replace('/cart')
  }
})
</script>
