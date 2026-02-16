import api, { AUTH_TOKEN_KEY } from './api'

/**
 * Đăng ký tài khoản
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function register(data) {
  const res = await api.post('/register', data)
  return res
}

/**
 * Đăng nhập
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login(data) {
  const res = await api.post('/login', data)
  return res
}

/**
 * Đăng xuất (xoá token phía server)
 */
export async function logout() {
  try {
    await api.post('/logout')
  } finally {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem('user')
  }
}

/**
 * Lấy thông tin user hiện tại (cần token)
 * @returns {Promise<{ user: object }>}
 */
export async function getMe() {
  const res = await api.get('/me')
  return res
}

/**
 * Lưu token sau khi đăng nhập/đăng ký
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export { AUTH_TOKEN_KEY }
