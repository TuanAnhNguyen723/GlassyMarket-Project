import api from './api.js'
import { get, set, CACHE_KEYS, CACHE_TTL } from '@/utils/cache'

/** Tạo cache key ổn định từ params (sort keys để cùng bộ params → cùng key). Export để view có thể check cache trước. */
export function getProductsCacheKey(params = {}) {
  const sorted = Object.keys(params)
    .filter((k) => params[k] != null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  return `${CACHE_KEYS.PRODUCTS}_${sorted || 'default'}`
}

/**
 * Product service - Handle all product-related API calls
 */
export const productService = {
  /**
   * Get all products (có cache 5 phút theo bộ filter/sort)
   * Chuyển tab Products hoặc đổi filter rồi quay lại không gọi API lại khi cache còn hạn.
   * @param {Object} params - Query parameters (page, limit, sort_by, categories_id, min_price, max_price, frame_shape...)
   * @returns {Promise<Object|Array>} Full response (data/products array, meta)
   */
  async getProducts(params = {}) {
    const cacheKey = getProductsCacheKey(params)
    const cached = get(cacheKey)
    if (cached != null && typeof cached === 'object') {
      return cached
    }
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`
      const response = await api.get(endpoint)
      set(cacheKey, response, CACHE_TTL.PRODUCTS)
      return response
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  /**
   * Get a single product by ID (có cache 5 phút)
   * Xem chi tiết sản phẩm rồi quay lại không gọi API nữa khi cache còn hạn.
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    const cacheKey = `${CACHE_KEYS.PRODUCT_DETAIL}_${id}`
    const cached = get(cacheKey)
    if (cached != null && typeof cached === 'object') {
      return cached
    }
    try {
      const response = await api.get(`/products/${id}`)
      const data = response.data || response
      set(cacheKey, data, CACHE_TTL.PRODUCT_DETAIL)
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  /**
   * Toggle product featured status (is_featured)
   * @param {string|number} id - Product ID
   * @param {boolean} isFeatured - New featured state
   */
  async updateFeaturedStatus(id, isFeatured) {
    try {
      // Bạn có thể chỉnh lại endpoint này cho khớp backend
      // Ví dụ: PUT /products/:id/feature với payload { is_featured: 1|0 }
      const payload = { is_featured: isFeatured ? 1 : 0 }
      return await api.put(`/products/${id}/feature`, payload)
    } catch (error) {
      console.error('Error updating featured status:', error)
      throw error
    }
  },
}

export default productService
