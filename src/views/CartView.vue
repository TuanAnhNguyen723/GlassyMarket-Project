<template>
  <main
    class="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-20 py-8 lg:py-12"
  >
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
    <div class="mb-6">
      <h1 class="text-2xl lg:text-3xl font-black tracking-tight mb-1">
        {{ $t("cart.title") }}
      </h1>
      <p class="text-[#5e8487] dark:text-gray-400 text-sm">
        {{ $t("cart.itemsCount", { count: itemsCount }) }}
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start">
      <!-- Cart Items Section: cuộn bên trong, không kéo dài cả trang -->
      <section class="flex-1 w-full min-w-0 flex flex-col">
        <template v-if="cartItems.length">
          <div
            class="space-y-4 max-h-[55vh] overflow-y-auto pr-1 -mr-1"
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
              class="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2 transition-all"
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
          class="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-[#eaf0f0] dark:border-gray-800 bg-white dark:bg-zinc-900/50 text-center"
        >
          <span
            class="material-symbols-outlined text-6xl text-[#5e8487] dark:text-gray-500 mb-4"
          >
            shopping_cart
          </span>
          <h2 class="text-xl font-bold text-[#111718] dark:text-white mb-2">
            {{ $t("cart.emptyTitle") }}
          </h2>
          <p class="text-[#5e8487] dark:text-gray-400 text-sm mb-6 max-w-sm">
            {{ $t("cart.emptyMessage") }}
          </p>
          <RouterLink
            class="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
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
        class="w-full lg:w-[340px] lg:sticky lg:top-24 flex-shrink-0"
      >
        <OrderSummary
          v-model:promo-code="promoCode"
          :subtotal="cartSubtotal"
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
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import CartItem from "@/components/features/cart/CartItem.vue";
import OrderSummary from "@/components/features/cart/OrderSummary.vue";
import ShippingNotice from "@/components/features/cart/ShippingNotice.vue";
import { useCart } from "@/composables/useCart.js";

const router = useRouter();
const cart = useCart();
const cartItems = cart.items;
const cartSubtotal = cart.subtotal;
const promoCode = ref("");
const appliedPromo = ref({ code: "", discount: 20 });

const itemsCount = cart.itemsCount;
const tax = cart.tax;
const discount = computed(() =>
  appliedPromo.value.code ? appliedPromo.value.discount : 20
);

function onUpdateQuantity({ id, quantity }) {
  cart.updateQuantity(id, quantity);
}

function onRemove(id) {
  cart.removeItem(id);
}

function applyPromo(code) {
  appliedPromo.value = {
    code: (code || "").trim().toUpperCase(),
    discount: 20,
  };
}

function checkout() {
  router.push("/checkout");
}
</script>
