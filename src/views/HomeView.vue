<template>
  <main class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 -top-44 h-[420px] bg-gradient-to-b from-primary/15 to-transparent"
    />
    <div class="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pb-20 relative">
      <aside class="hidden 2xl:block absolute top-10 -left-52 z-10">
        <a
          v-if="showPrimaryBanner && resolvedBannerPrimaryLink"
          :href="resolvedBannerPrimaryLink"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-md"
        >
          <img
            :src="resolvedBannerPrimaryUrl"
            alt="Banner trái"
            class="w-full h-[600px] object-cover"
            @error="handlePrimaryBannerError"
          />
        </a>
        <div
          v-else-if="showPrimaryBanner"
          class="block w-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-md"
        >
          <img
            :src="resolvedBannerPrimaryUrl"
            alt="Banner trái"
            class="w-full h-[600px] object-cover"
            @error="handlePrimaryBannerError"
          />
        </div>
      </aside>

      <aside class="hidden 2xl:block absolute top-10 -right-52 z-10">
        <a
          v-if="showSecondaryBanner && resolvedBannerSecondaryLink"
          :href="resolvedBannerSecondaryLink"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-md"
        >
          <img
            :src="resolvedBannerSecondaryUrl"
            alt="Banner phải"
            class="w-full h-[600px] object-cover"
            @error="handleSecondaryBannerError"
          />
        </a>
        <div
          v-else-if="showSecondaryBanner"
          class="block w-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-md"
        >
          <img
            :src="resolvedBannerSecondaryUrl"
            alt="Banner phải"
            class="w-full h-[600px] object-cover"
            @error="handleSecondaryBannerError"
          />
        </div>
      </aside>

      <HomeHero
        :image-url="heroImage"
        image-alt="Young model wearing stylish premium blue light glasses"
        :store-product-count="storeProductCount"
        secondary-text="AI gợi ý sản phẩm"
        secondary-icon="smart_toy"
        @primary="goToProducts"
        @secondary="openAiChat"
      />
      <HomeBadges :badges="badges" />
      <HomeBestSellers
        title="Sản phẩm nổi bật"
        subtitle="Những thiết kế nổi bật với độ hoàn thiện cao cho phong cách thường ngày."
        :products="featuredProducts"
        @add-to-cart="onAddToCart"
      />
      <HomePromoBanner />
    </div>
    <AiProductChatWidget
      ref="aiChatRef"
      @apply-filters="handleAiApplyFilters"
      @view-more="handleAiApplyFilters"
    />
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import HomeBadges from "@/components/features/home/HomeBadges.vue";
import HomeBestSellers from "@/components/features/home/HomeBestSellers.vue";
import HomeHero from "@/components/features/home/HomeHero.vue";
import HomePromoBanner from "@/components/features/home/HomePromoBanner.vue";
import AiProductChatWidget from "@/components/features/home/AiProductChatWidget.vue";
import productService from "@/services/productService.js";
import { useCart } from "@/composables/useCart.js";
import { AUTH_TOKEN_KEY } from "@/services/api.js";
import { useRouter } from "vue-router";
import { useNotification } from "@/composables/useNotification";
import { useGeneralSettings } from "@/composables/useGeneralSettings";
import { resolveAssetUrl } from "@/services/api";

const {
  fetchGeneralSettings,
  heroImageUrl,
  bannerPrimaryUrl,
  bannerSecondaryUrl,
  bannerPrimaryLink,
  bannerSecondaryLink,
} = useGeneralSettings();
const heroImage = computed(
  () =>
    resolveAssetUrl(heroImageUrl.value) ||
    "https://images.unsplash.com/photo-1485875437342-9b39470b3d95?auto=format&fit=crop&w=1400&q=80",
);
const resolvedBannerPrimaryUrl = computed(() =>
  resolveAssetUrl(bannerPrimaryUrl.value),
);
const resolvedBannerSecondaryUrl = computed(() =>
  resolveAssetUrl(bannerSecondaryUrl.value),
);
const resolvedBannerPrimaryLink = computed(() => bannerPrimaryLink.value || "");
const resolvedBannerSecondaryLink = computed(
  () => bannerSecondaryLink.value || "",
);
const isPrimaryBannerVisible = ref(true);
const isSecondaryBannerVisible = ref(true);
const showPrimaryBanner = computed(
  () => Boolean(resolvedBannerPrimaryUrl.value) && isPrimaryBannerVisible.value,
);
const showSecondaryBanner = computed(
  () =>
    Boolean(resolvedBannerSecondaryUrl.value) && isSecondaryBannerVisible.value,
);

function handlePrimaryBannerError() {
  isPrimaryBannerVisible.value = false;
}

function handleSecondaryBannerError() {
  isSecondaryBannerVisible.value = false;
}

watch(
  resolvedBannerPrimaryUrl,
  (url) => {
    isPrimaryBannerVisible.value = Boolean(url);
  },
  { immediate: true },
);

watch(
  resolvedBannerSecondaryUrl,
  (url) => {
    isSecondaryBannerVisible.value = Boolean(url);
  },
  { immediate: true },
);

