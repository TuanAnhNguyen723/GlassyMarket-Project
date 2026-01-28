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
}

export default productService
