/**
 * Cache in memory với TTL (time-to-live).
 * Dùng để tránh gọi lại API khi dữ liệu còn mới.
 */

const store = new Map()

/** Key dùng cho từng loại dữ liệu */
export const CACHE_KEYS = {
  PROFILE: 'kinhmat_cache_profile',
  ORDERS: 'kinhmat_cache_orders',
  PRODUCTS: 'kinhmat_cache_products',
  PRODUCT_DETAIL: 'kinhmat_cache_product_detail',
}

/** TTL mặc định (ms) */
export const CACHE_TTL = {
  PROFILE: 5 * 60 * 1000,     // 5 phút
  ORDERS: 2 * 60 * 1000,      // 2 phút
  PRODUCTS: 5 * 60 * 1000,    // 5 phút
  PRODUCT_DETAIL: 5 * 60 * 1000,  // 5 phút
}

/**
 * @param {string} key
 * @returns {unknown | null} Giá trị đã cache hoặc null nếu hết hạn/không có
 */
export function get(key) {
  const entry = store.get(key)
  if (!entry) return null
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

/**
 * Lưu cache. Tự deep-clone value để tránh lưu reactive proxy và đảm bảo dữ liệu (VD: image URL) không bị mất khi dùng lại.
 * @param {string} key
 * @param {unknown} value
 * @param {number} [ttlMs]
 */
export function set(key, value, ttlMs) {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null
  let valueToStore = value
  try {
    if (value !== null && typeof value === 'object') {
      valueToStore = JSON.parse(JSON.stringify(value))
    }
  } catch (_) {
    valueToStore = value
  }
  store.set(key, { value: valueToStore, expiresAt })
}

/**
 * @param {string} key
 */
export function remove(key) {
  store.delete(key)
}

/**
 * Xóa tất cả cache có key bắt đầu bằng prefix (dùng cho orders: mỗi page/per_page một key)
 * @param {string} prefix - VD: CACHE_KEYS.ORDERS
 */
export function removeByPrefix(prefix) {
  for (const key of store.keys()) {
    if (String(key).startsWith(prefix)) store.delete(key)
  }
}

/** Xóa toàn bộ cache (gọi khi logout) */
export function clear() {
  store.clear()
}

/** Xóa cache profile (gọi sau khi cập nhật hồ sơ) */
export function invalidateProfile() {
  remove(CACHE_KEYS.PROFILE)
}

/** Xóa tất cả cache orders (gọi sau khi đặt đơn mới) */
export function invalidateOrders() {
  removeByPrefix(CACHE_KEYS.ORDERS)
}

/** Xóa tất cả cache products và product detail (gọi khi cập nhật catalog từ admin) */
export function invalidateProducts() {
  removeByPrefix(CACHE_KEYS.PRODUCTS)
  removeByPrefix(CACHE_KEYS.PRODUCT_DETAIL)
}
