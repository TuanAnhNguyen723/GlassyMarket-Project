import api from './api.js'

/**
 * Image service - handle image-related API calls
 *
 * Assumption (theo mô tả của bạn):
 * - Endpoint: GET /images?product_color_id=:id
 * - Response có thể là:
 *   - { data: [...] }
 *   - [...] (array)
 *   - { images: [...] }
 */
export const imageService = {
  /**
   * Get images list by query params
   * @param {Object} params
   * @returns {Promise<any>} raw response
   */
  async getImages(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/images${queryString ? `?${queryString}` : ''}`
    return await api.get(endpoint)
  },

  /**
   * Get a best-fit image URL for a given product_color_id
   * @param {string|number} productColorId
   * @returns {Promise<string|null>}
   */
  async getPrimaryImageUrlByProductColorId(productColorId) {
    if (productColorId === null || productColorId === undefined || productColorId === '') return null

    const response = await this.getImages({ product_color_id: productColorId })

    let images = []
    if (Array.isArray(response)) {
      images = response
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) images = response.data
      else if (Array.isArray(response.images)) images = response.images
    }

    if (!images.length) return null

    // ưu tiên primary nếu backend có cờ
    const primary =
      images.find((img) => img && (img.is_primary === true || img.is_primary === 1)) || images[0]

    const url =
      (typeof primary?.image_url === 'string' && primary.image_url.trim() && primary.image_url) ||
      (typeof primary?.url === 'string' && primary.url.trim() && primary.url) ||
      null

    return url
  },
}

export default imageService
