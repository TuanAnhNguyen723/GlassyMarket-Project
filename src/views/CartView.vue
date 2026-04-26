<template>
  <main
    class="relative flex-1 max-w-[1280px] mx-auto w-full px-5 sm:px-8 lg:px-14 py-8 lg:py-10"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl" />
    <!-- Breadcrumbs -->
    <Breadcrumbs
      :items="[
        { label: $t('products.home'), to: '/' },
        { label: $t('cart.shoppingCart') },
      ]"
      class-name="mb-8"
      link-class="text-[#5e8487] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
      current-class="text-sm font-semibold"
      separator-class="text-[#5e8487] dark:text-gray-600 text-sm"
    />

    <!-- Page Heading -->
    <div class="mb-6 relative z-10">
      <h1 class="text-3xl lg:text-4xl font-black tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
        {{ $t("cart.title") }}
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 text-sm">
        {{ $t("cart.itemsCount", { count: itemsCount }) }}
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      <!-- Cart Items Section: cuộn bên trong, không kéo dài cả trang -->
      <section class="flex-1 w-full min-w-0 flex flex-col">
        <template v-if="cartItems.length">
          <div
            class="space-y-4 max-h-[58vh] overflow-y-auto pr-1 -mr-1"
          >
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @update:quantity="onUpdateQuantity"
              @remove="onRemove"
            />
          </div>

          <div class="pt-4 mt-2 flex-shrink-0">
            <RouterLink
              class="inline-flex items-center gap-1.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              to="/products"
            >
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              {{ $t("cart.continueShopping") }}
            </RouterLink>
          </div>
        </template>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-16 px-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 text-center"
        >
          <span
            class="material-symbols-outlined text-6xl text-zinc-500 dark:text-zinc-400 mb-4"
          >
            shopping_cart
          </span>
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            {{ $t("cart.emptyTitle") }}
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-sm">
            {{ $t("cart.emptyMessage") }}
          </p>
          <RouterLink
            class="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-colors"
            to="/products"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            {{ $t("cart.continueShopping") }}
          </RouterLink>
        </div>
      </section>

      <!-- Sidebar / Order Summary (chỉ hiện khi có sản phẩm) -->
      <aside
        v-if="cartItems.length"
        class="w-full lg:w-[360px] lg:sticky lg:top-24 flex-shrink-0"
      >
        <OrderSummary
          :subtotal="cartSubtotal"
          :tax="tax"
          :shipping-label="$t('cart.free')"
          @checkout="checkout"
        />

        <ShippingNotice />
      </aside>
    </div>
  </main>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import CartItem from "@/components/features/cart/CartItem.vue";
import OrderSummary from "@/components/features/cart/OrderSummary.vue";
import ShippingNotice from "@/components/features/cart/ShippingNotice.vue";
import { useCart } from "@/composables/useCart.js";
import { useNotification } from "@/composables/useNotification.js";
import { AUTH_TOKEN_KEY } from "@/services/api.js";

const router = useRouter();
const cart = useCart();
const { showNotification } = useNotification();
const cartItems = cart.items;
const cartSubtotal = cart.subtotal;

const itemsCount = cart.itemsCount;
const tax = cart.tax;

function onUpdateQuantity({ id, quantity }) {
  cart.updateQuantity(id, quantity);
}

function onRemove(id) {
  cart.removeItem(id);
}

function checkout() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    showNotification({
      message: "Vui lòng đăng nhập để đặt hàng.",
      type: "error",
      duration: 3500,
    });
    router.push({
      name: "Login",
      query: { redirect: "/checkout" },
    });
    return;
  }
  router.push("/checkout");
}
</script>
