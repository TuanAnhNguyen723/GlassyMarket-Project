import api from './api.js'

/**
 * Review service - API đánh giá sản phẩm
 * GET .../reviews: public, không cần token
 * GET .../my-review, POST, PUT, DELETE: cần token
 */

/**
 * GET /api/v1/products/{id}/reviews - Danh sách đánh giá (public)
 * @param {string|number} productId
 * @param {{ per_page?: number, page?: number }} params
 * @returns {Promise<{ reviews: Array, meta: Object, product_summary: Object }>}
 */
export async function getReviews(productId, params = {}) {
  const search = new URLSearchParams({
    per_page: params.per_page ?? 15,
    page: params.page ?? 1,
    ...params,
  }).toString()
  const query = search ? `?${search}` : ''
  return api.get(`/products/${productId}/reviews${query}`)
}

/**
 * GET /api/v1/products/{id}/my-review - Kiểm tra user đã mua/đã review (cần token)
 * @param {string|number} productId
 * @returns {Promise<{ review: Object|null, can_review: boolean }>}
 */
export async function getMyReview(productId) {
  return api.get(`/products/${productId}/my-review`)
}

/**
 * POST /api/v1/products/{id}/reviews - Gửi đánh giá mới (cần token)
 * @param {string|number} productId
 * @param {{ rating: number, comment?: string }} data - rating 1-5 bắt buộc, comment tối đa 2000 ký tự
 * @returns {Promise<{ review: Object }>}
 */
export async function createReview(productId, data) {
  return api.post(`/products/${productId}/reviews`, {
    rating: data.rating,
    comment: data.comment ?? '',
  })
}

/**
 * PUT /api/v1/reviews/{id} - Cập nhật đánh giá (cần token)
 * @param {string|number} reviewId
 * @param {{ rating?: number, comment?: string }} data
 * @returns {Promise<Object>}
 */
export async function updateReview(reviewId, data) {
  return api.put(`/reviews/${reviewId}`, data)
}

/**
 * DELETE /api/v1/reviews/{id} - Xóa đánh giá (cần token)
 * @param {string|number} reviewId
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId) {
  return api.delete(`/reviews/${reviewId}`)
}
