import api from './api.js'

/**
 * Order service - Tạo đơn, lấy chi tiết, xác nhận thanh toán
 * Luồng: POST orders → redirect cổng thanh toán → POST orders/:id/payment
 */
export const orderService = {
  /**
   * Tạo đơn hàng (shipping + items từ giỏ)
   * @param {Object} payload
   * @param {Object} payload.shipping - { first_name, last_name, street_address, city, state, zip_code }
   * @param {Array} payload.items - [{ product_id, quantity, lens_id?, ... }] hoặc cart_item_ids
   * @param {string} [payload.delivery_method] - 'standard' | 'express'
   * @param {string} [payload.payment_method] - 'momo' | 'vnpay' | 'direct'
   * @param {string} [payload.payment_status] - 'paid' | 'pending' (backend nên lưu vào cột payment_status)
   * @param {string} [payload.status] - 'completed' | 'pending' (backend nên lưu vào cột status)
   * @returns {Promise<{ id, order_number?, payment_url? }>}
   */
  async createOrder(payload) {
    const response = await api.post('/orders', payload)
    const data = response.data ?? response
    return data
  },

  /**
   * Chi tiết đơn hàng (payment_status, payment_method, paid_at, ...)
   * @param {string|number} orderId
   */
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data ?? response
  },

  /**
   * Xác nhận thanh toán (sau khi cổng redirect/webhook báo thành công)
   * POST /api/v1/orders/:id/payment
   * @param {string|number} orderId
   * @param {Object} payload - { payment_method, payment_reference? }
   */
  async confirmPayment(orderId, payload) {
    const response = await api.post(`/orders/${orderId}/payment`, payload)
    return response.data ?? response
  },

  /**
   * Lấy URL chuyển hướng đến cổng thanh toán (nếu backend hỗ trợ)
   * @param {string|number} orderId
   * @param {string} method - 'momo' | 'vnpay' | ...
   */
  async getPaymentUrl(orderId, method) {
    const query = method ? `?method=${encodeURIComponent(method)}` : ''
    const response = await api.get(`/orders/${orderId}/payment-url${query}`)
    const data = response.data ?? response
    return data.url ?? data.payment_url ?? null
  },
}

export default orderService
