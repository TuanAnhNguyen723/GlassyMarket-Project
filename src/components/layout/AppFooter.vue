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
          {{ $t('footer.description') }}
        </p>
      </div>

      <div>
        <h4 class="font-bold mb-6">{{ $t('footer.explore') }}</h4>
        <ul class="space-y-4 text-sm text-zinc-500">
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">{{ $t('footer.allProducts') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">{{ $t('footer.bestSellers') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">{{ $t('footer.newArrivals') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/products">{{ $t('footer.virtualMirror') }}</RouterLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">{{ $t('footer.support') }}</h4>
        <ul class="space-y-4 text-sm text-zinc-500">
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">{{ $t('footer.helpCenter') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">{{ $t('footer.orderStatus') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/about">{{ $t('footer.shippingReturns') }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary transition-colors" to="/contact">{{ $t('footer.contactUs') }}</RouterLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">{{ $t('footer.joinNewsletter') }}</h4>
        <p class="text-sm text-zinc-500 mb-4">{{ $t('footer.newsletterDesc') }}</p>
        <div class="flex gap-2">
          <input
            class="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg text-sm flex-1 focus:ring-primary focus:border-primary"
            :placeholder="$t('footer.emailPlaceholder')"
            type="email"
          />
          <button class="bg-primary text-white p-2 rounded-lg" type="button" :title="$t('footer.send')">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="max-w-[1440px] mx-auto px-6 lg:px-20 mt-20 pt-8 border-t border-[#e9f1f1] dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p class="text-xs text-zinc-400">{{ $t('footer.copyright', { year }) }}</p>
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
