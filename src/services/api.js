// API service configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

/** Origin (base URL không có path) để resolve URL tương đối */
function getApiOrigin() {
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return 'http://127.0.0.1:8000'
  }
}

/**
 * Chuẩn hóa avatar/asset URL: nếu là path tương đối (bắt đầu /) thì thêm origin.
 * @param {string} url
 * @returns {string}
 */
export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const s = url.trim()
  if (!s) return ''
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) return `${getApiOrigin()}${s}`
  return s
}

export const AUTH_TOKEN_KEY = 'auth_token'

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Base fetch function with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getStoredToken()
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const config = {
    headers,
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.text()
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      // Handle Laravel validation errors
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(', ')
        const err = new Error(errorMessages || data.message || `HTTP error! status: ${response.status}`)
        err.status = response.status
        throw err
      }
      const msg = data.message || `HTTP error! status: ${response.status}`
      const err = new Error(msg)
      err.status = response.status
      throw err
    }

    return data
  } catch (error) {
    // Handle network errors, CORS, etc.
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.')
    }
    // Không log khi lỗi từ backend do cấu hình auth (guard) - cần sửa ở Laravel
    const isAuthGuardError = error.message && (error.message.includes('Auth guard') || error.message.includes('is not defined'))
    if (!isAuthGuardError) {
      console.error('API request failed:', error)
    }
    throw error
  }
}

/** POST với FormData (multipart) - dùng cho upload file, không set Content-Type */
async function postFormData(endpoint, formData) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getStoredToken()
  const headers = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { method: 'POST', body: formData, headers })
  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return res.text()
  }
  const data = await res.json()
  if (!res.ok) {
    if (data.errors) {
      const msg = Object.values(data.errors).flat().join(', ')
      const err = new Error(msg || data.message || `HTTP ${res.status}`)
      err.status = res.status
      throw err
    }
    const err = new Error(data.message || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  postFormData,
  put: (endpoint, data, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
}

export default api
