<template>
  <main class="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-8 lg:py-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs
      :items="[
        { label: 'Home', to: '/' },
        { label: 'Eyewear', to: '/products' },
        { label: product.name },
      ]"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <!-- Left: Gallery Side -->
      <div class="lg:col-span-7 flex flex-col gap-5">
        <div
          class="relative group aspect-[4/5] max-h-[420px] lg:max-h-[480px] rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div
            class="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
            :style="{
              backgroundImage: `url('${selectedImage || product.images[0]?.url || ''}')`,
            }"
            :aria-label="product.images[0]?.alt || product.name"
          ></div>
        </div>
        <!-- Thumbnails -->
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="(img, idx) in product.images"
            :key="idx"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all bg-white dark:bg-slate-800"
            :class="
              selectedImage === img.url
                ? 'border-2 border-primary'
                : 'border border-slate-200 dark:border-slate-800'
            "
            @click="handleSelectImage(img)"
          >
            <div
              class="w-full h-full bg-center bg-no-repeat bg-cover"
              :style="{ backgroundImage: `url('${img.url}')` }"
              :aria-label="img.alt || product.name"
            ></div>
          </div>
        </div>
      </div>

      <!-- Right: Product Detail Side -->
      <div
        class="lg:col-span-5 flex flex-col gap-7 bg-white dark:bg-slate-900/50 p-6 lg:p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800"
      >
        <div>
          <div
            class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2"
          >
            <h1
              class="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-white flex-1 min-w-0"
            >
              {{ product.name }}
            </h1>
            <span
              class="text-lg md:text-xl font-extrabold text-red-600 whitespace-nowrap flex-shrink-0"
            >
              {{ formatPrice(finalPrice) }}
            </span>
          </div>
          <ProductRating
            :rating="product.rating"
            :reviews="product.reviews"
            size="md"
            :show-reviews-count="false"
            :reviews-text="`${product.reviews} reviews`"
            text-color="amber"
          />
        </div>
        <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Màu sắc -->
        <div v-if="product.colors && product.colors.length" class="space-y-3">
          <h3
            class="text-sm font-bold uppercase tracking-widest text-slate-400"
          >
            Màu sắc
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(color, index) in product.colors"
              :key="color.productColorId ?? color.id ?? index"
              type="button"
              class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-300 dark:ring-slate-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="{
                'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900':
                  isColorSelected(color),
              }"
              :style="{ backgroundColor: color.hex || '#9ca3af' }"
              :title="color.name"
              :aria-pressed="isColorSelected(color)"
              @click="handleSelectColor(color)"
            />
          </div>
        </div>

        <!-- Frame Details -->
        <div class="space-y-3">
          <h3
            class="text-sm font-bold uppercase tracking-widest text-slate-400"
          >
            Frame Details
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="detail in product.frameDetails"
              :key="detail.label"
              class="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
            >
              <span class="text-xs text-slate-500">{{ detail.label }}</span>
              <span class="text-xs md:text-sm font-medium">{{
                detail.value
              }}</span>
            </div>
          </div>
        </div>

        <!-- Lens Options -->
        <div v-if="activeLensOptions.length" class="space-y-3">
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400"
          >
            Lens Options
          </h3>
          <div class="flex flex-col gap-2.5">
            <label
              v-for="option in activeLensOptions"
              :key="option.id"
              class="group relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all text-xs md:text-sm"
              :class="
                selectedLens === option.id
                  ? 'border border-primary bg-primary/5'
                  : 'border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              "
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="w-3.5 h-3.5 rounded-full"
                  :class="
                    selectedLens === option.id
                      ? 'border-[3px] border-primary bg-white'
                      : 'border border-slate-300'
                  "
                ></div>
                <span class="font-medium">{{ option.name }}</span>
              </div>
              <span
                v-if="Number(option.priceAdjustment || 0) === 0"
                class="text-[11px] font-semibold bg-primary text-white px-2 py-0.5 rounded"
                >Included</span
              >
              <span v-else class="text-xs md:text-sm text-slate-500">
                {{ option.priceAdjustment > 0 ? "+" : ""
                }}{{ formatPrice(option.priceAdjustment) }}
              </span>
              <input
                v-model="selectedLens"
                :value="option.id"
                type="radio"
                class="sr-only"
                @change="selectedLens = option.id"
              />
            </label>
          </div>
        </div>

        <!-- CTA Actions -->
        <div class="flex flex-col gap-2.5 mt-3">
          <button
            class="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-sm md:text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
            type="button"
            @click="addToCart"
          >
            <span class="material-symbols-outlined text-base md:text-lg"
              >add_shopping_cart</span
            >
            Add to Cart
          </button>
          <p class="text-center text-xs text-slate-400 mt-2">
            Hurry! Only {{ product.stock }} pairs left in stock.
          </p>
        </div>

        <!-- Delivery & Info -->
        <div
          class="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary"
              >local_shipping</span
            >
            <div>
              <h4 class="text-sm font-semibold">Free Express Shipping</h4>
              <p class="text-xs text-slate-500">
                Arrives between Oct 24 - Oct 26
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary"
              >verified_user</span
            >
            <div>
              <h4 class="text-sm font-semibold">2-Year Lumina Warranty</h4>
              <p class="text-xs text-slate-500">
                Complete protection for your premium eyewear
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary"
              >keyboard_return</span
            >
            <div>
              <h4 class="text-sm font-semibold">30-Day Hassle-Free Returns</h4>
              <p class="text-xs text-slate-500">
                Not the right fit? Send them back for free
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <section v-if="relatedProducts.length" class="mt-20">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            You Might Also Like
          </h2>
          <p class="text-slate-500">
            Curated styles that match the Aviator aesthetic.
          </p>
        </div>
        <RouterLink
          class="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-1 hover:underline"
          to="/products"
        >
          View All
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="{
            ...item,
            imageUrl: item.image,
            price: item.price,
          }"
          :show-quick-view="false"
          :show-rating="false"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import ProductRating from "@/components/common/ProductRating.vue";
