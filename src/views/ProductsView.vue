<template>
  <main class="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
    <!-- Breadcrumbs & Heading -->
    <div class="mb-8">
      <Breadcrumbs
        :items="[
          { label: $t('products.home'), to: '/' },
          { label: $t('products.eyewearCollection') },
        ]"
        class-name="mb-4"
      />

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            class="text-4xl font-black tracking-tight text-[#101918] dark:text-white mb-2"
          >
            {{ $t("products.title") }}
          </h1>
          <p class="text-[#578e89] max-w-lg">
            {{ $t("products.subtitle") }}
          </p>
        </div>

        <div
          class="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-[#e9f1f1] dark:border-gray-700"
        >
          <span class="text-sm font-medium px-2">{{
            $t("products.sortBy")
          }}</span>
          <select
            v-model="selectedSort"
            class="bg-transparent border-none text-sm font-bold focus:ring-0 py-0 pr-8 cursor-pointer"
          >
            <option value="newest">{{ $t("products.newestArrivals") }}</option>
            <option value="priceAsc">
              {{ $t("products.priceLowToHigh") }}
            </option>
            <option value="priceDesc">
              {{ $t("products.priceHighToLow") }}
            </option>
            <option value="popular">{{ $t("products.mostPopular") }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div
          class="sticky top-28 space-y-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#e9f1f1] dark:border-gray-800 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ $t("products.filters") }}</h3>
            <button
              class="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
              type="button"
              @click="clearAllFilters"
            >
              {{ $t("products.clearAll") }}
            </button>
          </div>

          <!-- Categories Filter -->
          <div class="space-y-4">
            <p
              class="text-xs font-bold text-[#578e89] uppercase tracking-widest"
            >
              {{ $t("products.type") }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                class="px-4 py-2 rounded-lg text-sm font-bold"
                type="button"
                :class="
                  selectedCategoryId === null
                    ? 'bg-primary text-white'
                    : 'bg-[#e9f1f1] dark:bg-gray-800 hover:bg-primary/10 transition-colors'
                "
                @click="selectedCategoryId = null"
              >
                {{ $t("products.all") }}
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="px-4 py-2 rounded-lg text-sm font-medium"
                type="button"
                :class="
                  selectedCategoryId === cat.id
                    ? 'bg-primary text-white font-bold'
                    : 'bg-[#e9f1f1] dark:bg-gray-800 hover:bg-primary/10 transition-colors'
                "
                @click="selectedCategoryId = cat.id"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <p
                class="text-xs font-bold text-[#578e89] uppercase tracking-widest"
              >
                {{ $t("products.priceRange") }}
              </p>
              <span class="text-sm font-bold text-primary">{{
                priceRangeLabel
              }}</span>
            </div>
            <input
              class="w-full accent-primary h-1.5 bg-[#e9f1f1] dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              type="range"
              :min="priceMin"
              :max="priceMaxLimit"
              :step="priceStep"
              v-model.number="priceMaxDraft"
              @change="commitPriceMax"
            />
          </div>

          <!-- Frame Shape (single select) -->
          <div class="space-y-3">
            <p
              class="text-xs font-bold text-[#578e89] uppercase tracking-widest"
            >
              {{ $t("products.frameShape") }}
            </p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input
                  v-model="selectedFrameShape"
                  :value="null"
                  class="rounded-full border-gray-300 text-primary focus:ring-primary"
                  type="radio"
                  name="frame-shape"
                />
                <span
                  class="text-sm group-hover:text-primary transition-colors"
                  >{{ $t("products.all") }}</span
                >
              </label>

              <label
                v-for="shape in frameShapeOptions"
                :key="shape"
                class="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  v-model="selectedFrameShape"
                  :value="shape"
                  class="rounded-full border-gray-300 text-primary focus:ring-primary"
                  type="radio"
                  name="frame-shape"
                />
                <span
                  class="text-sm group-hover:text-primary transition-colors"
                  >{{ frameShapeLabel(shape) }}</span
                >
              </label>
            </div>
          </div>

          <!-- Promotion Card -->
          <div
            class="mt-8 bg-primary/10 dark:bg-primary/5 rounded-xl p-4 border border-primary/20"
          >
            <p class="text-sm font-bold text-primary mb-1">
              {{ $t("products.freeEyeExam") }}
            </p>
            <p class="text-xs text-[#578e89] leading-relaxed">
              {{ $t("products.freeEyeExamDesc") }}
            </p>
            <button
              class="mt-3 w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-105 transition-all"
              type="button"
            >
              {{ $t("products.bookNow") }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <section class="flex-1">
        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
        >
          <p class="text-red-600 dark:text-red-400 text-sm font-medium">
            {{ error }}
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading && products.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-[4/5] animate-pulse"
          ></div>
        </div>

        <!-- Products Grid -->
        <div
          v-else-if="sortedProducts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <ProductCard
            v-for="product in pagedProducts"
            :key="product.id"
            :product="product"
            :show-quick-view="false"
            :show-rating="false"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && !error" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            {{ "Không có sản phẩm nào" }}
          </p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="sortedProducts.length > PAGE_SIZE"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import ProductCard from "@/components/features/products/ProductCard.vue";
import Pagination from "@/components/common/Pagination.vue";
import { usePageLoading } from "@/composables/usePageLoading";
import productService from "@/services/productService.js";
import categoryService from "@/services/categoryService.js";

const { setLoading } = usePageLoading();
const { t } = useI18n();

const currentPage = ref(1);
const products = ref([]);
const isLoading = ref(false);
const error = ref(null);
const selectedSort = ref("newest");

// ===== Filters =====
const categories = ref([]);
const selectedCategoryId = ref(null); // null = all
const selectedFrameShape = ref(null); // single (null = all)

const priceMin = ref(0);
const priceMaxLimit = ref(5_000_000); // tuỳ bạn đổi, hiện mặc định 5tr
const priceStep = ref(50_000);
// priceMaxDraft: đang kéo slider (UI update liên tục, KHÔNG gọi API)
const priceMaxDraft = ref(priceMaxLimit.value);
// priceMax: giá đã chọn (chỉ đổi khi thả chuột / change -> mới gọi API)
const priceMax = ref(priceMaxLimit.value);

// Chuẩn hoá giá về number để sort
const parsePriceToNumber = (price) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    // Bỏ ký tự $, dấu phẩy, khoảng trắng...
    const cleaned = price.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
};

const formatVnd = (n) => {
  const num = Number(n) || 0;
  return num.toLocaleString("vi-VN") + "₫";
};

const priceRangeLabel = computed(
  () => `${formatVnd(priceMin.value)} - ${formatVnd(priceMaxDraft.value)}`,
);

const commitPriceMax = () => {
  // Chỉ khi thả chuột (change) mới commit và trigger fetch (watch priceMax)
  priceMax.value = priceMaxDraft.value;
};

// Chống race condition khi kéo filter nhanh (nhiều request về không theo thứ tự)
let fetchSeq = 0;

// Kích thước trang cho pagination phía client
const PAGE_SIZE = 6;

// Frame shape options (danh sách cố định, khớp với API frame_shape)
const frameShapeOptions = ["aviator", "wayfarer", "round", "square", "cat_eye"];

const frameShapeLabel = (shape) => {
  const keyMap = {
    aviator: "products.aviator",
    wayfarer: "products.wayfarer",
    round: "products.round",
    square: "products.square",
    cat_eye: "products.catEye",
  };
  const key = keyMap[String(shape)];
  if (key) return t(key);
  // fallback: hiển thị dạng chữ thường -> Title Case
  return String(shape)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
};

/**
 * Transform API product data to match component expectations
 * Handles different field names from Laravel API
 */
const transformProduct = (product) => {
  // Ensure product is an object
  if (!product || typeof product !== "object") {
    console.warn("Invalid product data:", product);
    return null;
  }

  // Handle nested objects (e.g., product.category might be an object)
  let categoryName = "";
  if (product.category) {
    if (typeof product.category === "string") {
      categoryName = product.category;
    } else if (typeof product.category === "object" && product.category.name) {
      categoryName = product.category.name;
    }
  }
  if (!categoryName) {
    categoryName = product.type || product.category_name || "";
  }

  // Extract price and format it
  let priceValue = product.price || product.price_formatted || 0;
  if (typeof priceValue === "number") {
    priceValue = `$${priceValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (typeof priceValue === "string" && !priceValue.startsWith("$")) {
    priceValue = `$${priceValue}`;
  }

  // Compare price (giá gốc) nếu có
  const comparePriceValue =
    product.compare_price ?? product.comparePrice ?? null;

  // Placeholder image URL (fallback khi không có ảnh)
  const placeholderImage =
    "https://via.placeholder.com/400x500/59b7c0/ffffff?text=Product+Image";

  // Get image URL từ API response
  // Với response bạn gửi: ưu tiên `primary_image` -> `images[].image_url`
  let imageUrl = null;

  // 1) Primary image ở cấp product
  if (
    typeof product.primary_image === "string" &&
    product.primary_image.trim()
  ) {
    imageUrl = product.primary_image;
  }

  // 2) Ảnh trong mảng images
  if (!imageUrl && Array.isArray(product.images) && product.images.length > 0) {
    const primaryImg =
      product.images.find(
        (img) => img && (img.is_primary === true || img.is_primary === 1),
      ) || product.images[0];
    if (primaryImg) {
      if (
        typeof primaryImg.image_url === "string" &&
        primaryImg.image_url.trim()
      ) {
        imageUrl = primaryImg.image_url;
      } else if (typeof primaryImg.url === "string" && primaryImg.url.trim()) {
        imageUrl = primaryImg.url;
      }
    }
  }

  // 3) Fallback (giữ tương thích các format khác)
  if (!imageUrl && product.image_url) {
    imageUrl =
      typeof product.image_url === "string"
        ? product.image_url
        : product.image_url.url || null;
  } else if (!imageUrl && product.image) {
    imageUrl =
      typeof product.image === "string"
        ? product.image
        : product.image.url || null;
  } else if (!imageUrl && product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (!imageUrl && product.photo) {
    imageUrl =
      typeof product.photo === "string"
        ? product.photo
        : product.photo.url || null;
  }

  // Sử dụng placeholder nếu không có URL
  if (!imageUrl) imageUrl = placeholderImage;

  // Get product name
  const productName = product.name || product.title || "Unnamed Product";

  // Get alt text
  const altText = product.alt || product.description || productName;

  // Transform to clean object with only needed fields
  const transformed = {
    id: product.id || product.product_id || null,
    name: productName,
    category: categoryName,
    categoryId:
      product?.category?.id ??
      product.category_id ??
      product.categories_id ??
      null,
    frameShape: product.frame_shape || product.frameShape || null,
    price: priceValue,
    comparePrice: comparePriceValue,
    badge:
      product.badge ||
      (product.is_new ? "New" : null) ||
      (product.is_new === 1 ? "New" : null),
    image: imageUrl,
    imageUrl: imageUrl,
    alt: altText,
    // rating trong response bạn gửi là object { average, count, reviews }
    rating: Number(
      product?.rating?.average ??
        product.average_rating ??
        product.rating_average ??
        0,
    ),
    reviews: Number(
      product?.rating?.count ??
        product.reviews_count ??
        product.review_count ??
        0,
    ),
    fullStars: Math.round(
      Number(
        product?.rating?.average ??
          product.average_rating ??
          product.rating_average ??
          0,
      ),
    ),
    // Danh sách ảnh (phục vụ variant đổi ảnh theo product_color_id)
    // Backend (ProductImageResource) đã có: image_url, is_primary, product_color_id
    images: Array.isArray(product.images)
      ? product.images
          .filter((img) => img && (img.image_url || img.url))
          .map((img) => ({
            id: img.id ?? null,
            imageUrl: img.image_url ?? img.url ?? null,
            isPrimary: img.is_primary === true || img.is_primary === 1,
            productColorId: img.product_color_id ?? null,
            sortOrder: img.sort_order ?? null,
          }))
      : [],
    // Dữ liệu phục vụ sort
    createdAt: product.created_at || product.createdAt || null,
    // Màu sắc (array) để hiển thị ở ProductCard
    colors: Array.isArray(product.colors)
      ? product.colors.map((c) => ({
          // id của "màu" (color_id) - dùng để key nếu có
          id: c?.color_id ?? c?.id ?? null,
          // id của biến thể product_color (để map với product.images[].product_color_id)
          // với ProductColorResource thường `id` chính là product_color.id
          productColorId:
            c?.id ??
            c?.product_color_id ??
            c?.product_color?.id ??
            c?.pivot?.id ??
            null,
          name: c?.name ?? "",
          hex: c?.hex_code || c?.hex || c?.hex_color || null,
        }))
      : [],
  };

  return transformed;
};

// Danh sách sản phẩm sau khi filter + sort (fallback client-side)
const sortedProducts = computed(() => {
  let list = [...products.value];

  // Fallback filter theo categoryId (trong trường hợp backend chưa lọc)
  if (
    selectedCategoryId.value !== null &&
    selectedCategoryId.value !== undefined
  ) {
    list = list.filter(
      (p) => String(p.categoryId) === String(selectedCategoryId.value),
    );
  }

  // Fallback filter theo frame_shape (single select)
  if (selectedFrameShape.value) {
    list = list.filter(
      (p) => String(p.frameShape) === String(selectedFrameShape.value),
    );
  }

  switch (selectedSort.value) {
    case "priceAsc":
      return list.sort(
        (a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price),
      );
    case "priceDesc":
      return list.sort(
        (a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price),
      );
    case "popular":
      // Sort theo số lượng reviews (hoặc rating cao hơn nếu reviews bằng nhau)
      return list.sort((a, b) => {
        const reviewsDiff = (b.reviews || 0) - (a.reviews || 0);
        if (reviewsDiff !== 0) return reviewsDiff;
        return (b.rating || 0) - (a.rating || 0);
      });
    case "newest":
    default:
      // Sort theo ngày tạo mới nhất
      return list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }
});

// Sản phẩm cho trang hiện tại (pagination phía client)
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return sortedProducts.value.slice(start, start + PAGE_SIZE);
});

// Tổng số trang dựa trên số sản phẩm sau khi filter
const totalPages = computed(() => {
  const total = sortedProducts.value.length;
  return total === 0 ? 1 : Math.ceil(total / PAGE_SIZE);
});

/**
 * Fetch products from API
 */
const fetchProducts = async (page = 1) => {
  const seq = ++fetchSeq;
  isLoading.value = true;
  error.value = null;
  setLoading(true);

  try {
    const params = {
      page,
      // Lấy nhiều sản phẩm để filter + phân trang phía client
      per_page: 100,
      limit: 100,
    };

    // ==== sort params (backend có thể dùng hoặc bỏ qua) ====
    // Nếu backend bạn đang có param riêng, đổi mapping tại đây
    if (selectedSort.value === "newest") {
      params.sort_by = "created_at";
      params.sort_dir = "desc";
    } else if (selectedSort.value === "priceAsc") {
      // Backend/DB dùng cột base_price (không có cột price)
      params.sort_by = "base_price";
      params.sort_dir = "asc";
    } else if (selectedSort.value === "priceDesc") {
      // Backend/DB dùng cột base_price (không có cột price)
      params.sort_by = "base_price";
      params.sort_dir = "desc";
    } else if (selectedSort.value === "popular") {
      params.sort_by = "popular";
      params.sort_dir = "desc";
    }

    // ==== filter params ====
    if (
      selectedCategoryId.value !== null &&
      selectedCategoryId.value !== undefined
    ) {
      // theo yêu cầu backend: filter bằng categories_id
      params.categories_id = selectedCategoryId.value;
      // fallback tên param thường gặp
      params.category_id = selectedCategoryId.value;
    }

    // price
    if (priceMax.value !== null && priceMax.value !== undefined) {
      params.min_price = priceMin.value;
      params.max_price = priceMax.value;
    }

    // frame shape (single)
    if (selectedFrameShape.value) {
      params.frame_shape = selectedFrameShape.value;
      // fallback param name (nếu backend dùng)
      params.frame_shapes = selectedFrameShape.value;
    }

    const response = await productService.getProducts(params);

    // Handle Laravel paginated response: { data: [...], meta: {...}, links: {...} }
    let productsData = [];
    let paginationMeta = null;

    if (response && typeof response === "object") {
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
        paginationMeta = response.meta || response.pagination;
      } else if (response.products && Array.isArray(response.products)) {
        productsData = response.products;
        paginationMeta = response.meta;
      }
    }

    // Nếu có request mới hơn, bỏ qua response cũ để tránh UI bị "trễ"
    if (seq !== fetchSeq) return;

    // Transform products to match component structure
    products.value = productsData
      .map(transformProduct)
      .filter((p) => p !== null); // Remove invalid products
  } catch (err) {
    if (seq !== fetchSeq) return;
    console.error("Failed to fetch products:", err);
    error.value =
      err.message || "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.";
    products.value = [];
  } finally {
    // Chỉ tắt loading cho request mới nhất
    if (seq === fetchSeq) {
      isLoading.value = false;
      setLoading(false);
    }
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const clearAllFilters = () => {
  selectedCategoryId.value = null;
  selectedFrameShape.value = null;
  priceMin.value = 0;
  priceMaxDraft.value = priceMaxLimit.value;
  priceMax.value = priceMaxLimit.value;
  currentPage.value = 1;
  fetchProducts(1);
};

// Khi thay đổi sort/filter -> reset về trang 1 và fetch lại
watch(
  [selectedSort, selectedCategoryId, selectedFrameShape, priceMax],
  () => {
    currentPage.value = 1;
    fetchProducts(1);
  },
  { deep: true },
);

const fetchCategories = async () => {
  try {
    const data = await categoryService.getCategories();
    categories.value = Array.isArray(data)
      ? data
          .filter((c) => c && c.id !== undefined && c.name)
          .map((c) => ({ id: Number(c.id), name: c.name }))
      : [];
  } catch (e) {
    console.error("Failed to fetch categories:", e);
    categories.value = [];
  }
};

// Fetch products on component mount
onMounted(() => {
  fetchCategories();
  fetchProducts(1);
});
</script>
