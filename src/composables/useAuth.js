import { ref, computed } from 'vue'
import * as authService from '@/services/authService'
import { clear as clearCache } from '@/utils/cache'

const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  /** Lưu user và token sau khi login/register (gọi từ authService response) */
  const setUser = (userData, token) => {
    user.value = userData
    if (token) authService.setToken(token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      user.value = null
      clearCache()
    }
  }

  /** Gọi khi khởi động app: có token thì khôi phục user từ localStorage, rồi gọi profile để cập nhật */
  const checkAuth = async () => {
    const token = localStorage.getItem(authService.AUTH_TOKEN_KEY)
    if (!token) {
      user.value = null
      return
    }
    // Khôi phục user từ localStorage ngay để reload không bị đăng xuất trong lúc chờ getCurrentUser()
    try {
      const stored = localStorage.getItem('user')
      if (stored) user.value = JSON.parse(stored)
    } catch {
      // ignore invalid JSON
    }
    try {
      const res = await authService.getCurrentUser()
      if (res.user) {
        user.value = res.user
        localStorage.setItem('user', JSON.stringify(res.user))
      }
    } catch (err) {
      // Chỉ xóa token khi backend trả 401 (token hết hạn / không hợp lệ). Lỗi khác (500, guard, mạng) giữ đăng nhập.
      if (err?.status === 401) {
        localStorage.removeItem(authService.AUTH_TOKEN_KEY)
        localStorage.removeItem('user')
        user.value = null
      }
    }
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
    checkAuth
  }
}