import ProductCard from "@/components/features/products/ProductCard.vue";
import productService from "@/services/productService.js";
import { usePageLoading } from "@/composables/usePageLoading";
import { get, CACHE_KEYS } from "@/utils/cache";
import { useNotification } from "@/composables/useNotification.js";
import { useCart } from "@/composables/useCart.js";

const route = useRoute();
const { setLoading } = usePageLoading();
const { showNotification } = useNotification();
const cart = useCart();
const selectedImage = ref("");
const selectedLens = ref(null);
const isLoading = ref(true);
const error = ref(null);

const product = ref({
  id: null,
  name: "",
  price: 0, // giữ tương thích cũ: = basePrice
  basePrice: 0,
  comparePrice: null,
  rating: 0,
  reviews: 0,
  stock: 0,
  images: [],
  frameDetails: [],
  lensOptions: [],
  colors: [],
});

const selectedProductColorId = ref(null);
const selectedColorHex = ref(null);

const relatedProducts = ref([]);

function parsePrice(value) {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const cleaned = String(value)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

const formatPrice = (price) => {
  const vnd = Math.round(parsePrice(price));
  return `${vnd.toLocaleString("vi-VN")} đ`;
};

const activeLensOptions = computed(() => {
  const list = Array.isArray(product.value?.lensOptions)
    ? product.value.lensOptions
    : [];
  return list.filter(
    (o) =>
      o &&
      (o.isActive === true ||
        o.isActive === 1 ||
        o.is_active === true ||
        o.is_active === 1 ||
        o.is_active == null),
  );
});

const selectedLensOption = computed(() => {
  const list = activeLensOptions.value;
  if (!list.length) return null;
  const found = list.find((o) => String(o.id) === String(selectedLens.value));
  return found || null;
});

const lensAdjustment = computed(() =>
  parsePrice(selectedLensOption.value?.priceAdjustment || 0),
);

const finalPrice = computed(() => {
  const base = parsePrice(
    product.value?.basePrice ?? product.value?.price ?? 0,
  );
  return base + lensAdjustment.value;
});

// Lấy sản phẩm liên quan cùng category
const loadRelatedProducts = async (categoryId, currentId) => {
  try {
    if (!categoryId) {
      relatedProducts.value = [];
      return;
    }

    const params = {
      // cùng category với sản phẩm hiện tại
      categories_id: categoryId,
      category_id: categoryId,
      limit: 8,
    };

    const response = await productService.getProducts(params);

    let productsData = [];

    if (Array.isArray(response)) {
      productsData = response;
    } else if (response && typeof response === "object") {
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response.products)) {
        productsData = response.products;
      }
    }

    relatedProducts.value = productsData
      // đảm bảo cùng category với sản phẩm hiện tại (fallback nếu backend không lọc)
      .filter((p) => {
        const pCategoryId =
          p?.category?.id ?? p.category_id ?? p.categories_id ?? null;
        return (
          pCategoryId !== null &&
          String(pCategoryId) === String(categoryId) &&
          String(p.id ?? p.product_id) !== String(currentId)
        );
      })
      .slice(0, 4)
      .map((p) => {
        // ===== Lấy image giống logic ở ProductsView (rút gọn) =====
        let imageUrl = null;

        if (typeof p.primary_image === "string" && p.primary_image.trim()) {
          imageUrl = p.primary_image;
        }

        if (!imageUrl && Array.isArray(p.images) && p.images.length > 0) {
          const primaryImg =
            p.images.find(
              (img) => img && (img.is_primary === true || img.is_primary === 1),
            ) || p.images[0];
          if (primaryImg) {
            if (
              typeof primaryImg.image_url === "string" &&
              primaryImg.image_url.trim()
            ) {
              imageUrl = primaryImg.image_url;
            } else if (
              typeof primaryImg.url === "string" &&
              primaryImg.url.trim()
            ) {
              imageUrl = primaryImg.url;
            }
          }
        }

        if (!imageUrl && p.image_url) {
          imageUrl =
            typeof p.image_url === "string"
              ? p.image_url
              : p.image_url.url || null;
        } else if (!imageUrl && p.image) {
          imageUrl =
            typeof p.image === "string" ? p.image : p.image.url || null;
        }

        // ===== Lấy giá giống ProductsView (priceValue string, ProductCard sẽ format VND) =====
        let priceValue = p.price || p.price_formatted || p.base_price || 0;
        if (typeof priceValue === "number") {
          priceValue = `$${priceValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        } else if (
          typeof priceValue === "string" &&
          priceValue &&
          !priceValue.startsWith("$")
        ) {
          priceValue = `$${priceValue}`;
        }

        const comparePriceValue = p.compare_price ?? p.comparePrice ?? null;

        const categoryName =
          (typeof p.category === "string" ? p.category : p.category?.name) ||
          "";

        return {
          id: p.id ?? p.product_id,
          name: p.name || p.title || "Unnamed Product",
          price: priceValue,
          comparePrice: comparePriceValue,
          image: imageUrl,
          alt: p.alt || p.description || p.name || "Product image",
          category: categoryName,
        };
      });
  } catch (e) {
    console.error("Failed to load related products:", e);
    relatedProducts.value = [];
  }
};

/** Xử lý response API → gán vào product.value (dùng chung cho cache và API) */
const applyProductResponse = (res) => {
  const ratingAverage = res?.rating?.average ?? 0;
  const ratingReviews = res?.rating?.reviews ?? res?.rating?.count ?? 0;

  const normalizeUrl = (u) => {
    if (typeof u !== "string" || !u.trim()) return "";
    return u.trim().replace(/\/+$/, "");
  };

  const images = [];
  const seenUrls = new Set();

  if (res.primary_image) {
    const url = res.primary_image.trim();
    images.push({ url, alt: res.name });
    seenUrls.add(normalizeUrl(url));
  }

  if (Array.isArray(res.images)) {
    for (const img of res.images) {
      const url = (img?.url ?? img?.image_url)?.trim?.() || "";
      const key = normalizeUrl(url);
      const productColorId = img?.product_color_id ?? img?.productColorId ?? null;
      if (key && !seenUrls.has(key)) {
        images.push({ url, alt: res.name, product_color_id: productColorId });
        seenUrls.add(key);
      }
    }
  }

  const colors =
    Array.isArray(res.colors) && res.colors.length > 0
      ? res.colors.map((c) => ({
          id: c?.color_id ?? c?.id ?? null,
          productColorId:
            c?.id ??
            c?.product_color_id ??
            c?.product_color?.id ??
            c?.pivot?.id ??
            null,
          name: c?.name ?? "",
          hex: c?.hex_code ?? c?.hex ?? c?.hex_color ?? "#9ca3af",
        }))
      : [
          { productColorId: null, id: null, name: "Đen", hex: "#111827" },
          { productColorId: null, id: null, name: "Nâu", hex: "#78350f" },
          { productColorId: null, id: null, name: "Xám", hex: "#4b5563" },
          { productColorId: null, id: null, name: "Bạc", hex: "#f3f4f6" },
        ];

  const loaiKinh =
    (typeof res.category?.slug === "string" && res.category.slug.trim()
      ? res.category.slug.trim()
      : null) ??
    res.category?.name ??
    "";

  const frameDetails = [
    loaiKinh && { label: "Loại", value: loaiKinh },
    res.frame_shape && { label: "Hình dạng", value: res.frame_shape },
    res.material && { label: "Chất liệu", value: res.material },
  ].filter(Boolean);

  const lensOptions = Array.isArray(res.lens_options)
    ? res.lens_options
        .map((opt, idx) => ({
          id: opt.id ?? `lens-${idx}`,
          name: opt.name ?? "Tùy chọn tròng",
          description: opt.description ?? null,
          priceAdjustment: parsePrice(
            opt.price_adjustment ?? opt.price_change ?? 0,
          ),
          isDefault: !!opt.is_default,
          isActive: opt.is_active ?? true,
          sortOrder: opt.sort_order ?? idx,
        }))
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    : [];

  const categoryName = loaiKinh || "";
  const basePrice = parsePrice(res.base_price ?? res.price ?? 0);
  const comparePrice = res.compare_price ?? res.comparePrice ?? null;

  product.value = {
    id: res.id,
    name: res.name,
    price: basePrice,
    basePrice,
    comparePrice,
    rating: ratingAverage,
    reviews: ratingReviews,
    stock: res.stock ?? 0,
    images: images.length ? images : [{ url: "", alt: res.name }],
    frameDetails,
    lensOptions,
    colors,
    categoryName: categoryName || null,
  };

  selectedImage.value = product.value.images[0]?.url || "";
  const firstDefault = lensOptions.find(
    (o) =>
      o &&
      o.isDefault &&
      (o.isActive === true || o.isActive === 1 || o.isActive == null),
  );
  const firstActive = lensOptions.find(
    (o) =>
      o && (o.isActive === true || o.isActive === 1 || o.isActive == null),
  );
  selectedLens.value = firstDefault?.id ?? firstActive?.id ?? null;
  selectedProductColorId.value = null;
  selectedColorHex.value = null;

  const categoryId =
    res?.category?.id ?? res.category_id ?? res.categories_id;
  if (categoryId) {
    loadRelatedProducts(categoryId, res.id);
  } else {
    relatedProducts.value = [];
  }
};

const loadProduct = async () => {
  const id = route.params.id;
  if (!id) return;

  const cacheKey = `${CACHE_KEYS.PRODUCT_DETAIL}_${id}`;
  const cached = get(cacheKey);
  if (cached != null && typeof cached === "object") {
    applyProductResponse(cached);
    error.value = null;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;
  setLoading(true);
  try {
    const res = await productService.getProductById(id);
    applyProductResponse(res);
  } catch (e) {
    console.error("Failed to load product detail:", e);
    error.value = "Không thể tải thông tin sản phẩm.";
  } finally {
    isLoading.value = false;
    setLoading(false);
  }
};

const isColorSelected = (color) => {
  const id = color?.productColorId ?? color?.id;
  if (id != null) return selectedProductColorId.value === id;
  return color?.hex && selectedColorHex.value === color.hex;
};

const handleSelectColor = (color) => {
  const productColorId = color?.productColorId ?? color?.id ?? null;
  selectedProductColorId.value = productColorId;
  selectedColorHex.value = color?.hex ?? null;

  if (!productColorId || !Array.isArray(product.value.images)) {
    selectedImage.value = product.value.images?.[0]?.url ?? "";
    return;
  }

  const matching = product.value.images.filter((img) => {
    const id = img?.product_color_id ?? img?.productColorId ?? null;
    return id != null && String(id) === String(productColorId);
  });
  const primary =
    matching.find(
      (img) =>
        img?.is_primary === true ||
        img?.is_primary === 1 ||
        img?.isPrimary === true,
    ) ?? matching[0];
  const url = primary?.url ?? primary?.image_url ?? primary?.imageUrl ?? "";
  selectedImage.value = url || (product.value.images?.[0]?.url ?? "");
};

/** Khi chọn ảnh (thumbnail), cập nhật luôn màu tương ứng theo product_color_id */
const handleSelectImage = (img) => {
  const url = img?.url ?? img?.image_url ?? img?.imageUrl ?? "";
  selectedImage.value = url;

  const productColorId = img?.product_color_id ?? img?.productColorId ?? null;
  if (productColorId == null || !Array.isArray(product.value.colors)) {
    selectedProductColorId.value = null;
    selectedColorHex.value = null;
    return;
  }

  const color = product.value.colors.find((c) => {
    const id = c?.productColorId ?? c?.id ?? null;
    return id != null && String(id) === String(productColorId);
  });
  if (color) {
    selectedProductColorId.value = color.productColorId ?? color.id ?? null;
    selectedColorHex.value = color.hex ?? null;
  } else {
    selectedProductColorId.value = null;
    selectedColorHex.value = null;
  }
};

const addToCart = () => {
  const p = product.value;
  if (!p?.id) return;

  const lensOpt = p.lensOptions?.find((o) => o.id === selectedLens.value);
  const lensName = lensOpt?.name ?? "—";
  const selectedColorObj = p.colors?.find((c) => isColorSelected(c));
  const colorDetail = p.frameDetails?.find(
    (d) => d.label === "Chất liệu" || d.label === "Loại",
  );
  const color = selectedColorObj?.name ?? "—";
  const colorHex = selectedColorObj?.hex ?? null; // API: colors.hex_code
  const frameType =
    colorDetail?.value ?? p.categoryName ?? p.frameDetails?.[0]?.value ?? "—";

  cart.addItem({
    productId: p.id,
    name: p.name,
    // Giá dòng giỏ = base_price + price_adjustment (lens option)
    price: finalPrice.value,
    image: selectedImage.value || (p.images?.[0]?.url ?? ""),
    alt: p.name,
    lensId: selectedLens.value,
    lensName,
    color,
    colorHex,
    frameType,
  });

  showNotification({
    message: "Đã thêm vào giỏ hàng",
    type: "success",
    icon: "add_shopping_cart",
    duration: 3000,
  });
};

onMounted(() => {
  loadProduct();
});

// Khi chuyển sang sản phẩm khác nhưng vẫn reuse cùng component,
// cần watch route params để load lại dữ liệu
watch(
  () => route.params.id,
  () => {
    loadProduct();
  },
);
</script>
