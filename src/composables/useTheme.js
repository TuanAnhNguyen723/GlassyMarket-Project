import { computed, onUnmounted, ref, watch } from 'vue'

const theme = ref('system') // 'light' | 'dark' | 'system'

function getPrefersDark() {
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export function useTheme() {
  const prefersDark = ref(getPrefersDark())

  const isDark = computed(() => {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false
    return prefersDark.value
  })

  const applyTheme = () => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark.value)
  }

  const init = () => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        theme.value = saved
      }
    } catch {}

    applyTheme()

    // Đồng bộ khi người dùng đổi theme hệ thống (chỉ khi theme = 'system')
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e) => {
        prefersDark.value = !!e.matches
      }
      try {
        mq.addEventListener('change', handler)
      } catch {
        // Safari cũ
        mq.addListener(handler)
      }
      onUnmounted(() => {
        try {
          mq.removeEventListener('change', handler)
        } catch {
          mq.removeListener(handler)
        }
      })
    }
  }

  watch(isDark, applyTheme, { immediate: false })

  const toggleDark = () => {
    const next = isDark.value ? 'light' : 'dark'
    theme.value = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return { theme, isDark, init, toggleDark }
}

