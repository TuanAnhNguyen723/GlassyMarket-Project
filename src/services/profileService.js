import api, { resolveAssetUrl } from './api'

/** Lấy URL ảnh từ order item (nhiều format backend có thể trả) */
function getOrderItemImageUrl(firstItem) {
  if (!firstItem) return ''
  const product =
    firstItem.product ??
    firstItem.product_data ??
    firstItem.product_snapshot ??
    firstItem

  const candidates = [
    firstItem.product_image_url,
    firstItem.product_image,
    firstItem.image_url,
    firstItem.image,
    firstItem.thumbnail,
    firstItem.photo,
    firstItem?.product?.primary_image,
    firstItem?.product?.image_url,
    firstItem?.product?.image,
    firstItem?.product_snapshot?.primary_image,
    firstItem?.product_snapshot?.image_url,
    firstItem?.product_snapshot?.image,
    product?.primary_image,
    product?.image_url,
    product?.image,
  ]

  for (const raw of candidates) {
    if (!raw) continue
    if (typeof raw === 'string' && raw.trim()) {
      return resolveAssetUrl(raw)
    }
    if (typeof raw === 'object') {
      const url = raw.url ?? raw.image_url ?? raw.path ?? ''
      if (typeof url === 'string' && url.trim()) {
        return resolveAssetUrl(url)
      }
    }
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    const img = product.images.find((i) => i?.is_primary) ?? product.images[0]
    const url = img?.image_url ?? img?.url ?? img?.image
    if (url) return resolveAssetUrl(url)
  }
  return ''
}
import { get, set, CACHE_KEYS, CACHE_TTL } from '@/utils/cache'

/**
 * Trạng thái đơn → % tiến độ giao hàng (hiển thị thanh progress).
 * Frontend chỉ đọc status từ API; % lên 100% khi backend cập nhật status = "delivered" (đã giao tới khách).
 * Luồng: pending/completed (0–25%) → confirmed (25%) → processing (50%) → shipped (85%) → delivered (100%).
 */
export const ORDER_PROGRESS = {
  pending: 0,
  completed: 25,   // Đơn vừa đặt/thanh toán xong (checkout gửi status "completed")
  confirmed: 25,
  processing: 50,
  shipped: 85,
  delivered: 100,   // 100% khi backend set status = "delivered"
  cancelled: 0
}

/**
 * Chuẩn hóa status từ backend về tập key nội bộ:
 * pending | confirmed | processing | shipped | delivered | cancelled
 */
export function normalizeOrderStatus(status) {
  const raw = String(status || '').trim().toLowerCase()
  if (!raw) return 'pending'

  const normalized = raw
    .replace(/[\s-]+/g, '_')
    .replace(/[^\w]/g, '')

  const aliasMap = {
    pending: 'pending',
    waiting: 'pending',
    queued: 'pending',
    new: 'pending',

    confirmed: 'confirmed',
    complete: 'confirmed',
    completed: 'confirmed',
    approved: 'confirmed',
    accepted: 'confirmed',

    processing: 'processing',
    preparing: 'processing',
    packing: 'processing',
    in_progress: 'processing',

    shipped: 'shipped',
    in_transit: 'shipped',
    on_delivery: 'shipped',
    delivering: 'shipped',
    out_for_delivery: 'shipped',

    delivered: 'delivered',
    done: 'delivered',
    success: 'delivered',

    cancelled: 'cancelled',
    canceled: 'cancelled',
    reject: 'cancelled',
    rejected: 'cancelled',
    failed: 'cancelled',
  }

  return aliasMap[normalized] || 'pending'
}

/**
 * Lấy % tiến độ theo status (do backend trả về).
 * @param {string} status
 * @returns {number}
 */
export function getOrderProgress(status) {
  const key = normalizeOrderStatus(status)
  return ORDER_PROGRESS[key] ?? 0
}

/**
 * Key trạng thái cho i18n (dashboard.orderStatusXxx)
 */
export const ORDER_STATUS_KEYS = {
  pending: 'orderStatusPending',
  completed: 'orderStatusConfirmed',
  confirmed: 'orderStatusConfirmed',
  processing: 'orderStatusProcessing',
  shipped: 'orderStatusShipped',
  delivered: 'orderStatusDelivered',
  cancelled: 'orderStatusCancelled'
}

export function getOrderStatusKey(status) {
  const key = normalizeOrderStatus(status)
  return ORDER_STATUS_KEYS[key] || 'orderStatusPending'
}

/**
 * Format ngày dự kiến: "Today" nếu là hôm nay
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export function formatEstimatedDelivery(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) {
    return 'Today'
  }
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * GET /api/v1/profile - Thông tin người dùng (có cache, TTL 5 phút)
 * Khi đã gọi API rồi thì chuyển tab không gọi lại nữa cho đến khi hết hạn.
 * @returns {Promise<{ id, name, email, avatar, is_premium, phone, date_of_birth, gender, ... }>}
 */
export async function getProfile() {
  const cached = get(CACHE_KEYS.PROFILE)
  if (cached != null && typeof cached === 'object') {
    return cached
  }
  const data = await api.get('/profile')
  set(CACHE_KEYS.PROFILE, data, CACHE_TTL.PROFILE)
  return data
}

/** Backend chỉ chấp nhận male, female, other */
function normalizeGender(val) {
  const v = (val || '').toLowerCase()
  if (v === 'male' || v === 'female') return v
  return v ? 'other' : null
}

