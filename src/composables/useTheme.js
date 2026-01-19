import { computed, ref } from 'vue'

const theme = ref('system') // 'light' | 'dark' | 'system'

function applyTheme(nextTheme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldDark = nextTheme === 'dark' || (nextTheme === 'system' && prefersDark)
  root.classList.toggle('dark', shouldDark)
}

export function useTheme() {
  const isDark = computed(() => document.documentElement.classList.contains('dark'))

  const init = () => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) theme.value = saved
    } catch {}
    applyTheme(theme.value)
  }

  const toggleDark = () => {
    const next = isDark.value ? 'light' : 'dark'
    theme.value = next
    applyTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return { theme, isDark, init, toggleDark }
}

