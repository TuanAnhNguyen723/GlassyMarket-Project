import { ref, computed } from 'vue'

const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const login = (userData) => {
    user.value = userData
    // Store in localStorage or cookie
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