/**
 * PUT /api/v1/profile - Cập nhật thông tin cá nhân
 * Spec: name, phone, date_of_birth, gender, language? (+ password, password_confirmation khi đổi MK)
 * @param {Object} data - { name, fullName?, phone, date_of_birth?, dateOfBirth?, gender, language?, password?, password_confirmation? }
 * @returns {Promise<Object>}
 */
export async function updateProfile(data) {
  const payload = {
    name: (data.name ?? data.fullName ?? '').trim() || null,
    phone: (data.phone ?? '').trim() || null,
    date_of_birth: (data.date_of_birth ?? data.dateOfBirth ?? '').trim() || null,
    gender: normalizeGender(data.gender),
  }
  if (data.language != null) payload.language = data.language
  if (data.password) {
    payload.password = data.password
    payload.password_confirmation = data.password_confirmation ?? data.password
  }
  return api.put('/profile', payload)
}

/**
 * Trích avatar URL từ response (nhiều format backend có thể trả).
 * Chuẩn hóa path tương đối thành URL đầy đủ.
 */
export function extractAvatarUrl(res) {
  if (!res || typeof res !== 'object') return ''
  const raw =
    res.avatar ??
    res.url ??
    res.avatar_url ??
    res.image ??
    res.path ??
    res.data?.avatar ??
    res.data?.url ??
    res.data?.avatar_url ??
    res.data?.user?.avatar ??
    res.data?.user?.avatar_url ??
    res.user?.avatar ??
    res.user?.avatar_url ??
    ''
  return resolveAssetUrl(raw)
}

/**
 * POST /api/v1/profile/avatar - Upload ảnh đại diện
 * @param {File} file - File ảnh (image/jpeg, image/png, ...)
 * @returns {Promise<{ avatar?: string }>} - Trả về object có avatar URL đã chuẩn hóa
 */
export async function uploadAvatar(file) {
  if (!file || !(file instanceof File)) {
    throw new Error('Vui lòng chọn file ảnh hợp lệ.')
  }
  const form = new FormData()
  form.append('avatar', file)
  const res = await api.postFormData('/profile/avatar', form)
  return { ...res, avatar: extractAvatarUrl(res) || res?.avatar || res?.url }
}

/** Cache key cho getOrders theo page + per_page */
function getOrdersCacheKey(params) {
  const page = params?.page ?? 1
  const perPage = params?.per_page ?? 10
  return `${CACHE_KEYS.ORDERS}_p${page}_pp${perPage}`
}

/**
 * GET /api/v1/orders - Danh sách đơn hàng (có cache 2 phút theo page/per_page)
 * Chuyển tab Đơn hàng không gọi lại API khi cache còn hạn.
 * @param {{ per_page?: number, page?: number }} params
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function getOrders(params = {}) {
  const cacheKey = getOrdersCacheKey(params)
  const cached = get(cacheKey)
  if (cached != null && typeof cached === 'object' && Array.isArray(cached.data)) {
    return cached
  }
  const search = new URLSearchParams(params).toString()
  const query = search ? `?${search}` : ''
  const res = await api.get(`/orders${query}`)
  const payload = { data: res.data ?? [], meta: res.meta ?? {} }
  set(cacheKey, payload, CACHE_TTL.ORDERS)
  return payload
}

/**
 * GET /api/v1/orders/{id}/track - Theo dõi đơn
 * @param {number|string} orderId
 * @returns {Promise<{ order_number, status, tracking_number, estimated_delivery_date, status_history }>}
 */
export async function getOrderTrack(orderId) {
  return api.get(`/orders/${orderId}/track`)
}

/**
 * Hủy đơn hàng (backend: POST /orders/{id}/cancel).
 * @param {number|string} orderId
 * @returns {Promise<Object>}
 */
export async function cancelOrder(orderId) {
  const id = encodeURIComponent(orderId)
  return api.post(`/orders/${id}/cancel`, {})
}

/**
 * Format ngày đặt hàng
 * @param {string} dateStr
 * @returns {string}
 */
export function formatOrderDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Map order từ API sang format dùng trong RecentOrderCard / OrderCard
 * API: customer = { id, name, email } khi có user_id; customer = null khi guest.
 * @param {Object} order - item từ data[]
 */
export function mapOrderToCard(order) {
  const orderItems = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.order_items)
      ? order.order_items
      : Array.isArray(order.lines)
        ? order.lines
        : []
  const firstItem = orderItems[0]
  const status = normalizeOrderStatus(order.status || 'pending')
  const customer = order.customer ?? null
  const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1)
  return {
    id: order.id,
    orderNumber: order.order_number || '',
    statusDisplay,
    productName: firstItem?.product_name || firstItem?.product?.name || '—',
    productId: firstItem?.product_id ?? firstItem?.product?.id ?? null,
    image: getOrderItemImageUrl(firstItem),
    status,
    statusKey: getOrderStatusKey(status),
    estimatedArrival: formatEstimatedDelivery(order.estimated_delivery_date),
    estimatedDeliveryDate: order.estimated_delivery_date,
    progress: getOrderProgress(status),
    statusMessageKey: status === 'shipped' ? 'statusMessage' : null,
    statusMessage: null,
    tracking_number: order.tracking_number,
    // Customer: có tài khoản → customer; guest → hiển thị "Khách" hoặc shipping_name/shipping_email
    customer,
    customerId: customer?.id ?? order.user_id ?? null,
    customerDisplay: customer ? customer.name : (order.shipping_name || null),
    customerEmail: customer?.email ?? order.shipping_email ?? null,
    orderDate: formatOrderDate(order.created_at ?? order.order_date ?? order.date),
    total: order.total ?? order.total_amount ?? 0,
    raw: order
  }
}
