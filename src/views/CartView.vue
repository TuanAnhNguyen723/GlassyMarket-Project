<template>
  <main class="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-20 py-8 lg:py-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs
      :items="[{ label: $t('products.home'), to: '/' }, { label: $t('cart.shoppingCart') }]"
      class-name="mb-8"
      link-class="text-[#5e8487] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
      current-class="text-sm font-semibold"
      separator-class="text-[#5e8487] dark:text-gray-600 text-sm"
    />

    <!-- Page Heading -->
    <div class="mb-10">
      <h1 class="text-4xl lg:text-5xl font-black tracking-tight mb-2">{{ $t('cart.title') }}</h1>
      <p class="text-[#5e8487] dark:text-gray-400 text-lg">{{ $t('cart.itemsCount', { count: itemsCount }) }}</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-12 items-start">
      <!-- Cart Items Section -->
      <section class="flex-1 w-full space-y-6">
        <CartItem
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @update:quantity="onUpdateQuantity"
          @remove="onRemove"
        />

        <div class="pt-4">
          <RouterLink class="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all" to="/products">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ $t('cart.continueShopping') }}
          </RouterLink>
        </div>
      </section>

      <!-- Sidebar / Order Summary -->
      <aside class="w-full lg:w-[400px] lg:sticky lg:top-28">
        <OrderSummary
          v-model:promo-code="promoCode"
          :subtotal="subtotal"
          :tax="tax"
          :discount="discount"
          :shipping-label="$t('cart.free')"
          @apply-promo="applyPromo"
          @checkout="checkout"
        />

        <ShippingNotice />
      </aside>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
import CartItem from '@/components/features/cart/CartItem.vue'
import OrderSummary from '@/components/features/cart/OrderSummary.vue'
import ShippingNotice from '@/components/features/cart/ShippingNotice.vue'

const promoCode = ref('')
const appliedPromo = ref({ code: '', discount: 20 }) // demo

const cartItems = ref([
  {
    id: 'avenue-classic',
    name: 'Avenue Classic',
    price: 145.0,
    color: 'Tortoise',
    lens: 'Blue Light Filter',
    quantity: 1,
    alt: 'Modern tortoise shell glasses frame',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKsp8dOfk6Wxkc4D_sGRQb8hQX1hi72MN8tNgqoI2xfk1gU-h9WZXariwKBD8wt85bXIpfOdXeDpCT8rDMqjugGyZ7qC2Zv32OaNf2oWvoeFhZ5EYp8HvcpU3l-ZmgM-1TbaeeMXqyu5pn5z97yN-MOwVC6UTNue51SoPISdjIfSaDtpVhnmqibj9KiF4ZGcezKfpoHNMPEY6dehxwyz_rpb9uyFLfCdzJ3gpJMPKTQz2WsUnIfCnT3gG5QliqTPq6mUXQPzQALdN-',
  },
  {
    id: 'nordic-minimalist',
    name: 'Nordic Minimalist',
    price: 189.0,
    color: 'Matte Black',
    lens: 'Polarized Sun',
    quantity: 1,
    alt: 'Minimalist black round glasses',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJh_Kr2GH8TZ1yqhmoh--QGOAicaiEeOixm8BV5wH02ZPUY98o5AGyN6vtRPh4Io-RNwzalYrnWZbtwIxdXWX73maTEqUlFJyj16EfqIWy9l2BPyr3GtsUjG07ndXChpP-AlIcrviDoKRtW21zXLx2PjdhhcVFlO7I9SsKhTYbLKBMjdKre20HaEaJfFbRiRG497BvuGNfnkEgKuUorvy9QIhxqDIpQCMPOySb7j21FcMqxPrx0JW5bSNvFQyelrCKowx_eMCCK2UA',
  },
])

const itemsCount = computed(() => cartItems.value.reduce((sum, i) => sum + i.quantity, 0))
const subtotal = computed(() => cartItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
const tax = computed(() => 21.71) // demo theo UI mẫu
const discount = computed(() => (appliedPromo.value.code ? appliedPromo.value.discount : 20)) // demo

function onUpdateQuantity({ id, quantity }) {
  const item = cartItems.value.find((i) => i.id === id)
  if (!item) return
  item.quantity = quantity
}

function onRemove(id) {
  cartItems.value = cartItems.value.filter((i) => i.id !== id)
}

function applyPromo(code) {
  appliedPromo.value = { code: (code || '').trim().toUpperCase(), discount: 20 }
}

function checkout() {
  // TODO: integrate checkout flow
  alert('Proceed to Checkout')
}
</script>

