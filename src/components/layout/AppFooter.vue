<template>
  <footer class="bg-zinc-50 dark:bg-zinc-900/50 border-t border-[#e9f1f1] dark:border-zinc-800 py-20">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="col-span-1 md:col-span-1">
        <div class="flex items-center gap-2 mb-6">
          <div class="size-6 bg-primary rounded flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-sm">visibility</span>
          </div>
          <h2 class="text-lg font-black tracking-tight uppercase">Optic</h2>
        </div>
        <p class="text-sm text-zinc-500 leading-relaxed">
          Crafting perspectives since 2012. Our mission is to make quality eyewear accessible without
          compromising on style.
        </p>
      </div>

      <div>
        <h4 class="font-bold mb-6">Explore</h4>
        <ul class="space-y-4 text-sm text-zinc-500">
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">All Products</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">Best Sellers</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">New Arrivals</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">Virtual Mirror</RouterLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Support</h4>
        <ul class="space-y-4 text-sm text-zinc-500">
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">Help Center</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">Order Status</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">Shipping &amp; Returns</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/contact">Contact Us</RouterLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Join the newsletter</h4>
        <p class="text-sm text-zinc-500 mb-4">Weekly styles and exclusive offers in your inbox.</p>
        <div class="flex gap-2">
          <input
            class="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg text-sm flex-1 focus:ring-primary focus:border-primary"
            placeholder="email@example.com"
            type="email"
          />
          <button class="bg-primary text-white p-2 rounded-lg" type="button" title="Gửi">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="max-w-[1440px] mx-auto px-6 lg:px-20 mt-20 pt-8 border-t border-[#e9f1f1] dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p class="text-xs text-zinc-400">© {{ year }} Optic Eyewear Store. All rights reserved.</p>
      <div class="flex gap-6 grayscale opacity-50">
        <span class="material-symbols-outlined">payments</span>
        <span class="material-symbols-outlined">credit_card</span>
        <span class="material-symbols-outlined">account_balance_wallet</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const year = computed(() => new Date().getFullYear())
</script>
