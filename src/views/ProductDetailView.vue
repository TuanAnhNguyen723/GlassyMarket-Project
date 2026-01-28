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
          <!-- Virtual Try-On Floating CTA -->
          <div class="absolute bottom-6 left-6">
            <button
              class="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-xl hover:bg-primary/90 hover:scale-105 transition-all"
              type="button"
            >
              <span class="material-symbols-outlined">videocam</span>
              <span>Virtual Try-On</span>
            </button>
          </div>
          <button
            class="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover-favorite-btn"
            type="button"
            @click.stop="toggleFavorite"
          >
            <span
              class="material-symbols-outlined flex-custom color-btn-favorite"
              :class="isFavorite ? 'text-red-500' : 'text-slate-900'"
            >
              {{ isFavorite ? "favorite" : "favorite_border" }}
            </span>
          </button>
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
            @click="selectedImage = img.url"
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
              {{ formatPrice(product.price) }}
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
        <div class="space-y-3">
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400"
          >
            Lens Options
          </h3>
          <div class="flex flex-col gap-2.5">
            <label
              v-for="option in product.lensOptions"
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
                v-if="option.priceChange === 0"
                class="text-[11px] font-semibold bg-primary text-white px-2 py-0.5 rounded"
                >Included</span
              >
              <span v-else class="text-xs md:text-sm text-slate-500"
                >{{ option.priceChange > 0 ? "+" : "" }}${{
                  option.priceChange
                }}</span
              >
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
          :show-favorite="true"
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
import { useNotification } from "@/composables/useNotification.js";

const route = useRoute();
const { setLoading } = usePageLoading();
const { showNotification } = useNotification();
const selectedImage = ref("");
const selectedLens = ref(null);
const isFavorite = ref(false);
const isLoading = ref(true);
const error = ref(null);

const product = ref({
  id: null,
  name: "",
  price: 0,
  rating: 0,
  reviews: 0,
  stock: 0,
  images: [],
  frameDetails: [],
  lensOptions: [],
});

const relatedProducts = ref([]);

const formatPrice = (price) => {
  let value = 0;
  if (typeof price === "number") {
    value = price;
  } else if (typeof price === "string") {
    const cleaned = price.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(cleaned);
    value = Number.isNaN(parsed) ? 0 : parsed;
  }
  const vnd = Math.round(value);
  return `${vnd.toLocaleString("vi-VN")} đ`;
};

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

const loadProduct = async () => {
  isLoading.value = true;
  error.value = null;
  setLoading(true);
  try {
    const id = route.params.id;
    const res = await productService.getProductById(id);

    const ratingAverage = res?.rating?.average ?? 0;
    const ratingReviews = res?.rating?.reviews ?? res?.rating?.count ?? 0;

    // build images list: primary_image + images[] (loại bỏ trùng lặp)
    const images = [];
    const seenUrls = new Set();

    if (res.primary_image) {
      images.push({ url: res.primary_image, alt: res.name });
      seenUrls.add(res.primary_image);
    }

    if (Array.isArray(res.images)) {
      for (const img of res.images) {
        const url = img?.image_url;
        if (url && !seenUrls.has(url)) {
          images.push({ url, alt: res.name });
          seenUrls.add(url);
        }
      }
    }

    const frameDetails = [
      res.category?.name && { label: "Loại", value: res.category.name },
      res.frame_shape && { label: "Hình dạng", value: res.frame_shape },
      res.material && { label: "Chất liệu", value: res.material },
      res.size && { label: "Kích cỡ", value: res.size },
      res.bridge && { label: "Cầu kính", value: res.bridge },
    ].filter(Boolean);

    const lensOptions = Array.isArray(res.lens_options)
      ? res.lens_options.map((opt, idx) => ({
          id: opt.id ?? `lens-${idx}`,
          name: opt.name ?? "Tùy chọn tròng",
          priceChange: opt.price_change ?? 0,
        }))
      : [];

    product.value = {
      id: res.id,
      name: res.name,
      price: res.price,
      rating: ratingAverage,
      reviews: ratingReviews,
      stock: res.stock ?? 0,
      images: images.length ? images : [{ url: "", alt: res.name }],
      frameDetails,
      lensOptions,
    };

    // Đồng bộ trạng thái favorite từ API (is_featured)
    isFavorite.value = !!res.is_featured;

    selectedImage.value = product.value.images[0]?.url || "";
    selectedLens.value = lensOptions[0]?.id ?? null;

    // Sau khi có thông tin category => load related products cùng category.
    // Không await để trang detail hiển thị nhanh hơn; phần gợi ý sẽ load sau.
    const categoryId =
      res?.category?.id ?? res.category_id ?? res.categories_id;
    if (categoryId) {
      loadRelatedProducts(categoryId, res.id);
    } else {
      relatedProducts.value = [];
    }
  } catch (e) {
    console.error("Failed to load product detail:", e);
    error.value = "Không thể tải thông tin sản phẩm.";
  } finally {
    isLoading.value = false;
    setLoading(false);
  }
};

const toggleFavorite = async () => {
  if (!product.value?.id) return;

  const next = !isFavorite.value;
  // Đổi UI ngay (optimistic)
  isFavorite.value = next;

  // Hiển thị noti ngay khi user ấn (optimistic)
  if (next) {
    showNotification({
      message: "Đã thêm sản phẩm vào mục yêu thích",
      type: "success",
      icon: "favorite",
      duration: 3000,
    });
  }

  try {
    await productService.updateFeaturedStatus(product.value.id, next);
  } catch (e) {
    console.error("Failed to update featured status:", e);
    // revert nếu lỗi
    isFavorite.value = !next;

    // Hiển thị notification lỗi
    showNotification({
      message: "Không thể cập nhật mục yêu thích. Vui lòng thử lại.",
      type: "error",
      duration: 3000,
    });
  }
};

const addToCart = () => {
  // TODO: Implement add to cart logic
  console.log("Added to cart:", {
    product: product.value.name,
    lens: selectedLens.value,
    price: product.value.price,
  });
  alert("Added to cart!");
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
