import api from './api'

/**
 * Gợi ý sản phẩm bằng AI theo nhu cầu người dùng.
 * Backend: POST /api/v1/ai/recommend-products
 * @param {string} message
 * @returns {Promise<{ reply?: string, filters?: Object, products?: Array }>}
 */
export async function recommendProducts(message) {
  const payload = { message: String(message || '').trim() }
  return api.post('/ai/recommend-products', payload)
}

export default { recommendProducts }

