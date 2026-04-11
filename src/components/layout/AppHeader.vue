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
        </nav>
      </div>

        <div class="flex items-center gap-4">
        <!-- Search Bar -->
        <div
          ref="searchWrapRef"
          class="hidden sm:block relative w-80 lg:w-[28rem]"
        >
          <div
            class="flex items-center border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-full px-4 py-2"
          >
            <span class="material-symbols-outlined text-zinc-400 text-lg"
              >search</span
            >
            <input
              v-model="searchQuery"
              class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400"
              :placeholder="$t('header.searchPlaceholder')"
              type="text"
              @input="handleSearchInput"
              @focus="handleSearchFocus"
              @keydown.enter.prevent="handleSearchEnter"
            />
          </div>

          <div
            v-if="showSearchPopup"
            class="absolute left-0 right-0 mt-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden z-50"
          >
            <div v-if="isSearchLoading" class="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
              {{ $t('common.loading') }}
            </div>
            <div
              v-else-if="searchResults.length === 0"
              class="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400"
            >
              {{ $t('header.noSearchResult', 'Không tìm thấy sản phẩm phù hợp') }}
            </div>
            <button
              v-for="item in searchResults"
              :key="item.id"
              type="button"
              class="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              @click="selectSearchItem(item)"
            >
              <div class="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                <span v-else class="material-symbols-outlined text-zinc-400 text-lg">image</span>
              </div>
              <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{{ item.name }}</p>
            </button>
          </div>
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
import productService from "@/services/productService";
import { resolveAssetUrl } from "@/services/api";

const { init, isDark, toggleDark } = useTheme();
const { locale, toggleLanguage } = useLanguage();
const cart = useCart();
const cartItemsCount = cart.itemsCount;
const { user, isAuthenticated, logout } = useAuth();
const router = useRouter();
const showUserMenu = ref(false);
const userMenuRef = ref(null);
const searchWrapRef = ref(null);
const searchQuery = ref("");
const searchResults = ref([]);
const isSearchLoading = ref(false);
const showSearchPopup = ref(false);
let searchDebounceTimer = null;

function normalizeProductsResponse(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.products)) return response.products;
  return [];
}

/**
 * Lấy URL ảnh hiển thị — cùng thứ tự ưu tiên như ProductsView (transformProduct).
 * API thường chỉ trả ảnh trong images[].image_url, không có primary_image.
 */
function extractProductImageUrl(product) {
  if (!product || typeof product !== "object") return "";

  if (
    typeof product.primary_image === "string" &&
    product.primary_image.trim()
  ) {
    return product.primary_image.trim();
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const primaryImg =
      product.images.find(
        (img) => img && (img.is_primary === true || img.is_primary === 1)
      ) || product.images[0];
    if (primaryImg) {
      if (
        typeof primaryImg.image_url === "string" &&
        primaryImg.image_url.trim()
      ) {
        return primaryImg.image_url.trim();
      }
      if (typeof primaryImg.url === "string" && primaryImg.url.trim()) {
        return primaryImg.url.trim();
      }
    }
  }

  if (product.image_url) {
    if (typeof product.image_url === "string" && product.image_url.trim()) {
      return product.image_url.trim();
    }
    if (product.image_url && typeof product.image_url.url === "string") {
      return product.image_url.url.trim();
    }
  }

  if (product.image) {
    if (typeof product.image === "string" && product.image.trim()) {
      return product.image.trim();
    }
    if (product.image && typeof product.image.url === "string") {
      return product.image.url.trim();
    }
  }

  if (typeof product.imageUrl === "string" && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }

  if (product.photo) {
    if (typeof product.photo === "string" && product.photo.trim()) {
      return product.photo.trim();
    }
    if (product.photo && typeof product.photo.url === "string") {
      return product.photo.url.trim();
    }
  }

  if (
    typeof product.thumbnail === "string" &&
    product.thumbnail.trim()
  ) {
    return product.thumbnail.trim();
  }

  return "";
}

function toSearchItem(product) {
  const id = product?.id;
  if (id == null) return null;
  const name = product?.name || product?.title || "Sản phẩm";
  const imageRaw = extractProductImageUrl(product);
  return {
    id,
    name,
    image: resolveAssetUrl(imageRaw),
  };
}

async function runSearch(keyword) {
  const q = keyword.trim().toLowerCase();
  if (!q) {
    searchResults.value = [];
    showSearchPopup.value = false;
    return;
  }
  isSearchLoading.value = true;
  showSearchPopup.value = true;
  try {
    const response = await productService.getProducts({
      per_page: 20,
      search: q,
      q,
    });
    const products = normalizeProductsResponse(response);
    const matches = products
      .map(toSearchItem)
      .filter((item) => item && item.name.toLowerCase().includes(q))
      .slice(0, 3);
    searchResults.value = matches;
  } catch {
    searchResults.value = [];
  } finally {
    isSearchLoading.value = false;
  }
}

function handleSearchInput() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  const value = searchQuery.value.trim();
  if (!value) {
    searchResults.value = [];
    showSearchPopup.value = false;
    return;
  }
  searchDebounceTimer = setTimeout(() => {
    runSearch(value);
  }, 250);
}

function handleSearchFocus() {
  if (searchQuery.value.trim()) {
    showSearchPopup.value = true;
    if (searchResults.value.length === 0 && !isSearchLoading.value) {
      runSearch(searchQuery.value);
    }
  }
}

function selectSearchItem(item) {
  showSearchPopup.value = false;
  searchQuery.value = "";
  searchResults.value = [];
  router.push(`/product/${item.id}`);
}

function handleSearchEnter() {
  const first = searchResults.value[0];
  if (first) {
    selectSearchItem(first);
    return;
  }
  if (searchQuery.value.trim()) {
    router.push("/products");
    showSearchPopup.value = false;
  }
}

const handleLogout = async () => {
  showUserMenu.value = false;
  await logout();
  router.push("/");
};

const onDocumentClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
  if (searchWrapRef.value && !searchWrapRef.value.contains(e.target)) {
    showSearchPopup.value = false;
  }
};

onMounted(() => {
  init();
  document.addEventListener("click", onDocumentClick);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});
</script>
