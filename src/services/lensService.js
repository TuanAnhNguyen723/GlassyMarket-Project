import api from './api.js'

export const lensService = {
  async getLenses(params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value != null && value !== ''),
    ).toString()
    const response = await api.get(`/lenses${queryString ? `?${queryString}` : ''}`)
    return response.data ?? response
  },

  async getLensById(id) {
    const response = await api.get(`/lenses/${id}`)
    return response.data ?? response
  },
}

export default lensService
