<template>
  <main class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 -top-44 h-[420px] bg-gradient-to-b from-primary/15 to-transparent"
    />
    <div class="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pb-20">
      <section v-if="shouldShowPromoBanner" class="pt-6 md:pt-8">
        <div
          class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-emerald-50 via-cyan-50 to-sky-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 text-zinc-800 dark:text-zinc-100 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]"
        >
          <div
            class="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-emerald-50 via-emerald-50/85 to-transparent dark:from-zinc-900 dark:via-zinc-900/85 dark:to-transparent"
          />
          <div
            class="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-sky-100 via-sky-100/85 to-transparent dark:from-zinc-800 dark:via-zinc-800/85 dark:to-transparent"
          />
          <div
            class="flex items-center justify-center gap-3 px-4 py-2.5 border-b border-zinc-900/5 dark:border-white/10"
          >
            <span class="material-symbols-outlined text-primary text-base"
              >campaign</span
            >
            <p
              class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/90"
            >
              Ưu đãi nổi bật
            </p>
          </div>
          <div class="relative h-11 flex items-center overflow-hidden">
            <div class="promo-marquee whitespace-nowrap">
              <span
                class="mx-6 font-semibold text-sm md:text-base text-zinc-700 dark:text-zinc-100"
                >{{ promoBannerText }}</span
              >
              <span
                class="mx-6 font-semibold text-sm md:text-base text-zinc-700 dark:text-zinc-100"
                >{{ promoBannerText }}</span
              >
            </div>
          </div>
        </div>
      </section>
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
import { computed, onMounted, ref } from "vue";
import HomeBadges from "@/components/features/home/HomeBadges.vue";
import HomeBestSellers from "@/components/features/home/HomeBestSellers.vue";
import HomeHero from "@/components/features/home/HomeHero.vue";
import HomePromoBanner from "@/components/features/home/HomePromoBanner.vue";
import AiProductChatWidget from "@/components/features/home/AiProductChatWidget.vue";
import productService from "@/services/productService.js";
import { getAvailablePromoCodes } from "@/services/promoCodeService.js";
import { useCart } from "@/composables/useCart.js";
import { useRouter } from "vue-router";

const heroImage =
  "https://images.unsplash.com/photo-1485875437342-9b39470b3d95?auto=format&fit=crop&w=1400&q=80";

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

function openAiChat() {
  aiChatRef.value?.openChat?.();
}

function goToProducts() {
  router.push("/products");
}

const allProducts = ref([]);
/** Tổng SP cửa hàng — lấy từ meta/field của response getProducts (cùng 1 lần gọi). */
const storeProductCount = ref(null);
const homePromo = ref(null);

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

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatPromoDate(input) {
  if (!input) return "12/4/2026";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "12/4/2026";
  return d.toLocaleDateString("vi-VN");
}

function parseDateMs(input) {
  if (!input) return null
  const ms = new Date(input).getTime()
  return Number.isFinite(ms) ? ms : null
}

function extractDiscountText(voucher) {
  const raw = voucher?.raw ?? {};
  const discountType = String(
    raw.discount_type ?? raw.type ?? "",
  ).toLowerCase();
  const percentCandidates = [
    raw.discount_percent,
    raw.percent,
    raw.percentage,
    raw.discount_percentage,
    raw.discount_value,
    raw.value,
  ];
  const amountCandidates = [
    voucher?.discountAmount,
    raw.discount_amount,
    raw.amount,
    raw.value_amount,
  ];
  const percentValue = percentCandidates
    .map(toNumber)
    .find((v) => v != null && v > 0);
  const amountValue = amountCandidates
    .map(toNumber)
    .find((v) => v != null && v > 0);
  if (discountType.includes("percent") || discountType.includes("percentage")) {
    if (percentValue != null) return `${Math.round(percentValue)}%`;
  }
  if (percentValue != null && percentValue <= 100)
    return `${Math.round(percentValue)}%`;
  if (amountValue != null)
    return `${Math.round(amountValue).toLocaleString("vi-VN")}đ`;
  return "12%";
}

function extractAppliesScope(voucher) {
  const raw = voucher?.raw ?? {};
  const scope = String(
    raw.applies_to ?? raw.scope ?? raw.apply_scope ?? "",
  ).toLowerCase();
  if (scope.includes("all") || scope.includes("global"))
    return "toàn bộ sản phẩm";
  return "sản phẩm áp dụng";
}