const badges = [
  {
    icon: "local_shipping",
    title: "Giao nhanh toàn quốc",
    subtitle: "Miễn phí vận chuyển cho đơn từ 2.000.000đ",
  },
  {
    icon: "verified",
    title: "Bảo hành chính hãng",
    subtitle: "Bảo hành 12 tháng cho gọng và tròng tiêu chuẩn",
  },
  {
    icon: "ar_on_you",
    title: "AI gợi ý sản phẩm",
    subtitle: "Gợi ý kính theo nhu cầu, phong cách và ngân sách của bạn",
  },
];

const cart = useCart();
const router = useRouter();
const aiChatRef = ref(null);
const { showNotification } = useNotification();

function openAiChat() {
  aiChatRef.value?.openChat?.();
}

function goToProducts() {
  router.push("/products");
}

const allProducts = ref([]);
/** Tổng SP cửa hàng — lấy từ meta/field của response getProducts (cùng 1 lần gọi). */
const storeProductCount = ref(null);

function parsePrice(value) {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const cleaned = String(value)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function formatVnd(value) {
  const v = Math.round(parsePrice(value));
  return `${v.toLocaleString("vi-VN")} đ`;
}

function getProductImage(p) {
  if (typeof p?.primary_image === "string" && p.primary_image.trim())
    return p.primary_image;
  if (Array.isArray(p?.images) && p.images.length) {
    const primary =
      p.images.find(
        (img) => img && (img.is_primary === true || img.is_primary === 1),
      ) || p.images[0];
    if (primary) {
      if (typeof primary.image_url === "string" && primary.image_url.trim())
        return primary.image_url;
      if (typeof primary.url === "string" && primary.url.trim())
        return primary.url;
    }
  }
  if (typeof p?.image_url === "string" && p.image_url.trim())
    return p.image_url;
  if (typeof p?.image === "string" && p.image.trim()) return p.image;
  return "";
}

function normalizeProductsResponse(response) {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") {
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.products)) return response.products;
  }
  return [];
}

/** Tổng sản phẩm trong cửa hàng từ cùng response API (không gọi thêm request). */
function extractStoreProductCount(response) {
  if (!response || typeof response !== "object") return null;
  const meta = response.meta ?? response.pagination ?? {};
  const candidates = [
    meta.total_products,
    meta.total_all,
    meta.catalog_total,
    response.total_products,
    response.products_total,
    response.products_count,
    meta.total,
    response.total,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function getProductStock(p) {
  const n = Number(
    p?.stock ??
      p?.quantity ??
      p?.inventory ??
      p?.inventory_count ??
      p?.stock_quantity ??
      0,
  );
  return Number.isFinite(n) ? n : 0;
}

const featuredProducts = computed(() => {
  const list = allProducts.value.filter(
    (p) => p && (p.is_featured === true || p.is_featured === 1),
  );
  return list.slice(0, 4).map((p) => ({
    id: p.id ?? p.product_id ?? null,
    name: p.name ?? p.title ?? "Sản phẩm",
    subtitle: p.material ?? p.frame_shape ?? p.category?.name ?? "",
    price: formatVnd(p.base_price ?? p.price ?? 0),
    badge: p.tag ?? (p.is_premium ? "Premium" : null),
    alt: p.alt ?? p.name ?? "Product image",
    image: getProductImage(p),
    stock: getProductStock(p),
    isOutOfStock: getProductStock(p) <= 0,
    raw: p,
  }));
});

async function loadFeaturedProducts() {
  // Chỉ lấy sản phẩm nổi bật từ backend để giảm preload.
  try {
    const res = await productService.getProducts({
      featured: 1,
      page: 1,
      limit: 12,
      per_page: 12,
    });
    allProducts.value = normalizeProductsResponse(res);
    storeProductCount.value = extractStoreProductCount(res);
  } catch {
    allProducts.value = [];
    storeProductCount.value = null;
  }
}

function onAddToCart(product) {
  const raw = product?.raw ?? product;
  const productId = raw?.id ?? product?.id;
  if (!productId) return;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    showNotification({
      message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
      type: "error",
      duration: 3500,
    });
    router.push({
      name: "Login",
      query: { redirect: `/product/${productId}` },
    });
    return;
  }
  const stock = getProductStock(raw);
  if (stock <= 0) {
    showNotification({
      message: "Sản phẩm đã hết hàng, không thể thêm vào giỏ.",
      type: "error",
      duration: 3000,
    });
    return;
  }
  cart.addItem({
    productId,
    name: raw?.name ?? product?.name,
    price: raw?.base_price ?? raw?.price ?? product?.price,
    image: raw?.primary_image ?? product?.image,
    alt: raw?.name ?? product?.alt,
    lensId: null,
    lensName: "—",
    color: "—",
    frameType: raw?.category?.name ?? "—",
  });
}

function buildProductsQueryFromAiFilters(filters) {
  const query = {};
  if (!filters || typeof filters !== "object") return query;
  if (filters.frame_shape) query.frame_shape = String(filters.frame_shape);
  if (filters.max_price != null && filters.max_price !== "") {
    query.max_price = String(filters.max_price);
  }
  if (filters.min_price != null && filters.min_price !== "") {
    query.min_price = String(filters.min_price);
  }
  return query;
}

function handleAiApplyFilters(filters) {
  const query = buildProductsQueryFromAiFilters(filters);
  router.push({ path: "/products", query });
}

onMounted(() => {
  // Banner signed URL: luôn làm mới khi vào trang chủ.
  fetchGeneralSettings({ force: true }).catch(() => {});
  loadFeaturedProducts();
});
</script>
