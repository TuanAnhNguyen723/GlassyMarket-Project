<template>
  <article
    class="product-card group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-transparent transition-all duration-700 ease-out hover:shadow-lg hover:shadow-black/5"
    :class="{ 'cursor-pointer': clickable }"
    @click="handleClick"
    style="border: 1px solid #e9f1f1"
  >
    <!-- Image -->
    <div
      class="relative aspect-square overflow-hidden bg-white dark:bg-gray-900"
    >
      <img
        v-if="imageSrc"
        class="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        :src="imageSrc"
        :alt="product.alt || product.name || 'Product image'"
        @error="handleImageError"
      />
      <!-- Placeholder when no image -->
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
      >
        <div class="text-center p-4">
          <span class="material-symbols-outlined text-6xl text-primary/40"
            >image</span
          >
          <p class="text-xs text-primary/60 mt-2 font-medium">No Image</p>
        </div>
      </div>

      <div v-if="product.badge" class="absolute top-4 left-4">
        <span
          class="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
        >
          {{ product.badge }}
        </span>
      </div>

      <!-- (Giữ lại quick-view cho chỗ khác dùng) -->
      <div
        v-if="showQuickView"
        class="quick-view-btn absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 flex items-center justify-center transition-all duration-300 translate-y-2 group-hover:opacity-100"
      >
        <button
          class="bg-white text-[#101918] px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          type="button"
          @click.stop="handleQuickView"
        >
          <span class="material-symbols-outlined !text-lg">visibility</span>
          Quick View
        </button>
      </div>

      <button
        v-if="showFavorite"
        class="absolute top-3 right-3 p-2 bg-white/90 rounded-full"
        type="button"
        @click.stop="toggleFavorite"
      >
        <span
          class="material-symbols-outlined text-[20px] flex-custom color-btn-favorite"
          :class="isFav ? 'text-red-500' : 'text-zinc-500'"
        >
          {{ isFav ? "favorite" : "favorite_border" }}
        </span>
      </button>
    </div>

    <!-- Content -->
    <div class="px-4 pb-5 pt-4">
      <!-- Brand/Category -->
      <p
        class="text-[11px] font-extrabold tracking-widest uppercase text-zinc-400 mb-1"
      >
        {{ (product.brand || product.category || "").toString() }}
      </p>

      <!-- Name -->
      <h3
        class="text-sm font-extrabold tracking-wide uppercase text-zinc-800 dark:text-zinc-100 leading-snug"
      >
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="mt-2 flex items-baseline gap-2">
        <span
          v-if="product.comparePrice"
          class="text-sm font-bold text-zinc-900 dark:text-zinc-200 line-through"
        >
          {{ formatPrice(product.comparePrice) }}
        </span>
        <span class="text-sm font-extrabold text-red-600">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Colors -->
      <div
        v-if="product.colors && product.colors.length"
        class="mt-3 flex flex-wrap gap-2"
      >
        <button
          v-for="(color, index) in product.colors.slice(0, 6)"
          :key="color.productColorId || color.id || index"
          class="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ring-1 ring-black/25 transition-transform hover:scale-105"
          :class="{
            'ring-2 ring-primary ring-offset-1 ring-offset-white dark:ring-offset-gray-900':
              color.productColorId !== null &&
              color.productColorId !== undefined &&
              selectedProductColorId === color.productColorId,
          }"
          :style="{ backgroundColor: color.hex || '#ffffff' }"
          :title="color.name"
          type="button"
          :aria-pressed="
            color.productColorId !== null &&
            color.productColorId !== undefined &&
            selectedProductColorId === color.productColorId
          "
          @click.stop="handleSelectColor(color)"
        />
      </div>

      <!-- Rating (nếu muốn dùng ở nơi khác) -->
      <ProductRating
        v-if="showRating && product.rating"
        class="mt-3"
        :rating="product.rating"
        :reviews="product.reviews || 0"
        size="sm"
        :show-reviews-count="true"
      />
    </div>
  </article>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import ProductRating from "@/components/common/ProductRating.vue";
import productService from "@/services/productService.js";
import { useNotification } from "@/composables/useNotification.js";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  showQuickView: {
    type: Boolean,
    default: true,
  },
  showFavorite: {
    type: Boolean,
    default: false,
  },
  showRating: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["click", "quick-view", "favorite"]);

