import api from './api'

/**
 * Trạng thái đơn → % tiến độ giao hàng
 */
export const ORDER_PROGRESS = {
  pending: 0,
  confirmed: 25,
  processing: 50,
  shipped: 85,
  delivered: 100,
  cancelled: 0
}

/**
 * Lấy % tiến độ theo status
 * @param {string} status
 * @returns {number}
 */
export function getOrderProgress(status) {
  const key = (status || '').toLowerCase()
  return ORDER_PROGRESS[key] ?? 0
}

/**
 * Key trạng thái cho i18n (dashboard.orderStatusXxx)
 */
export const ORDER_STATUS_KEYS = {
  pending: 'orderStatusPending',
  confirmed: 'orderStatusConfirmed',
  processing: 'orderStatusProcessing',
  shipped: 'orderStatusShipped',
  delivered: 'orderStatusDelivered',
  cancelled: 'orderStatusCancelled'
}

export function getOrderStatusKey(status) {
  const key = (status || '').toLowerCase()
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
 * GET /api/v1/profile - Thông tin người dùng
 * @returns {Promise<{ id, name, email, avatar, is_premium, phone, date_of_birth, gender, ... }>}
 */
export async function getProfile() {
  return api.get('/profile')
}

/**
 * GET /api/v1/orders - Danh sách đơn hàng
 * @param {{ per_page?: number, page?: number }} params
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function getOrders(params = {}) {
  const search = new URLSearchParams(params).toString()
  const query = search ? `?${search}` : ''
  return api.get(`/orders${query}`)
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
 * Map order từ API sang format dùng trong RecentOrderCard
 * @param {Object} order - item từ data[]
 */
export function mapOrderToCard(order) {
  const firstItem = order.items?.[0]
  const status = (order.status || 'pending').toLowerCase()
  return {
    id: order.id,
    orderNumber: order.order_number || '',
    productName: firstItem?.product_name || '—',
    image: firstItem?.product_image_url || '',
    status,
    statusKey: getOrderStatusKey(status),
    estimatedArrival: formatEstimatedDelivery(order.estimated_delivery_date),
    estimatedDeliveryDate: order.estimated_delivery_date,
    progress: getOrderProgress(status),
    statusMessageKey: status === 'shipped' ? 'statusMessage' : null,
    statusMessage: null,
    tracking_number: order.tracking_number,
    raw: order
  }
}
