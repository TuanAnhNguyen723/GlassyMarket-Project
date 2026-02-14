import { ref, computed, watch } from "vue";

const CART_STORAGE_KEY = "kinhmat_cart";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("useCart: could not persist cart", e);
  }
}

/**
 * Tạo id dòng giỏ hàng: cùng sản phẩm + cùng lens = gộp quantity
 */
function lineId(productId, lensId) {
  return `${productId}-${lensId ?? "default"}`;
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

/**
 * State giỏ hàng dùng chung (singleton) để badge header và màn cart/product cập nhật theo thời gian thực.
 */
const items = ref(loadFromStorage());

watch(
  items,
  (val) => saveToStorage(val),
  { deep: true }
);

const itemsCount = computed(() =>
  items.value.reduce((sum, i) => sum + (i.quantity || 0), 0)
);

const subtotal = computed(() =>
  items.value.reduce((sum, i) => sum + parsePrice(i.price) * (i.quantity || 0), 0)
);

/** Thuế 8% tính trên từng sản phẩm (price × quantity), làm tròn từng dòng rồi cộng tổng */
const tax = computed(() =>
  items.value.reduce(
    (sum, i) => sum + Math.round(parsePrice(i.price) * (i.quantity || 0) * 0.08),
    0
  )
);

/**
 * Composable quản lý giỏ hàng (chỉ cart, không làm thanh toán).
 * Lưu localStorage, hỗ trợ add / update quantity / remove.
 * Trả về cùng một state cho mọi component → badge giỏ hàng cập nhật realtime.
 */
export function useCart() {
  /**
   * Thêm vào giỏ (hoặc tăng quantity nếu đã có cùng productId + lensId).
   * @param {Object} payload
   * @param {string|number} payload.productId
   * @param {string} payload.name
   * @param {number|string} payload.price
   * @param {string} [payload.image]
   * @param {string} [payload.alt]
   * @param {string|number} [payload.lensId]
   * @param {string} [payload.lensName]
   * @param {string} [payload.color] - Tên màu (để hiển thị)
   * @param {string} [payload.colorHex] - Mã hex từ API (colors.hex_code) để hiển thị ô màu
   * @param {string} [payload.frameType] - Loại kính (category/frame detail)
   */
  function addItem(payload) {
    const productId = String(payload.productId ?? payload.id ?? "");
    const lensId = payload.lensId != null ? String(payload.lensId) : "default";
    const id = lineId(productId, lensId);

    const price = parsePrice(payload.price);
    const image = payload.image ?? payload.imageUrl ?? "";
    const name = payload.name ?? "Sản phẩm";
    const lensName = payload.lensName ?? "—";
    const color = payload.color ?? "—";
    const colorHex =
      payload.colorHex ?? payload.color_hex ?? payload.hex ?? null;
    const frameType = payload.frameType ?? "—";
    const alt = payload.alt ?? name;

    const existing = items.value.find((i) => i.id === id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      return;
    }

    items.value.push({
      id,
      productId,
      name,
      price,
      image,
      alt,
      color,
      colorHex: colorHex && String(colorHex).trim() ? String(colorHex).trim() : null,
      frameType,
      lens: lensName,
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
    if (item) item.quantity = num;
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