const router = useRouter();
const { showNotification } = useNotification();
const isFav = ref(!!props.product?.is_featured);
const imageError = ref(false);

// ===== Variant image (by color) =====
const selectedProductColorId = ref(null);
const variantImageUrl = ref(null);
let colorFetchSeq = 0;

// cache để không phải lọc lại (cùng product_color_id)
const variantImageCache = new Map();

// Placeholder image URL
const placeholderImage =
  "https://via.placeholder.com/400x500/59b7c0/ffffff?text=Product+Image";

const imageSrc = computed(() => {
  return (
    variantImageUrl.value ||
    props.product?.image ||
    props.product?.imageUrl ||
    null
  );
});

const handleImageError = (event) => {
  // If image fails to load, use placeholder
  if (event.target.src !== placeholderImage) {
    event.target.src = placeholderImage;
  }
  imageError.value = true;
};

const handleSelectColor = async (color) => {
  const productColorId = color?.productColorId ?? null;
  selectedProductColorId.value = productColorId;

  // nếu không có product_color_id thì reset về ảnh mặc định
  if (!productColorId) {
    variantImageUrl.value = null;
    return;
  }

  // cache hit
  if (variantImageCache.has(String(productColorId))) {
    variantImageUrl.value =
      variantImageCache.get(String(productColorId)) || null;
    return;
  }

  // Map màu -> ảnh ngay từ product.images[] (backend đã trả product_color_id)
  const seq = ++colorFetchSeq;

  const images = Array.isArray(props.product?.images)
    ? props.product.images
    : [];
  const matching = images.filter((img) => {
    const imgProductColorId =
      img?.productColorId ?? img?.product_color_id ?? null;
    return (
      imgProductColorId !== null &&
      String(imgProductColorId) === String(productColorId)
    );
  });

  const primary =
    matching.find(
      (img) =>
        img &&
        (img.isPrimary === true ||
          img.is_primary === true ||
          img.is_primary === 1),
    ) ||
    matching[0] ||
    null;

  const url =
    (typeof primary?.imageUrl === "string" &&
      primary.imageUrl.trim() &&
      primary.imageUrl) ||
    (typeof primary?.image_url === "string" &&
      primary.image_url.trim() &&
      primary.image_url) ||
    (typeof primary?.url === "string" && primary.url.trim() && primary.url) ||
    null;

  if (seq !== colorFetchSeq) return;
  variantImageCache.set(String(productColorId), url);
  variantImageUrl.value = url;
};

const handleClick = () => {
  if (props.clickable && props.product.id) {
    router.push(`/product/${props.product.id}`);
  }
  emit("click", props.product);
};

const handleQuickView = () => {
  emit("quick-view", props.product);
};

// Đồng bộ lại khi prop product thay đổi (ví dụ reload từ API)
watch(
  () => props.product?.is_featured,
  (val) => {
    isFav.value = !!val;
  },
);

// Reset variant state khi chuyển product khác
watch(
  () => props.product?.id,
  () => {
    selectedProductColorId.value = null;
    variantImageUrl.value = null;
    colorFetchSeq = 0;
  },
);

const toggleFavorite = async () => {
  if (!props.product?.id) return;

  const next = !isFav.value;
  // Optimistic UI: đổi màu ngay
  isFav.value = next;
  emit("favorite", { product: props.product, isFavorite: next });

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
    await productService.updateFeaturedStatus(props.product.id, next);
  } catch (error) {
    console.error("Failed to update featured status:", error);
    // revert UI nếu lỗi
    isFav.value = !next;
    emit("favorite", { product: props.product, isFavorite: isFav.value });

    // Hiển thị notification lỗi
    showNotification({
      message: "Không thể cập nhật mục yêu thích. Vui lòng thử lại.",
      type: "error",
      duration: 3000,
    });
  }
};

const formatPrice = (price) => {
  // Normalize to number (handle "$1,234,567.00", "1,234,567.00", 1234567, etc.)
  let value = 0;

  if (typeof price === "number") {
    value = price;
  } else if (typeof price === "string") {
    // Keep digits, separators and minus; then remove thousands commas
    const cleaned = price.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(cleaned);
    value = Number.isNaN(parsed) ? 0 : parsed;
  }

  // VND: no decimals
  const vnd = Math.round(value);
  return `${vnd.toLocaleString("vi-VN")} đ`;
};
</script>
