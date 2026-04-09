<template>
  <header
    class="sticky top-0 z-50 glass-header border-b border-zinc-200/70 dark:border-zinc-800 px-5 sm:px-8 lg:px-14 py-3.5"
  >
    <div class="max-w-[1440px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-12">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5">
          <div
            class="size-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900"
          >
            <span class="material-symbols-outlined text-xl">visibility</span>
          </div>
          <h2 class="text-lg font-black tracking-[0.08em] uppercase">Optic</h2>
        </RouterLink>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink
            class="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
            to="/products"
            >{{ $t("header.eyeglasses") }}</RouterLink
          >
          <RouterLink
            class="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
            to="/products"
            >{{ $t("header.sunglasses") }}</RouterLink
          >
          <RouterLink
            class="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
            to="/products"
            >{{ $t("header.accessories") }}</RouterLink
          >
          <RouterLink
            class="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
            to="/About"
            >{{ $t("header.aboutUs") }}</RouterLink
          >
        </nav>
      </div>

        <div class="flex items-center gap-4">
        <!-- Search Bar -->
        <div
          class="hidden sm:flex items-center border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-4 py-2 w-64"
        >
          <span class="material-symbols-outlined text-zinc-400 text-lg"
            >search</span
          >
          <input
            class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400"
            :placeholder="$t('header.searchPlaceholder')"
            type="text"
          />
        </div>

        <!-- Utilities -->
        <div class="flex items-center gap-1">
          <RouterLink
            class="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
            to="/cart"
            :title="$t('header.cartTitle')"
          >
            <span class="material-symbols-outlined">shopping_bag</span>
            <span
              v-if="cartItemsCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold rounded-full"
            >
              {{ cartItemsCount > 99 ? "99+" : cartItemsCount }}
            </span>
          </RouterLink>

          <template v-if="isAuthenticated">
            <div ref="userMenuRef" class="relative">
              <button
                type="button"
                class="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1.5"
                style="margin-bottom: 5px"
                :title="$t('header.accountTitle')"
                @click="showUserMenu = !showUserMenu"
              >
                <span class="material-symbols-outlined">person</span>
                <span
                  class="hidden sm:inline text-sm font-medium max-w-[80px] truncate text-zinc-700 dark:text-zinc-200"
                  >{{ user?.name }}</span
                >
                <span class="material-symbols-outlined text-lg"
                  >expand_more</span
                >
              </button>
              <div
                v-show="showUserMenu"
                class="absolute right-0 top-full mt-1 py-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-50"
              >
                <RouterLink
                  to="/dashboard"
                  class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  @click="showUserMenu = false"
                >
                  {{ $t("common.account") }}
                </RouterLink>
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  @click="handleLogout"
                >
                  {{ $t("auth.logout") }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {{ $t("auth.login") }}
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-3.5 py-1.5 text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
            >
              {{ $t("auth.register") }}
            </RouterLink>
          </template>

          <!-- Language Switcher -->
          <button
            class="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            type="button"
            :title="locale === 'en' ? 'Tiếng Việt' : 'English'"
            @click="toggleLanguage"
          >
            <span class="text-sm font-bold">{{
              locale === "en" ? "VI" : "EN"
            }}</span>
          </button>

          <button
            class="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            type="button"
            :title="isDark ? $t('header.lightMode') : $t('header.darkMode')"
            @click="toggleDark"
          >
            <span class="material-symbols-outlined">{{
              isDark ? "light_mode" : "dark_mode"
            }}</span>
          </button>

          <button
            class="md:hidden p-2"
            type="button"
            :title="$t('common.menu')"
          >
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import { useLanguage } from "@/composables/useLanguage";
import { useCart } from "@/composables/useCart.js";
import { useAuth } from "@/composables/useAuth";

const { init, isDark, toggleDark } = useTheme();
const { locale, toggleLanguage } = useLanguage();
const cart = useCart();
const cartItemsCount = cart.itemsCount;
const { user, isAuthenticated, logout } = useAuth();
const router = useRouter();
const showUserMenu = ref(false);
const userMenuRef = ref(null);

const handleLogout = async () => {
  showUserMenu.value = false;
  await logout();
  router.push("/");
};

const onDocumentClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  init();
  document.addEventListener("click", onDocumentClick);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
