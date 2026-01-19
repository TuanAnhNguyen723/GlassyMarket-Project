<template>
  <header
    class="sticky top-0 z-50 glass-header border-b border-[#e9f1f1] dark:border-zinc-800 px-6 lg:px-20 py-4"
  >
    <div class="max-w-[1440px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-12">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-xl">visibility</span>
          </div>
          <h2 class="text-xl font-black tracking-tight uppercase">Optic</h2>
        </RouterLink>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink class="text-sm font-semibold hover:text-primary transition-colors" to="/products"
            >Eyeglasses</RouterLink
          >
          <RouterLink class="text-sm font-semibold hover:text-primary transition-colors" to="/products"
            >Sunglasses</RouterLink
          >
          <RouterLink class="text-sm font-semibold hover:text-primary transition-colors" to="/products"
            >Accessories</RouterLink
          >
          <RouterLink class="text-sm font-semibold hover:text-primary transition-colors" to="/About"
          >About us</RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-6">
        <!-- Search Bar -->
        <div class="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 w-64">
          <span class="material-symbols-outlined text-zinc-400 text-lg">search</span>
          <input
            class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400"
            placeholder="Find your style..."
            type="text"
          />
        </div>

        <!-- Utilities -->
        <div class="flex items-center gap-1">
          <RouterLink
            class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
            to="/cart"
            title="Giỏ hàng"
          >
            <span class="material-symbols-outlined">shopping_bag</span>
            <span class="absolute top-1 right-1 size-2 bg-primary rounded-full"></span>
          </RouterLink>

          <button
            class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            type="button"
            title="Tài khoản"
          >
            <span class="material-symbols-outlined">person</span>
          </button>

          <button
            class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            type="button"
            :title="isDark ? 'Chế độ sáng' : 'Chế độ tối'"
            @click="toggleDark"
          >
            <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <button class="md:hidden p-2" type="button" title="Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { init, isDark, toggleDark } = useTheme()

onMounted(() => init())
</script>