const promoBannerText = computed(() => {
  const voucher = homePromo.value;
  const scope = extractAppliesScope(voucher);
  const discountText = extractDiscountText(voucher);
  const startDate = formatPromoDate(
    voucher?.raw?.starts_at ??
      voucher?.raw?.start_date ??
      voucher?.raw?.valid_from ??
      voucher?.raw?.start_at ??
      voucher?.raw?.active_from ??
      voucher?.raw?.created_at ??
      voucher?.raw?.createdAt ??
      voucher?.raw?.created ??
      voucher?.raw?.end_date ??
      voucher?.raw?.expires_at ??
      voucher?.raw?.expired_at ??
      voucher?.raw?.valid_until,
  );
  const endDate = formatPromoDate(
    voucher?.raw?.ends_at ??
      voucher?.raw?.end_date ??
      voucher?.raw?.expires_at ??
      voucher?.raw?.expired_at ??
      voucher?.raw?.valid_until ??
      voucher?.raw?.end_at,
  );
  return `Hiện cửa hàng chúng tôi đang có mã giảm giá cho ${scope} lên tới ${discountText}, bắt đầu từ ngày ${startDate} và kết thúc vào ngày ${endDate}. Nhanh tay mua hàng kẻo bỏ lỡ.`;
});

const shouldShowPromoBanner = computed(() => {
  const voucher = homePromo.value
  if (!voucher) return false
  const now = Date.now()
  const startMs = parseDateMs(
    voucher?.raw?.starts_at ??
      voucher?.raw?.start_date ??
      voucher?.raw?.valid_from ??
      voucher?.raw?.start_at ??
      voucher?.raw?.active_from
  )
  const endMs = parseDateMs(
    voucher?.raw?.ends_at ??
      voucher?.raw?.end_date ??
      voucher?.raw?.expires_at ??
      voucher?.raw?.expired_at ??
      voucher?.raw?.valid_until ??
      voucher?.raw?.end_at
  )
  if (startMs != null && now < startMs) return false
  if (endMs != null && now > endMs) return false
  return true
})

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

async function loadHomePromo() {
  try {
    const vouchers = await getAvailablePromoCodes([]);
    if (!Array.isArray(vouchers) || !vouchers.length) {
      homePromo.value = null;
      return;
    }
    const now = Date.now()
    const validNow = vouchers.filter((v) => {
      const startMs = parseDateMs(
        v?.raw?.starts_at ??
          v?.raw?.start_date ??
          v?.raw?.valid_from ??
          v?.raw?.start_at ??
          v?.raw?.active_from
      )
      const endMs = parseDateMs(
        v?.raw?.ends_at ??
          v?.raw?.end_date ??
          v?.raw?.expires_at ??
          v?.raw?.expired_at ??
          v?.raw?.valid_until ??
          v?.raw?.end_at
      )
      if (startMs != null && now < startMs) return false
      if (endMs != null && now > endMs) return false
      return true
    })
    if (!validNow.length) {
      homePromo.value = null
      return
    }
    const sorted = [...validNow].sort((a, b) => {
      const aStartsAt = parseDateMs(
        a?.raw?.starts_at ??
          a?.raw?.start_date ??
          a?.raw?.valid_from ??
          a?.raw?.start_at ??
          a?.raw?.active_from
      ) ?? 0
      const bStartsAt = parseDateMs(
        b?.raw?.starts_at ??
          b?.raw?.start_date ??
          b?.raw?.valid_from ??
          b?.raw?.start_at ??
          b?.raw?.active_from
      ) ?? 0

      const aTime = Number.isFinite(aStartsAt) ? aStartsAt : 0;
      const bTime = Number.isFinite(bStartsAt) ? bStartsAt : 0;
      if (bTime !== aTime) return bTime - aTime;

      const aId = Number(a?.id ?? a?.raw?.id ?? 0);
      const bId = Number(b?.id ?? b?.raw?.id ?? 0);
      return (Number.isFinite(bId) ? bId : 0) - (Number.isFinite(aId) ? aId : 0);
    });
    homePromo.value = sorted[0];
  } catch {
    homePromo.value = null;
  }
}

function onAddToCart(product) {
  const raw = product?.raw ?? product;
  const productId = raw?.id ?? product?.id;
  if (!productId) return;
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
  loadFeaturedProducts();
  loadHomePromo();
});
</script>

<style scoped>
.promo-marquee {
  display: inline-block;
  min-width: 200%;
  animation: promoMarquee 34s linear infinite;
}

@keyframes promoMarquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
