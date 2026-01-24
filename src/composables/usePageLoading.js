import { ref } from 'vue'

const isPageLoading = ref(false)

export function usePageLoading() {
  const setLoading = (value) => {
    isPageLoading.value = value
  }

  return {
    isPageLoading,
    setLoading,
  }
}

