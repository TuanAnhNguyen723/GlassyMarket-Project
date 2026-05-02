import { ref, computed, watch } from "vue";
import { useAuth } from "@/composables/useAuth";

const CART_KEY_GUEST = "kinhmat_cart_guest";

function getCartKey(userId) {
  if (userId == null || userId === "") return CART_KEY_GUEST;
  return `kinhmat_cart_user_${userId}`;
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(sanitizeStoredCartItem) : [];
  } catch {
    return [];
  }
}

function sanitizeStoredCartItem(item) {
  if (!item || typeof item !== "object") return item;
  const prescription = normalizePrescription(item.prescription);
  return {
    ...item,
    prescription,
  };
}

function saveToStorage(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn("useCart: could not persist cart", e);
  }
}

/**
 * Tạo id dòng giỏ hàng: cùng sản phẩm + cùng màu + cùng lens + cùng độ mắt = gộp quantity
 */
function lineId(productId, productColorId, lensId, prescriptionKey = "") {
  return `${productId}-${productColorId ?? "default-color"}-${lensId ?? "default-lens"}-${prescriptionKey}`;
}

/**
 * Chuẩn hóa giá từ API (number hoặc string) thành number
 */
function parsePrice(value) {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const cleaned = String(value).replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function normalizePrescription(prescription) {
  if (!prescription || typeof prescription !== "object") return null;
  const entries = Object.entries(prescription).filter(
    ([key, value]) =>
      key !== "pd" && value !== null && value !== undefined && value !== "",
  );
  if (!entries.length) return null;
  return Object.fromEntries(entries);
}

/**
 * State giỏ hàng dùng chung (singleton).
 * Mỗi user có giỏ riêng: guest = kinhmat_cart_guest, user = kinhmat_cart_user_{id}
 */
const items = ref([]);
let cartInitialized = false;

function initCartSync() {
  if (cartInitialized) return;
  cartInitialized = true;
  const { user } = useAuth();

  // Khi đổi user (login/logout) → lưu giỏ hiện tại, tải giỏ của user mới
  let isFirstSync = true;
  watch(
    () => user.value?.id ?? null,
    (newUserId, oldUserId) => {
      const newKey = getCartKey(newUserId);
      let loaded;

      if (isFirstSync) {
        isFirstSync = false;
        loaded = loadFromStorage(newKey);
      } else {
        const oldKey = getCartKey(oldUserId);
        saveToStorage(oldKey, items.value);
        loaded = loadFromStorage(newKey);
      }

      // Migrate từ key cũ (kinhmat_cart) nếu có và đang load guest
      if (loaded.length === 0 && !newUserId) {
        const legacy = loadFromStorage("kinhmat_cart");
        if (legacy.length > 0) {
          loaded = legacy;
          try {
            localStorage.removeItem("kinhmat_cart");
          } catch (_) {}
        }
      }
      items.value = loaded;
    },
    { immediate: true }
  );

  // Lưu giỏ khi items thay đổi
  watch(
    items,
    (val) => {
      const key = getCartKey(user.value?.id ?? null);
      saveToStorage(key, val);
    },
    { deep: true }
  );
}

const itemsCount = computed(() =>
  items.value.reduce((sum, i) => sum + (i.quantity || 0), 0)
);

const subtotal = computed(() =>
  items.value.reduce(
    (sum, i) => sum + parsePrice(i.unitPrice ?? i.price) * (i.quantity || 0),
    0,
  )
);

/** Thuế 8% tính trên từng sản phẩm (price × quantity), làm tròn từng dòng rồi cộng tổng */
const tax = computed(() =>
  items.value.reduce(
    (sum, i) =>
      sum + Math.round(parsePrice(i.unitPrice ?? i.price) * (i.quantity || 0) * 0.08),
    0
  )
);

/**
 * Composable quản lý giỏ hàng (chỉ cart, không làm thanh toán).
 * Mỗi tài khoản có giỏ riêng, chuyển đổi tự động khi login/logout.
 */
export function useCart() {
  initCartSync();
  /**
   * Thêm vào giỏ (hoặc tăng quantity nếu đã có cùng productId + productColorId + lensId + prescription).
   * @param {Object} payload
   * @param {string|number} payload.productId
   * @param {string} payload.name
   * @param {number|string} payload.price
   * @param {string} [payload.image]
   * @param {string} [payload.alt]
   * @param {string|number} [payload.lensId]
   * @param {string} [payload.lensName]
   * @param {string} [payload.lensType]
   * @param {string} [payload.prescriptionType]
   * @param {Object} [payload.prescription]
   * @param {string|number} [payload.productColorId]
   * @param {string} [payload.color] - Tên màu (để hiển thị)
   * @param {string} [payload.colorHex] - Mã hex từ API (colors.hex_code) để hiển thị ô màu
   * @param {string} [payload.frameType] - Loại kính (category/frame detail)
   * @param {number|string} [payload.stock] - Tồn kho hiện tại của sản phẩm
   */
  function addItem(payload) {
    const productId = String(payload.productId ?? payload.id ?? "");
    const productColorId =
      payload.productColorId ?? payload.product_color_id ?? null;
    const lensId = payload.lensId ?? payload.lens_id ?? null;
    const prescription = normalizePrescription(payload.prescription);
    const prescriptionKey = prescription
      ? JSON.stringify({
          type: payload.prescriptionType ?? payload.prescription_type ?? null,
          prescription,
        })
      : "";
    const id = lineId(productId, productColorId, lensId, prescriptionKey);

    const price = parsePrice(payload.price);
    const image = payload.image ?? payload.imageUrl ?? "";
    const name = payload.name ?? "Sản phẩm";
    const lensName =
      payload.lensName ?? payload.lens_name ?? payload.lens_option_name ?? "Không chọn lens";
    const lensType = payload.lensType ?? payload.lens_type ?? null;
    const prescriptionType =
      payload.prescriptionType ?? payload.prescription_type ?? null;
    const color = payload.color ?? "—";
    const colorHex =
      payload.colorHex ?? payload.color_hex ?? payload.hex ?? null;
    const frameType = payload.frameType ?? "—";
    const alt = payload.alt ?? name;
    const stock = Number(payload.stock ?? payload.stock_quantity ?? 0);
    const maxQuantity = Number.isFinite(stock) && stock > 0 ? stock : null;

    const existing = items.value.find((i) => i.id === id);
    if (existing) {
      if (maxQuantity != null) {
        existing.stock = maxQuantity;
      }
      existing.quantity =
        maxQuantity != null
          ? Math.min(maxQuantity, (existing.quantity || 1) + 1)
          : (existing.quantity || 1) + 1;
      return;
    }

    items.value.push({
      id,
      productId,
      productColorId,
      name,
      price,
      unitPrice: price,
      image,
      alt,
      color,
      colorHex: colorHex && String(colorHex).trim() ? String(colorHex).trim() : null,
      frameType,
      lensId,
      lens: lensName,
      lensName,
      lensType,
      prescriptionType,
      prescription,
      stock: maxQuantity,
      quantity: 1,
    });
  }

  function updateQuantity(itemId, quantity) {
    const num = Math.max(0, Number(quantity) || 0);
    if (num === 0) {
      removeItem(itemId);
      return;
    }
    const item = items.value.find((i) => i.id === itemId);
    if (item) {
      const stock = Number(item.stock ?? item.stock_quantity ?? 0);
      const maxQuantity = Number.isFinite(stock) && stock > 0 ? stock : null;
      item.quantity = maxQuantity != null ? Math.min(num, maxQuantity) : num;
    }
  }

  function removeItem(itemId) {
    items.value = items.value.filter((i) => i.id !== itemId);
  }

  function clear() {
    items.value = [];
  }

  return {
    items,
    itemsCount,
    subtotal,
    tax,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}
