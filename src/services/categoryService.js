import api from './api.js'

/**
 * Category service - Handle all category-related API calls
 */
export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    const response = await api.get('/categories')

    // Handle common Laravel response structures:
    // - { data: [...] }
    // - [...]
    if (response && typeof response === 'object' && Array.isArray(response.data)) return response.data
    if (Array.isArray(response)) return response
    return []
  },
}

export default categoryService

