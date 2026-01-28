import api from './api.js'

/**
 * Product service - Handle all product-related API calls
 */
export const productService = {
  /**
   * Get all products
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise<Array>} Array of products
   */
  async getProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`
      const response = await api.get(endpoint)
      
      // Handle different response structures
      // Laravel might return:
      // - { data: [...], meta: {...} } (paginated)
      // - { data: [...] } (resource collection)
      // - [...] (direct array)
      // - { products: [...], meta: {...} }
      
      // Return full response to let the view handle pagination
      return response
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  /**
   * Get a single product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data || response
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
